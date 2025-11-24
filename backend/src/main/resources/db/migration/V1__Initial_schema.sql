-- V1__Initial_schema.sql
-- Create initial database schema for Disaster Management System V2

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(50) NOT NULL,
    department_id BIGINT,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    account_non_locked BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Departments table
CREATE TABLE departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    contact_number VARCHAR(20) NOT NULL,
    address VARCHAR(200),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_dept_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rescue Teams table
CREATE TABLE rescue_teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department_id BIGINT NOT NULL,
    user_id BIGINT UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    current_request_id BIGINT,
    member_count INT NOT NULL DEFAULT 1,
    equipment VARCHAR(500),
    current_location VARCHAR(200),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_department (department_id),
    INDEX idx_current_request (current_request_id),
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Team Capabilities junction table
CREATE TABLE team_capabilities (
    team_id BIGINT NOT NULL,
    capability VARCHAR(50) NOT NULL,
    PRIMARY KEY (team_id, capability),
    FOREIGN KEY (team_id) REFERENCES rescue_teams(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Emergency Requests table
CREATE TABLE emergency_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    victim_name VARCHAR(100) NOT NULL,
    victim_phone VARCHAR(100),
    location VARCHAR(300) NOT NULL,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    emergency_type VARCHAR(30) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    description VARCHAR(1000),
    assigned_team_id BIGINT,
    assigned_at TIMESTAMP NULL,
    responded_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    resolution_notes VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_type (emergency_type),
    INDEX idx_priority (priority),
    INDEX idx_location (location),
    INDEX idx_created_at (created_at),
    INDEX idx_assigned_team (assigned_team_id),
    FOREIGN KEY (assigned_team_id) REFERENCES rescue_teams(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Messages table
CREATE TABLE messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_id BIGINT NOT NULL,
    content VARCHAR(2000) NOT NULL,
    sender_name VARCHAR(100) NOT NULL,
    sender_type VARCHAR(20) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_request (request_id),
    INDEX idx_sender (sender_type),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (request_id) REFERENCES emergency_requests(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key for users -> departments (after departments table exists)
ALTER TABLE users
ADD CONSTRAINT fk_user_department
FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

-- Add foreign key for rescue_teams -> emergency_requests (after both tables exist)
ALTER TABLE rescue_teams
ADD CONSTRAINT fk_team_current_request
FOREIGN KEY (current_request_id) REFERENCES emergency_requests(id) ON DELETE SET NULL;
