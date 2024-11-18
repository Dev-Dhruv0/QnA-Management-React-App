require("dotenv").config();
const db = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserController = {
  submitQuestion: async (req, res) => {
    const { ques_id, selected_option_id } = req.body;
    const userId = req.userId;

    if (!selected_option_id || !ques_id) {
      return res
        .status(400)
        .json({
          error: "Both ques_id and selected_option_id are required.",
        });
    }

    try {
      // Verify selected_option_id is valid for given ques_id
      const [optionValidation] = await db.query(
        "SELECT option_id FROM tbl_options WHERE option_id = ? AND ques_id = ?",
        [selected_option_id, ques_id]
      );

      if (optionValidation.length === 0) {
        return res
          .status(404)
          .json({
            error: "Selected Option is not valid for the given question!",
          });
      } 
      
        const [insertAnswer] = await db.query(
          "INSERT INTO tbl_user_answers (ques_id ,selected_option_id) VALUES(?, ?) ",
          [ques_id, selected_option_id]
        );

      // Debugging
      if (insertAnswer.affectedRows > 0) {
        console.log("Option Inserted Successfully: ", insertAnswer.insertId);
      } else {
        return res.status(500).json({ error: "Insertion Failed!" });
      }
      // Destructuring the value from array
      const [[is_correct_data]] = await db.query(
        "SELECT is_correct FROM tbl_options WHERE option_id = ? AND ques_id = ?",
        [selected_option_id, ques_id]
      );
      console.log("Is Correct: ", is_correct_data);

      await db.query(
        "UPDATE tbl_user_answers SET is_correct = ? WHERE selected_option_id = ? AND ques_id = ?",
        [is_correct_data.is_correct, selected_option_id, ques_id]
      );

      const message = is_correct_data.is_correct
        ? "Correct Answer!"
        : "Incorrect Answer!";
      return res.status(200).json({ message });
    } catch (error) {
      console.error("Error Submitting answer: ", error.message);
      return res
        .status(500)
        .json
        ({ error: "An error occurred while submitting the answer.",
          details: error.message,
         });
    }
  },

  // get submitted questions
  getSubmittedQuestion: async (req, res) => {
    console.log("Fetching Submitted Questions...");
    try {
      const [getAnswers] = await db.query(
        "SELECT * FROM tbl_user_answers "
      );
      console.log("Retrieved Submitted Questions: ", getAnswers);
      res.status(200).json(getAnswers);
    } catch (error) {
      console.error("Error Fetching submitted question's answers!", error);
      res.status(500).json({ error: "Failed to fetch submitted question's answers!" });
    }
  },

  // Login Method
  loginUser: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and Password are required!" });
    }

    try {
      // Check if user exists
      const [users] = await db.query("SELECT *FROM tbl_user WHERE email = ?", [
        email,
      ]);

      if (users.length === 0) {
        return res.status(404).json({ error: "User not found!" });
      }

      const user = users[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid Password!" });
      }

      // Generate JWT Token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({ token });
    } catch (error) {
      console.log("Error logging in user: ", error);
      return res.status(500).json({ error: "Failed to log in" });
    }
  },

  // Sign up Method
  signupUser: async (req, res) => {
    const { userName, email, password } = req.body;

    if (!email || !password || !userName) {
      return res.status(400).json({ error: "All fields are Required!" });
    }

    try {
      const [existingUser] = await db.query(
        "SELECT * FROM tbl_user WHERE email = ?",
        [email]
      );

      if (existingUser.length > 0) {
        return res.status(400).json({ error: "User already exists!" });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const [result] = await db.query(
        "INSERT INTO tbl_user (userName ,email, password) VALUES (?, ?, ?)",
        [userName, email, hashPassword]
      );

      if (result.affectedRows > 0) {
        return res
          .status(201)
          .json({ message: "User registered successfully!" });
      } else {
        return res.status(500).json({ error: "Failed to register user!" });
      }
    } catch (error) {
      console.error("Error signing up user:", error);
      return res.status(500).json({ error: "Server error during signup!" });
    }
  },

  // Get Users API
  getUsers: async (req, res) => {
    try {
      const [users] = await db.query("SELECT *FROM tbl_user");

      // Check if users were retrieved
      if (users.length === 0) {
        return res.status(404).json({ error: "No users found!" });
      }

      // Send users data if retrieval was successfull
      res.status(200).json(users);
    } catch (error) {
      console.error("Error retrieving users: ", error.message);
      res.status(500).json({ error: "Failed to retrieve users!" });
    }
  },
};

module.exports = UserController;
