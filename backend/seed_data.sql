-- Seed Data for Disaster Management System V2
-- Clear existing data (except admin user)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE messages;
TRUNCATE TABLE emergency_requests;
TRUNCATE TABLE team_capabilities;
TRUNCATE TABLE rescue_teams;
DELETE FROM users WHERE username != 'admin';
TRUNCATE TABLE departments;
SET FOREIGN_KEY_CHECKS = 1;

-- Insert Departments
INSERT INTO departments (name, description, contact_number, address, active) VALUES
('Fire Department', 'Handles fire emergencies and rescue operations', '+1-555-3473-001', '100 Fire Station Road', 1),
('Police Department', 'Law enforcement and emergency response', '+1-555-7654-301', '200 Police Plaza', 1),
('Medical Emergency', 'Emergency medical services and ambulance', '+1-555-6334-201', '300 Medical Center Drive', 1),
('Search and Rescue', 'Specialized search and rescue operations', '+1-555-7372-801', '400 Rescue Lane', 1),
('Disaster Relief', 'Disaster relief coordination and supplies', '+1-555-7354-331', '500 Relief Avenue', 1);

-- Insert Users (password is BCrypt hash of 'Admin@123' - same as admin user)
INSERT INTO users (username, email, password, full_name, phone_number, role, department_id, enabled, account_non_locked) VALUES
-- Department Heads
('john.smith', 'john.smith@fire.gov', '$2a$10$vxKI1gx8Nf8JEQrjQM.KqeN5qQw8wY7QzJxZ3X5X6X7X8X9X0X1X2', 'John Smith', '+1-555-0101', 'ROLE_DEPT_HEAD', 1, 1, 1),
('sarah.johnson', 'sarah.johnson@police.gov', '$2a$10$vxKI1gx8Nf8JEQrjQM.KqeN5qQw8wY7QzJxZ3X5X6X7X8X9X0X1X2', 'Sarah Johnson', '+1-555-0102', 'ROLE_DEPT_HEAD', 2, 1, 1),
('michael.chen', 'michael.chen@medical.gov', '$2a$10$vxKI1gx8Nf8JEQrjQM.KqeN5qQw8wY7QzJxZ3X5X6X7X8X9X0X1X2', 'Dr. Michael Chen', '+1-555-0103', 'ROLE_DEPT_HEAD', 3, 1, 1),

-- Dispatchers
('dispatcher1', 'dispatch1@emergency.gov', '$2a$10$vxKI1gx8Nf8JEQrjQM.KqeN5qQw8wY7QzJxZ3X5X6X7X8X9X0X1X2', 'Emma Wilson', '+1-555-0201', 'ROLE_DISPATCHER', 1, 1, 1),
('dispatcher2', 'dispatch2@emergency.gov', '$2a$10$vxKI1gx8Nf8JEQrjQM.KqeN5qQw8wY7QzJxZ3X5X6X7X8X9X0X1X2', 'James Brown', '+1-555-0202', 'ROLE_DISPATCHER', 2, 1, 1),

-- Rescue Team Members
('firefighter1', 'ff1@fire.gov', '$2a$10$vxKI1gx8Nf8JEQrjQM.KqeN5qQw8wY7QzJxZ3X5X6X7X8X9X0X1X2', 'Robert Taylor', '+1-555-0301', 'ROLE_RESCUE', 1, 1, 1),
('firefighter2', 'ff2@fire.gov', '$2a$10$vxKI1gx8Nf8JEQrjQM.KqeN5qQw8wY7QzJxZ3X5X6X7X8X9X0X1X2', 'Lisa Anderson', '+1-555-0302', 'ROLE_RESCUE', 1, 1, 1),
('officer1', 'officer1@police.gov', '$2a$10$vxKI1gx8Nf8JEQrjQM.KqeN5qQw8wY7QzJxZ3X5X6X7X8X9X0X1X2', 'Chris Moore', '+1-555-0303', 'ROLE_RESCUE', 2, 1, 1),
('paramedic1', 'para1@medical.gov', '$2a$10$vxKI1gx8Nf8JEQrjQM.KqeN5qQw8wY7QzJxZ3X5X6X7X8X9X0X1X2', 'Jennifer Lee', '+1-555-0304', 'ROLE_RESCUE', 3, 1, 1),
('paramedic2', 'para2@medical.gov', '$2a$10$vxKI1gx8Nf8JEQrjQM.KqeN5qQw8wY7QzJxZ3X5X6X7X8X9X0X1X2', 'Kevin White', '+1-555-0305', 'ROLE_RESCUE', 3, 1, 1),

-- Victims
('victim1', 'victim1@email.com', '$2a$10$vxKI1gx8Nf8JEQrjQM.KqeN5qQw8wY7QzJxZ3X5X6X7X8X9X0X1X2', 'Alice Cooper', '+1-555-0401', 'ROLE_VICTIM', NULL, 1, 1),
('victim2', 'victim2@email.com', '$2a$10$vxKI1gx8Nf8JEQrjQM.KqeN5qQw8wY7QzJxZ3X5X6X7X8X9X0X1X2', 'Bob Miller', '+1-555-0402', 'ROLE_VICTIM', NULL, 1, 1);


-- Insert Rescue Teams (get user IDs dynamically)
SET @firefighter1_id = (SELECT id FROM users WHERE username = 'firefighter1');
SET @firefighter2_id = (SELECT id FROM users WHERE username = 'firefighter2');
SET @officer1_id = (SELECT id FROM users WHERE username = 'officer1');
SET @paramedic1_id = (SELECT id FROM users WHERE username = 'paramedic1');
SET @paramedic2_id = (SELECT id FROM users WHERE username = 'paramedic2');

INSERT INTO rescue_teams (name, department_id, user_id, status, member_count, equipment, current_location) VALUES
('Fire Team Alpha', 1, @firefighter1_id, 'AVAILABLE', 5, 'Fire truck, Ladder, Hoses, Breathing apparatus, Thermal camera', 'Station 1'),
('Fire Team Bravo', 1, @firefighter2_id, 'ON_MISSION', 4, 'Hazmat truck, Chemical suits, Fire suppression equipment', '123 Main Street'),
('Police Unit 1', 2, @officer1_id, 'AVAILABLE', 2, 'Patrol car, Traffic cones, First aid kit', 'Station 2'),
('Medical Team 1', 3, @paramedic1_id, 'AVAILABLE', 3, 'Ambulance, Defibrillator, Medical supplies, Stretcher', 'Station 3'),
('Medical Team 2', 3, @paramedic2_id, 'ON_BREAK', 2, 'Ambulance, Advanced trauma kit, Oxygen tanks', 'Hospital');

-- Insert Team Capabilities
SET @team1_id = (SELECT id FROM rescue_teams WHERE name = 'Fire Team Alpha');
SET @team2_id = (SELECT id FROM rescue_teams WHERE name = 'Fire Team Bravo');
SET @team3_id = (SELECT id FROM rescue_teams WHERE name = 'Police Unit 1');
SET @team4_id = (SELECT id FROM rescue_teams WHERE name = 'Medical Team 1');
SET @team5_id = (SELECT id FROM rescue_teams WHERE name = 'Medical Team 2');

INSERT INTO team_capabilities (team_id, capability) VALUES
-- Fire Team Alpha capabilities
(@team1_id, 'Fire Suppression'),
(@team1_id, 'Building Rescue'),
(@team1_id, 'First Aid'),

-- Fire Team Bravo capabilities
(@team2_id, 'Hazmat Response'),
(@team2_id, 'Fire Suppression'),

-- Police Unit 1 capabilities
(@team3_id, 'Traffic Control'),
(@team3_id, 'Crowd Control'),
(@team3_id, 'First Aid'),

-- Medical Team 1 capabilities
(@team4_id, 'Emergency Medical'),
(@team4_id, 'Advanced Life Support'),
(@team4_id, 'Trauma Care'),

-- Medical Team 2 capabilities
(@team5_id, 'Trauma Care'),
(@team5_id, 'Emergency Medical');

-- Insert Emergency Requests
INSERT INTO emergency_requests (victim_name, victim_phone, location, latitude, longitude, emergency_type, priority, status, description, assigned_team_id, assigned_at, responded_at, completed_at, resolution_notes) VALUES
-- Active emergencies
('Multiple People', '+1-555-9999', '123 Main Street, Downtown', 40.7128, -74.0060, 'FIRE', 'CRITICAL', 'IN_PROGRESS', 'Building fire on 5th floor, multiple people trapped', @team2_id, NOW() - INTERVAL 25 MINUTE, NOW() - INTERVAL 20 MINUTE, NULL, NULL),
('Bob Miller', '+1-555-0402', '456 Oak Avenue, Residential Area', 40.7580, -73.9855, 'MEDICAL_EMERGENCY', 'HIGH', 'ASSIGNED', 'Cardiac arrest, 65-year-old male', @team4_id, NOW() - INTERVAL 14 MINUTE, NULL, NULL, NULL),
('Alice Cooper', '+1-555-0401', '789 Highway 101, Mile Marker 45', 40.7489, -73.9680, 'ACCIDENT', 'MEDIUM', 'PENDING', 'Multi-vehicle accident, 3 cars involved, minor injuries', NULL, NULL, NULL, NULL, NULL),
('Unknown', NULL, 'Central Park, Near Bethesda Fountain', 40.7694, -73.9654, 'RESCUE', 'HIGH', 'PENDING', 'Person stuck in tree, approximately 20 feet high', NULL, NULL, NULL, NULL, NULL),

-- Completed emergencies
('Bob Miller', '+1-555-0402', '321 Elm Street, Apartment 4B', 40.7306, -73.9352, 'MEDICAL_EMERGENCY', 'CRITICAL', 'COMPLETED', 'Severe allergic reaction, breathing difficulty', @team5_id, NOW() - INTERVAL 118 MINUTE, NOW() - INTERVAL 115 MINUTE, NOW() - INTERVAL 90 MINUTE, 'Patient stabilized and transported to General Hospital. Full recovery expected.'),
('Alice Cooper', '+1-555-0401', '654 Pine Road, Commercial District', 40.7589, -73.9851, 'FIRE', 'HIGH', 'COMPLETED', 'Kitchen fire in restaurant', @team1_id, NOW() - INTERVAL 178 MINUTE, NOW() - INTERVAL 175 MINUTE, NOW() - INTERVAL 150 MINUTE, 'Fire extinguished. Minor smoke damage. No injuries.'),
('Unknown', NULL, '987 Broadway, Intersection', 40.7614, -73.9776, 'ACCIDENT', 'LOW', 'COMPLETED', 'Fender bender, no injuries', @team3_id, NOW() - INTERVAL 238 MINUTE, NOW() - INTERVAL 235 MINUTE, NOW() - INTERVAL 220 MINUTE, 'Traffic cleared. Insurance information exchanged.');

-- Insert Messages
SET @req1_id = (SELECT id FROM emergency_requests WHERE location = '123 Main Street, Downtown');
SET @req2_id = (SELECT id FROM emergency_requests WHERE location = '456 Oak Avenue, Residential Area');
SET @req3_id = (SELECT id FROM emergency_requests WHERE location = '789 Highway 101, Mile Marker 45');
SET @req5_id = (SELECT id FROM emergency_requests WHERE location = '321 Elm Street, Apartment 4B');

INSERT INTO messages (request_id, sender_name, sender_type, content, is_read, created_at) VALUES
-- Messages for active request #1 (Building fire)
(@req1_id, 'Dispatcher Emma Wilson', 'DISPATCHER', 'Fire reported at 123 Main Street. Dispatching Team Bravo immediately.', 1, NOW() - INTERVAL 25 MINUTE),
(@req1_id, 'FF Lisa Anderson', 'RESCUE_TEAM', 'Team Bravo on scene. Fire on 5th floor confirmed. Requesting additional units.', 1, NOW() - INTERVAL 20 MINUTE),
(@req1_id, 'Dispatcher Emma Wilson', 'DISPATCHER', 'Fire Team Alpha en route as backup. ETA 5 minutes.', 1, NOW() - INTERVAL 18 MINUTE),

-- Messages for active request #2 (Cardiac arrest)
(@req2_id, 'Dispatcher James Brown', 'DISPATCHER', 'Medical emergency - cardiac arrest at 456 Oak Avenue. Medical Team 1 dispatched.', 1, NOW() - INTERVAL 14 MINUTE),
(@req2_id, 'Paramedic Jennifer Lee', 'RESCUE_TEAM', 'En route to location. ETA 3 minutes.', 1, NOW() - INTERVAL 12 MINUTE),

-- Messages for pending request #3 (Accident)
(@req3_id, 'Alice Cooper', 'VICTIM', 'Need help! 3-car accident on Highway 101. Some people are injured.', 1, NOW() - INTERVAL 10 MINUTE),
(@req3_id, 'Dispatcher James Brown', 'DISPATCHER', 'Help is on the way. Please stay calm and do not move injured persons.', 0, NOW() - INTERVAL 9 MINUTE),

-- Messages for completed request #5 (Allergic reaction)
(@req5_id, 'Bob Miller', 'VICTIM', 'Emergency! Severe allergic reaction. Cannot breathe!', 1, NOW() - INTERVAL 2 HOUR),
(@req5_id, 'Dispatcher James Brown', 'DISPATCHER', 'Medical Team 2 dispatched to 321 Elm Street Apt 4B', 1, NOW() - INTERVAL 118 MINUTE),
(@req5_id, 'Paramedic Kevin White', 'RESCUE_TEAM', 'Patient stabilized. Transporting to General Hospital.', 1, NOW() - INTERVAL 95 MINUTE),
(@req5_id, 'Paramedic Kevin White', 'RESCUE_TEAM', 'Patient delivered to ER. Mission complete.', 1, NOW() - INTERVAL 90 MINUTE);

-- Display summary
SELECT 'Data seeding completed successfully!' as Status;
SELECT COUNT(*) as 'Departments' FROM departments;
SELECT COUNT(*) as 'Users (including admin)' FROM users;
SELECT COUNT(*) as 'Rescue Teams' FROM rescue_teams;
SELECT COUNT(*) as 'Team Capabilities' FROM team_capabilities;
SELECT COUNT(*) as 'Emergency Requests' FROM emergency_requests;
SELECT COUNT(*) as 'Messages' FROM messages;
