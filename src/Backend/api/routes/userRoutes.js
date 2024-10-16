const express = require('express');
const UserController = require('../controllers/userController');

const Answerrouter = express.Router();

// Route to Submit Question
Answerrouter.post('/api/user/questions', UserController.submitQuestion);

module.exports = Answerrouter;