-- ===============================
-- Task Manager Database Setup
-- ===============================

-- Create database
CREATE DATABASE IF NOT EXISTS taskmanager_db;

-- Use the database
USE taskmanager_db;

-- Note: Tables will be automatically created by Hibernate (JPA)
-- when you run the Spring Boot application for the first time.
-- 
-- The application is configured with:
--   spring.jpa.hibernate.ddl-auto=update
-- 
-- This means Hibernate will automatically:
-- 1. Create the 'users' table
-- 2. Create the 'projects' table
-- 3. Create the 'tasks' table
-- 4. Set up all necessary foreign key relationships
--
-- No manual table creation is required!

-- Optional: Verify the database was created
SHOW DATABASES LIKE 'taskmanager_db';
