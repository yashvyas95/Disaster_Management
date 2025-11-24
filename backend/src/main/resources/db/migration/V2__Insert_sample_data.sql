-- V2__Insert_sample_data.sql
-- Insert sample data for development and testing

-- Insert Departments
INSERT INTO departments (name, description, contact_number, address, active) VALUES
('Fire Department', 'Emergency fire response and rescue operations', '911-FIRE', '123 Fire Station Road', TRUE),
('Police Department', 'Law enforcement and crime prevention', '911-POLICE', '456 Police Plaza', TRUE),
('Medical Emergency Services', 'Emergency medical response and ambulance services', '911-MEDICAL', '789 Hospital Drive', TRUE),
('Disaster Management Office', 'Coordination of all disaster response activities', '911-DISASTER', '100 Emergency Center Blvd', TRUE);

-- Insert Admin User (password: Admin@123)
-- BCrypt hash for "Admin@123" with strength 12
INSERT INTO users (username, email, password, full_name, phone_number, role, department_id, enabled, account_non_locked) VALUES
('admin', 'admin@disaster.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYKFxNvXrGu', 'System Administrator', '1234567890', 'ROLE_ADMIN', 4, TRUE, TRUE),
('fire_chief', 'fire.chief@disaster.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYKFxNvXrGu', 'Fire Chief John Doe', '1234567891', 'ROLE_DEPARTMENT_HEAD', 1, TRUE, TRUE),
('police_captain', 'police.captain@disaster.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYKFxNvXrGu', 'Captain Jane Smith', '1234567892', 'ROLE_DEPARTMENT_HEAD', 2, TRUE, TRUE),
('dispatcher1', 'dispatcher@disaster.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYKFxNvXrGu', 'Dispatcher Sarah Johnson', '1234567893', 'ROLE_DISPATCHER', 4, TRUE, TRUE);

-- Insert Rescue Team Users
INSERT INTO users (username, email, password, full_name, phone_number, role, department_id, enabled, account_non_locked) VALUES
('rescue_team1', 'team1@disaster.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYKFxNvXrGu', 'Fire Rescue Team Leader', '1234567894', 'ROLE_RESCUE_TEAM_MEMBER', 1, TRUE, TRUE),
('rescue_team2', 'team2@disaster.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYKFxNvXrGu', 'Medical Response Leader', '1234567895', 'ROLE_RESCUE_TEAM_MEMBER', 3, TRUE, TRUE),
('rescue_team3', 'team3@disaster.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYKFxNvXrGu', 'Police Response Unit', '1234567896', 'ROLE_RESCUE_TEAM_MEMBER', 2, TRUE, TRUE);

-- Insert Rescue Teams
INSERT INTO rescue_teams (name, department_id, user_id, status, member_count, equipment) VALUES
('Fire Rescue Alpha', 1, 5, 'AVAILABLE', 6, 'Fire trucks, hoses, breathing apparatus, ladders'),
('Medical Response Team 1', 3, 6, 'AVAILABLE', 4, 'Ambulance, medical supplies, defibrillator'),
('Police Rapid Response', 2, 7, 'AVAILABLE', 5, 'Patrol vehicles, communication equipment, safety gear'),
('Fire Rescue Bravo', 1, NULL, 'AVAILABLE', 5, 'Fire engine, rescue tools, protective equipment');

-- Insert Team Capabilities
INSERT INTO team_capabilities (team_id, capability) VALUES
(1, 'FIRE'),
(1, 'RESCUE'),
(2, 'MEDICAL'),
(3, 'CRIME'),
(3, 'RESCUE'),
(4, 'FIRE'),
(4, 'HAZMAT');

-- Insert Sample Emergency Requests
INSERT INTO emergency_requests (victim_name, victim_phone, location, latitude, longitude, emergency_type, priority, status, description, assigned_team_id) VALUES
('Emergency Caller 1', '9876543210', '123 Main Street, Downtown', 40.7128, -74.0060, 'FIRE', 'HIGH', 'PENDING', 'Building fire reported, multiple people trapped', NULL),
('Emergency Caller 2', '9876543211', '456 Oak Avenue', 40.7580, -73.9855, 'MEDICAL', 'CRITICAL', 'PENDING', 'Heart attack victim needs immediate assistance', NULL),
('Emergency Caller 3', '9876543212', '789 Park Lane', 40.7614, -73.9776, 'ACCIDENT', 'MEDIUM', 'PENDING', 'Multi-vehicle collision, injuries reported', NULL);
