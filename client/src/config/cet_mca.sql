-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 02, 2024 at 05:47 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cet_mca`
--

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `course_id` int(6) NOT NULL,
  `course_name` varchar(100) NOT NULL,
  `dept_id` int(6) NOT NULL,
  `sem_no` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`course_id`, `course_name`, `dept_id`, `sem_no`) VALUES
(12, 'MCA', 1, 4),
(13, 'BTECH', 2, 8),
(14, 'MTECH', 2, 4),
(19, 'mca', 1, 4),
(20, 'MCA', 25, 4),
(21, 'Btech Computer Science', 24, 8),
(22, 'B Tech. Mechanical', 27, 8),
(23, 'B Tech. Civil', 26, 8),
(24, 'BArch', 30, 10),
(25, 'Mtech Artificial Intelligence', 24, 4),
(26, 'mtech civil', 31, 4);

-- --------------------------------------------------------

--
-- Table structure for table `department`
--

CREATE TABLE `department` (
  `dept_id` int(6) NOT NULL,
  `dept_name` varchar(100) NOT NULL,
  `inst_id` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `department`
--

INSERT INTO `department` (`dept_id`, `dept_name`, `inst_id`) VALUES
(1, 'Computer Applications', 1),
(2, 'Computer Science', 1),
(7, 'Civil Engineering', 1),
(13, 'Mechanical Engineering', 1),
(14, 'Electrical and Electronics', 1),
(15, 'Computer Applications', 7),
(16, 'Computer Science', 7),
(17, 'Civil ', 7),
(18, 'Mechanical', 7),
(19, 'Electrical ', 7),
(20, 'Electronics', 7),
(21, 'Architecture', 7),
(24, 'Computer Science', 8),
(25, 'Computer Applications', 8),
(26, 'Civil ', 8),
(27, 'Mechanical', 8),
(28, 'Industrial', 8),
(29, 'Electrical and Electronics', 8),
(30, 'Architecture', 8),
(31, 'civil engineering', 8);

-- --------------------------------------------------------

--
-- Table structure for table `exam`
--

CREATE TABLE `exam` (
  `exam_id` int(6) NOT NULL,
  `exam_name` varchar(100) NOT NULL,
  `description` varchar(300) NOT NULL,
  `subject_id` int(6) NOT NULL,
  `quiz_id` int(6) NOT NULL,
  `subjective_id` int(6) NOT NULL,
  `starting_date` datetime NOT NULL,
  `ending_date` datetime NOT NULL,
  `duration` int(6) NOT NULL,
  `teacher_id` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `exam`
--

INSERT INTO `exam` (`exam_id`, `exam_name`, `description`, `subject_id`, `quiz_id`, `subjective_id`, `starting_date`, `ending_date`, `duration`, `teacher_id`) VALUES
(67, 'Project Review', 'Project Presentation should be done within maximum 20 minutes', 3, 50, 53, '2024-11-12 09:00:00', '2024-11-16 04:00:00', 45, 12),
(73, 'subjective exam test', 'Briefly explain ', 2, 0, 54, '2024-11-07 09:36:00', '2024-11-07 22:00:00', 20, 12),
(75, 'Quiz Exam', 'test', 2, 56, 0, '2024-11-07 09:00:00', '2024-11-07 22:00:00', 12, 12),
(76, 'testing', 'nfek', 2, 57, 55, '2024-11-07 13:12:00', '2024-11-07 14:12:00', 40, 12),
(77, 'sample', 'test', 2, 58, 56, '2024-10-10 11:11:00', '2024-12-10 11:01:00', 2, 12),
(78, 'First Series', 'Testing', 4, 59, 57, '2024-11-11 11:11:00', '2024-12-15 12:12:00', 3, 20),
(79, 'First Series', 'Write all questions', 14, 60, 58, '2024-12-12 12:12:00', '2024-12-15 11:11:00', 2, 35),
(80, 'Second Series', 'Write all Questions', 29, 61, 59, '2024-12-12 10:00:00', '2024-12-15 12:12:00', 2, 35),
(81, 'Lab Viva', 'Max Marks 10', 34, 62, 0, '2024-11-12 10:10:00', '2024-12-15 11:11:00', 1, 35),
(82, 'Class Test', 'First Module', 36, 0, 60, '2024-11-12 10:10:00', '2024-12-12 11:11:00', 2, 35),
(83, 'series test', 'write all questions', 23, 63, 61, '2024-12-12 11:11:00', '2024-11-15 03:03:00', 2, 35),
(84, 'test', 'kl', 18, 64, 62, '2024-11-11 11:01:00', '2025-12-12 12:12:00', 2, 35);

-- --------------------------------------------------------

--
-- Table structure for table `exam_result`
--

CREATE TABLE `exam_result` (
  `exam_id` int(6) NOT NULL,
  `student_regno` varchar(50) NOT NULL,
  `quiz_mark` int(5) NOT NULL,
  `subjective_mark` int(5) NOT NULL,
  `total` int(3) NOT NULL,
  `feedback` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `exam_result`
--

INSERT INTO `exam_result` (`exam_id`, `student_regno`, `quiz_mark`, `subjective_mark`, `total`, `feedback`) VALUES
(67, 'TVE23MCA-2019', 8, 34, 0, ''),
(67, 'TVE23MCA-20199', 6, 0, 0, ''),
(67, 'TVE23MCA-2020', 6, 40, 0, ''),
(73, 'TVE23MCA-20199', 0, 0, 0, ''),
(73, 'TVE23MCA-2020', -1, -1, 0, ''),
(75, 'TVE23MCA-2019', 0, 0, 0, ''),
(75, 'TVE23MCA-20199', 2, 0, 0, ''),
(75, 'TVE23MCA-2020', 4, -2, 0, ''),
(76, 'TVE23MCA-2019', 0, 0, 0, ''),
(78, 'TVE23MCA-2018', 2, 17, 0, ''),
(80, 'TVE23MCA2019', 25, 43, 0, ''),
(80, 'TVE23MCA2036', 30, 88, 0, '');

-- --------------------------------------------------------

--
-- Table structure for table `feeback`
--

CREATE TABLE `feeback` (
  `feddback_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `feedback` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `institution`
--

CREATE TABLE `institution` (
  `inst_id` int(8) NOT NULL,
  `inst_name` varchar(150) NOT NULL,
  `inst_email` varchar(50) NOT NULL,
  `inst_address` varchar(250) NOT NULL,
  `inst_phno` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `institution`
--

INSERT INTO `institution` (`inst_id`, `inst_name`, `inst_email`, `inst_address`, `inst_phno`) VALUES
(1, 'CET', 'cet@gmail.com', 'trivandrum', 9845646),
(6, 'CUSAT', 'cusat@gmail.com', 'KALAMASSERY', 123244988),
(7, 'TKM', 'tkmkollam@gmail.com', 'Kollam', 484124578),
(8, 'COLLEGE OF ENGINEERING TRIVANDRUM', 'cettrivandrum@gmail.com', 'Sreekaryam PO', 124578963),
(9, 'tkmkollam', 'tkmkollam@gmail.com', 'kollam', 97846123);

-- --------------------------------------------------------

--
-- Table structure for table `quiz`
--

CREATE TABLE `quiz` (
  `quiz_id` int(6) NOT NULL,
  `exam_id` int(6) NOT NULL,
  `description` varchar(250) NOT NULL,
  `mark` int(2) NOT NULL,
  `qno_of_questions` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `quiz`
--

INSERT INTO `quiz` (`quiz_id`, `exam_id`, `description`, `mark`, `qno_of_questions`) VALUES
(50, 67, '', 2, 4),
(56, 75, '', 2, 2),
(57, 76, '', 2, 1),
(58, 77, '', 2, 1),
(59, 78, '', 2, 2),
(60, 79, '', 5, 4),
(61, 80, '', 5, 6),
(62, 81, '', 2, 5),
(63, 83, '', 2, 3),
(64, 84, '', 1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_questions`
--

CREATE TABLE `quiz_questions` (
  `quiz_id` int(6) NOT NULL,
  `question_id` int(6) NOT NULL,
  `question_title` varchar(500) NOT NULL,
  `option1` varchar(300) NOT NULL,
  `option2` varchar(300) NOT NULL,
  `option3` varchar(300) NOT NULL,
  `option4` varchar(300) NOT NULL,
  `answer` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `quiz_questions`
--

INSERT INTO `quiz_questions` (`quiz_id`, `question_id`, `question_title`, `option1`, `option2`, `option3`, `option4`, `answer`) VALUES
(50, 38, 'How many Users are there in the system', '1', '2', '3', '4', 4),
(50, 39, 'Which database is used f', 'MySql', 'MongoDB', 'Firebase', 'Postgres', 1),
(50, 40, 'Which Framework/library  is not used in this project', 'React', 'Django', 'Codeignitor', 'Express', 2),
(50, 41, 'Which of the following is not a feature of teacher user', 'create Exam', 'view answers', 'add departments', 'edit profile', 3),
(56, 46, 'Which model is used for clustering', 'KNN', 'SVM', 'KMeans', 'None of the above', 3),
(56, 47, 'datasets is imported from', 'matplotlib', 'sklearn', 'pandas', 'numpy', 2),
(57, 48, 'testing', 'ioj', 'ijkl', 'iojkl', 'ijokl', 2),
(58, 49, 'tste', 'm,', 'kml', 'mkl', 'kml', 4),
(59, 50, 'ADBMS is', 'Advanced Data Base Management System', 'Advance', 'database', 'All', 1),
(59, 51, 'MCA has how many semesters', '1', '2', '34', '4', 4),
(60, 52, 'Which data structure follows the Last In First Out (LIFO) principle?', 'Queue', 'Stack', 'Array', 'Linked List', 2),
(60, 53, 'What is the time complexity of accessing an element in an array by index?', 'O(n)', 'O(log n)', 'O(1)', 'O(n log n)', 3),
(60, 54, 'In which data structure are elements stored in a hierarchical form?', 'Array', 'Stack', 'Tree', 'Graph', 3),
(60, 55, 'What type of data structure is used in Breadth-First Search (BFS) algorithm?', 'Stack', 'Queue', 'Priority Queue', 'Tree', 2),
(61, 56, 'What is the main purpose of an activation function in a neural network?', 'To initialize the weights', 'To introduce non-linearity into the network', 'To reduce overfitting', 'To optimize the learning rate', 2),
(61, 57, 'Which of the following is a popular optimization algorithm used in training deep learning models?', ' AdaBoost', ' K-Means', 'Adam', 'SVM', 3),
(61, 58, 'What is a convolutional neural network (CNN) primarily used for?', 'Text processing', 'Image and video analysis', 'Financial data prediction', ' Speech recognition', 2),
(61, 59, 'In deep learning, what is overfitting?', 'When the model has too few parameters and underperforms', 'When the model performs well on training data but poorly on new data', 'When the model takes too long to train', 'When the model is optimized for all types of input data', 2),
(61, 60, 'What type of neural network is best suited for sequence data such as text or time series?', 'Convolutional Neural Network (CNN)', 'Recurrent Neural Network (RNN)', 'Feedforward Neural Network', ' Radial Basis Function Network', 2),
(61, 61, 'Which of the following is not a type of neural network architecture?', 'Autoencoder', 'Decision Tree', 'Generative Adversarial Network (GAN)', 'Transformer', 2),
(62, 62, 'What is the role of the train_test_split() function in data preprocessing?', 'To normalize the data', 'To split the data into training and testing sets', 'To handle missing values', 'To perform feature scaling', 2),
(62, 63, 'Which Python library is most commonly used for data manipulation and analysis?', 'NumPy', 'TensorFlow', 'Pandas', 'Matplotlib', 3),
(62, 64, 'What type of machine learning problem is a recommendation system typically associated with?', 'Classification', 'Clustering', 'Regression', 'Collaborative filtering', 4),
(62, 65, 'Which of the following is a supervised learning algorithm?', 'K-Means Clustering', ' Principal Component Analysis (PCA)', 'Linear Regression', 'Apriori Algorithm', 3),
(62, 66, 'Which algorithm is typically used for clustering data?', 'Linear Regression', 'K-Means', 'Decision Trees', 'Support Vector Machine (SVM)', 2),
(63, 67, 'test1', '1', '2', '3', '4', 1),
(63, 68, 'test2', 'option1', 'option2', 'option 3', 'option 4', 4),
(63, 69, 'test4', 'op1', 'op2', 'op3', 'op4', 4);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_result`
--

CREATE TABLE `quiz_result` (
  `quiz_id` int(6) NOT NULL,
  `student_regno` varchar(50) NOT NULL,
  `correct_no` int(3) NOT NULL,
  `wrong_no` int(3) NOT NULL,
  `total_mark` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `quiz_result`
--

INSERT INTO `quiz_result` (`quiz_id`, `student_regno`, `correct_no`, `wrong_no`, `total_mark`) VALUES
(50, 'TVE23MCA-2019', 4, 0, 8),
(50, 'TVE23MCA-20199', 3, 1, 6),
(50, 'TVE23MCA-2020', 3, 1, 6),
(56, 'TVE23MCA-2019', 0, 2, 0),
(56, 'TVE23MCA-20199', 1, 1, 2),
(56, 'TVE23MCA-2020', 2, 0, 4),
(57, 'TVE23MCA-2019', 0, 0, 0),
(59, 'TVE23MCA-2018', 1, 1, 2),
(61, 'TVE23MCA2019', 5, 1, 25),
(61, 'TVE23MCA2036', 6, 0, 30);

-- --------------------------------------------------------

--
-- Table structure for table `rejected`
--

CREATE TABLE `rejected` (
  `user_regno` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `feedback` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `revaluation`
--

CREATE TABLE `revaluation` (
  `exam_id` int(6) NOT NULL,
  `user_id` int(6) NOT NULL,
  `reason` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_id` int(6) NOT NULL,
  `course_id` int(6) NOT NULL,
  `current_sem` int(2) NOT NULL,
  `status` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `course_id`, `current_sem`, `status`) VALUES
(11, 12, 3, 'approved'),
(16, 12, 3, 'approved'),
(19, 12, 3, 'approved'),
(21, 12, 2, 'approved'),
(24, 20, 3, 'approved'),
(25, 20, 3, 'approved'),
(26, 20, 3, 'approved'),
(27, 20, 3, 'approved'),
(28, 20, 3, 'approved'),
(29, 20, 3, 'approved'),
(30, 20, 3, 'approved'),
(31, 20, 2, 'approved'),
(32, 20, 2, 'approved'),
(33, 20, 2, 'approved'),
(34, 20, 2, 'approved'),
(42, 20, 1, 'approved'),
(43, 20, 1, 'approved'),
(44, 20, 1, 'approved'),
(45, 20, 1, 'approved'),
(46, 20, 1, 'approved'),
(47, 20, 1, 'approved'),
(48, 20, 1, 'approved'),
(50, 20, 4, 'approved');

-- --------------------------------------------------------

--
-- Table structure for table `subject`
--

CREATE TABLE `subject` (
  `subject_id` int(6) NOT NULL,
  `subject_name` varchar(100) NOT NULL,
  `course_id` int(6) NOT NULL,
  `course_sem` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subject`
--

INSERT INTO `subject` (`subject_id`, `subject_name`, `course_id`, `course_sem`) VALUES
(1, 'DATA STRUCTURES AND ALGORITHM', 12, 1),
(2, 'DS', 12, 3),
(3, 'Mini Project', 12, 3),
(4, 'ADBMS', 12, 2),
(5, 'ACN', 12, 2),
(6, 'AI', 12, 2),
(8, 'IPR', 12, 2),
(9, 'AOS', 12, 2),
(12, 'Mathematical Foundations For Computing', 20, 1),
(13, 'Digital Fundamentals and Computer Architecture', 20, 1),
(14, 'Advanced Data Structures', 20, 1),
(15, 'Advanced Software Engineering', 20, 1),
(16, 'Web Programming Lab', 20, 1),
(17, 'Data Structures Lab', 20, 1),
(18, 'Programming Lab', 20, 1),
(19, 'Artificial Intelligence', 20, 2),
(20, 'Functional Programming', 20, 2),
(21, 'Advanced Data Base Management System', 20, 2),
(22, 'Advanced Computer Networks', 20, 2),
(23, 'Networking Lab', 20, 2),
(24, 'Advanced DBMS Lab', 20, 2),
(25, 'Object Oriented Programming Lab', 20, 2),
(26, 'Operational Research', 20, 3),
(29, 'Deep Learning', 20, 3),
(31, 'Data Science and Machine Learning', 20, 3),
(33, 'Design and Analysis of Algorithm', 20, 3),
(34, 'Data Science Lab', 20, 3),
(36, 'Mobile Application Development Lab', 20, 3),
(37, 'Mini Project', 20, 3),
(38, 'Main Project', 20, 4),
(39, 'test', 20, 2);

-- --------------------------------------------------------

--
-- Table structure for table `subjective`
--

CREATE TABLE `subjective` (
  `subjective_id` int(6) NOT NULL,
  `exam_id` int(6) NOT NULL,
  `description` varchar(250) NOT NULL,
  `sno_of_questions` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subjective`
--

INSERT INTO `subjective` (`subjective_id`, `exam_id`, `description`, `sno_of_questions`) VALUES
(53, 67, '', 4),
(54, 73, '', 3),
(55, 76, '', 1),
(56, 77, '', 2),
(57, 78, '', 2),
(58, 79, '', 4),
(59, 80, '', 6),
(60, 82, '', 4),
(61, 83, '', 3),
(62, 84, '', 2);

-- --------------------------------------------------------

--
-- Table structure for table `subjective_answer`
--

CREATE TABLE `subjective_answer` (
  `question_id` int(6) NOT NULL,
  `student_regno` varchar(50) NOT NULL,
  `answer` varchar(500) NOT NULL,
  `mark` int(2) NOT NULL,
  `feedback` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subjective_answer`
--

INSERT INTO `subjective_answer` (`question_id`, `student_regno`, `answer`, `mark`, `feedback`) VALUES
(9, 'TVE23MCA-2019', 'testing by arun', 7, ''),
(9, 'TVE23MCA-20199', 'successful', 8, ''),
(9, 'TVE23MCA-2020', '', 10, ''),
(10, 'TVE23MCA-2019', 'all verified', 7, ''),
(10, 'TVE23MCA-20199', 'added', 6, ''),
(10, 'TVE23MCA-2020', 'oh', 10, ''),
(11, 'TVE23MCA-2019', 'Working smoothly', 10, ''),
(11, 'TVE23MCA-20199', 'edited', 10, ''),
(11, 'TVE23MCA-2020', 'jkl', 10, ''),
(12, 'TVE23MCA-2019', 'finalized', 10, ''),
(12, 'TVE23MCA-20199', 'details', 9, ''),
(12, 'TVE23MCA-2020', 'lk', 10, ''),
(13, 'TVE23MCA-2019', 'next testing', 0, ''),
(13, 'TVE23MCA-20199', 'passed', 12, ''),
(13, 'TVE23MCA-2020', 'jnnn', 0, ''),
(14, 'TVE23MCA-2019', 'successfull', 0, ''),
(14, 'TVE23MCA-20199', 'exam', 6, ''),
(14, 'TVE23MCA-2020', 'ijkl', 0, ''),
(15, 'TVE23MCA-2019', 'completed', 0, ''),
(15, 'TVE23MCA-20199', 'ok', 5, ''),
(15, 'TVE23MCA-2020', 'iojlk', 0, ''),
(16, 'TVE23MCA-2019', 'f', 0, ''),
(19, 'TVE23MCA-2018', 'Tested to true', 5, ''),
(20, 'TVE23MCA-2018', 'Valuable info', 12, ''),
(25, 'TVE23MCA2019', 'testing', 9, ''),
(25, 'TVE23MCA2036', 'gradient small', 5, ''),
(26, 'TVE23MCA2019', 'worked', 4, ''),
(26, 'TVE23MCA2036', 'Rectified ', 6, ''),
(27, 'TVE23MCA2019', 'successfull', 10, ''),
(27, 'TVE23MCA2036', 'Train and test', 5, ''),
(28, 'TVE23MCA2019', 'test', 5, ''),
(28, 'TVE23MCA2036', 'advantage', 56, ''),
(29, 'TVE23MCA2019', 'tyt', 8, ''),
(29, 'TVE23MCA2036', '', 9, ''),
(30, 'TVE23MCA2019', 'ioo', 7, ''),
(30, 'TVE23MCA2036', 'worked', 7, '');

-- --------------------------------------------------------

--
-- Table structure for table `subjective_questions`
--

CREATE TABLE `subjective_questions` (
  `subjective_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `question_title` varchar(300) NOT NULL,
  `mark` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subjective_questions`
--

INSERT INTO `subjective_questions` (`subjective_id`, `question_id`, `question_title`, `mark`) VALUES
(53, 9, 'Explain your project topic and why you choose this', 8),
(53, 10, 'Briefly explain all modules in the system', 6),
(53, 11, 'Which SDLC model is used in this project and explain that SDLC model', 10),
(53, 12, 'Explain the projects advantages and drawbacks', 10),
(54, 13, 'Explain B+ tree DS', 10),
(54, 14, 'Explain Blockchain and why it came under DS', 8),
(54, 15, 'Explain Prims Algorithm', 15),
(55, 16, 'jwfkjwa', 12),
(56, 17, 'sef', 12),
(56, 18, 'mkm', 23),
(57, 19, 'Explain vision of MCA', 5),
(57, 20, 'Explain CET', 12),
(58, 21, 'Explain the difference between an array and a linked list. Discuss their advantages and disadvantages.', 10),
(58, 22, 'Describe how a stack data structure works and provide a real-world example where it is used.', 5),
(58, 23, 'Explain the concept of recursion and how it can be implemented using a stack data structure.', 5),
(58, 24, 'What is a balanced binary tree, and why is it important? Describe how AVL trees maintain balance.', 10),
(59, 25, 'Discuss the vanishing gradient problem in deep learning. What causes it, and how can it be mitigated?', 10),
(59, 26, 'What are the advantages and disadvantages of using ReLU (Rectified Linear Unit) as an activation function?', 5),
(59, 27, 'What are Generative Adversarial Networks (GANs), and how do they function? Explain the roles of the generator and the discriminator.', 10),
(59, 28, 'What is the purpose of a loss function in training a neural network, and how does it influence the learning process? Provide examples of common loss functions.', 5),
(59, 29, 'What is overfitting, and what strategies can be used to prevent it in deep learning models?', 8),
(59, 30, 'Describe how dropout regularization works and why it is used in deep learning.', 7),
(60, 31, 'Describe the architecture of an Android app and explain the roles of activities, fragments, and services.', 10),
(60, 32, 'What is the lifecycle of an Android activity, and why is it important for developers to understand?\n\n', 10),
(60, 33, 'What are the main differences between iOS and Android development in terms of programming languages, frameworks, and development environments?', 5),
(60, 34, 'Explain how data can be stored and managed in a mobile app, including the use of local databases and cloud storage.', 5),
(61, 35, 'explain ADBMS', 10),
(61, 36, 'explain stack', 5),
(61, 37, 'advanatages of LL', 6);

-- --------------------------------------------------------

--
-- Table structure for table `subjective_result`
--

CREATE TABLE `subjective_result` (
  `subjective_id` int(6) NOT NULL,
  `student_regno` varchar(50) NOT NULL,
  `total_mark` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subjective_result`
--

INSERT INTO `subjective_result` (`subjective_id`, `student_regno`, `total_mark`) VALUES
(53, 'TVE23MCA-2019', 34),
(53, 'TVE23MCA-20199', 33),
(53, 'TVE23MCA-2020', 40),
(54, 'TVE23MCA-2019', -1),
(54, 'TVE23MCA-20199', 23),
(54, 'TVE23MCA-2020', -1),
(55, 'TVE23MCA-2019', -1),
(57, 'TVE23MCA-2018', 17),
(59, 'TVE23MCA2019', 43),
(59, 'TVE23MCA2036', 88);

-- --------------------------------------------------------

--
-- Table structure for table `subject_assignment`
--

CREATE TABLE `subject_assignment` (
  `subject_id` int(6) NOT NULL,
  `teacher_id` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subject_assignment`
--

INSERT INTO `subject_assignment` (`subject_id`, `teacher_id`) VALUES
(1, 12),
(1, 13),
(2, 12),
(2, 13),
(3, 12),
(4, 12),
(4, 20),
(5, 12),
(5, 13),
(5, 20),
(6, 20),
(14, 35),
(14, 36),
(15, 38),
(18, 35),
(19, 36),
(20, 40),
(21, 37),
(22, 38),
(23, 35),
(23, 36),
(24, 36),
(24, 40),
(25, 36),
(25, 37),
(26, 41),
(29, 35),
(31, 36),
(33, 39),
(34, 35),
(34, 36),
(34, 37),
(36, 35),
(36, 37),
(37, 40);

-- --------------------------------------------------------

--
-- Table structure for table `teacher`
--

CREATE TABLE `teacher` (
  `teacher_id` int(6) NOT NULL,
  `dept_id` int(6) NOT NULL,
  `status` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `teacher`
--

INSERT INTO `teacher` (`teacher_id`, `dept_id`, `status`) VALUES
(12, 1, 'approved'),
(13, 1, 'approved'),
(20, 1, 'approved'),
(35, 25, 'approved'),
(36, 25, 'approved'),
(37, 25, 'approved'),
(38, 25, 'approved'),
(39, 25, 'approved'),
(40, 25, 'approved'),
(41, 25, 'approved');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(6) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `user_email` varchar(50) NOT NULL,
  `user_regno` varchar(50) NOT NULL,
  `user_phno` bigint(12) NOT NULL,
  `user_password` varchar(50) NOT NULL,
  `user_gender` varchar(50) NOT NULL,
  `user_dob` date NOT NULL,
  `user_type` varchar(50) NOT NULL,
  `inst_id` int(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_name`, `user_email`, `user_regno`, `user_phno`, `user_password`, `user_gender`, `user_dob`, `user_type`, `inst_id`) VALUES
(2, 'ARUN C P', 'aruncpacp10@gmail.com', 'TVE23MCA', 2147483647, 'acp', 'Male', '2024-10-01', 'admin', 1),
(11, 'test', 'test@gmail.com', 'TVE23MCA-20199', 2147483647, 'test', 'Male', '2024-11-01', 'student', 1),
(12, 'teacher', 'teacher@gmail.com', 'TVE23', 12345, 'teacher', 'Male', '2024-11-01', 'teacher', 1),
(13, 'teacher2', 'teacher2@gmail.com', 'tve23mca', 1233144, 'teacher2', 'Female', '2024-11-02', 'teacher', 1),
(14, 'cusatadmin', 'cusatadmin@gmail.com', 'cusat', 54564564, 'cusatadmin', 'Male', '2024-11-06', 'admin', 6),
(16, 'Arun C P', 'aruncpacp10@gmail.com', 'TVE23MCA-2019', 9074244885, 'aruncp', 'Male', '2002-07-26', 'student', 1),
(19, 'Student3', 'student3@gmail.com', 'TVE23MCA-2020', 68756465, 'student3', 'Male', '2024-11-29', 'student', 1),
(20, 'Gauri', 'gauri@gmail.com', '123', 987456123, 'gauri', 'Female', '1990-11-12', 'teacher', 1),
(21, 'Varun', 'varun@gmail.com', 'TVE23MCA-2018', 12346789, 'varun', 'Male', '2002-12-12', 'student', 1),
(22, 'tkmadmin', 'tkmadmin@gmail.com', '1234', 3454345345, 'tkmadmin', 'Male', '1992-12-12', 'admin', 7),
(23, 'cetadmin', 'cetadmin@gmail.com', '1223', 145789632, 'cetadmin', 'Male', '2000-12-12', 'admin', 8),
(24, 'Arun C P', 'aruncpacp10@gmail.com', 'TVE23MCA2019', 9074244885, 'aruncp', 'Male', '2002-07-26', 'student', 8),
(25, 'Alwin thomas', 'alwin@gmail.com', 'TVE23MCA2011', 9074248558, 'alwin', 'Male', '2000-10-10', 'student', 8),
(26, 'Marshad', 'marshad@gmail.com', 'TVE23MCA2036', 589894561654, 'marshad', 'Male', '2001-08-26', 'student', 8),
(27, 'abshira', 'abshira@gmail.com', 'TVE23MCA2003', 8489465651212, 'abshira', 'Female', '2001-10-12', 'student', 8),
(28, 'mariya', 'mariya@gmail.com', 'TVE23MCA2032', 76132487684, 'mariya', 'Female', '2002-10-26', 'student', 8),
(29, 'Meera', 'meera@gmail.com', 'TVE23MCA2033', 9074244885, 'meera', 'Female', '2002-04-05', 'student', 8),
(30, 'naveen', 'naveen@gmail.com', 'TVE23MCA2038', 798765132123, 'navven', 'Male', '2001-10-10', 'student', 8),
(31, 'abhay', 'abhay@gmail.com', 'TVE23MCA2002', 78789564151897, 'abhay', 'Male', '2000-10-10', 'student', 8),
(32, 'amith', 'amith@gmail.com', 'TVE23MCA2013', 8798465351, 'amith', 'Male', '2000-02-20', 'student', 8),
(33, 'ajith', 'ajith@gmail.com', 'TVE23MCA2007', 98754123, 'ajith', 'Male', '2002-10-10', 'student', 8),
(34, 'akshay', 'akshay@gmail.com', 'TVE23MCA2009', 89451122, 'akshay', 'Male', '2000-10-10', 'student', 8),
(35, 'Priya', 'priya@gmail.com', '48453', 789411388, 'priya', 'Female', '2002-12-12', 'teacher', 8),
(36, 'deepa', 'deepa@gmail.com', '8998456', 9421798653, 'deepa', 'Female', '1998-10-12', 'teacher', 8),
(37, 'sunitha', 'suniths@gmail.com', '89754231', 54234564, 'sunitha', 'Female', '1988-10-10', 'teacher', 8),
(38, 'najna', 'najna@gmail.com', '878784564', 79787564, 'najna', 'Female', '1987-10-10', 'teacher', 8),
(39, 'Sabina', 'sabina@gmailcom', '979874986', 8965451, 'sabina', 'Female', '1987-10-10', 'teacher', 8),
(40, 'shine', 'shine@gmail.com', '986654', 98646554, 'shine', 'Male', '1988-10-10', 'teacher', 8),
(41, 'liji', 'liji@gmail.com', '78789', 797889787, 'liji', 'Female', '2000-10-10', 'teacher', 8),
(42, 'nijas', 'nijas@gmail.com', 'TVE23MCA2040', 897887897, 'nijas', 'Male', '2002-10-10', 'student', 8),
(43, 'Ramya', 'ramya@gmai.com', 'TVE23MCA2044', 878789787897, 'ramya', 'Female', '2000-12-10', 'student', 8),
(44, 'sunneb', 'suneeb@gmail.com', 'TVE23MCA2053', 89789789798, 'suneeb', 'Male', '2000-10-10', 'student', 8),
(45, 'shijin', 'shijin@gmail.com', 'TVE23MCA2050', 8979878978, 'shijin', 'Male', '2001-10-10', 'student', 8),
(46, 'Vyshnav', 'vyshnav@gmail.com', 'TVE23MCA2060', 878888878, 'vyshnav', 'Male', '2002-10-10', 'student', 8),
(47, 'adhila', 'adhila@gmail.com', 'TVE23MCA2004', 7878789, 'adhila', 'Female', '2002-10-10', 'student', 8),
(48, 'Nandhu', 'nandhu@gmail.com', 'TVE23MCA2037', 979879879, 'nandhu', 'Male', '2000-10-10', 'student', 8),
(49, 'tkmadmin2', 'tkmadmin2@gmail.com', '234', 7894125630, 'tkmadmin2', 'Male', '2000-10-10', 'admin', 9),
(50, 'test3', 'test3@gmail.com', '789', 9287458960, 'test3', 'Female', '2000-10-10', 'student', 8);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`course_id`),
  ADD KEY `dept_id` (`dept_id`);

--
-- Indexes for table `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`dept_id`),
  ADD KEY `inst_id` (`inst_id`);

--
-- Indexes for table `exam`
--
ALTER TABLE `exam`
  ADD PRIMARY KEY (`exam_id`),
  ADD KEY `teacher_id` (`teacher_id`),
  ADD KEY `subjective_id` (`subjective_id`),
  ADD KEY `quiz_id` (`quiz_id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indexes for table `exam_result`
--
ALTER TABLE `exam_result`
  ADD PRIMARY KEY (`exam_id`,`student_regno`);

--
-- Indexes for table `feeback`
--
ALTER TABLE `feeback`
  ADD PRIMARY KEY (`feddback_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `institution`
--
ALTER TABLE `institution`
  ADD PRIMARY KEY (`inst_id`);

--
-- Indexes for table `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`quiz_id`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Indexes for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Indexes for table `quiz_result`
--
ALTER TABLE `quiz_result`
  ADD PRIMARY KEY (`quiz_id`,`student_regno`);

--
-- Indexes for table `revaluation`
--
ALTER TABLE `revaluation`
  ADD PRIMARY KEY (`exam_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `subject`
--
ALTER TABLE `subject`
  ADD PRIMARY KEY (`subject_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indexes for table `subjective`
--
ALTER TABLE `subjective`
  ADD PRIMARY KEY (`subjective_id`),
  ADD KEY `exam_id` (`exam_id`);

--
-- Indexes for table `subjective_answer`
--
ALTER TABLE `subjective_answer`
  ADD PRIMARY KEY (`question_id`,`student_regno`),
  ADD KEY `question_id` (`question_id`),
  ADD KEY `student_regno` (`student_regno`);

--
-- Indexes for table `subjective_questions`
--
ALTER TABLE `subjective_questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `subjective_id` (`subjective_id`);

--
-- Indexes for table `subjective_result`
--
ALTER TABLE `subjective_result`
  ADD PRIMARY KEY (`subjective_id`,`student_regno`);

--
-- Indexes for table `subject_assignment`
--
ALTER TABLE `subject_assignment`
  ADD PRIMARY KEY (`subject_id`,`teacher_id`),
  ADD KEY `subject_id` (`subject_id`),
  ADD KEY `teacher_id` (`teacher_id`);

--
-- Indexes for table `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`teacher_id`),
  ADD KEY `teacher_id` (`teacher_id`),
  ADD KEY `dept_id` (`dept_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `user_id` (`user_id`,`user_regno`),
  ADD KEY `users_ibfk_1` (`inst_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `course_id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `dept_id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `exam`
--
ALTER TABLE `exam`
  MODIFY `exam_id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT for table `institution`
--
ALTER TABLE `institution`
  MODIFY `inst_id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `quiz_id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  MODIFY `question_id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT for table `subject`
--
ALTER TABLE `subject`
  MODIFY `subject_id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT for table `subjective`
--
ALTER TABLE `subjective`
  MODIFY `subjective_id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `subjective_questions`
--
ALTER TABLE `subjective_questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `course_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `department` (`dept_id`);

--
-- Constraints for table `department`
--
ALTER TABLE `department`
  ADD CONSTRAINT `department_ibfk_1` FOREIGN KEY (`inst_id`) REFERENCES `institution` (`inst_id`);

--
-- Constraints for table `exam`
--
ALTER TABLE `exam`
  ADD CONSTRAINT `exam_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `exam_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`subject_id`);

--
-- Constraints for table `exam_result`
--
ALTER TABLE `exam_result`
  ADD CONSTRAINT `exam_result_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`);

--
-- Constraints for table `feeback`
--
ALTER TABLE `feeback`
  ADD CONSTRAINT `feeback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `quiz`
--
ALTER TABLE `quiz`
  ADD CONSTRAINT `quiz_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`);

--
-- Constraints for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD CONSTRAINT `quiz_questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`quiz_id`);

--
-- Constraints for table `quiz_result`
--
ALTER TABLE `quiz_result`
  ADD CONSTRAINT `quiz_result_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`quiz_id`);

--
-- Constraints for table `revaluation`
--
ALTER TABLE `revaluation`
  ADD CONSTRAINT `revaluation_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`),
  ADD CONSTRAINT `revaluation_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`),
  ADD CONSTRAINT `student_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `subject`
--
ALTER TABLE `subject`
  ADD CONSTRAINT `subject_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `course` (`course_id`);

--
-- Constraints for table `subjective`
--
ALTER TABLE `subjective`
  ADD CONSTRAINT `subjective_ibfk_1` FOREIGN KEY (`exam_id`) REFERENCES `exam` (`exam_id`);

--
-- Constraints for table `subjective_answer`
--
ALTER TABLE `subjective_answer`
  ADD CONSTRAINT `subjective_answer_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `subjective_questions` (`question_id`);

--
-- Constraints for table `subjective_questions`
--
ALTER TABLE `subjective_questions`
  ADD CONSTRAINT `subjective_questions_ibfk_1` FOREIGN KEY (`subjective_id`) REFERENCES `subjective` (`subjective_id`);

--
-- Constraints for table `subject_assignment`
--
ALTER TABLE `subject_assignment`
  ADD CONSTRAINT `subject_assignment_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subject` (`subject_id`),
  ADD CONSTRAINT `subject_assignment_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`teacher_id`);

--
-- Constraints for table `teacher`
--
ALTER TABLE `teacher`
  ADD CONSTRAINT `teacher_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `teacher_ibfk_2` FOREIGN KEY (`dept_id`) REFERENCES `department` (`dept_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`inst_id`) REFERENCES `institution` (`inst_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
