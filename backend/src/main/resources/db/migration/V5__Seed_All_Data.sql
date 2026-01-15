-- V5 Migration: Clear all existing data
-- This prepares the database for fresh data entry via frontend

DELETE FROM quiz_attempts;
DELETE FROM batch_progress;
DELETE FROM batch_questions;
DELETE FROM quiz_batches;
DELETE FROM question_options;
DELETE FROM questions;
DELETE FROM chapters;
DELETE FROM user_progress;
DELETE FROM users;
DELETE FROM topics;
DELETE FROM periods;