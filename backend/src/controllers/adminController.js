const Category = require('../models/Category');
const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Question = require('../models/Question');

// Categories
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({ name, description, createdBy: req.user._id });
    res.status(201).json({ category });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add category', error: err.message });
  }
};
exports.listCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories', error: err.message });
  }
};
exports.editCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
    if (!category) return res.status(404).json({ message: 'Not found' });
    res.json({ category });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update category', error: err.message });
  }
};
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete category', error: err.message });
  }
};

// Users
exports.listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};
exports.changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Failed to change role', error: err.message });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

// Tickets
exports.listTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().populate('createdBy assignedTo category', 'name email');
    res.json({ tickets });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tickets', error: err.message });
  }
};
exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete ticket', error: err.message });
  }
};

// Questions
exports.listQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate('createdBy', 'name email');
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch questions', error: err.message });
  }
};
exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete question', error: err.message });
  }
}; 