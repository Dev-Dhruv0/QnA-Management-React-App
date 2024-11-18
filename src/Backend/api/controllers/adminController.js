const db = require('../../config/db');

const AdminController = {
    addQuestion: async (req, res) => {
        const questions = req.body;

        try {
            for (const item of questions) {
                const { question, options } = item;

                console.log("Received Data - question: ", question, "options:", options);

                if ( !question || !options || options.length === 0 )
                {
                    console.log("Invalid request - question or options are missing");
                    return res.status(400).json({ error: "Question and Options are required!" });
                }
                const [result] = await db.query("INSERT INTO tbl_questions (question) VALUES(?)", [question]);
                // console.log("Question Inserted wih result: ", result);
                const questionId = result.insertId;

                for (const option of options)
                {
                    try {
                        await db.query("INSERT INTO tbl_options (ques_id, option_text, is_correct) VALUES(?, ?, ?)", [questionId, option.option_text, option.is_correct]);
                    } catch (error) {
                        console.log("Error Inserting Option", option.option_text, error);
                        throw new Error(`Failed to insert option: ${option.option_text}`);
                    }
                    console.log("Options Inserted Successfully!");
                }

                // await Promise.all(optionPromises);
            }
            res.status(201).send({ message: "Questions Added Successfully!" });
        } catch (error) {
            console.error("Error Adding Questions: ", error);
            res.status(500).json({ error: "Failed to add questions!" });
        }
    },
    editQuestion: async (req, res) => {
        const { id, question, options } = req.body;

        if ( !id || !question || !options )
        {
            return res.status(400).json({ error: "Question Id, Question text and options are required!" })
        }

        try {
            await db.query("UPDATE tbl_questions SET question = ? WHERE ques_id = ?", [question, id]);

            // Update Options
            const optionPromises = options.map(option => 
                db.query("UPDATE tbl_options SET option_text = ?, is_correct = ? WHERE option_id = ?",[option.option_text, option.is_correct, option.id])
            );

            await Promise.all(optionPromises);
            res.status(201).send({ message: "Question Updated Successfully!" });
        } catch (error) {
            console.error("Error updating question: ", error);
            res.status(500).json({ error: "Failed to update question!" })
        }
    },
    deleteQuestion:  async (req, res) => {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "Question Id is required!" });
        }

        try 
        {
            await db.query("DELETE FROM tbl_options WHERE ques_id = ?", [id]);
            await db.query("DELETE FROM tbl_questions WHERE ques_id = ?", [id]);
            return res.status(200).json({ message: "Question Deleted Successfully" });
        } catch (error) 
        {
            console.error("Error Deleting Question: ", error);
            res.status(500).json({ error: "Failed to delete question!" });
        }
    },
    getAllQuestions: async (req, res) => {
        console.log("Fetching all Questions..."); //Log when the function is called
        try 
        {
            const [questions] = await db.query("SELECT *FROM tbl_questions");
            const [options] = await db.query("SELECT *FROM tbl_options");

            console.log("Questions Retrieved: ", questions);
            console.log("Options Retrieved: ", options);

            const questionsWithOptions = questions.map(question => ({
                ...question,
                options: options.filter(option => option.ques_id === question.ques_id)
            }));
            res.status(200).json(questionsWithOptions);
        } catch (error) {
            console.error("Error Fetching Questions: ", error);
            res.status(500).json({ error: "Failed to fetch questions!" });
        }
    },
    setCorrectAnswer: async (req, res) => {
        const { ques_id, option_id} = req.body;
        try {
            await db.query("UPDATE tbl_options SET is_correct = FALSE WHERE ques_id = ?", [ques_id]);
            await db.query("UPDATE tbl_options SET is_correct = TRUE  WHERE option_id = ?", [option_id]);
            res.status(200).json({ message: "Correct Answer Upated Successfully!" });
        } catch (error) {
            console.error("Error setting correct answer!", error);
            res.status(500).json({ message: "Error updating correct answer!" });
        }
    }
};

module.exports = AdminController;