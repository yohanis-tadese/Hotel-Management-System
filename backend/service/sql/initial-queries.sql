-- Departments Table
CREATE TABLE IF NOT EXISTS `departments` (
  `department_id` INT(11) NOT NULL AUTO_INCREMENT,
  `department_name` VARCHAR(255) NOT NULL,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `phone_number` VARCHAR(20),
  `contact_email` VARCHAR(255),
  `office_location` VARCHAR(255),
  `photo` VARCHAR(255) DEFAULT 'default.jpg', 
  `password` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255), 
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  `entity_type` ENUM('department') DEFAULT 'department',
  PRIMARY KEY (`department_id`),
  UNIQUE KEY (`department_name`),
  INDEX (`department_name`)
) ENGINE=InnoDB;

-- Companies Table
CREATE TABLE IF NOT EXISTS `companies` (
  `company_id` INT(11) NOT NULL AUTO_INCREMENT,
  `company_name` VARCHAR(255) NOT NULL,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `phone_number` VARCHAR(20),
  `contact_email` VARCHAR(255),
  `location` VARCHAR(255),
  `industry_sector` VARCHAR(255),
  `accepted_student_limit` INT(11),
  `website` VARCHAR(400),
  `photo` VARCHAR(255) DEFAULT 'default.jpg', 
  `password` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255), 
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  `entity_type` ENUM('companie') DEFAULT 'companie',
  PRIMARY KEY (`company_id`),
  UNIQUE KEY (`company_name`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `students` (
  `student_id` INT(11) NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `phone_number` VARCHAR(20),
  `contact_email` VARCHAR(255),
  `gpa` DECIMAL(3, 2),  
  `photo` VARCHAR(255) DEFAULT 'default.jpg', 
  `password` VARCHAR(255) NOT NULL,
  `department_id` INT(11),
  `token` VARCHAR(255), 
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  `entity_type` ENUM('student') DEFAULT 'student',
  `status` ENUM('Not Started', 'In Progress', 'Nearly Completed', 'Almost Finished', 'Completed') DEFAULT 'Not Started',
  PRIMARY KEY (`student_id`),
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`department_id`) ON DELETE CASCADE 
) ENGINE=InnoDB;


-- Admins Table
CREATE TABLE IF NOT EXISTS `admins` (
  `admin_id` INT(11) NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL,
  `photo` VARCHAR(255) DEFAULT 'default.jpg', 
  `password` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255), 
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
  `entity_type` ENUM('admin') DEFAULT 'admin',
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB;

-- Student Apply Form Table
CREATE TABLE IF NOT EXISTS `student_apply_form` (
  `apply_id` INT(11) NOT NULL AUTO_INCREMENT,
  `student_id` INT(11) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `disability` TINYINT(1),
  `gender` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`apply_id`),
  FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE 
) ENGINE=InnoDB;

-- Student Preferences Table
CREATE TABLE IF NOT EXISTS `student_preferences` (
  `apply_id` INT(11) NOT NULL,
  `preference_order` INT(11) NOT NULL,
  `student_id` INT(11) NOT NULL,
  `company_id` INT(11) NOT NULL,
  PRIMARY KEY (`apply_id`, `preference_order`),
  FOREIGN KEY (`apply_id`) REFERENCES `student_apply_form`(`apply_id`) ON DELETE CASCADE,
  FOREIGN KEY (`student_id`) REFERENCES `student_apply_form`(`student_id`) ON DELETE CASCADE,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`company_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Admin-Defined Weights Table
CREATE TABLE IF NOT EXISTS `weights` (
  `weight_id` INT(11) NOT NULL AUTO_INCREMENT,
  `weight_disability` INT(11) NOT NULL,
  `weight_gender` INT(11) NOT NULL,
  `weight_preference` INT(11) NOT NULL,
  `weight_grade` INT(11) NOT NULL,
  `admin_id` INT(11), 
  PRIMARY KEY (`weight_id`),
  FOREIGN KEY (`admin_id`) REFERENCES `admins`(`admin_id`)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `apptlytime` (
  `time_id` INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `start_time` DATETIME,
  `end_time` DATETIME
);

-- Placement Results Table
CREATE TABLE IF NOT EXISTS `placement_results` (
  `placement_id` INT(11) NOT NULL AUTO_INCREMENT,
  `student_id` INT(11) NOT NULL,
  `company_id` INT(11) NOT NULL,
   PRIMARY KEY (`placement_id`),
  FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`company_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Plorganization  Results Table
CREATE TABLE IF NOT EXISTS `student_organizational_result` (
  `result_id` INT(11) NOT NULL AUTO_INCREMENT,
  `student_id` INT(11) NOT NULL,
  `department_id` INT(11) NOT NULL,
  `company_id` INT(11) NOT NULL,
  `commitment` DECIMAL(5,2),
  `courtesy` DECIMAL(5,2),
  `conduct` DECIMAL(5,2),
  `perseverance` DECIMAL(5,2),
  `teamwork` DECIMAL(5,2),
  `professional_ethics` DECIMAL(5,2),
  `creativity` DECIMAL(5,2),
  `technical_knowledge` DECIMAL(5,2),
  `efficiency` DECIMAL(5,2),
  `professional_comments` DECIMAL(5,2),
  `attendance` DECIMAL(5,2),
  `advisor_name` VARCHAR(255),
  `department_assigned` VARCHAR(255),
  `attachment_from_date` DATE,
  `attachment_to_date` DATE,
  `area_of_work` VARCHAR(255),
  `total_hours` DECIMAL(8,2),
  `comment`VARCHAR(5000),
  PRIMARY KEY (`result_id`),
  FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE,
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`department_id`) ON DELETE CASCADE,
  FOREIGN KEY (`company_id`) REFERENCES `companies`(`company_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Presentation Result Table
CREATE TABLE IF NOT EXISTS `evaluation_result` (
  `evaluation_result_id` INT(11) NOT NULL AUTO_INCREMENT,
  `student_id` INT(11) NOT NULL,
  `department_id` INT(11) NOT NULL,
  `advisor_score` DECIMAL(5,2),
  `presentation_score` DECIMAL(5,2),
  `documentation_score` DECIMAL(5,2),
   PRIMARY KEY (`evaluation_result_id`),
  FOREIGN KEY (`student_id`) REFERENCES `students`(`student_id`) ON DELETE CASCADE,
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`department_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Insert test admin-defined weights
INSERT INTO `weights` (`weight_disability`, `weight_gender`, `weight_preference`, `weight_grade`)
VALUES (10, 10, 50, 30);

-- Insert an admin
INSERT INTO `admins` (`first_name`, `last_name`, `username`, `email`, `photo`, `password`)
VALUES 
  ('Jhon', 'Doee', 'admin.jhon.do', 'admin@example.com', 'default.jpg', '$2b$10$FnNRxXprBvWeyhl4UHiDs./ZaOQg8RVm/ShFg0aqPHe0AqD.I/bO6');



-- Insert random departments
INSERT INTO `departments` (`department_name`, `username`, `phone_number`, `contact_email`, `office_location`, `password`)
VALUES 
  ('InfoSystem', 'dept.infosystem', '1234567890', 'info_sys@gmail.com', 'Building A', '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2'),
  ('InfoScience', 'dept.infoscience', '0987654321', 'info_sci@gmail.com', 'Building B', '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2'),
  ('CompScience', 'dept.compscience', '9876543210', 'comp_sci@gmail.com', 'Building C', '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2'),
  ('InfoTechnology', 'dept.infotechnology', '9876543210', 'info_tech@gmail.com', 'Building D', '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2'),
  ('Software', 'dept.software', '2345678901', 'soft_eng@gmail.com', 'Building E', '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2');


-- Insert ten companies
INSERT INTO companies (company_name, username, phone_number, contact_email, location, industry_sector, accepted_student_limit, website, password) VALUES
('Zalatech', 'comp.zalatech', '+251912974411', 'info@zalatechs.com', 'Addis Ababa', 'Tech', 4, 'www.zalatechs.com', '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2'),
('Cynooxtech', 'comp.cynooxtech', '+251909772885', 'cynooxtech@gmail.com', 'Addis Ababa', 'Tech', 5, 'www.cynoox.com', '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2'),
('Fairfaxtech', 'comp.fairfaxtech', '+251115549172', 'info@fairfaxtechnologies.com', 'Addis Ababa', 'Tech', 3, 'www.fairfax.com', '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2'),
('Alphait', 'comp.alphait', '+251912254156', 'info@alphaitsolution.com', 'Addis Ababa', 'Tech', 4, 'www.alpha.com', '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2'),
('PeragoTech', 'comp.peragotech', '+251911231622', 'info@peragosystems.com', 'Addis Ababa', 'Tech', 3, 'www.perago.com', '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2'),
('Technium', 'comp.technium', '+251911000111', 'contact@technium.com', 'Addis Ababa', 'Tech', 4, 'www.technium.com', '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2'),
('Innovative Minds', 'comp.innovativeminds', '+251911002222', 'info@innovativeminds.com', 'Addis Ababa', 'Tech', 5, 'www.innovativeminds.com', '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2'),
('NexGenTech', 'comp.nexgentech', '+251911003333', 'contact@nexgentech.com', 'Addis Ababa', 'Tech', 3, 'www.nexgentech.com', '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2'),
('Tech Giants', 'comp.techgiants', '+251911004444', 'info@techgiants.com', 'Addis Ababa', 'Tech', 4, 'www.techgiants.com', '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2'),
('FutureTech', 'comp.futuretech', '+251911005555', 'contact@futuretech.com', 'Addis Ababa', 'Tech', 5, 'www.futuretech.com', '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2');


-- Insert ten students with different departments
INSERT INTO students (first_name, last_name, username, phone_number, contact_email, gpa, password, department_id) VALUES
('Yonas', 'Daniel', 'stud.yonas.da', '0967155787', 'yonasda@gmail.com', 3.70, '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2', 1),
('Dawit', 'Belete', 'stud.dawit.be', '0925567288', 'dawitbete@gmail.com', 3.75, '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2', 1),
('Dereje', 'Zerifu', 'stud.dereje.ze', '0973452687', 'derejezerf@gmail.com', 3.25, '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2', 1),
('Daniel', 'Niguse', 'stud.daniel.ni', '0945690715', 'sdanielnu2@gmail.com', 3.80, '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2', 1),
('Yakob', 'Temesgen', 'stud.yakob.te', '0955231467', 'yakobtemu@gmail.com', 3.65, '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2', 5),
('Tsion', 'Ayele', 'stud.tsion.ay', '0987541377', 'tsionayu1@gmail.com', 3.90, '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2', 2),
('Abel', 'Regasa', 'stud.abel.re', '0962145677', 'abelrega@gmail.com', 3.55, '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2', 2),
('Helen', 'Kebede', 'stud.helen.ke', '0945231691', 'helenke56@gmail.com', 3.70, '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2', 3),
('Kalab', 'Kibebew', 'stud.kalab.ki', '0935441277', 'kalabkeb66@gmail.com', 3.45, '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2', 4),
('Tamirat', 'Eyoil', 'stud.tamirat.ey', '0932557410', 'tamirateyu88@gmail.com', 3.80, '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2', 5),
('Teddy', 'Alemu', 'stud.teddy.al', '0998732211', 'teddyale8@gmail.com', 3.60, '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2', 5),
('Ahmed', 'Abdu', 'stud.ahmed.ab', '0988726367', 'ahamedab78@gmail.com', 3.70, '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2', 3),
('Binyam', 'Belete', 'stud.binyam.bi', '0945267278', 'binyambel82@gmail.com', 3.75, '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2', 4),
('Roza', 'Mesifi', 'stud.roza.me', '0972342691', 'rozamesfin2@gmail.com', 3.85, '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2', 5),
('Betty', 'Adane', 'stud.betty.ad', '0935137412', 'bettyad12@gmail.com', 3.40, '$2b$10$NQcPKGOvYo6.51l7aR.nkuVxdNZazz7xKE28i8jLKNHmCdcAkWMC2', 3);

-- Student Apply Form Data
INSERT INTO `student_apply_form` (`student_id`, `name`, `disability`, `gender`) VALUES
(1, 'Yonas Daniel', 1, 'male'),
(2, 'Dawit Belete', 1, 'male'),
(3, 'Dereje Zerifu', 0, 'male'),
(4, 'Daniel Niguse', 0, 'male'),
(5, 'Yakob Temesgen', 0, 'male'),
(6, 'Tsion Ayele', 1, 'female'),
(7, 'Abel Regasa', 1, 'male'),
(8, 'Helen Kebede', 0, 'female'),
(9, 'Kalab Kibebew', 0, 'male'),
(10, 'Tamirat Eyoil', 1, 'male'),
(11, 'Teddy Alemu', 1, 'male'),
(12, 'Ahmed Abdu', 0, 'male'),
(13, 'Binyam Belete', 0, 'male'),
(14, 'Roza Mesifi', 1, 'female'),
(15, 'Betty Adane', 1, 'female');

-- Student Preferences Data
INSERT INTO `student_preferences` (`apply_id`, `preference_order`, `student_id`, `company_id`) VALUES
(1, 1, 1, 1), (1, 2, 1, 2), (1, 3, 1, 3), (1, 4, 1, 4), (1, 5, 1, 5), (1, 6, 1, 6), (1, 7, 1, 7), (1, 8, 1, 8), (1, 9, 1, 9), (1, 10, 1, 10),
(2, 1, 2, 2), (2, 2, 2, 3), (2, 3, 2, 1), (2, 4, 2, 4), (2, 5, 2, 5), (2, 6, 2, 6), (2, 7, 2, 7), (2, 8, 2, 8), (2, 9, 2, 9), (2, 10, 2, 10),
(3, 1, 3, 3), (3, 2, 3, 2), (3, 3, 3, 4), (3, 4, 3, 1), (3, 5, 3, 5), (3, 6, 3, 6), (3, 7, 3, 7), (3, 8, 3, 8), (3, 9, 3, 9), (3, 10, 3, 10),
(4, 1, 4, 1), (4, 2, 4, 4), (4, 3, 4, 3), (4, 4, 4, 2), (4, 5, 4, 5), (4, 6, 4, 6), (4, 7, 4, 7), (4, 8, 4, 8), (4, 9, 4, 9), (4, 10, 4, 10),
(5, 1, 5, 5), (5, 2, 5, 4), (5, 3, 5, 3), (5, 4, 5, 2), (5, 5, 5, 1), (5, 6, 5, 6), (5, 7, 5, 7), (5, 8, 5, 8), (5, 9, 5, 9), (5, 10, 5, 10),
(6, 1, 6, 2), (6, 2, 6, 1), (6, 3, 6, 3), (6, 4, 6, 4), (6, 5, 6, 5), (6, 6, 6, 6), (6, 7, 6, 7), (6, 8, 6, 8), (6, 9, 6, 9), (6, 10, 6, 10),
(7, 1, 7, 2), (7, 2, 7, 3), (7, 3, 7, 1), (7, 4, 7, 4), (7, 5, 7, 5), (7, 6, 7, 6), (7, 7, 7, 7), (7, 8, 7, 8), (7, 9, 7, 9), (7, 10, 7, 10),
(8, 1, 8, 3), (8, 2, 8, 2), (8, 3, 8, 4), (8, 4, 8, 1), (8, 5, 8, 5), (8, 6, 8, 6), (8, 7, 8, 7), (8, 8, 8, 8), (8, 9, 8, 9), (8, 10, 8, 10),
(9, 1, 9, 4), (9, 2, 9, 2), (9, 3, 9, 1), (9, 4, 9, 5), (9, 5, 9, 3), (9, 6, 9, 6), (9, 7, 9, 7), (9, 8, 9, 8), (9, 9, 9, 9), (9, 10, 9, 10),
(10, 1, 10, 5), (10, 2, 10, 4), (10, 3, 10, 3), (10, 4, 10, 2), (10, 5, 10, 1), (10, 6, 10, 6), (10, 7, 10, 7), (10, 8, 10, 8), (10, 9, 10, 9), (10, 10, 10, 10),
(11, 1, 11, 1), (11, 2, 11, 2), (11, 3, 11, 3), (11, 4, 11, 4), (11, 5, 11, 5), (11, 6, 11, 6), (11, 7, 11, 7), (11, 8, 11, 8), (11, 9, 11, 9), (11, 10, 11, 10),
(12, 1, 12, 3), (12, 2, 12, 2), (12, 3, 12, 4), (12, 4, 12, 1), (12, 5, 12, 5), (12, 6, 12, 6), (12, 7, 12, 7), (12, 8, 12, 8), (12, 9, 12, 9), (12, 10, 12, 10),
(13, 1, 13, 2), (13, 2, 13, 1), (13, 3, 13, 3), (13, 4, 13, 4), (13, 5, 13, 5), (13, 6, 13, 6), (13, 7, 13, 7), (13, 8, 13, 8), (13, 9, 13, 9), (13, 10, 13, 10),
(14, 1, 14, 3), (14, 2, 14, 4), (14, 3, 14, 2), (14, 4, 14, 1), (14, 5, 14, 5), (14, 6, 14, 6), (14, 7, 14, 7), (14, 8, 14, 8), (14, 9, 14, 9), (14, 10, 14, 10),
(15, 1, 15, 2), (15, 2, 15, 1), (15, 3, 15, 3), (15, 4, 15, 4), (15, 5, 15, 5), (15, 6, 15, 6), (15, 7, 15, 7), (15, 8, 15, 8), (15, 9, 15, 9), (15, 10, 15, 10);


