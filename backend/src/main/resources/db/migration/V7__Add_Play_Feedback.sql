-- Feedback from the test version of the Ave Caesar game at /play: one row per round a tester rates
CREATE TABLE play_feedback (
    id BIGSERIAL PRIMARY KEY,
    tester VARCHAR(40),          -- an anonymous id the tester's browser makes up, to group one person's notes
    chapter VARCHAR(80),
    game VARCHAR(120),
    set_name VARCHAR(200),
    stars INTEGER,
    mistakes INTEGER,
    in_test BOOLEAN,
    tags VARCHAR(300),
    comment VARCHAR(2000),
    lang VARCHAR(5),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_play_feedback_created_at ON play_feedback (created_at);
