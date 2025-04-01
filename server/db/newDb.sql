CREATE TABLE course (course_id int NOT NULL AUTO_INCREMENT ,course_name varchar(100) NOT NULL,dept_id int NOT NULL,sem_no int NOT NULL) 
CREATE TABLE department  (dept_id  int NOT NULL AUTO_INCREMENT,dept_name  varchar(100) NOT NULL,inst_id  int NOT NULL)
CREATE TABLE exam  (exam_id  int NOT NULL AUTO_INCREMENT,exam_name  varchar(100) NOT NULL,description  varchar(300) NOT NULL,subject_id  int NOT NULL,quiz_id  int NOT NULL,subjective_id  int NOT NULL,starting_date  datetime NOT NULL,ending_date  datetime NOT NULL,duration  int NOT NULL,teacher_id  int NOT NULL)
CREATE TABLE exam_result  (exam_id  int NOT NULL,student_regno  varchar(50) NOT NULL,quiz_mark  int NOT NULL,subjective_mark  int NOT NULL,total  int NOT NULL,feedback  varchar(200) NOT NULL)
CREATE TABLE feeback (feedback_id  int NOT NULL AUTO_INCREMENT,user_id  int NOT NULL,feedback  int NOT NULL) 
CREATE TABLE  institution  (inst_id  int NOT NULL AUTO_INCREMENT,inst_name  varchar(150) NOT NULL,inst_email  varchar(50) NOT NULL,inst_address  varchar(250) NOT NULL,inst_phno  int NOT NULL)
CREATE TABLE  quiz  (quiz_id  int NOT NULL AUTO_INCREMENT,exam_id  int NOT NULL,description  varchar(250) NOT NULL,mark  int NOT NULL,qno_of_questions  int NOT NULL)
CREATE TABLE  quiz_questions  (quiz_id  int NOT NULL,question_id int NOT NULL AUTO_INCREMENT,question_title  varchar(500) NOT NULL,option1  varchar(300) NOT NULL,option2  varchar(300) NOT NULL,option3  varchar(300) NOT NULL,option4  varchar(300) NOT NULL,answer  int NOT NULL)
CREATE TABLE  quiz_result  (quiz_id  int NOT NULL,student_regno  varchar(50) NOT NULL,correct_no int NOT NULL,wrong_no  int NOT NULL,total_mark  int NOT NULL)
CREATE TABLE  rejected  (user_regno  varchar(50) NOT NULL,email  varchar(100) NOT NULL,password  varchar(100) NOT NULL,feedback  varchar(500) NOT NULL)
CREATE TABLE  revaluation  (exam_id  int NOT NULL,user_id  int NOT NULL,reason  varchar(100) NOT NULL)
CREATE TABLE  student  (student_id  int NOT NULL,course_id  int NOT NULL,current_sem  int NOT NULL,status  varchar(25) NOT NULL)
CREATE TABLE  subject  (subject_id  int NOT NULL AUTO_INCREMENT,subject_name  varchar(100) NOT NULL,course_id  int NOT NULL,course_sem  int NOT NULL)
CREATE TABLE  subjective  (subjective_id  int NOT NULL AUTO_INCREMENT,exam_id  int NOT NULL,description  varchar(250) NOT NULL,sno_of_questions  int NOT NULL)
CREATE TABLE  subjective_answer  (question_id  int NOT NULL,student_regno  varchar(50) NOT NULL,answer  varchar(500) NOT NULL,mark  int NOT NULL,feedback  varchar(300) NOT NULL)
CREATE TABLE  subjective_questions  (subjective_id  int NOT NULL,question_id int NOT NULL AUTO_INCREMENT,question_title  varchar(300) NOT NULL,mark  int NOT NULL)
CREATE TABLE  subjective_result  (subjective_id  int NOT NULL,student_regno  varchar(50) NOT NULL,total_mark  int NOT NULL)
CREATE TABLE  subject_assignment  (subject_id  int NOT NULL,teacher_id  int NOT NULL)
CREATE TABLE  teacher  (teacher_id  int NOT NULL,dept_id  int NOT NULL,status  varchar(25) NOT NULL)
CREATE TABLE  users  (user_id  int NOT NULL AUTO_INCREMENT,user_name  varchar(100) NOT NULL,user_email  varchar(50) NOT NULL,user_regno  varchar(50) NOT NULL,user_phno  bigint NOT NULL,user_password  varchar(200) NOT NULL,user_gender  varchar(50) NOT NULL,user_dob  date NOT NULL,user_type  varchar(50) NOT NULL,inst_id  int NOT NULL)


ALTER TABLE course ADD PRIMARY KEY(course_id);
ALTER TABLE  department ADD PRIMARY KEY ( dept_id );
ALTER TABLE  exam ADD PRIMARY KEY ( exam_id );
ALTER TABLE  exam_result ADD PRIMARY KEY ( exam_id , student_regno );
ALTER TABLE  feeback ADD PRIMARY KEY ( feedback_id );
ALTER TABLE  institution ADD PRIMARY KEY ( inst_id );
ALTER TABLE  quiz ADD PRIMARY KEY ( quiz_id );
ALTER TABLE  quiz_questions ADD PRIMARY KEY ( question_id );
ALTER TABLE  quiz_result ADD PRIMARY KEY ( quiz_id , student_regno );
ALTER TABLE  revaluation ADD PRIMARY KEY ( exam_id , user_id );
ALTER TABLE  student ADD PRIMARY KEY ( student_id );
ALTER TABLE  subject ADD PRIMARY KEY ( subject_id );
ALTER TABLE  subjective ADD PRIMARY KEY ( subjective_id );
ALTER TABLE  subjective_answer ADD PRIMARY KEY ( question_id , student_regno );
ALTER TABLE  subjective_questions ADD PRIMARY KEY ( question_id );
ALTER TABLE  subjective_result ADD PRIMARY KEY ( subjective_id , student_regno );
ALTER TABLE  subject_assignment ADD PRIMARY KEY ( subject_id , teacher_id );
ALTER TABLE  teacher ADD PRIMARY KEY ( teacher_id );
ALTER TABLE  users ADD PRIMARY KEY ( user_id );


ALTER TABLE course ADD FOREIGN KEY(dept_id) references department(dept_id);
ALTER TABLE department ADD FOREIGN KEY(inst_id) references institution(inst_id);
ALTER TABLE exam ADD FOREIGN KEY(teacher_id) references  teacher( teacher_id ), FOREIGN KEY(subjective_id)  references subjective( subjective_id ),FOREIGN KEY(quiz_id) references quiz( quiz_id ),FOREIGN KEY(subject_id) references subject( subject_id );
ALTER TABLE feedback ADD FOREIGN KEY(user_id) references users( user_id );
ALTER TABLE  quiz ADD FOREIGN  KEY( exam_id) references exam  ( exam_id );
ALTER TABLE  quiz_questions  ADD FOREIGN KEY(quiz_id) references quiz( quiz_id );
ALTER TABLE  revaluation ADD FOREIGN KEY (user_id)references  users  ( user_id );
ALTER TABLE  student ADD FOREIGN KEY ( student_id ) references users(user_id),FOREIGN KEY ( course_id ) references course(course_id);
ALTER TABLE  subject ADD FOREIGN KEY (course_id) references course ( course_id );
ALTER TABLE  subjective ADD FOREIGN KEY ( exam_id ) references exam(exam_id);
ALTER TABLE  subjective_answer ADD FOREIGN KEY(question_id) references  subjective_questions ( question_id ), FOREIGN KEY(student_regno) references users ( user_regno );
ALTER TABLE  subjective_questions ADD FOREIGN KEY(subjective_id) references subjective ( subjective_id );
ALTER TABLE  subjective_questions ADD FOREIGN KEY  (subject_id) references subject  ( subject_id ),FOREIGN KEY  (teacher_id) references teacher  ( teacher_id );
ALTER TABLE  teacher ADD FOREIGN KEY  (teacher_id) references users  ( user_id ),FOREIGN KEY(dept_id) references department(dept_id);
ALTER TABLE users ADD FOREIGN  KEY(inst_id) references institution(inst_id);


ALTER TABLE  course 
  ADD CONSTRAINT  course_ibfk_1  FOREIGN KEY ( dept_id ) REFERENCES  department  ( dept_id );
ALTER TABLE  department 
  ADD CONSTRAINT  department_ibfk_1  FOREIGN KEY ( inst_id ) REFERENCES  institution  ( inst_id );
ALTER TABLE  exam 
  ADD CONSTRAINT  exam_ibfk_1  FOREIGN KEY ( teacher_id ) REFERENCES  users  ( user_id ),CONSTRAINT  exam_ibfk_2  FOREIGN KEY ( subject_id ) REFERENCES  subject  ( subject_id );
ALTER TABLE  exam_result 
  ADD CONSTRAINT  exam_result_ibfk_1  FOREIGN KEY ( exam_id ) REFERENCES  exam  ( exam_id );
ALTER TABLE  feeback 
  ADD CONSTRAINT  feeback_ibfk_1  FOREIGN KEY ( user_id ) REFERENCES  users  ( user_id );
ALTER TABLE  quiz 
  ADD CONSTRAINT  quiz_ibfk_1  FOREIGN KEY ( exam_id ) REFERENCES  exam  ( exam_id );
ALTER TABLE  quiz_questions 
  ADD CONSTRAINT  quiz_questions_ibfk_1  FOREIGN KEY ( quiz_id ) REFERENCES  quiz  ( quiz_id );
ALTER TABLE  quiz_result 
  ADD CONSTRAINT  quiz_result_ibfk_1  FOREIGN KEY ( quiz_id ) REFERENCES  quiz  ( quiz_id );
ALTER TABLE  revaluation 
  ADD CONSTRAINT  revaluation_ibfk_1  FOREIGN KEY ( exam_id ) REFERENCES  exam  ( exam_id ),CONSTRAINT  revaluation_ibfk_2  FOREIGN KEY ( user_id ) REFERENCES  users  ( user_id );
ALTER TABLE  student 
  ADD CONSTRAINT  student_ibfk_1  FOREIGN KEY ( course_id ) REFERENCES  course  ( course_id ),CONSTRAINT  student_ibfk_2  FOREIGN KEY ( student_id ) REFERENCES  users  ( user_id );
ALTER TABLE  subject 
  ADD CONSTRAINT  subject_ibfk_1  FOREIGN KEY ( course_id ) REFERENCES  course  ( course_id );
ALTER TABLE  subjective 
  ADD CONSTRAINT  subjective_ibfk_1  FOREIGN KEY ( exam_id ) REFERENCES  exam  ( exam_id );
ALTER TABLE  subjective_answer 
  ADD CONSTRAINT  subjective_answer_ibfk_1  FOREIGN KEY ( question_id ) REFERENCES  subjective_questions  ( question_id );
ALTER TABLE  subjective_questions 
  ADD CONSTRAINT  subjective_questions_ibfk_1  FOREIGN KEY ( subjective_id ) REFERENCES  subjective  ( subjective_id );
ALTER TABLE  subject_assignment 
  ADD CONSTRAINT  subject_assignment_ibfk_1  FOREIGN KEY ( subject_id ) REFERENCES  subject  ( subject_id ), CONSTRAINT  subject_assignment_ibfk_2  FOREIGN KEY ( teacher_id ) REFERENCES  teacher  ( teacher_id );
ALTER TABLE  teacher 
  ADD CONSTRAINT  teacher_ibfk_1  FOREIGN KEY ( teacher_id ) REFERENCES  users  ( user_id ),CONSTRAINT  teacher_ibfk_2  FOREIGN KEY ( dept_id ) REFERENCES  department  ( dept_id );
ALTER TABLE  users 
  ADD CONSTRAINT  users_ibfk_1  FOREIGN KEY ( inst_id ) REFERENCES  institution  ( inst_id );

