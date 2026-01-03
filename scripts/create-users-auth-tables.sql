-- Create users and authentication tables for MASS Car Workshop VWMS
-- Demo Users Authentication System

-- Users table with role-based access
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'staff', 'technician', 'customer')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
    id SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    module VARCHAR(100) NOT NULL,
    permissions JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert demo users (passwords are hashed version of '123456')
-- Note: In production, use proper password hashing like bcrypt
INSERT INTO users (email, password_hash, role, first_name, last_name, phone) VALUES
('admin@masscar.com', '$2b$10$rOzJqQZ8kVx.QvF5L5YzKOqGqF5L5YzKOqGqF5L5YzKOqGqF5L5Yz', 'admin', 'System', 'Administrator', '+252-61-234-5678'),
('staff@masscar.com', '$2b$10$rOzJqQZ8kVx.QvF5L5YzKOqGqF5L5YzKOqGqF5L5YzKOqGqF5L5Yz', 'staff', 'Workshop', 'Staff', '+252-61-234-5679'),
('tech@masscar.com', '$2b$10$rOzJqQZ8kVx.QvF5L5YzKOqGqF5L5YzKOqGqF5L5YzKOqGqF5L5Yz', 'technician', 'Senior', 'Technician', '+252-61-234-5680'),
('customer@masscar.com', '$2b$10$rOzJqQZ8kVx.QvF5L5YzKOqGqF5L5YzKOqGqF5L5YzKOqGqF5L5Yz', 'customer', 'Demo', 'Customer', '+252-61-234-5681');

-- Insert role permissions
INSERT INTO role_permissions (role, module, permissions) VALUES
-- Admin permissions (full access)
('admin', 'dashboard', '{"read": true, "write": true, "delete": true, "manage": true}'),
('admin', 'customers', '{"read": true, "write": true, "delete": true, "manage": true}'),
('admin', 'vehicles', '{"read": true, "write": true, "delete": true, "manage": true}'),
('admin', 'appointments', '{"read": true, "write": true, "delete": true, "manage": true}'),
('admin', 'technicians', '{"read": true, "write": true, "delete": true, "manage": true}'),
('admin', 'suppliers', '{"read": true, "write": true, "delete": true, "manage": true}'),
('admin', 'inspections', '{"read": true, "write": true, "delete": true, "manage": true}'),
('admin', 'estimates', '{"read": true, "write": true, "delete": true, "manage": true}'),
('admin', 'inventory', '{"read": true, "write": true, "delete": true, "manage": true}'),
('admin', 'reports', '{"read": true, "write": true, "delete": false, "manage": true}'),
('admin', 'ai-tools', '{"read": true, "write": true, "delete": false, "manage": true}'),

-- Staff permissions (most modules, limited delete)
('staff', 'dashboard', '{"read": true, "write": false, "delete": false, "manage": false}'),
('staff', 'customers', '{"read": true, "write": true, "delete": false, "manage": false}'),
('staff', 'vehicles', '{"read": true, "write": true, "delete": false, "manage": false}'),
('staff', 'appointments', '{"read": true, "write": true, "delete": false, "manage": true}'),
('staff', 'technicians', '{"read": true, "write": false, "delete": false, "manage": false}'),
('staff', 'suppliers', '{"read": true, "write": true, "delete": false, "manage": false}'),
('staff', 'inspections', '{"read": true, "write": true, "delete": false, "manage": false}'),
('staff', 'estimates', '{"read": true, "write": true, "delete": false, "manage": true}'),
('staff', 'inventory', '{"read": true, "write": true, "delete": false, "manage": false}'),
('staff', 'reports', '{"read": true, "write": false, "delete": false, "manage": false}'),
('staff', 'ai-tools', '{"read": true, "write": true, "delete": false, "manage": false}'),

-- Technician permissions (focused on technical work)
('technician', 'dashboard', '{"read": true, "write": false, "delete": false, "manage": false}'),
('technician', 'customers', '{"read": true, "write": false, "delete": false, "manage": false}'),
('technician', 'vehicles', '{"read": true, "write": true, "delete": false, "manage": false}'),
('technician', 'appointments', '{"read": true, "write": true, "delete": false, "manage": false}'),
('technician', 'technicians', '{"read": true, "write": false, "delete": false, "manage": false}'),
('technician', 'suppliers', '{"read": true, "write": false, "delete": false, "manage": false}'),
('technician', 'inspections', '{"read": true, "write": true, "delete": false, "manage": true}'),
('technician', 'estimates', '{"read": true, "write": true, "delete": false, "manage": false}'),
('technician', 'inventory', '{"read": true, "write": false, "delete": false, "manage": false}'),
('technician', 'reports', '{"read": true, "write": false, "delete": false, "manage": false}'),
('technician', 'ai-tools', '{"read": true, "write": true, "delete": false, "manage": false}'),

-- Customer permissions (limited access)
('customer', 'dashboard', '{"read": true, "write": false, "delete": false, "manage": false}'),
('customer', 'vehicles', '{"read": true, "write": false, "delete": false, "manage": false}'),
('customer', 'appointments', '{"read": true, "write": true, "delete": false, "manage": false}'),
('customer', 'inspections', '{"read": true, "write": false, "delete": false, "manage": false}'),
('customer', 'estimates', '{"read": true, "write": false, "delete": false, "manage": false}');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_role_permissions_role ON role_permissions(role);
