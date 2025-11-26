-- V2: Migrate from single correctAnswer to multiple correctAnswers
-- This migration:
-- 1. Creates new table to store multiple correct answers (using @ElementCollection pattern)
-- 2. Migrates existing data from correct_answer column
-- 3. Drops the old column

-- Create new table to store multiple correct answers per question
-- (Follows same pattern as question_options)
CREATE TABLE question_correct_answers (
    question_id BIGINT NOT NULL,
    answer_index INT NOT NULL,
    PRIMARY KEY (question_id, answer_index),
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Migrate existing data: each question's current correct_answer becomes a row
INSERT INTO question_correct_answers (question_id, answer_index)
SELECT id, correct_answer FROM questions WHERE correct_answer IS NOT NULL;

-- Drop the old column (no longer needed)
ALTER TABLE questions DROP COLUMN correct_answer;