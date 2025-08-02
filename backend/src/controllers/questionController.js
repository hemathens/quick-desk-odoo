const Question = require('../models/Question');
const User = require('../models/User');

exports.create = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const question = await Question.create({
      title,
      description,
      tags,
      createdBy: req.user._id,
    });
    res.status(201).json({ question });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create question', error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { tag, status, sort, search } = req.query;
    let filter = {};
    if (tag) filter.tags = tag;
    if (status) filter.status = status;
    if (search) filter.$text = { $search: search };
    let query = Question.find(filter).populate('createdBy', 'name email');
    // Sorting
    if (sort === 'upvotes') query = query.sort({ upvotes: -1 });
    else if (sort === 'recent') query = query.sort({ createdAt: -1 });
    else if (sort === 'answers') query = query.sort({ 'answers.length': -1 });
    const questions = await query.exec();
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch questions', error: err.message });
  }
};

exports.get = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('createdBy', 'name email').populate('answers.user', 'name email');
    if (!question) return res.status(404).json({ message: 'Not found' });
    res.json({ question });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch question', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Not found' });
    if (!question.createdBy.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    const { title, description, tags } = req.body;
    if (title) question.title = title;
    if (description) question.description = description;
    if (tags) question.tags = tags;
    await question.save();
    res.json({ question });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update question', error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Not found' });
    if (!question.createdBy.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await question.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete question', error: err.message });
  }
};

exports.vote = async (req, res) => {
  try {
    const { type } = req.body; // 'up' or 'down'
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Not found' });
    // Prevent double voting: (for demo, not tracking voters)
    if (type === 'up') question.upvotes += 1;
    else if (type === 'down') question.downvotes += 1;
    await question.save();
    res.json({ upvotes: question.upvotes, downvotes: question.downvotes });
  } catch (err) {
    res.status(500).json({ message: 'Failed to vote', error: err.message });
  }
};

exports.answer = async (req, res) => {
  try {
    const { text } = req.body;
    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ message: 'Not found' });
    question.answers.push({ text, user: req.user._id });
    await question.save();
    res.status(201).json({ answers: question.answers });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add answer', error: err.message });
  }
}; 