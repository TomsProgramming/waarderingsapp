-- Initialize the database with student tables
-- This script should be run once to set up the database

-- Create docenten table if it doesn't exist
CREATE TABLE IF NOT EXISTS docenten (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create students table if it doesn't exist
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    student_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    class_name VARCHAR(50),
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table for storing student reviews
CREATE TABLE IF NOT EXISTS student_reviews (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    reviewer_type VARCHAR(20) DEFAULT 'klant', -- 'klant', 'docent', 'student'
    reviewer_id VARCHAR(50), -- For tracking who made the review
    ratings JSONB NOT NULL, -- Store ratings as JSON: {"Presenteren": 4, "Organiseren": 3, ...}
    review_text TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create student_skills junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS student_skills (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
    level INTEGER CHECK (level >= 1 AND level <= 5), -- 1-5 skill level
    assessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, skill_id)
);

-- Insert default skills
INSERT INTO skills (name, description, category) VALUES
('Presenteren', 'Vermogen om informatie duidelijk en overtuigend over te brengen', 'Communication'),
('Organiseren', 'Vermogen om taken en tijd effectief te plannen en structureren', 'Organization'),
('Zelfstandigheid', 'Vermogen om onafhankelijk te werken en beslissingen te nemen', 'Independence'),
('Samenwerken', 'Vermogen om effectief in teamverband te functioneren', 'Teamwork'),
('Communiceren', 'Vermogen om duidelijk en effectief te communiceren', 'Communication')
ON CONFLICT DO NOTHING;

-- Insert sample students
INSERT INTO students (student_number, first_name, last_name, email, class_name, image_url) VALUES
('2024001', 'Jorden', 'Gielen', 'jorden.gielen@student.example.com', 'ICT-4A', '/assets/img/bureau_logo.png'),
('2024002', 'Emma', 'Janssen', 'emma.janssen@student.example.com', 'ICT-4A', '/assets/img/bureau_logo.png'),
('2024003', 'Lars', 'van Berg', 'lars.vanberg@student.example.com', 'ICT-4B', '/assets/img/bureau_logo.png'),
('2024004', 'Sophie', 'Bakker', 'sophie.bakker@student.example.com', 'ICT-4A', '/assets/img/bureau_logo.png'),
('2024005', 'Tim', 'de Vries', 'tim.devries@student.example.com', 'ICT-4B', '/assets/img/bureau_logo.png'),
('2024006', 'Lisa', 'Meijer', 'lisa.meijer@student.example.com', 'ICT-4A', '/assets/img/bureau_logo.png'),
('2024007', 'Mike', 'Smit', 'mike.smit@student.example.com', 'ICT-4B', '/assets/img/bureau_logo.png'),
('230043', 'Etien', 'den Ouden', 'etien.denouden@student.example.com', 'ICT-3A', '/assets/img/bureau_logo.png'),
('230076', 'Mark', 'Petrenko', 'mark.petrenko@student.example.com', 'ICT-3A', '/assets/img/bureau_logo.png'),
('210348', 'Jaiden', 'Coole', 'jaiden.coole@student.example.com', 'ICT-5A', '/assets/img/bureau_logo.png')
ON CONFLICT (student_number) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_docenten_username ON docenten(username);
CREATE INDEX IF NOT EXISTS idx_students_student_number ON students(student_number);
CREATE INDEX IF NOT EXISTS idx_student_reviews_student_id ON student_reviews(student_id);
CREATE INDEX IF NOT EXISTS idx_student_skills_student_id ON student_skills(student_id);