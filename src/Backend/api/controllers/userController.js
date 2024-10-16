const db = require('../../config/db')

const UserController = {
    submitQuestion: async (req, res) => {
        const { question_id, selected_option_id } = req.body;

        if ( !selected_option_id ) 
            {
                return res.status(400).json({ error: "Required selected_option_id" });
            }
        if ( !question_id ) 
            {
            return res.status(400).json({ error: "Required question_id" });
            }

        try 
        {
            const checkSelected = await db.promise().query("SELECT selected_option_id FROM tbl_user_answers WHERE selected_option_id = ? AND ques_id = ?", [selected_option_id, question_id]);

            if (checkSelected.length === 0) {
                res.status(404).json({ error: "Selected Option is not valid for the given question!" });
            }
            else 
            {
                const [result] = await db.promise().query("INSERT INTO tbl_user_answers (selected_option_id) VALUES(?) ", [selected_option_id]);
            }
            // Debugging
            if (result.affectedRows <= 0) {
                console.log("No rows affected, Insertion may have failed!");
                return res.status(500).json({ error: "Insertion Failed!" });
            }
            else {
                console.log("Option Inserted Successfully: ", result.insertId);   
                // return res.status(200).json({ message: "Option Inserted Successfully!" });
            }
            const is_correct = await db.promise().query("SELECT is_correct, ques_id FROM tbl_options WHERE option_id = ? AND ques_id = ?", [selected_option_id, question_id]);

            // Destructuring the value from array
            const [is_correct_data] = is_correct;
            console.log("Is Correct: ", is_correct_data);

            if (is_correct_data.is_correct) {
                const [correctAnswer] = await db.promise().query("UPDATE tbl_user_answers SET is_correct = ? WHERE selected_option_id = ? ", [is_correct_data.is_correct, selected_option_id]);
                console.log("Correct Answer Updated Succesfully in tbl_user_answers: ", correctAnswer);
                return res.status(200).json({ message: "Correct Answer!" });
            } 
            else {
                console.log("Incorrect Answer!");
                return res.status(400).json({ message: "Incorrect Answer!" });
            }


        } catch (error) {
            console.error("Error Adding Selected option: ", error);
            return res.status(500).json({ error: "Failed to add Selected option" });
        }
    }
};

module.exports = UserController;