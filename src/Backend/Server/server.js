require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 5000;
const userRouter = require('../api/routes/userRoutes');
const adminRouter = require('../api/routes/adminRoutes');

// Middlewares
app.use(cors());
app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/admin', adminRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port${PORT}`);
});