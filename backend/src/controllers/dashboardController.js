const User = require('../models/User');
const Ticket = require('../models/Ticket');
const Question = require('../models/Question');
const Category = require('../models/Category');

exports.adminOverview = async (req, res) => {
  try {
    const [userCount, ticketCount, questionCount, categories] = await Promise.all([
      User.countDocuments(),
      Ticket.countDocuments(),
      Question.countDocuments(),
      Category.aggregate([
        { $lookup: { from: 'questions', localField: '_id', foreignField: 'category', as: 'questions' } },
        { $project: { name: 1, questionCount: { $size: '$questions' } } },
        { $sort: { questionCount: -1 } },
        { $limit: 5 }
      ])
    ]);
    res.json({ userCount, ticketCount, questionCount, mostActiveCategories: categories });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch overview', error: err.message });
  }
};

exports.userStats = async (req, res) => {
  try {
    const [myTickets, myQuestions] = await Promise.all([
      Ticket.countDocuments({ createdBy: req.user._id }),
      Question.countDocuments({ createdBy: req.user._id })
    ]);
    res.json({ myTickets, myQuestions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user stats', error: err.message });
  }
}; 