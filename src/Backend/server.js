const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 5000;

// Middlewares
app.use(cors());
app.use(express.json());

let questions =  [];

// POST endpoint to add questions
app.post('/api/questions', (req, res) => {
    const { body } = req;

    if(!Array.isArray(body)) {
        return res.status(400).json({ error: 'Invalid data format' });
    }

    const newQuestions = req.body.map((item, index) => ({
        id: questions.length + index + 1,
        question: item.question,
        options: item.options,
    }));
    questions = [...questions, ...newQuestions];
    res.status(201).json(newQuestions);
});

// GET endpoint to retrieve questions
app.get('/api/questions', (req, res) => {
    res.json(questions);
});

app.listen(PORT, () => {
    console.log(`Server is running on port${PORT}`);
});