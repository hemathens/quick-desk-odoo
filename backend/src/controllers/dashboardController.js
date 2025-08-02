const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Question = require('../models/Question');
const TicketComment = require('../models/TicketComment');
const Category = require('../models/Category');

// Admin Dashboard - Complete system overview
exports.adminOverview = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const [userCount, ticketCount, questionCount, categories, ticketsToday, ticketsByStatus, recentTickets, activeUsers] = await Promise.all([
      User.countDocuments(),
      Ticket.countDocuments(),
      Question.countDocuments(),
      Category.aggregate([
        { $lookup: { from: 'questions', localField: '_id', foreignField: 'category', as: 'questions' } },
        { $project: { name: 1, questionCount: { $size: '$questions' } } },
        { $sort: { questionCount: -1 } },
        { $limit: 5 }
      ]),
      Ticket.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } }),
      Ticket.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Ticket.find()
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .limit(10),
      User.countDocuments({ role: { $in: ['user', 'agent'] } })
    ]);
    
    // Calculate average response time (mock calculation for now)
    const resolvedTickets = await Ticket.find({ status: 'resolved' }).select('createdAt updatedAt');
    let avgResponseTime = '0h';
    if (resolvedTickets.length > 0) {
      const totalTime = resolvedTickets.reduce((sum, ticket) => {
        return sum + (new Date(ticket.updatedAt) - new Date(ticket.createdAt));
      }, 0);
      const avgMs = totalTime / resolvedTickets.length;
      avgResponseTime = `${Math.round(avgMs / (1000 * 60 * 60))}h`;
    }
    
    res.json({ 
      userCount, 
      ticketCount, 
      questionCount, 
      ticketsToday,
      avgResponseTime,
      activeUsers,
      mostActiveCategories: categories,
      ticketsByStatus,
      recentTickets
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admin overview', error: err.message });
  }
};

// Agent Dashboard - Focus on assigned tickets and workload
exports.agentOverview = async (req, res) => {
  try {
    const agentId = req.user._id;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const [assignedTickets, resolvedToday, pendingTickets, myRecentTickets, totalResolved] = await Promise.all([
      Ticket.countDocuments({ assignedTo: agentId }),
      Ticket.countDocuments({ 
        assignedTo: agentId, 
        status: 'resolved',
        updatedAt: { $gte: startOfDay, $lte: endOfDay }
      }),
      Ticket.countDocuments({ 
        assignedTo: agentId, 
        status: { $in: ['open', 'in progress'] }
      }),
      Ticket.find({ assignedTo: agentId })
        .populate('createdBy', 'name email')
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .limit(10),
      Ticket.countDocuments({ assignedTo: agentId, status: 'resolved' })
    ]);
    
    // Get unassigned tickets for agents to pick up
    const unassignedTickets = await Ticket.find({ assignedTo: null, status: 'open' })
      .populate('createdBy', 'name email')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      assignedTickets,
      resolvedToday,
      pendingTickets,
      totalResolved,
      myRecentTickets,
      unassignedTickets
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch agent overview', error: err.message });
  }
};

// User Dashboard - Personal tickets and stats
exports.userStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const [myTickets, myQuestions, myRecentTickets, ticketsByStatus] = await Promise.all([
      Ticket.countDocuments({ createdBy: userId }),
      Question.countDocuments({ createdBy: userId }),
      Ticket.find({ createdBy: userId })
        .populate('assignedTo', 'name email')
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .limit(10),
      Ticket.aggregate([
        { $match: { createdBy: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);
    
    res.json({ 
      myTickets, 
      myQuestions, 
      myRecentTickets,
      ticketsByStatus
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user stats', error: err.message });
  }
};

// Get tickets with filters and pagination
exports.getTickets = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, category, search, sortBy = 'createdAt' } = req.query;
    const userId = req.user._id;
    const userRole = req.user.role;
    
    // Build query based on user role
    let query = {};
    if (userRole === 'user') {
      query.createdBy = userId; // Users can only see their own tickets
    } else if (userRole === 'agent') {
      // Agents can see assigned tickets and unassigned ones
      query = { $or: [{ assignedTo: userId }, { assignedTo: null }] };
    }
    // Admins can see all tickets (no additional filter)
    
    // Apply filters
    if (status) query.status = status;
    if (category) {
      // Handle category filtering by ObjectId or name
      const categoryDoc = await Category.findOne({ name: category.toLowerCase() });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Sort options
    let sort = {};
    if (sortBy === 'recent') sort = { createdAt: -1 };
    else if (sortBy === 'oldest') sort = { createdAt: 1 };
    else if (sortBy === 'title') sort = { title: 1 };
    else sort = { createdAt: -1 };
    
    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email')
      .populate('category', 'name')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    // Transform tickets to match frontend expectations
    const transformedTickets = tickets.map(ticket => ({
      id: ticket._id,
      _id: ticket._id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      tags: ticket.category ? [ticket.category.name] : [],
      author: {
        name: ticket.createdBy.name,
        email: ticket.createdBy.email,
        role: ticket.createdBy.role
      },
      assignedTo: ticket.assignedTo ? {
        name: ticket.assignedTo.name,
        email: ticket.assignedTo.email
      } : null,
      category: ticket.category,
      priority: ticket.priority || 'medium',
      upvotes: 0, // Default for now
      answers: 0, // We'll count comments later
      isUpvoted: false,
      isDownvoted: false
    }));
    
    const total = await Ticket.countDocuments(query);
    
    res.json({
      tickets: transformedTickets,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tickets', error: err.message });
  }
};
