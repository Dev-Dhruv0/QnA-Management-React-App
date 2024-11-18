CREATE DATABASE db_QnA;
USE db_QnA;

-- Users Table 01
CREATE TABLE tbl_user (
user_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
userName CHAR(50),
email VARCHAR(50)
);
INSERT INTO tbl_user(user_id, userName, email) VALUES (1, "Dhruv", "officialdhruv0004@gmail.com");
ALTER TABLE tbl_user ADD password VARCHAR(255);
 
SELECT *FROM tbl_user;

--  Questions Table 02
CREATE TABLE tbl_questions (
ques_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
user_id INT,
FOREIGN KEY (user_id) REFERENCES tbl_user(user_id) ON DELETE CASCADE,
question VARCHAR(100)
);

ALTER TABLE tbl_questions MODIFY COLUMN question VARCHAR(255);
INSERT INTO tbl_questions(user_id, question) VALUES (1, "Sample question?");


SELECT *FROM tbl_questions;
-- TRUNCATE tbl_questions; 
DESCRIBE tbl_questions;
SHOW CREATE TABLE tbl_questions;

-- Drop Foreign key constraint -- 
-- ALTER TABLE tbl_questions
-- DROP FOREIGN KEY tbl_questions_ibfk_1;

-- Drop user_id Column --
-- ALTER TABLE tbl_questions
-- DROP COLUMN user_id;

-- DROP Foreign Key Constraint
-- ALTER TABLE tbl_questions
-- DROP FOREIGN KEY tbl_questions_ibfk_1;

-- Drop user_id Column 
-- ALTER TABLE tbl_questions
-- DROP COLUMN user_id;

-- To get Constraints
SHOW CREATE TABLE tbl_questions;

-- INSERT INTO tbl_questions(question) VALUES("Question 1");

-- Options Table 03
CREATE TABLE tbl_options (
option_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
ques_id INT,
option_text varchar(100),
FOREIGN KEY (ques_id) REFERENCES tbl_questions(ques_id) ON DELETE CASCADE,
is_correct BOOLEAN
);
SELECT *FROM tbl_options;
SELECT * FROM tbl_options WHERE option_id = selected_option_id AND ques_id = question_id;

-- TRUNCATE tbl_options;

-- User Submission Table 04
CREATE TABLE tbl_userSubmission (
submit_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
user_id INT,
FOREIGN KEY (user_id) REFERENCES tbl_user(user_id) ON DELETE CASCADE,
submission_time TIME
);
SELECT *FROM tbl_userSubmission; 

-- User Answers Table 05
CREATE TABLE tbl_user_answers (
answer_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
submit_id INT,
FOREIGN KEY (submit_id) REFERENCES tbl_userSubmission(submit_id) ON DELETE CASCADE,
ques_id INT,
FOREIGN KEY (ques_id) REFERENCES tbl_questions(ques_id) ON DELETE CASCADE,
selected_option_id INT,
FOREIGN KEY (selected_option_id) REFERENCES tbl_options(option_id) ON DELETE CASCADE,
is_correct BOOLEAN
);
SELECT *FROM tbl_user_answers;


-- Disable foreign key checks
-- SET FOREIGN_KEY_CHECKS = 0;

-- Truncate the tables
-- TRUNCATE TABLE tbl_user_answers;
-- TRUNCATE TABLE tbl_userSubmission;
-- TRUNCATE TABLE tbl_options;
-- TRUNCATE TABLE tbl_questions;
-- TRUNCATE TABLE tbl_user;

-- Re-enable foreign key checks
-- SET FOREIGN_KEY_CHECKS = 1;

