-- Add role column to users table
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'PLAYER';

-- Set yourself as ADMIN (replace with your actual email)
UPDATE users SET role = 'ADMIN' WHERE email = 'ogidan@abv.bg';