-- Test Data for Disaster Management System
-- Run this to populate the system with realistic test scenarios

-- First, let's check existing data
SELECT 'Current Users:' as info;
SELECT id, username, role, department_id FROM users;

SELECT 'Current Departments:' as info;
SELECT id, name FROM departments;

SELECT 'Current Rescue Teams:' as info;
SELECT id, name, department_id, status FROM rescue_teams;

-- Create test emergency requests with assignments
-- Fire Department Requests (Department ID: 1)
INSERT INTO emergency_requests (
    victim_name, victim_phone, location, latitude, longitude,
    emergency_type, priority, status, description,
    assigned_team_id, created_by, created_at, updated_at
) VALUES
-- Fire emergencies assigned to Fire Rescue Team (Team ID: 1)
(
    'Sarah Johnson', '555-0101', '123 Main Street, Downtown',
    40.7128, -74.0060,
    'FIRE', 'CRITICAL', 'EN_ROUTE',
    'Building fire with people trapped on 3rd floor. Heavy smoke visible.',
    1, 'victim_test1',
    DATE_SUB(NOW(), INTERVAL 30 MINUTE),
    DATE_SUB(NOW(), INTERVAL 25 MINUTE)
),
(
    'Michael Chen', '555-0102', '456 Oak Avenue, Residential Area',
    40.7589, -73.9851,
    'FIRE', 'HIGH', 'ON_SCENE',
    'House fire started in kitchen. Family evacuated safely.',
    1, 'victim_test2',
    DATE_SUB(NOW(), INTERVAL 2 HOUR),
    DATE_SUB(NOW(), INTERVAL 1 HOUR)
),
(
    'Emily Rodriguez', '555-0103', '789 Pine Road, Suburbs',
    40.7282, -73.7949,
    'FIRE', 'MEDIUM', 'RESOLVED',
    'Small electrical fire in garage. Contained before spreading.',
    1, 'victim_test3',
    DATE_SUB(NOW(), INTERVAL 1 DAY),
    DATE_SUB(NOW(), INTERVAL 23 HOUR)
),

-- Police Department Requests (Department ID: 2)
-- Assigned to Police Response Unit (Team ID: 3)
(
    'James Wilson', '555-0201', '321 Elm Street, Commercial District',
    40.7484, -73.9857,
    'CRIME', 'HIGH', 'ASSIGNED',
    'Armed robbery in progress at convenience store. Suspects still on scene.',
    3, 'victim_test4',
    DATE_SUB(NOW(), INTERVAL 15 MINUTE),
    DATE_SUB(NOW(), INTERVAL 10 MINUTE)
),
(
    'Lisa Anderson', '555-0202', '654 Maple Drive, Downtown',
    40.7614, -73.9776,
    'CRIME', 'CRITICAL', 'EN_ROUTE',
    'Hostage situation at bank. Multiple civilians involved.',
    3, 'victim_test5',
    DATE_SUB(NOW(), INTERVAL 45 MINUTE),
    DATE_SUB(NOW(), INTERVAL 40 MINUTE)
),
(
    'Robert Taylor', '555-0203', '987 Cedar Lane, Business Park',
    40.7489, -73.9680,
    'CRIME', 'MEDIUM', 'RESOLVED',
    'Break-in at warehouse. Suspects apprehended.',
    3, 'victim_test6',
    DATE_SUB(NOW(), INTERVAL 3 HOUR),
    DATE_SUB(NOW(), INTERVAL 2 HOUR)
),

-- Medical Department Requests (Department ID: 3)
-- Assigned to Medical Response Team (Team ID: 2)
(
    'Jennifer Martinez', '555-0301', '147 Birch Avenue, Residential',
    40.7300, -73.9950,
    'MEDICAL', 'CRITICAL', 'ON_SCENE',
    'Cardiac arrest. Patient unresponsive. CPR in progress.',
    2, 'victim_test7',
    DATE_SUB(NOW(), INTERVAL 20 MINUTE),
    DATE_SUB(NOW(), INTERVAL 15 MINUTE)
),
(
    'David Lee', '555-0302', '258 Walnut Street, Park Area',
    40.7410, -73.9897,
    'MEDICAL', 'HIGH', 'ASSIGNED',
    'Severe allergic reaction. Patient having difficulty breathing.',
    2, 'victim_test8',
    DATE_SUB(NOW(), INTERVAL 35 MINUTE),
    DATE_SUB(NOW(), INTERVAL 30 MINUTE)
),
(
    'Amanda White', '555-0303', '369 Spruce Road, Shopping Mall',
    40.7580, -73.9855,
    'MEDICAL', 'MEDIUM', 'RESOLVED',
    'Broken leg from fall. Patient stabilized and transported.',
    2, 'victim_test9',
    DATE_SUB(NOW(), INTERVAL 5 HOUR),
    DATE_SUB(NOW(), INTERVAL 4 HOUR)
),

-- Pending Requests (Not yet assigned)
(
    'Carlos Garcia', '555-0401', '741 Ash Boulevard, Industrial Zone',
    40.7450, -73.9800,
    'FIRE', 'MEDIUM', 'PENDING',
    'Smoke alarm activated in warehouse. No visible fire yet.',
    NULL, 'victim_test10',
    DATE_SUB(NOW(), INTERVAL 5 MINUTE),
    DATE_SUB(NOW(), INTERVAL 5 MINUTE)
),
(
    'Michelle Brown', '555-0402', '852 Hickory Lane, Residential',
    40.7520, -73.9920,
    'MEDICAL', 'LOW', 'PENDING',
    'Minor injury from sports activity. Non-emergency transport needed.',
    NULL, 'victim_test11',
    DATE_SUB(NOW(), INTERVAL 10 MINUTE),
    DATE_SUB(NOW(), INTERVAL 10 MINUTE)
),
(
    'Steven Kim', '555-0403', '963 Sycamore Drive, University Campus',
    40.7350, -73.9960,
    'CRIME', 'LOW', 'PENDING',
    'Suspicious activity reported near dormitory. Possible trespasser.',
    NULL, 'victim_test12',
    DATE_SUB(NOW(), INTERVAL 8 MINUTE),
    DATE_SUB(NOW(), INTERVAL 8 MINUTE)
);

-- Update team statuses based on assignments
UPDATE rescue_teams SET status = 'EN_ROUTE' WHERE id = 1;  -- Fire team responding
UPDATE rescue_teams SET status = 'ON_SCENE' WHERE id = 2;   -- Medical team on scene
UPDATE rescue_teams SET status = 'EN_ROUTE' WHERE id = 3;   -- Police team responding

-- Set assigned_at and responded_at timestamps for assigned requests
UPDATE emergency_requests 
SET assigned_at = DATE_SUB(NOW(), INTERVAL 25 MINUTE)
WHERE id IN (SELECT id FROM (SELECT id FROM emergency_requests WHERE status IN ('EN_ROUTE', 'ON_SCENE', 'RESOLVED', 'ASSIGNED') AND assigned_team_id IS NOT NULL) as temp);

UPDATE emergency_requests 
SET responded_at = DATE_SUB(NOW(), INTERVAL 20 MINUTE)
WHERE status IN ('ON_SCENE', 'RESOLVED');

UPDATE emergency_requests 
SET completed_at = updated_at
WHERE status = 'RESOLVED';

UPDATE emergency_requests 
SET resolution_notes = 'Situation resolved successfully. No casualties.'
WHERE status = 'RESOLVED' AND resolution_notes IS NULL;

-- Verify the test data
SELECT 'Emergency Requests by Status:' as info;
SELECT status, COUNT(*) as count FROM emergency_requests GROUP BY status;

SELECT 'Emergency Requests by Department (via Team):' as info;
SELECT d.name as department, COUNT(er.id) as request_count
FROM emergency_requests er
LEFT JOIN rescue_teams rt ON er.assigned_team_id = rt.id
LEFT JOIN departments d ON rt.department_id = d.id
GROUP BY d.name;

SELECT 'Recent Emergency Requests:' as info;
SELECT 
    id, 
    victim_name, 
    emergency_type, 
    priority, 
    status, 
    assigned_team_id,
    DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') as created
FROM emergency_requests 
ORDER BY created_at DESC 
LIMIT 10;

SELECT 'Team Utilization:' as info;
SELECT 
    rt.name as team_name,
    d.name as department,
    rt.status,
    COUNT(er.id) as assigned_requests
FROM rescue_teams rt
LEFT JOIN departments d ON rt.department_id = d.id
LEFT JOIN emergency_requests er ON er.assigned_team_id = rt.id AND er.status IN ('ASSIGNED', 'EN_ROUTE', 'ON_SCENE')
GROUP BY rt.id, rt.name, d.name, rt.status;
