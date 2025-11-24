-- Insert admin user
INSERT INTO users (username, email, password, full_name, phone_number, role, department_id, enabled, account_non_locked) VALUES
('admin', 'admin@disaster.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYKFxNvXrGu', 'System Administrator', '1234567890', 'ROLE_ADMIN', 19, TRUE, TRUE);

SELECT * FROM users;
