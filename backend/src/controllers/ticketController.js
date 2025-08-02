const Ticket = require('../models/Ticket');
const TicketComment = require('../models/TicketComment');
const User = require('../models/User');
const Category = require('../models/Category');

// Get single ticket with full details and comments
exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    // Check access permissions
    const ticket = await Ticket.findById(id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email')
      .populate('category', 'name');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Users can only see their own tickets
    if (userRole === 'user' && ticket.createdBy._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get comments based on user role
    let commentQuery = { ticket: id };
    if (userRole === 'user') {
      commentQuery.isInternal = false; // Users can't see internal notes
    }

    const comments = await TicketComment.find(commentQuery)
      .populate('author', 'name email role')
      .sort({ createdAt: 1 });

    res.json({ ticket, comments });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch ticket', error: err.message });
  }
};

// Create new ticket
exports.createTicket = async (req, res) => {
  try {
    const { title, description, category, priority = 'medium', tags = [] } = req.body;
    const userId = req.user._id;

    // Find category by name if it's a string
    let categoryId = null;
    if (category) {
      const categoryDoc = await Category.findOne({ name: category.toLowerCase() });
      if (!categoryDoc) {
        // Create category if it doesn't exist
        const newCategory = new Category({ name: category.toLowerCase() });
        await newCategory.save();
        categoryId = newCategory._id;
      } else {
        categoryId = categoryDoc._id;
      }
    }

    const ticket = new Ticket({
      title,
      description,
      category: categoryId,
      priority: priority.toLowerCase(),
      tags: Array.isArray(tags) ? tags : [],
      createdBy: userId,
      status: 'open'
    });

    await ticket.save();
    await ticket.populate('createdBy', 'name email');
    await ticket.populate('category', 'name');

    res.status(201).json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create ticket', error: err.message });
  }
};

// Update ticket (status, assignment, etc.)
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, title, description, category } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check permissions
    if (userRole === 'user' && ticket.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Users can only edit their own tickets and only if not resolved
    if (userRole === 'user') {
      if (ticket.status === 'resolved') {
        return res.status(403).json({ message: 'Cannot edit resolved ticket' });
      }
      // Users can only update title and description
      if (title !== undefined) ticket.title = title;
      if (description !== undefined) ticket.description = description;
    } else {
      // Agents and admins can update all fields
      if (status !== undefined) ticket.status = status;
      if (assignedTo !== undefined) ticket.assignedTo = assignedTo;
      if (title !== undefined) ticket.title = title;
      if (description !== undefined) ticket.description = description;
      if (category !== undefined) ticket.category = category;
    }

    await ticket.save();
    await ticket.populate('createdBy', 'name email');
    await ticket.populate('assignedTo', 'name email');
    await ticket.populate('category', 'name');

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update ticket', error: err.message });
  }
};

// Add comment to ticket
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, isInternal = false } = req.body;
    const userId = req.user._id;
    const userRole = req.user.role;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Check access permissions
    if (userRole === 'user' && ticket.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only agents and admins can create internal notes
    const finalIsInternal = (userRole === 'user') ? false : isInternal;

    const comment = new TicketComment({
      ticket: id,
      author: userId,
      content,
      isInternal: finalIsInternal
    });

    await comment.save();
    await comment.populate('author', 'name email role');

    // Update ticket's updatedAt timestamp
    ticket.updatedAt = new Date();
    await ticket.save();

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add comment', error: err.message });
  }
};

// Assign ticket to agent (admin/agent only)
exports.assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { agentId } = req.body;
    const userRole = req.user.role;

    if (!['admin', 'agent'].includes(userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Verify agent exists and has correct role
    if (agentId) {
      const agent = await User.findById(agentId);
      if (!agent || !['agent', 'admin'].includes(agent.role)) {
        return res.status(400).json({ message: 'Invalid agent' });
      }
    }

    ticket.assignedTo = agentId || null;
    if (agentId && ticket.status === 'open') {
      ticket.status = 'in progress';
    }

    await ticket.save();
    await ticket.populate('assignedTo', 'name email');
    await ticket.populate('createdBy', 'name email');

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign ticket', error: err.message });
  }
};

// Get all agents (for assignment dropdown)
exports.getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: { $in: ['agent', 'admin'] } })
      .select('name email role')
      .sort({ name: 1 });

    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch agents', error: err.message });
  }
};

// Delete ticket (admin only)
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;

    if (userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Delete associated comments
    await TicketComment.deleteMany({ ticket: id });
    
    // Delete ticket
    await Ticket.findByIdAndDelete(id);

    res.json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete ticket', error: err.message });
  }
};
