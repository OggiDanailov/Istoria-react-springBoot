ALTER TABLE periods RENAME TO sections;
ALTER TABLE sections ADD COLUMN discipline VARCHAR(50) NOT NULL DEFAULT 'history';
ALTER TABLE topics RENAME COLUMN period_id TO section_id;