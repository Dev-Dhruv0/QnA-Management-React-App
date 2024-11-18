const express = require('express');
const UserController = require('../controllers/userController');

const userRouter = express.Router();

// Route to Submit Question
// userRouter.post('/questions', UserController.submitQuestion);

// Route to handle answer submission
userRouter.post('/submit-answer', UserController.submitQuestion);
// Route to get All submitted question's answers
userRouter.get('/submit-answer', UserController.getSubmittedQuestion);
// Route for User login
userRouter.post('/login', UserController.loginUser);
// Route for User registration
userRouter.post('/signup', UserController.signupUser);
// Route to get All Users
userRouter.get('/users', UserController.getUsers);

module.exports = userRouter;