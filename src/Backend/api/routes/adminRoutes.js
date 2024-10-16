const express = require('express');
const AdminController = require('../controllers/adminController');

const Questionrouter = express.Router();

// Route to Add a Question
Questionrouter.post('/questions', AdminController.addQuestion);

// Route to Edit a Question
Questionrouter.put('/questions/:id', AdminController.editQuestion);

// Route to Delete a Question
Questionrouter.delete('/questions/:id', AdminController.deleteQuestion);

// Route to Get All Questions
Questionrouter.get('/questions', AdminController.getAllQuestions);

Questionrouter.put('/questions/correct_answer', AdminController.setCorrectAnswer);

module.exports = Questionrouter;