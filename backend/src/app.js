require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes (to be implemented)
app.use('/auth', require('./routes/auth'));
app.use('/questions', require('./routes/questions'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/admin', require('./routes/admin'));

// Health check
app.get('/', (req, res) => res.send('QuickDesk API running'));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Socket.IO setup
const io = require('socket.io')(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('Socket.IO client connected:', socket.id);
  // Future: emit events for ticket status, answers, notifications, etc.
});

module.exports = app; 