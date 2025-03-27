CREATE TABLE malpractice_students (
    malpractice_id INT NOT NULL IDENTITY(1,1),
    exam_id INT NOT NULL,
    student_regno VARCHAR(50) NOT NULL,
    malpractice_count INT NOT NULL DEFAULT 0, -- Tracks total number of malpractices for this student in this exam
    status VARCHAR(25) NOT NULL DEFAULT 'Pending', -- e.g., 'Pending', 'Warned', 'Suspended'
    reported_date DATETIME NOT NULL DEFAULT GETDATE(), -- When the malpractice was reported
    PRIMARY KEY (malpractice_id),
    FOREIGN KEY (exam_id) REFERENCES exam (exam_id),
    FOREIGN KEY (student_regno) REFERENCES users (user_regno)
);

CREATE TABLE malpractice_log (
    log_id INT NOT NULL IDENTITY(1,1),
    malpractice_id INT NOT NULL,
    student_regno VARCHAR(50) NOT NULL,
    exam_id INT NOT NULL,
    malpractice_type VARCHAR(100) NOT NULL, -- e.g., 'Screen Switching', 'Multiple Persons Detected'
    description VARCHAR(500) NOT NULL, -- Detailed description of the incident
    log_time DATETIME NOT NULL DEFAULT GETDATE(), -- When the incident occurred
    warning_count INT NOT NULL DEFAULT 1, -- Number of warnings issued for this incident
    PRIMARY KEY (log_id),
    FOREIGN KEY (malpractice_id) REFERENCES malpractice_students (malpractice_id),
    FOREIGN KEY (student_regno) REFERENCES users (user_regno),
    FOREIGN KEY (exam_id) REFERENCES exam (exam_id)
);