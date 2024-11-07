const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"cet_mca"
})

db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      process.exit(1);
    }
    console.log('Database connected successfully!');
  });

app.get('/users',(req,res)=>{
    const sql="select * from user";
    db.query(sql,(err,data)=>{
        if(err) return res.json(err);
        return res.json(data);
    })
})

app.post('/addInstitution',(req,res)=>{   
    sql = "INSERT INTO `institution` (`inst_name`, `inst_email`, `inst_address`, `inst_phno`) VALUES (?,?,?,?)"
    const values = [
        req.body.name,
        req.body.email,
        req.body.address,
        req.body.phone
    ]
    db.query(sql,values,(err,result)=>{
        if(err) return res.json({message:'Something has Occured' + err})
        return res.json({ id: result.insertId,name:req.body.name })
    })
})

app.post('/addInstAdmin',(req,res)=>{   
    // res.json({message:req.body.inst_id})
    sql="INSERT INTO `users` (`user_name`, `user_email`, `user_regno`, `user_phno`, `user_password`, `user_gender`, `user_dob`, `user_type`, `inst_id`) VALUES (?,?,?,?,?,?,?,?,?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.regno,
        req.body.phone,
        req.body.password,
        req.body.gender,
        req.body.dob,
        "admin",
        req.body.inst_id
    ]
    db.query(sql,values,(err,result)=>{
        if(err) return res.json({message:'Something has Occured' + err})
        return res.json({ id: result.insertId, message: 'Admin added successfully' })
    })
})

app.post('/login', (req, res) => {
    if(req.body.type === "admin"){
        var values = [
            req.body.email,
            req.body.password,
            req.body.type,
            parseInt(req.body.institution)
        ]
        var sql = "select * from users where user_email = ? and user_password = ? and user_type =? and  inst_id = ?";
        //var sql = `SELECT * FROM users WHERE user_email = ? AND user_password = ? AND user_type = ? AND inst_id = (SELECT inst_id FROM institution WHERE inst_name = ?)`;
    }
    else if(req.body.type === "student"){
        var values = [
            req.body.regno,
            req.body.password,
            req.body.type
        ]
        var sql = "select * from users inner join student on users.user_id = student.student_id where user_regno = ? and user_password = ? and user_type= ?";
    }
    else if(req.body.type === "teacher"){
        var values = [
            req.body.email,
            req.body.password,
            req.body.type,
            parseInt(req.body.institution)
        ]
        var sql = "select * from users inner join teacher on users.user_id = teacher.teacher_id where user_email = ? and user_password = ? and user_type= ?";
    }
    db.query(sql,values, (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.json({ message: 'Some Error Occurred: ' + err });
        }
        
        if (result.length > 0) {
            // return res.json({ id: result[0].user_id ,name:result[0].user_name,email:result[0].user_email,regno:result[0].user_regno,inst_id:result[0].inst_id});
            return res.json(result[0]);

        } else {
            return res.json({ message: 'Invalid credentials or user not found'});
        }
    });
});

app.get('/getCollege',(req,res)=>{
    sql="select inst_id,inst_name from institution";
    db.query(sql,(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/addDepartment',(req,res)=>{   
    // res.json({message:req.body.inst_id})
    sql="INSERT INTO `department` (`dept_name`, `inst_id`) VALUES (?,?)";
    const values = [
        req.body.name,
        req.body.inst_id,
    ]
    db.query(sql,values,(err,result)=>{
        if(err) return res.json({message:'Something has Occured' + err})
        return res.json({message: 'Department added successfully' })
    })
})

app.post('/deleteDepartment',(req,res)=>{   
    sql="DELETE FROM `department` WHERE `dept_id`=?";
    db.query(sql,[req.body.id],(err,result)=>{
        if(err) return res.json({message:'Something has Occured' + err})
        return res.json({message: 'Department Deleted successfully' })
    })
})

app.post('/updateDepartment',(req,res)=>{   
    sql="UPDATE `department` SET `dept_name`=? WHERE `dept_id` = ?";
    db.query(sql,[req.body.name,req.body.id],(err,result)=>{
        if(err) return res.json({message:'Something has Occured' + err})
        return res.json({message: 'Department Updated successfully' })
    })
})

app.post('/getDepartments',(req,res)=>{
    sql="select * from department where `inst_id`=?";
    db.query(sql,[req.body.inst_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/addCourse', (req, res) => { 
    const sqlSelectDept = "SELECT `dept_id` FROM department WHERE `dept_name` = ?";
    db.query(sqlSelectDept, [req.body.dept_name], (err, result) => {
        if (err) {
            return res.json({ message: 'Error occurred: ' + err });
        }
        if (result.length === 0) {
            return res.json({ message: 'Department not found' });
        }
        const dept_id = result[0].dept_id;
        const sqlInsertCourse = "INSERT INTO `course` (`course_name`, `dept_id`, `sem_no`) VALUES (?, ?, ?)";
        const values = [
            req.body.name,
            dept_id,
            req.body.sem
        ];

        db.query(sqlInsertCourse, values, (err, result) => {
            if (err) {
                return res.json({ message: 'Error occurred: ' + err });
            }
            return res.json({ message: 'Course added successfully' });
        });
    });
});

app.post('/deleteCourse',(req,res)=>{   
    sql="DELETE FROM `course` WHERE `course_id`=?";
    db.query(sql,[req.body.id],(err,result)=>{
        if(err) return res.json({message:'Something has Occured' + err})
        return res.json({message: 'Course Deleted successfully' })
    })
})

app.post('/updateCourse',(req,res)=>{   
    sql="UPDATE `course` SET `course_name`=? ,`sem_no`=? WHERE `course_id` = ?";
    db.query(sql,[req.body.courseFields.name,req.body.courseFields.sem,req.body.id],(err,result)=>{
        if(err) return res.json({message:'Something has Occured' + err})
        return res.json({message: 'Course Updated successfully' })
    })
})

app.post('/getCourses',(req,res)=>{
    sql="select * from course inner join department on course.dept_id = department.dept_id where department.inst_id= ?";
    db.query(sql,[req.body.inst_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/fetchCourses',(req,res)=>{
    sql="select * from course where dept_id= ?";
    db.query(sql,[req.body.dept_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/addStudent', (req, res) => { 
    const userSql="INSERT INTO `users` (`user_name`, `user_email`, `user_regno`, `user_phno`, `user_password`, `user_gender`, `user_dob`, `user_type`, `inst_id`) VALUES (?,?,?,?,?,?,?,?,?)";
    
    const values = [
        req.body.name,
        req.body.email,
        req.body.regno,
        req.body.phone,
        req.body.password,
        req.body.gender,
        req.body.dob,
        "student",
        parseInt(req.body.inst_id),
    ]
    db.query(userSql, values, (err, result) => {
        if (err) {
            return res.json({ message: 'Error occurred USER: ' + err });
        }
        const user_id = result.insertId;
        const studentSql = "INSERT INTO `student` (`student_id`, `course_id`, `current_sem`,`status`) VALUES (?, ?, ?, ?)";
        const values2 = [
            user_id,
            parseInt(req.body.course),
            parseInt(req.body.semester),
            "approved"
        ];

        db.query(studentSql, values2, (err, result) => {
            if (err) {
                return res.json({ message: 'Error occurred STUDENT: ' + err });
            }
            return res.json({ message: 'Student added successfully' });
        });
    });
});

app.post('/addTeacher', (req, res) => { 
    const userSql="INSERT INTO `users` (`user_name`, `user_email`, `user_regno`, `user_phno`, `user_password`, `user_gender`, `user_dob`, `user_type`, `inst_id`) VALUES (?,?,?,?,?,?,?,?,?)";
    
    const values = [
        req.body.name,
        req.body.email,
        req.body.regno,
        req.body.phone,
        req.body.password,
        req.body.gender,
        req.body.dob,
        "teacher",
        parseInt(req.body.inst_id),
    ]
    db.query(userSql, values, (err, result) => {
        if (err) {
            return res.json({ message: 'Error occurred USER: ' + err });
        }
        const user_id = result.insertId;
        const teacherSql = "INSERT INTO `teacher` (`teacher_id`, `dept_id`,`status`) VALUES (?, ?, ?)";
        const values2 = [
            user_id,
            parseInt(req.body.dept_id),
            "approved"
        ];

        db.query(teacherSql, values2, (err, result) => {
            if (err) {
                return res.json({ message: 'Error occurred TEACHER: ' + err });
            }
            return res.json({ message: 'Teacher added successfully' });
        });
    });
});

app.post('/addSubject',(req,res)=>{   
    // res.json({message:req.body.inst_id})
    sql="INSERT INTO `subject` (`subject_name`, `course_id`,`course_sem`) VALUES (?,?,?)";
    const values = [
        req.body.name,
        req.body.course_id,
        req.body.sem
    ]
    db.query(sql,values,(err,result)=>{
        if(err) return res.json({message:'Something has Occured' + err})
        return res.json({message: 'subject added successfully' })
    })
})

app.post('/deleteSubject',(req,res)=>{
    
})

app.post('/getSubjects',(req,res)=>{
    //sql="select * from subject inner join course on course.course_id = subject.course_id inner join department on course.dept_id = department.dept_id inner join subject_assignment on subject_assignment.subject_id = subject.subject_id where department.inst_id= ?";
    sql ="select * from subject inner join course on course.course_id = subject.course_id inner join department on course.dept_id = department.dept_id where department.inst_id= ?";
    db.query(sql,[req.body.inst_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/fetchSubjects',(req,res)=>{
    sql ="select * from subject inner join subject_assignment on subject.subject_id = subject_assignment.subject_id where subject_assignment.teacher_id= ?";
    db.query(sql,[req.body.user_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.get('/getTeachers',(req,res)=>{
    sql ="select user_name,teacher_id from subject_assignment INNER join users on users.user_id = subject_assignment.teacher_id WHERE subject_id = ?";
    db.query(sql,[req.query.sub_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        if (result.length === 0) {
            return res.json({ message: 'no teacher assigned' });
        }
        return res.json(result)
    })
})

app.get('/fetchTeachers/:dept_id',(req,res)=>{
    sql ="select user_name,user_id from users INNER join teacher on users.user_id = teacher.teacher_id WHERE dept_id = ?";
    db.query(sql,[req.params.dept_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        if (result.length === 0) {
            return res.json({ message: 'no teacher in department' });
        }
        return res.json(result)
    })
})

app.post('/assignTeacher',(req,res)=>{   
    // res.json({message:req.body.inst_id})
    sql="INSERT INTO `subject_assignment` (`subject_id`, `teacher_id`) VALUES (?,?)";
    const values = [
        req.body.sub_id,
        req.body.id,
    ]
    db.query(sql,values,(err,result)=>{
        if(err) return res.json({message:'Something has Occured' + err})
        return res.json({message: 'teacher assigned successfully' })
    })
})
/*
app.post('/createExam',(req,res)=>{
    const sqlExam = "INSERT INTO `exam` (`exam_name`, `description`, `subject_id`,`starting_date`, `ending_date`, `duration`, `teacher_id`) VALUES (?,?,?,?,?,?,?)";
    const valuesExam = [
        req.body.exam_name,
        req.body.description,
        req.body.subject_id,
        req.body.starting,
        req.body.ending,
        req.body.duration,
        req.body.teacher,
    ]
    var exam_id,subjective_id=0,quiz_id=0;
    db.query(sqlExam,valuesExam,(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured exam' + err})
        else{
            exam_id =result.insertId;
            if(req.body.subjective > 0){
                sqlSubjective = "insert into `subjective` (`exam_id`,`no_of_questions`) values (?,?)";
                valuesSubjective = [exam_id,req.body.subjective]
                db.query(sqlSubjective,valuesSubjective,(err,result1)=>{
                    if(err)
                        return res.json({message:'Some Error Occured sub'+err})
                    else
                        subjective_id=result1.insertId;
                })
            }
            if(req.body.objective >0){
                sqlQuiz = "insert into `quiz` (`exam_id`,`no_of_questions`) values (?,?)";
                valuesQuiz = [exam_id,req.body.objective]
                db.query(sqlQuiz,valuesQuiz,(err,result2)=>{
                    if(err)
                        return res.json({message:'Some Error Occured quiz'+err})
                    else
                        quiz_id=result2.insertId;
                })
            }
            return res.json({exam_id,subjective_id,quiz_id})
        }
    })
})
*/  
/*
app.post('/createExam', (req, res) => {
    const sqlExam = "INSERT INTO `exam` (`exam_name`, `description`, `subject_id`, `starting_date`, `ending_date`, `duration`, `teacher_id`) VALUES (?,?,?,?,?,?,?)";
    const valuesExam = [
        req.body.exam_name,
        req.body.description,
        req.body.subject_id,
        req.body.starting,
        req.body.ending,
        req.body.duration,
        req.body.teacher,
    ];

    let exam_id = 0, subjective_id = 0, quiz_id = 0;

    // Insert exam data
    db.query(sqlExam, valuesExam, (err, result) => {
        if (err) return res.json({ message: 'Some Error Occurred in exam: ' + err });

        exam_id = result.insertId;

        // Promise for subjective insertion
        const subjectivePromise = new Promise((resolve, reject) => {
            if (req.body.subjective > 0) {
                const sqlSubjective = "INSERT INTO `subjective` (`exam_id`, `no_of_questions`) VALUES (?,?)";
                const valuesSubjective = [exam_id, req.body.subjective];
                db.query(sqlSubjective, valuesSubjective, (err, result1) => {
                    if (err) {
                        reject('Some Error Occurred in subjective: ' + err);
                    } else {
                        subjective_id = result1.insertId;
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });

        // Promise for quiz insertion
        const quizPromise = new Promise((resolve, reject) => {
            if (req.body.objective > 0) {
                const sqlQuiz = "INSERT INTO `quiz` (`exam_id`, `no_of_questions`) VALUES (?,?)";
                const valuesQuiz = [exam_id, req.body.objective];
                db.query(sqlQuiz, valuesQuiz, (err, result2) => {
                    if (err) {
                        reject('Some Error Occurred in quiz: ' + err);
                    } else {
                        quiz_id = result2.insertId;
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });

        // Execute both promises and return final result once both complete
        Promise.all([subjectivePromise, quizPromise])
            .then(() => {
                if(subjective_id!=0){
                    examUpdate1="update exam set subjective_id = ? where exam_id =?";
                    db.query(examUpdate1, [subjective_id,exam_id], (err, result2) => {
                        if (err) {
                            reject('Some Error Occurred in subjective updation: ' + err);
                        } else {
                            quiz_id = result2.insertId;
                            resolve();
                        }
                    });
                }
                if(quiz_id!=0){
                    examUpdate1="update exam set quiz_id = ? where exam_id =?";
                    db.query(examUpdate1, [quiz_id,exam_id], (err, result2) => {
                        if (err) {
                            reject('Some Error Occurred in Quiz updation: ' + err);
                        } else {
                            quiz_id = result2.insertId;
                            resolve();
                        }
                    });
                }
                return res.json({ exam_id, subjective_id, quiz_id });
            })
            .catch((error) => {
                return res.json({ message: error });
            });
    });
});
*/

app.post('/createExam', (req, res) => {
    const sqlExam = "INSERT INTO `exam` (`exam_name`, `description`, `subject_id`, `starting_date`, `ending_date`, `duration`, `teacher_id`) VALUES (?,?,?,?,?,?,?)";
    const valuesExam = [
        req.body.exam_name,
        req.body.description,
        req.body.subject_id,
        req.body.starting,
        req.body.ending,
        req.body.duration,
        req.body.teacher,
    ];

    db.query(sqlExam, valuesExam, (err, result) => {
        if (err) return res.json({ message: 'Some Error Occurred in exam: ' + err });

        const exam_id = result.insertId;

        // Promise for subjective insertion
        const subjectivePromise = new Promise((resolve, reject) => {
            if (req.body.subjective > 0) {
                const sqlSubjective = "INSERT INTO `subjective` (`exam_id`, `sno_of_questions`) VALUES (?,?)";
                const valuesSubjective = [exam_id, req.body.subjective];
                db.query(sqlSubjective, valuesSubjective, (err, result1) => {
                    if (err) {
                        reject('Some Error Occurred in subjective: ' + err);
                    } else {
                        resolve(result1.insertId);
                    }
                });
            } else {
                resolve(null);
            }
        });

        // Promise for quiz insertion
        const quizPromise = new Promise((resolve, reject) => {
            if (req.body.objective > 0) {
                const sqlQuiz = "INSERT INTO `quiz` (`exam_id`,`mark`, `qno_of_questions`) VALUES (?,?,?)";
                const valuesQuiz = [exam_id,req.body.obj_mark, req.body.objective];
                db.query(sqlQuiz, valuesQuiz, (err, result2) => {
                    if (err) {
                        reject('Some Error Occurred in quiz: ' + err);
                    } else {
                        resolve(result2.insertId);
                    }
                });
            } else {
                resolve(null);
            }
        });

        // Execute both promises
        Promise.all([subjectivePromise, quizPromise])
            .then(([subjective_id, quiz_id]) => {
                const updatePromises = [];

                // Add update for subjective_id if needed
                if (subjective_id) {
                    updatePromises.push(new Promise((resolve, reject) => {
                        const sqlUpdate = "UPDATE `exam` SET `subjective_id` = ? WHERE `exam_id` = ?";
                        db.query(sqlUpdate, [subjective_id, exam_id], (err) => {
                            if (err) {
                                reject('Some Error Occurred in subjective updation: ' + err);
                            } else {
                                resolve();
                            }
                        });
                    }));
                }

                // Add update for quiz_id if needed
                if (quiz_id) {
                    updatePromises.push(new Promise((resolve, reject) => {
                        const sqlUpdate = "UPDATE `exam` SET `quiz_id` = ? WHERE `exam_id` = ?";
                        db.query(sqlUpdate, [quiz_id, exam_id], (err) => {
                            if (err) {
                                reject('Some Error Occurred in quiz updation: ' + err);
                            } else {
                                resolve();
                            }
                            
                        });
                    }));
                }

                // Execute all update promises and respond
                return Promise.all(updatePromises).then(() => {
                    return res.json({ exam_id, subjective_id, quiz_id });
                });
            })
            .catch((error) => {
                return res.json({ message: error });
            });
    });
});


app.post('/addQuizQuestions/:quiz_id', (req, res) => {
    const sql = "INSERT INTO `quiz_questions` (`quiz_id`, `question_title`, `option1`, `option2`, `option3`, `option4`, `answer`) VALUES ?";
    // Transform each question in `req.body` into an array of value
    const values = req.body.map(question => [
        req.params.quiz_id,
        question.question,
        question.option1,
        question.option2,
        question.option3,
        question.option4,
        question.answer,
    ]);

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.log("Error inserting questions:", err);
            return res.json({ message: 'An error occurred: ' + err });
        }
        return res.json({ message: 'Questions added successfully' });
    });
});

app.post('/addSubjectiveQuestions/:subjective_id', (req, res) => {
    const sql = "INSERT INTO `subjective_questions` (`subjective_id`, `question_title`, `mark`) VALUES ?";

    const values = req.body.map(question => [
        req.params.subjective_id,
        question.question,
        question.mark,
    ]);

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.log("Error inserting questions:", err);
            return res.json({ message: 'An error occurred: ' + err });
        }
        return res.json({ message: 'Questions added successfully' });
    });
});


app.post('/fetchExams',(req,res)=>{
    // sql ="select * from exam inner join subject on exam.subject_id = subject.subject_id inner join course on subject.course_id = course.course_id inner join quiz on quiz.quiz_id = exam.quiz_id inner join subjective on subjective.subjective_id = exam.subjective_id where subject.course_id = ? and subject.course_sem=?";
    // sql = "SELECT * FROM exam INNER JOIN subject ON exam.subject_id = subject.subject_id INNER JOIN course ON subject.course_id = course.course_id LEFT JOIN quiz ON quiz.quiz_id = exam.quiz_id LEFT JOIN subjective ON subjective.subjective_id = exam.subjective_id WHERE subject.course_id = ? AND subject.course_sem = ?";
    sql="SELECT exam.exam_id,exam.exam_name,exam.description,exam.subject_id,exam.quiz_id,exam.subjective_id,exam.starting_date,exam.ending_date,exam.duration,subject.subject_name,quiz.mark,quiz.qno_of_questions,subjective.sno_of_questions FROM exam INNER JOIN subject ON exam.subject_id = subject.subject_id INNER JOIN course ON subject.course_id = course.course_id LEFT JOIN quiz ON quiz.quiz_id = exam.quiz_id LEFT JOIN subjective ON subjective.subjective_id = exam.subjective_id WHERE subject.course_id = ? AND subject.course_sem = ?";
    db.query(sql,[req.body.course_id,req.body.semester],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})
app.post('/fetchQuizQuestions',(req,res)=>{
    sql ="select * from quiz_questions where quiz_id=?";
    db.query(sql,[req.body.quiz_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/attemptQuiz/:regno/:quiz_id/:quizMark/:exam_id', (req, res) => {
    // const sql = "INSERT INTO `quiz_questions` (`quiz_id`. `question_title`, `option1`, `option2`, `option3`, `option4`, `answer`) VALUES ?";
    // Transform each question in `req.body` into an array of value
    const total = req.body.map(question => [
        question.question_id,
        question.answer,
        question.correctanswer,
    ]);
    let correct=0,wrong=0;
    total.forEach(question => {
        if(question[1] === question[2])//question.answer === question.correctanswer
            correct++;
        else
            wrong++
      });
      const totalMark=correct*req.params.quizMark;
    const sql = "INSERT INTO `quiz_result` (`quiz_id`, `student_regno`, `correct_no`, `wrong_no`, `total_mark`) VALUES (?,?,?,?,?)";
    const values = [
        req.params.quiz_id,
        req.params.regno,
        correct,
        wrong,
        totalMark,
    ]
    // const values = [
    //     [req.params.quiz_id, req.params.regno, correct, wrong, correct * req.params.quizMark]
    // ];and edit VALUES (?);
    db.query(sql, values, (err, result) => {
        if (err) {
            console.log("Error inserting results:", err);
            return res.json({ message: 'An error occurred: ' + err });
        }
        else{
            const sql2 = "insert into exam_result (exam_id,student_regno,quiz_mark) values (?,?,?)";
            const value2=[req.params.exam_id,req.params.regno,totalMark];
            console.log(value2);
            db.query(sql2,value2,(err,result)=>{
                if(err)
                    console.log("Error inserting to result")
            })
        }
        return res.json({ message: 'Mark added successfully' });
    });
});

app.post('/fetchSubjectiveQuestions',(req,res)=>{
    sql ="select * from subjective_questions where subjective_id=?";
    db.query(sql,[req.body.subjective_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/attemptSubjective/:regno/:subjective_id', (req, res) => {
    const sql = "INSERT INTO `subjective_answer` (`question_id`, `student_regno`, `answer`,`mark`) VALUES ?";

    const values = req.body.map(question => [
        question.question_id,
        req.params.regno,
        question.answer,
        0
    ]);

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.log("Error inserting answers:", err);
            return res.json({ message: 'An error occurred: ' + err });
        }
        else{
            const sql2 = "insert into subjective_result (subjective_id,student_regno,total_mark) values (?,?,?)";
            const value2=[req.params.subjective_id,req.params.regno,-1];
            db.query(sql2,value2,(err,result)=>{
                if(err)
                    console.log("Error inserting to result")
            })
        }
        
        return res.json({ message: 'Answers added successfully' });
    });
});

app.post('/getExams',(req,res)=>{
    // sql ="select * from exam inner join subject on exam.subject_id = subject.subject_id inner join course on subject.course_id = course.course_id inner join quiz on quiz.quiz_id = exam.quiz_id inner join subjective on subjective.subjective_id = exam.subjective_id where subject.course_id = ? and subject.course_sem=?";
    sql = "SELECT * FROM exam INNER JOIN subject ON exam.subject_id = subject.subject_id where exam.teacher_id =? ";
    db.query(sql,[req.body.user_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/getQuizAttendees',(req,res)=>{

    sql = "SELECT * FROM quiz_result inner join users on quiz_result.student_regno = users.user_regno where quiz_result.quiz_id=? ";
    db.query(sql,[req.body.quiz_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/getSubjectiveAttendees',(req,res)=>{

    sql = "SELECT * FROM subjective_result inner join users on subjective_result.student_regno = users.user_regno where subjective_result.subjective_id=? ";
    db.query(sql,[req.body.subjective_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/getBothAttendees',(req,res)=>{

    sql = "SELECT distinct users.user_name,users.user_regno,quiz_result.total_mark as qtotal,subjective_result.total_mark as stotal,exam.subjective_id,exam.exam_id FROM exam inner join quiz_result on quiz_result.quiz_id = exam.quiz_id inner join subjective_result on subjective_result.subjective_id=exam.subjective_id inner join users on quiz_result.student_regno=users.user_regno where exam.exam_id=?";
    db.query(sql,[req.body.exam_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})
app.listen(5000)