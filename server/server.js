const express = require("express");
const mysql = require("mysql");
// const sql = require('mssql');
const cors = require("cors");
const bcrypt = require('bcryptjs');
const util = require('util');
const router = express.Router();
const WebSocket = require("ws");
const multer = require('multer');
const path = require('path');

const { body, validationResult } = require('express-validator');
// const OpenAI = require('openai');
const { GoogleGenerativeAI } = require("@google/generative-ai");




// const { Configuration, OpenAIApi } = require('openai');
// const openaiConfig = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(openaiConfig);
require('dotenv').config();

// const { connectToDatabase, sql } = require('./db');
const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// if (!process.env.OPENAI_API_KEY) {
//   throw new Error('Missing OpenAI API key. Please set OPENAI_API_KEY in your .env file');
// }

// const openai = new OpenAI({
//   apiKey: process.env
// .OPENAI_API_KEY
// });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Store API key in environment variables
const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const PORT = process.env.PORT || 5000 ;

const db=mysql.createConnection({
    host:DB_HOST,
    user:DB_USER,
    password:DB_PASSWORD,
    database:DB_NAME
})
// const db = sql.connect({
//     user:DB_USER,
//     password:DB_PASSWORD,
//     server:DB_HOST,
//     database:DB_NAME
// })
db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      process.exit(1);
    }
    console.log('Database connected successfully!');
  });
  db.query = util.promisify(db.query);
  // Configure storage for malpractice images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/malpractice/');
  },
  filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `malpractice-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `avatar-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });
const avatarUpload = multer({ 
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
          cb(null, true);
      } else {
          cb(new Error('Only image files are allowed!'), false);
      }
  }
});
// WebSocket connection for real-time monitoring
wss.on('connection', (ws, req) => {
  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const examId = urlParams.get('/student');
  const studentId = urlParams.get('studentId');
  
  console.log(`New WebSocket connection for exam ${examId}, student ${studentId}`);
  
  ws.on('close', () => {
      console.log(`WebSocket closed for exam ${examId}, student ${studentId}`);
  });
});
app.post('/getStudentDetails2', (req, res) => {
  const { user_id } = req.body;
  
  if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
  }

  const sql = `
      SELECT u.user_id, u.user_name, u.user_email, u.user_regno, u.user_phno, 
             u.user_gender, u.user_dob, u.avatar_url, s.current_sem, c.course_name
      FROM users u
      JOIN student s ON u.user_id = s.student_id
      JOIN course c ON s.course_id = c.course_id
      WHERE u.user_id = ?
  `;
  
  db.query(sql, [user_id], (err, results) => {
      if (err) {
          console.error('Error fetching student details:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'Student not found' });
      }

      const student = results[0];
      res.json({
          success: true,
          data: {
              id: student.user_id,
              name: student.user_name,
              email: student.user_email,
              regno: student.user_regno,
              phone: student.user_phno,
              gender: student.user_gender,  
              dob: student.user_dob,
              semester: student.current_sem,
              course: student.course_name,
              avatar_url: student.avatar_url ? `${req.protocol}://${req.get('host')}/${student.avatar_url}` : null
          }
      });
  });
});

app.post('/updateStudentDetails', [
  body('user_id').isInt().withMessage('Invalid user ID'),
  body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ max: 100 }).withMessage('Name must be less than 100 characters'),
  body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .isLength({ max: 50 }).withMessage('Email must be less than 50 characters'),
  body('phone')
      .trim()
      .notEmpty().withMessage('Phone number is required')
      .isMobilePhone().withMessage('Invalid phone number'),
  body('gender')
      .trim()
      .notEmpty().withMessage('Gender is required')
      .isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender value'),
  body('dob')
      .trim()
      .notEmpty().withMessage('Date of birth is required')
      .isDate().withMessage('Invalid date format')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { user_id, name, email, phone, gender, dob } = req.body;
  
  // Check if user exists and is a student
  const checkSql = 'SELECT 1 FROM users u JOIN student s ON u.user_id = s.student_id WHERE u.user_id = ?';
  
  db.query(checkSql, [user_id], (err, results) => {
      if (err) {
          console.error('Error checking student:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }
      
      if (results.length === 0) {
          return res.status(404).json({ error: 'Student not found' });
      }

      // Update student details
      const updateSql = `
          UPDATE users 
          SET user_name = ?, user_email = ?, user_phno = ?, user_gender = ?, user_dob = ?
          WHERE user_id = ?
      `;
      
      db.query(updateSql, [name, email, phone, gender, dob, user_id], (err, result) => {
          if (err) {
              console.error('Error updating student:', err);
              return res.status(500).json({ error: 'Internal server error' });
          }
          
          res.json({
              success: true,
              message: 'Student details updated successfully'
          });
      });
  });
});

app.post('/uploadAvatar', avatarUpload.single('avatar'), (req, res) => {
  const { user_id } = req.body;
  const avatarPath = req.file?.path;

  if (!avatarPath) {
      return res.status(400).json({ error: 'No file uploaded' });
  }

  if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
  }

  const sql = 'UPDATE users SET avatar_url = ? WHERE user_id = ?';
  
  db.query(sql, [avatarPath, user_id], (err, result) => {
      if (err) {
          console.error('Error updating avatar:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }
      
      res.json({
          success: true,
          message: 'Avatar uploaded successfully',
          avatar_url: `${req.protocol}://${req.get('host')}/${avatarPath}`
      });
  });
});
// Malpractice logging endpoint
app.post('/logMalpractice', upload.single('image'), (req, res) => {
  const { exam_id, student_id, type } = req.body;
  const image_path = req.file ? req.file.path : null;

  const sql = `
      INSERT INTO malpractice_logs 
      (exam_id, student_id, type, image_path, created_at) 
      VALUES (?, ?, ?, ?, NOW())
  `;
  
  db.query(sql, [exam_id, student_id, type, image_path], (err, result) => {
      if (err) {
          console.error('Error logging malpractice:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }
      
      // Notify all connected clients about the malpractice
      wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                  type: 'MALPRACTICE',
                  examId: exam_id,
                  studentId: student_id,
                  malpracticeType: type
              }));
          }
      });
      
      res.status(201).json({ success: true, id: result.insertId });
  });
});

// Get malpractice logs for an exam
app.get('/malpracticeLogs/:examId', (req, res) => {
  const { examId } = req.params;
  
  const sql = `
      SELECT ml.*, s.name as student_name, s.regno
      FROM malpractice_logs ml
      JOIN students s ON ml.student_id = s.id
      WHERE ml.exam_id = ?
      ORDER BY ml.created_at DESC
  `;
  
  db.query(sql, [examId], (err, results) => {
      if (err) {
          console.error('Error fetching malpractice logs:', err);
          return res.status(500).json({ error: 'Internal server error' });
      }
      
      // Convert image paths to URLs
      const logs = results.map(log => ({
          ...log,
          image_url: log.image_path ? `${req.protocol}://${req.get('host')}/${log.image_path}` : null
      }));
      
      res.json(logs);
  });
});
// Create malpractice logs table if not exists (for initial setup)
app.get('/setupMalpracticeTable', (req, res) => {
  const sql = `
      CREATE TABLE IF NOT EXISTS malpractice_logs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          exam_id INT NOT NULL,
          student_id INT NOT NULL,
          type VARCHAR(50) NOT NULL,
          image_path VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          resolved BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
          FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )
  `;
  
  db.query(sql, (err, result) => {
      if (err) {
          console.error('Error creating malpractice_logs table:', err);
          return res.status(500).json({ error: 'Failed to create table' });
      }
      res.json({ success: true, message: 'Table created or already exists' });
  });
});

// let dbPool;
// (async () => {
//   dbPool = await connectToDatabase();
// })();
app.get('/users',(req,res)=>{
    const sql="select * from users";
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
    console.log("object");
    db.query(sql,values,(err,result)=>{
        if(err) return res.json({message:'Something has Occured' + err})
        return res.json({ id: result.insertId,name:req.body.name })
    })
})
// Add Institution Admin with Password Hashing
app.post('/addInstAdmin', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 5); // Hash the password with a salt round of 10

        const sql = "INSERT INTO `users` (`user_name`, `user_email`, `user_regno`, `user_phno`, `user_password`, `user_gender`, `user_dob`, `user_type`, `inst_id`) VALUES (?,?,?,?,?,?,?,?,?)";
        const values = [
            req.body.name,
            req.body.email,
            req.body.regno,
            req.body.phone,
            hashedPassword, // Use the hashed password here
            req.body.gender,
            req.body.dob,
            "admin",
            req.body.inst_id
        ];

        db.query(sql, values, (err, result) => {
            if (err) return res.json({ message: 'Something has occurred: ' + err });
            return res.json({ id: result.insertId, message: 'Admin added successfully' });
        });
    } catch (error) {
        res.json({ message: 'Error hashing password: ' + error });
    }
});
app.post('/login', async (req, res) => {
    let sql, values;
    if (req.body.type === "admin") {
        values = [
            req.body.email,
            req.body.type,
            parseInt(req.body.institution)
        ];
        sql = "SELECT * FROM users WHERE user_email = ? AND user_type = ? AND inst_id = ?";
    } else if (req.body.type === "student") {
        values = [
            req.body.regno,
            req.body.type
        ];
        sql = "SELECT * FROM users INNER JOIN student ON users.user_id = student.student_id WHERE user_regno = ? AND user_type =?  AND student.status='approved'";
    } else if (req.body.type === "teacher") {
        values = [
            req.body.email,
            req.body.type,
            parseInt(req.body.institution)
        ];
        sql = "SELECT * FROM users INNER JOIN teacher ON users.user_id = teacher.teacher_id WHERE user_email = ? AND user_type = ? AND teacher.status='approved'";
    }



    db.query(sql, values, async (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.json({ message: 'Some error occurred: ' + err });
        }

        if (result.length > 0) {
            const user = result[0];
       
            const isPasswordMatch = await bcrypt.compare(req.body.password, user.user_password);
          

            if (isPasswordMatch) {
                return res.json(user);
            } else {
                return res.json({ message: 'Invalid credentials' });
            }
        } else {
            return res.json({ message: 'Invalid credentials or user not found' });
        }
    });
});

// Login with Password Verification
/*app.post('/login', async (req, res) => {
    let sql, values;
    if (req.body.type === "admin") {
        values = [
            req.body.email,
            req.body.type,
            parseInt(req.body.institution)
        ];
        sql = "SELECT * FROM users WHERE user_email = ? AND user_type = ? AND inst_id = ?";
    } else if (req.body.type === "student") {
        values = [
            req.body.regno,
            req.body.type
        ];
        sql = "SELECT * FROM users INNER JOIN student ON users.user_id = student.student_id WHERE user_regno = ? AND user_type = ?";
    } else if (req.body.type === "teacher") {
        values = [
            req.body.email,
            req.body.type,
            parseInt(req.body.institution)
        ];
        sql = "SELECT * FROM users INNER JOIN teacher ON users.user_id = teacher.teacher_id WHERE user_email = ? AND user_type = ?";
    }

    db.query(sql, values, async (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            return res.json({ message: 'Some error occurred: ' + err });
        }

        if (result.length > 0) {
            const user = result[0];
            // Compare the provided password with the hashed password stored in the database
            const isPasswordMatch = await bcrypt.compare(req.body.password, user.user_password);

            if (isPasswordMatch) {
                return res.json(user);
            } else {
                return res.json({ message: 'Invalid credentials '});
            }
        } else {
            return res.json({ message: 'Invalid credentials or user not found' });
        }
    });
});
*/

// app.post('/addInstAdmin',(req,res)=>{   
//     // res.json({message:req.body.inst_id})
//     sql="INSERT INTO `users` (`user_name`, `user_email`, `user_regno`, `user_phno`, `user_password`, `user_gender`, `user_dob`, `user_type`, `inst_id`) VALUES (?,?,?,?,?,?,?,?,?)";
//     const values = [
//         req.body.name,
//         req.body.email,
//         req.body.regno,
//         req.body.phone,
//         req.body.password,
//         req.body.gender,
//         req.body.dob,
//         "admin",
//         req.body.inst_id
//     ]
//     db.query(sql,values,(err,result)=>{
//         if(err) return res.json({message:'Something has Occured' + err})
//         return res.json({ id: result.insertId, message: 'Admin added successfully' })
//     })
// })
// app.post('/login', (req, res) => {
//     if(req.body.type === "admin"){
//         var values = [
//             req.body.email,
//             req.body.password,
//             req.body.type,
//             parseInt(req.body.institution)
//         ]
//         var sql = "select * from users where user_email = ? and user_password = ? and user_type =? and  inst_id = ?";
//         //var sql = `SELECT * FROM users WHERE user_email = ? AND user_password = ? AND user_type = ? AND inst_id = (SELECT inst_id FROM institution WHERE inst_name = ?)`;
//     }
//     else if(req.body.type === "student"){
//         var values = [
//             req.body.regno,
//             req.body.password,
//             req.body.type
//         ]
//         var sql = "select * from users inner join student on users.user_id = student.student_id where user_regno = ? and user_password = ? and user_type= ?";
//     }
//     else if(req.body.type === "teacher"){
//         var values = [
//             req.body.email,
//             req.body.password,
//             req.body.type,
//             parseInt(req.body.institution)
//         ]
//         var sql = "select * from users inner join teacher on users.user_id = teacher.teacher_id where user_email = ? and user_password = ? and user_type= ?";
//     }
//     db.query(sql,values, (err, result) => {
//         if (err) {
//             console.error("Database Error:", err);
//             return res.json({ message: 'Some Error Occurred: ' + err });
//         }
        
//         if (result.length > 0) {
//             // return res.json({ id: result[0].user_id ,name:result[0].user_name,email:result[0].user_email,regno:result[0].user_regno,inst_id:result[0].inst_id});
//             return res.json(result[0]);

//         } else {
//             return res.json({ message: 'Invalid credentials or user not found'});
//         }
//     });
// });

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
    // const sqlSelectDept = "SELECT `dept_id` FROM department WHERE `dept_name` = ?";
    // db.query(sqlSelectDept, [req.body.dept_name], (err, result) => {
    //     if (err) {
    //         return res.json({ message: 'Error occurred: ' + err });
    //     }
    //     if (result.length === 0) {
    //         return res.json({ message: 'Department not found' });
    //     }
    //     const dept_id = result[0].dept_id;
        const sqlInsertCourse = "INSERT INTO `course` (`course_name`, `dept_id`, `sem_no`) VALUES (?, ?, ?)";
        const values = [
            req.body.name,
            req.body.dept_name,
            req.body.sem
        ];

        db.query(sqlInsertCourse, values, (err, result) => {
            if (err) {
                return res.json({ message: 'Error occurred: ' + err });
            }
            return res.json({ message: 'Course added successfully' });
        });
    // });
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

app.post('/addStudent', async (req, res) => { 
    const hashedPassword = await bcrypt.hash(req.body.password, 5);
    const userSql="INSERT INTO `users` (`user_name`, `user_email`, `user_regno`, `user_phno`, `user_password`, `user_gender`, `user_dob`, `user_type`, `inst_id`) VALUES (?,?,?,?,?,?,?,?,?)";
    
    const values = [
        req.body.name,
        req.body.email,
        req.body.regno,
        req.body.phone,
        hashedPassword,
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
            "pending"
        ];

        db.query(studentSql, values2, (err, result) => {
            if (err) {
                return res.json({ message: 'Error occurred STUDENT: ' + err });
            }
            return res.json({ message: 'Student added successfully' });
        });
    });
});
app.post('/addTeacher', async (req, res) => { 
    const hashedPassword = await bcrypt.hash(req.body.password, 5);
    const userSql="INSERT INTO `users` (`user_name`, `user_email`, `user_regno`, `user_phno`, `user_password`, `user_gender`, `user_dob`, `user_type`, `inst_id`) VALUES (?,?,?,?,?,?,?,?,?)";
    
    const values = [
        req.body.name,
        req.body.email,
        req.body.regno,
        req.body.phone,
        hashedPassword,
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
            "pending"
        ];

        db.query(teacherSql, values2, (err, result) => {
            if (err) {
                return res.json({ message: 'Error occurred TEACHER: ' + err });
            }
            return res.json({ message: 'Teacher added successfully' });
        });
    });
});

app.post('/getPendingTeacher',(req,res)=>{
    sql="select * from users inner join teacher on teacher.teacher_id = users.user_id inner join department on department.dept_id= teacher.dept_id where teacher.status='pending' and users.inst_id = ?";
    db.query(sql,[req.body.inst_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/getPendingStudents',(req,res)=>{
    sql="select * from users inner join student on student.student_id = users.user_id inner join course on course.course_id = student.course_id where student.status='pending' and users.inst_id = ?";
    db.query(sql,[req.body.inst_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/updatePendingStudent',(req,res)=>{   
    sql="UPDATE `student` SET `status`=?  WHERE `student_id` = ?";
    db.query(sql,[req.body.status,req.body.student_id],(err,result)=>{
        if(err) return res.json({message:'Something has Occured' + err})
        return res.json({message: 'Student Updated successfully' })
    })
})

app.post('/updatePendingTeacher',(req,res)=>{   
    sql="UPDATE `teacher` SET `status`=?  WHERE `teacher_id` = ?";
    db.query(sql,[req.body.status,req.body.teacher_id],(err,result)=>{
        if(err) return res.json({message:'Something has Occured' + err})
        return res.json({message: 'Teacher Updated successfully' })
    })
})

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
    console.log(valuesExam);
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
  const now=Date.now();
    // sql ="select * from exam inner join subject on exam.subject_id = subject.subject_id inner join course on subject.course_id = course.course_id inner join quiz on quiz.quiz_id = exam.quiz_id inner join subjective on subjective.subjective_id = exam.subjective_id where subject.course_id = ? and subject.course_sem=?";
    // sql = "SELECT * FROM exam INNER JOIN subject ON exam.subject_id = subject.subject_id INNER JOIN course ON subject.course_id = course.course_id LEFT JOIN quiz ON quiz.quiz_id = exam.quiz_id LEFT JOIN subjective ON subjective.subjective_id = exam.subjective_id WHERE subject.course_id = ? AND subject.course_sem = ?";
    sql="SELECT exam.exam_id,exam.exam_name,exam.description,exam.subject_id,exam.quiz_id,exam.subjective_id,exam.starting_date,exam.ending_date,exam.duration,subject.subject_name,quiz.mark,quiz.qno_of_questions,subjective.sno_of_questions FROM exam INNER JOIN subject ON exam.subject_id = subject.subject_id INNER JOIN course ON subject.course_id = course.course_id LEFT JOIN quiz ON quiz.quiz_id = exam.quiz_id LEFT JOIN subjective ON subjective.subjective_id = exam.subjective_id WHERE subject.course_id = ? AND subject.course_sem = ? AND exam.ending_date>= ?";
    db.query(sql,[req.body.course_id,req.body.semester,now],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})
app.post('/fetchExamDetails',(req,res)=>{
  sql ="select * from exam where exam_id=?";
  db.query(sql,[req.body.examid],(err,result)=>{
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
    console.log(req.body)
    let correct=0,wrong=0;
    total.forEach(question => {
        if(Number(question[1]) === question[2])//question.answer === question.correctanswer
            correct++;
        else
            wrong++;
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
            const sql2 = "insert into exam_result (exam_id,student_regno,quiz_mark,subjective_mark,total) values (?,?,?,?,?)";
            const value2=[req.params.exam_id,req.params.regno,totalMark,-2,totalMark];
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
/*
app.post('/attemptSubjective/:regno/:subjective_id/:quiz_id/:exam_id', (req, res) => {
    const sql = "INSERT INTO `subjective_answer` (`question_id`, `student_regno`, `answer`,`mark`) VALUES ?";
    console.log(req.body);
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
            if(req.params.quiz_id == null || req.params.quiz_id==0){
                console.log(req.params.exam_id)
                console.log(req.params.regno)

                
                const sql2 = "insert into exam_result (exam_id,student_regno,quiz_mark,subjective_mark) values (?,?,?,?)";
                const value2=[req.params.exam_id,req.params.regno,-1,-1];
                db.query(sql2,value2,(err,result)=>{
                    if(err)
                        console.log("Error inserting to result")
                })
            }
            else{
                //no need because quiz already enters attended details in exam details table and nothing to change as mark is 0
                const sql3 = "update exam_result set subjective_mark=? where student_regno=? and exam_id=?"
                const value3=[-1,req.params.regno,req.params.exam_id];
                db.query(sql3,value3,(err,result)=>{
                    if(err)
                        console.log("Error inserting to resultsd    ")
                })
            }
        }
        
        return res.json({ message: 'Answers added successfully' });
    });
});
*/

app.post('/attemptSubjective/:regno/:subjective_id/:quiz_id/:exam_id', async (req, res) => {
  try {
      // 1. Get questions with their max marks
      const questions = await db.query(
          'SELECT question_id, question_title, mark FROM subjective_questions WHERE subjective_id = ?',
          [req.params.subjective_id]
      );
      
      // 2. Prepare answers with questions
      const answersWithQuestions = req.body.map(answer => ({
          ...answer,
          question_text: questions.find(q => q.question_id === answer.question_id)?.question_title || '',
          max_mark: questions.find(q => q.question_id === answer.question_id)?.mark || 0
      }));
      // 3. Evaluate answers using Gemini
      const evaluatedAnswers = await Promise.all(
        answersWithQuestions.map(async (item) => {
            if (item.max_mark <= 0) return { ...item, mark: 0 };

            try {
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-exp-03-25" });
                const prompt = `Evaluate this answer on a scale of 0 to ${item.max_mark}. Only respond with a number.\n\nQuestion: ${item.question_text}\nAnswer: ${item.answer}\n\nScore (0-${item.max_mark}):`;
                
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text().trim();
                
                // Extract numeric score (Gemini might return text, so we parse it)
                const score = parseFloat(text.match(/\d+/)?.[0]) || 0;
                return { ...item, mark: Math.min(Math.max(0, score), item.max_mark) };
            } catch (error) {
                console.error("Gemini error:", error);
                return { ...item, mark: 0 }; // Fallback to 0 if API fails
            }
        })
    );
      /*
      // 3. Evaluate each answer using AI
      const evaluatedAnswers = await Promise.all(
          answersWithQuestions.map(async (item) => {
              if (item.max_mark <= 0) return { ...item, mark: 0 };
              
              try {
                  const response = await openai.chat.completions.create({
                      model: "gpt-3.5-turbo",
                      messages: [
                          {
                              role: "system",
                              content: "You are an expert exam evaluator. Provide only numeric scores."
                          },
                          {
                              role: "user",
                              content: `Evaluate (0-${item.max_mark}): Q: ${item.question_text} A: ${item.answer}`
                          }
                      ],
                      max_tokens: 5,
                      temperature: 0.3
                  });
                  
                  const score = parseFloat(response.choices[0]?.message?.content?.trim()) || 0;
                  return { ...item, mark: Math.min(Math.max(0, score), item.max_mark) };
              } catch (error) {
                  console.error("AI error:", error);
                  return { ...item, mark: 0 };
              }
          })
      );
    */
      // [Rest of your existing code...]
      // 4. Calculate total marks
      const totalMarks = evaluatedAnswers.reduce((sum, item) => sum + item.mark, 0);

      // 5. Insert answers with AI-evaluated marks
      const insertAnswersSql = `
          INSERT INTO subjective_answer 
          (question_id, student_regno, answer, mark) 
          VALUES ?
      `;
      const answerValues = evaluatedAnswers.map(item => [
          item.question_id,
          req.params.regno,
          item.answer,
          item.mark
      ]);
      
      await db.query(insertAnswersSql, [answerValues]);

      // 6. Update results
      const updateResultSql = `
          INSERT INTO subjective_result 
          (subjective_id, student_regno, total_mark) 
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE total_mark = ?
      `;
      await db.query(updateResultSql, [
          req.params.subjective_id,
          req.params.regno,
          totalMarks,
          totalMarks
      ]);

      // // 7. Update exam result
      // const examResultSql = `
      //     INSERT INTO exam_result 
      //     (exam_id, student_regno, quiz_mark, subjective_mark) 
      //     VALUES (?, ?, ?, ?)
      //     ON DUPLICATE KEY UPDATE subjective_mark = ?
      // `;
      // const quizMark = req.params.quiz_id && req.params.quiz_id != 0 ? -1 : -2;
      // await db.query(examResultSql, [
      //     req.params.exam_id,
      //     req.params.regno,
      //     quizMark,
      //     totalMarks,
      //     totalMarks
      // ]);
      if(req.params.quiz_id == null || req.params.quiz_id==0){
        console.log(req.params.exam_id)
        console.log(req.params.regno)

        
        const sql2 = "insert into exam_result (exam_id,student_regno,quiz_mark,subjective_mark,total) values (?,?,?,?,?)";
        const value2=[req.params.exam_id,req.params.regno,-1,totalMarks,totalMarks];
        db.query(sql2,value2,(err,result)=>{
            if(err)
                console.log("Error inserting to result")
        })
    }
    else{
      console.log("first")
        //no need because quiz already enters attended details in exam details table and nothing to change as mark is 0
        const sql3 = "update exam_result set subjective_mark=?,total=quiz_mark+? where student_regno=? and exam_id=?"
        const value3=[totalMarks,totalMarks,req.params.regno,req.params.exam_id];
        db.query(sql3,value3,(err,result)=>{
            if(err)
                console.log("Error inserting to resultsd    ")
        })
    }
      res.json({ 
          success: true,
          message: 'Answers evaluated and saved successfully',
          totalMarks 
      });
  } catch (err) {
      console.error("Error:", err);
      res.status(500).json({ success: false, message: 'Evaluation failed' });
  }
});
/*
app.post('/attemptSubjective/:regno/:subjective_id/:quiz_id/:exam_id', async (req, res) => {
    try {
        // 1. First get all questions with their max marks
        const getQuestionsSql = `
            SELECT question_id, question_title, mark 
            FROM subjective_questions 
            WHERE subjective_id = ?
        `;
        
        const [questions] = await db.promise().query(getQuestionsSql, [req.params.subjective_id]);
        
        // 2. Prepare answers with their corresponding questions
        const answersWithQuestions = req.body.map(answer => {
            const question = questions.find(q => q.question_id === answer.question_id);
            return {
                ...answer,
                question_text: question?.question_title || '',
                max_mark: question?.mark || 0
            };
        });

        // 3. Evaluate each answer using AI
        const evaluatedAnswers = await Promise.all(
            answersWithQuestions.map(async (item) => {
                if (item.max_mark <= 0) return { ...item, mark: 0 };
                
                try {
                    const prompt = `
                        You are an expert exam evaluator. Evaluate this answer based on the question and provide a score from 0 to ${item.max_mark}.
                        
                        Question: ${item.question_text}
                        Answer: ${item.answer}
                        
                        Evaluation criteria:
                        - Accuracy of content (50%)
                        - Completeness of response (30%)
                        - Clarity and organization (20%)
                        
                        Provide ONLY the numeric score between 0 and ${item.max_mark}, nothing else.
                    `;
                    
                    const aiResponse = await openai.createCompletion({
                        model: "text-davinci-003",
                        prompt: prompt,
                        max_tokens: 5,
                        temperature: 0.3
                    });
                    
                    // Extract numeric score from AI response
                    const aiScore = parseFloat(aiResponse.data.choices[0].text.trim());
                    const finalMark = Math.min(Math.max(0, aiScore), item.max_mark); // Clamp between 0-max
                    
                    return { ...item, mark: finalMark };
                } catch (aiError) {
                    console.error("AI evaluation failed:", aiError);
                    return { ...item, mark: 0 }; // Fallback to 0 if AI fails
                }
            })
        );

        // 4. Calculate total marks
        const totalMarks = evaluatedAnswers.reduce((sum, item) => sum + item.mark, 0);

        // 5. Insert answers with AI-evaluated marks
        const insertAnswersSql = `
            INSERT INTO subjective_answer 
            (question_id, student_regno, answer, mark) 
            VALUES ?
        `;
        const answerValues = evaluatedAnswers.map(item => [
            item.question_id,
            req.params.regno,
            item.answer,
            item.mark
        ]);
        
        await db.promise().query(insertAnswersSql, [answerValues]);

        // 6. Update results
        const updateResultSql = `
            INSERT INTO subjective_result 
            (subjective_id, student_regno, total_mark) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE total_mark = ?
        `;
        await db.promise().query(updateResultSql, [
            req.params.subjective_id,
            req.params.regno,
            totalMarks,
            totalMarks
        ]);

        // 7. Update exam result
        const examResultSql = `
            INSERT INTO exam_result 
            (exam_id, student_regno, quiz_mark, subjective_mark) 
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE subjective_mark = ?
        `;
        const quizMark = req.params.quiz_id && req.params.quiz_id != 0 ? -1 : -2;
        await db.promise().query(examResultSql, [
            req.params.exam_id,
            req.params.regno,
            quizMark,
            totalMarks,
            totalMarks
        ]);

        res.json({ 
            success: true,
            message: 'Answers evaluated and saved successfully',
            totalMarks 
        });

    } catch (err) {
        console.error("Error in subjective answer submission:", err);
        res.status(500).json({ 
            success: false,
            message: 'An error occurred during evaluation'
        });
    }
});*/
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

    sql = "SELECT distinct * FROM subjective_result inner join users on subjective_result.student_regno = users.user_regno where subjective_result.subjective_id=? ";
    db.query(sql,[req.body.subjective_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/getBothAttendees',(req,res)=>{
    sql = "SELECT distinct users.user_name,users.user_regno,quiz_result.total_mark as qtotal,exam.subjective_id,exam.exam_id FROM exam inner join quiz_result on quiz_result.quiz_id = exam.quiz_id inner join users on users.user_regno=quiz_result.student_regno where exam.exam_id=?";
    // sql = "SELECT distinct users.user_name,users.user_regno,quiz_result.total_mark as qtotal,subjective_result.total_mark as stotal,exam.subjective_id,exam.exam_id FROM exam inner join quiz_result on quiz_result.quiz_id = exam.quiz_id inner join subjective_result on subjective_result.subjective_id=exam.subjective_id inner join users on quiz_result.student_regno=users.user_regno where exam.exam_id=?";
    // sql="SELECT users.user_name,users.user_regno,MAX(quiz_result.total_mark) AS qtotal,MAX(subjective_result.total_mark) AS stotal,exam.subjective_id,exam.exam_id FROM exam INNER JOIN quiz_result ON quiz_result.quiz_id = exam.quiz_id INNER JOIN subjective_result ON subjective_result.subjective_id =exam.subjective_id INNER JOIN users ON quiz_result.student_regno = users.user_regno WHERE exam.exam_id =? GROUP BY users.user_name, users.user_regno, exam.subjective_id, exam.exam_id;";
    db.query(sql,[req.body.exam_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/getBothAttendeesandMark', async (req,res)=>{
    const { exam_id } = req.body;

    try {
        // Fetch both attendees based on exam_id
        const attendees = await db.query("SELECT distinct users.user_name,users.user_regno,quiz_result.total_mark as qtotal,exam.subjective_id,exam.exam_id FROM exam inner join quiz_result on quiz_result.quiz_id = exam.quiz_id inner join users on users.user_regno=quiz_result.student_regno where exam.exam_id=?",[exam_id]);
        
        // Fetch marks for each attendee
        const markPromises = attendees.map(async (item) => {
            const [markResult] = await db.query(
                'SELECT total_mark from subjective_result where subjective_id = ? and student_regno=?' ,
                [item.subjective_id, item.user_regno]
            );
            return { [item.user_regno]: markResult ? markResult.total_mark : null };
        });

        const marks = await Promise.all(markPromises);

        // Combine attendees and marks into a single response object
        const marksObject = marks.reduce((acc, curr) => ({ ...acc, ...curr }), {});

        res.json({ attendees, marks: marksObject });
    } catch (err) {
        console.error("Error fetching attendees or marks:", err);
        res.status(500).send('Server error');
    }
})

app.post('/getBoth', async (req, res) => {
    const sqlExam = `
        SELECT DISTINCT users.user_name, users.user_regno, quiz_result.total_mark AS qtotal,
        exam.subjective_id, exam.exam_id 
        FROM exam 
        INNER JOIN quiz_result ON quiz_result.quiz_id = exam.quiz_id 
        INNER JOIN users ON users.user_regno = quiz_result.student_regno 
        WHERE exam.exam_id = ?`;
    const valuesExam = [req.body.examid];

    try {
        db.query(sqlExam, valuesExam, async (err, result) => {
            if (err) {
                return res.json({ message: 'Error fetching exam data: ' + err });
            }

            // Ensure `result` is an array
            const markPromises = result.map(async (item) => {
                return new Promise((resolve, reject) => {
                    db.query(
                        'SELECT total_mark FROM subjective_result WHERE subjective_id = ? AND student_regno = ?',
                        [item.subjective_id, item.user_regno],
                        (err, markResult) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve({ [item.user_regno]: markResult[0] ? markResult[0].total_mark : null });
                            }
                        }
                    );
                });
            });

            try {
                const marks = await Promise.all(markPromises);
                const marksObject = marks.reduce((acc, curr) => ({ ...acc, ...curr }), {});

                res.json({ attendees: result, marks: marksObject });
            } catch (markErr) {
                console.error('Error fetching marks:', markErr);
                res.status(500).json({ message: 'Error fetching marks: ' + markErr });
            }
        });
    } catch (outerErr) {
        console.error('Server error:', outerErr);
        res.status(500).json({ message: 'Server error: ' + outerErr });
    }
});


app.post('/getMark',(req,res)=>{
    sql = "SELECT * from subjective_result where subjective_id = ? and student_regno=?";
    db.query(sql,[req.body.sub_id,req.body.regno],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/fetchSubjectiveAnswers',(req,res)=>{

    sql = "select subjective_answer.student_regno,subjective_answer.answer,subjective_questions.question_id,subjective_answer.mark as currentmark,subjective_questions.question_title,subjective_questions.mark as maxmark from subjective_answer inner join subjective_questions on subjective_answer.question_id = subjective_questions.question_id where subjective_answer.student_regno=? and subjective_questions.subjective_id=?";
    db.query(sql,[req.body.regno,req.body.subjective_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})
/*
app.post('/addMark/:regno/:subjective_id/', (req, res) => {
    // const sql = "INSERT INTO `quiz_questions` (`quiz_id`. `question_title`, `option1`, `option2`, `option3`, `option4`, `answer`) VALUES ?";
    // Transform each question in `req.body` into an array of value
    const values = req.body.map(question => [
        question.question_id,
        req.params.regno,
        question.mark,
    ]);
    let total=0
    values.forEach(question => {
        total=total+values[2]
      });
    const sql = "update subjective_answer set mark =? where question_id =? and student_regno=?";

    db.query(sql, [values], (err, result) => {
        if (err) {
            console.log("Error updating marks:", err);
            return res.json({ message: 'An error occurred: ' + err });
        }
        else{
            const sql2 = "update subjective_result set total_mark=? where subjective_id =? and student_regno=?";
            const value2=[total,req.params.subjective_id,req.params.regno];
            db.query(sql2,value2,(err,result)=>{
                if(err)
                    console.log("Error updating to result")
            })
        }
        
        return res.json({ message: 'mark added successfully' });
    });
});
*/
app.post('/addMarks/:regno/:subjective_id/:exam_id', (req, res) => {
    const values = req.body.map(question => [
        question.question_id,
        req.params.regno,
        question.mark,
    ]);
    
    let total = 0;
    // values.forEach(question => {
    //     total += parseInt(question[2],10);// Access marks correctly
    // });
    values.forEach(q =>{
        total = total +parseInt(q[2],10)
    })

    const sql = "UPDATE subjective_answer SET mark = ? WHERE question_id = ? AND student_regno = ?";

    // Execute each update sequentially
    let updateCount = 0;
    values.forEach(([question_id, regno, mark]) => {
        db.query(sql, [mark, question_id, regno], (err, result) => {
            if (err) {
                console.log("Error updating marks:", err);
                return res.status(500).json({ message: 'An error occurred: ' + err });
            }

            updateCount++;
            if (updateCount === values.length) {
                // Once all updates are done, update the total mark
                const sql2 = "UPDATE subjective_result SET total_mark = ? WHERE subjective_id = ? AND student_regno = ?";
                const value2 = [total, req.params.subjective_id, req.params.regno];
                
                db.query(sql2, value2, (err, result) => {
                    if (err) {
                        console.log("Error updating to result:", err);
                        return res.status(500).json({ message: 'An error occurred: ' + err });
                    }

                    return res.json({ message: 'Marks added successfully' });
                });
                const sql3 = "UPDATE exam_result SET subjective_mark = ? WHERE exam_id = ? AND student_regno = ?";
                const value3 = [total, req.params.exam_id, req.params.regno];
                
                db.query(sql3, value3, (err, result) => {
                    if (err) {
                        console.log("Error updating to exam result:", err);
                        return res.status(500).json({ message: 'An error occurred: ' + err });
                    }

                    return res.json({ message: 'Marks added successfully' });
                });

            }
        });
    });
});

app.post('/addMark/:regno/:subjective_id/:exam_id', (req, res) => {
    const values = req.body.map(question => [
        question.question_id,
        req.params.regno,
        question.mark,
    ]);

    let total = 0;
    values.forEach(q => {
        total += parseInt(q[2], 10);
    });

    const sql = "UPDATE subjective_answer SET mark = ? WHERE question_id = ? AND student_regno = ?";
    const updatePromises = values.map(([question_id, regno, mark]) => {
        return new Promise((resolve, reject) => {
            db.query(sql, [mark, question_id, regno], (err, result) => {
                if (err) {
                    console.error("Error updating marks:", err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });

    Promise.all(updatePromises)
        .then(() => {
            const sql2 = "UPDATE subjective_result SET total_mark = ? WHERE subjective_id = ? AND student_regno = ?";
            const value2 = [total, req.params.subjective_id, req.params.regno];
            db.query(sql2, value2, (err, result) => {
                if (err) {
                    console.error("Error updating total mark in subjective_result:", err);
                    return res.status(500).json({ message: 'An error occurred: ' + err });
                }

                const sql3 = "UPDATE exam_result SET subjective_mark = ? WHERE exam_id = ? AND student_regno = ?";
                const value3 = [total, req.params.exam_id, req.params.regno];
                db.query(sql3, value3, (err, result) => {
                    if (err) {
                        console.error("Error updating exam result:", err);
                        return res.status(500).json({ message: 'An error occurred: ' + err });
                    }

                    return res.json({ message: 'Marks added successfully' });
                });
            });
        })
        .catch(err => {
            console.error("Error in updating marks sequentially:", err);
            return res.status(500).json({ message: 'An error occurred: ' + err });
        });
});


app.post('/getStudentDetails',(req,res)=>{
    sql="SELECT * FROM `users` inner join student on users.user_id = student.student_id where users.user_regno = ?";
    db.query(sql,[req.body.user_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/fetchHistory',(req,res)=>{
    sql="SELECT * FROM exam_result INNER join exam on exam_result.exam_id =exam.exam_id inner join subject on subject.subject_id=exam.subject_id where exam_result.student_regno=?";
    db.query(sql,[req.body.regno],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/getStudents',(req,res)=>{
    sql="SELECT * FROM `users` inner join student on student.student_id = users.user_id inner join course on course.course_id = student.course_id where users.inst_id = ?";
    db.query(sql,[req.body.inst_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/deleteStudent',(req,res)=>{   
    sql="DELETE FROM `student` WHERE `student_id`=?";
    db.query(sql,[req.body.id],(err,result)=>{
        if(err) return res.json({message:'Something has Occured' + err})
        else{
            const sql2 ="delete from users where user_id =?";
            db.query(sql2,[req.body.id],(err,res)=>{
                if(err) return res.json({message:'something has occured'})
            })
        }
        return res.json({message: 'Student Deleted successfully' })
    })
})

app.post('/fetchTeachers',(req,res)=>{
    sql="SELECT * FROM `users` inner join teacher on teacher.teacher_id = users.user_id inner join department on department.dept_id = teacher.dept_id where users.inst_id = ?";
    db.query(sql,[req.body.inst_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/deleteTeacher',(req,res)=>{   
    sql="DELETE FROM `teacher` WHERE `teacher_id`=?";
    db.query(sql,[req.body.id],(err,result)=>{
        if(err) return res.json({message:'Something has Occured' + err})
        else{
            const sql1 ="delete from subject_assignment where teacher_id =?";
            db.query(sql1,[req.body.id],(err,res)=>{
                if(err) return res.json({message:'something has occured'})
            })
            const sql2 ="delete from exam where teacher_id =?";
            db.query(sql2,[req.body.id],(err,res)=>{
                if(err) return res.json({message:'something has occured'})
            })
            const sql3 ="delete from users where user_id =?";
            db.query(sql3,[req.body.id],(err,res)=>{
                if(err) return res.json({message:'something has occured'})
            })
        }
        return res.json({message: 'Teacher Deleted successfully' })
    })
})

app.post('/getAllExams',(req,res)=>{
    sql="SELECT exam.exam_id,exam.quiz_id,exam.subjective_id,exam.exam_name,exam.description,users.user_name,course.course_name,subject.subject_name,exam.starting_date FROM `exam` inner join subject on subject.subject_id = exam.subject_id inner join course on course.course_id = subject.course_id inner join users on users.user_id = exam.teacher_id inner join teacher on teacher.teacher_id = users.user_id inner join department on department.dept_id = teacher.dept_id where department.inst_id=?";
    db.query(sql,[req.body.inst_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/getStudentsByDepartment',(req,res)=>{
    sql="select * from users inner join student on student.student_id = users.user_id inner join course on course.course_id = student.course_id INNER join department on department.dept_id = course.dept_id where course.dept_id =?";
    db.query(sql,[req.body.dept_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})

app.post('/getAssignedSubjects',(req,res)=>{
    sql="SELECT * FROM `subject_assignment` inner join subject on subject.subject_id = subject_assignment.subject_id inner join course on course.course_id = subject.course_id where subject_assignment.teacher_id=?";
    db.query(sql,[req.body.user_id],(err,result)=>{
        if(err)
            return res.json({message:'Some Error Occured' + err})
        return res.json(result)
    })
})


// Get exam details
app.get('/exams/:examId', (req, res) => {
    const examId = req.params.examId;
    const sql = `
      SELECT e.exam_id, e.exam_name, e.description, e.starting_date, e.ending_date, e.duration, s.subject_name
      FROM exam e
      JOIN subject s ON e.subject_id = s.subject_id
      WHERE e.exam_id = ?
    `;
    db.query(sql, [examId], (err, data) => {
      if (err) {
        console.error('Error fetching exam:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (data.length > 0) {
        return res.json(data[0]);
      } else {
        return res.status(404).json({ error: 'Exam not found' });
      }
    });
  });
  
  // Update exam
  app.put('/exams/:examId', (req, res) => {
    const examId = req.params.examId;
    const { exam_name, description, starting_date, ending_date, duration } = req.body;
    const sql = `
      UPDATE exam
      SET exam_name = ?, description = ?, starting_date = ?, ending_date = ?, duration = ?
      WHERE exam_id = ?
    `;
    db.query(sql, [exam_name, description, starting_date, ending_date, duration, examId], (err, result) => {
      if (err) {
        console.error('Error updating exam:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (result.affectedRows > 0) {
        return res.json({ message: 'Exam updated successfully' });
      } else {
        return res.status(404).json({ error: 'Exam not found' });
      }
    });
  });
  
  // Delete exam
  app.delete('/exams/:examId', (req, res) => {
    const examId = req.params.examId;
    const sql = 'DELETE FROM exam WHERE exam_id = ?';
    db.query(sql, [examId], (err, result) => {
      if (err) {
        console.error('Error deleting exam:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (result.affectedRows > 0) {
        return res.json({ message: 'Exam deleted successfully' });
      } else {
        return res.status(404).json({ error: 'Exam not found' });
      }
    });
  });
  // Get quiz questions for an exam
app.get('/exams/:examId/quiz/questions', (req, res) => {
    const examId = req.params.examId;
    const sql = `
      SELECT qq.question_id, qq.question_title, qq.option1, qq.option2, qq.option3, qq.option4, qq.answer
      FROM quiz q
      JOIN quiz_questions qq ON q.quiz_id = qq.quiz_id
      WHERE q.exam_id = ?
    `;
    db.query(sql, [examId], (err, data) => {
      if (err) {
        console.error('Error fetching quiz questions:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      return res.json(data);
    });
  });
  /*
  // Add a new quiz question
  app.post('/exams/:examId/quiz/questions', (req, res) => {
    const examId = req.params.examId;
    const { question_title, option1, option2, option3, option4, answer } = req.body;
  
    // First, get the quiz_id for the exam
    const getQuizSql = 'SELECT quiz_id FROM quiz WHERE exam_id = ?';
    db.query(getQuizSql, [examId], (err, quizData) => {
      if (err) {
        console.error('Error fetching quiz:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (quizData.length === 0) {
        return res.status(404).json({ error: 'Quiz not found for this exam' });
      }
      const quizId = quizData[0].quiz_id;
  
      const sql = `
        INSERT INTO quiz_questions (quiz_id, question_title, option1, option2, option3, option4, answer)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(sql, [quizId, question_title, option1, option2, option3, option4, answer], (err, result) => {
        if (err) {
          console.error('Error adding question:', err);
          return res.status(500).json({ error: 'Server error' });
        }
        return res.json({ message: 'Question added successfully', question_id: result.insertId });
      });
    });
  });
  */
 // Add a new quiz question and increment qno_of_questions
app.post('/exams/:examId/quiz/questions', (req, res) => {
    const examId = req.params.examId;
    const { question_title, option1, option2, option3, option4, answer } = req.body;
  
    // Start a transaction
    db.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).json({ error: 'Server error' });
      }
  
      // Step 1: Get the quiz_id for the exam
      const getQuizSql = 'SELECT quiz_id FROM quiz WHERE exam_id = ?';
      db.query(getQuizSql, [examId], (err, quizData) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error fetching quiz:', err);
            res.status(500).json({ error: 'Server error' });
          });
        }
        if (quizData.length === 0) {
          return db.rollback(() => {
            res.status(404).json({ error: 'Quiz not found for this exam' });
          });
        }
        const quizId = quizData[0].quiz_id;
  
        // Step 2: Insert the new question
        const insertSql = `
          INSERT INTO quiz_questions (quiz_id, question_title, option1, option2, option3, option4, answer)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(insertSql, [quizId, question_title, option1, option2, option3, option4, answer], (err, result) => {
          if (err) {
            return db.rollback(() => {
              console.error('Error adding question:', err);
              res.status(500).json({ error: 'Server error' });
            });
          }
          const questionId = result.insertId;
  
          // Step 3: Increment qno_of_questions in quiz table
          const updateSql = `
            UPDATE quiz
            SET qno_of_questions = qno_of_questions + 1
            WHERE quiz_id = ?
          `;
          db.query(updateSql, [quizId], (err, updateResult) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error updating qno_of_questions:', err);
                res.status(500).json({ error: 'Server error' });
              });
            }
  
            // Commit the transaction
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error('Error committing transaction:', err);
                  res.status(500).json({ error: 'Server error' });
                });
              }
              res.json({ message: 'Question added successfully', question_id: questionId });
            });
          });
        });
      });
    });
  });
  // Update a quiz question
  app.put('/exams/:examId/quiz/questions/:questionId', (req, res) => {
    const questionId = req.params.questionId;
    const { question_title, option1, option2, option3, option4, answer } = req.body;
    const sql = `
      UPDATE quiz_questions
      SET question_title = ?, option1 = ?, option2 = ?, option3 = ?, option4 = ?, answer = ?
      WHERE question_id = ?
    `;
    db.query(sql, [question_title, option1, option2, option3, option4, answer, questionId], (err, result) => {
      if (err) {
        console.error('Error updating question:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (result.affectedRows > 0) {
        return res.json({ message: 'Question updated successfully' });
      } else {
        return res.status(404).json({ error: 'Question not found' });
      }
    });
  });
  
  // Delete a quiz question
//   app.delete('/exams/:examId/quiz/questions/:questionId', (req, res) => {
//     const questionId = req.params.questionId;
//     const sql = 'DELETE FROM quiz_questions WHERE question_id = ?';
//     db.query(sql, [questionId], (err, result) => {
//       if (err) {
//         console.error('Error deleting question:', err);
//         return res.status(500).json({ error: 'Server error' });
//       }
//       if (result.affectedRows > 0) {
//         return res.json({ message: 'Question deleted successfully' });
//       } else {
//         return res.status(404).json({ error: 'Question not found' });
//       }
//     });
//   });
// Delete a quiz question and decrement qno_of_questions
app.delete('/exams/:examId/quiz/questions/:questionId', (req, res) => {
    const examId = req.params.examId;
    const questionId = req.params.questionId;
  
    // Start a transaction
    db.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).json({ error: 'Server error' });
      }
  
      // Step 1: Get the quiz_id for the exam
      const getQuizSql = 'SELECT quiz_id FROM quiz WHERE exam_id = ?';
      db.query(getQuizSql, [examId], (err, quizData) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error fetching quiz:', err);
            res.status(500).json({ error: 'Server error' });
          });
        }
        if (quizData.length === 0) {
          return db.rollback(() => {
            res.status(404).json({ error: 'Quiz not found for this exam' });
          });
        }
        const quizId = quizData[0].quiz_id;
  
        // Step 2: Delete the question
        const deleteSql = 'DELETE FROM quiz_questions WHERE question_id = ? AND quiz_id = ?';
        db.query(deleteSql, [questionId, quizId], (err, result) => {
          if (err) {
            return db.rollback(() => {
              console.error('Error deleting question:', err);
              res.status(500).json({ error: 'Server error' });
            });
          }
          if (result.affectedRows === 0) {
            return db.rollback(() => {
              res.status(404).json({ error: 'Question not found' });
            });
          }
  
          // Step 3: Decrement qno_of_questions in quiz table
          const updateSql = `
            UPDATE quiz
            SET qno_of_questions = qno_of_questions - 1
            WHERE quiz_id = ? AND qno_of_questions > 0
          `;
          db.query(updateSql, [quizId], (err, updateResult) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error updating qno_of_questions:', err);
                res.status(500).json({ error: 'Server error' });
              });
            }
  
            // Commit the transaction
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error('Error committing transaction:', err);
                  res.status(500).json({ error: 'Server error' });
                });
              }
              res.json({ message: 'Question deleted successfully' });
            });
          });
        });
      });
    });
  });

  // Get subjective questions for an exam
app.get('/exams/:examId/subjective/questions', (req, res) => {
    const examId = req.params.examId;
    const sql = `
      SELECT sq.question_id, sq.question_title, sq.mark
      FROM subjective s
      JOIN subjective_questions sq ON s.subjective_id = sq.subjective_id
      WHERE s.exam_id = ?
    `;
    db.query(sql, [examId], (err, data) => {
      if (err) {
        console.error('Error fetching subjective questions:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      return res.json(data);
    });
  });
  

 // Add a new subjective question and increment sno_of_questions
app.post('/exams/:examId/subjective/questions', (req, res) => {
    const examId = req.params.examId;
    const { question_title, mark } = req.body;
  
    // Start a transaction
    db.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).json({ error: 'Server error' });
      }
  
      // Step 1: Get the subjective_id for the exam
      const getSubjectiveSql = 'SELECT subjective_id FROM subjective WHERE exam_id = ?';
      db.query(getSubjectiveSql, [examId], (err, subjectiveData) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error fetching subjective:', err);
            res.status(500).json({ error: 'Server error' });
          });
        }
        if (subjectiveData.length === 0) {
          return db.rollback(() => {
            res.status(404).json({ error: 'Subjective section not found for this exam' });
          });
        }
        const subjectiveId = subjectiveData[0].subjective_id;
  
        // Step 2: Insert the new question
        const insertSql = `
          INSERT INTO subjective_questions (subjective_id, question_title, mark)
          VALUES (?, ?, ?)
        `;
        db.query(insertSql, [subjectiveId, question_title, mark], (err, result) => {
          if (err) {
            return db.rollback(() => {
              console.error('Error adding question:', err);
              res.status(500).json({ error: 'Server error' });
            });
          }
          const questionId = result.insertId;
  
          // Step 3: Increment sno_of_questions in subjective table
          const updateSql = `
            UPDATE subjective
            SET sno_of_questions = sno_of_questions + 1
            WHERE subjective_id = ?
          `;
          db.query(updateSql, [subjectiveId], (err, updateResult) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error updating sno_of_questions:', err);
                res.status(500).json({ error: 'Server error' });
              });
            }
  
            // Commit the transaction
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error('Error committing transaction:', err);
                  res.status(500).json({ error: 'Server error' });
                });
              }
              res.json({ message: 'Question added successfully', question_id: questionId });
            });
          });
        });
      });
    });
  });
  // Update a subjective question
  app.put('/exams/:examId/subjective/questions/:questionId', (req, res) => {
    const questionId = req.params.questionId;
    const { question_title, mark } = req.body;
    const sql = `
      UPDATE subjective_questions
      SET question_title = ?, mark = ?
      WHERE question_id = ?
    `;
    db.query(sql, [question_title, mark, questionId], (err, result) => {
      if (err) {
        console.error('Error updating question:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (result.affectedRows > 0) {
        return res.json({ message: 'Question updated successfully' });
      } else {
        return res.status(404).json({ error: 'Question not found' });
      }
    });
  });
  
// Delete a subjective question and decrement sno_of_questions
app.delete('/exams/:examId/subjective/questions/:questionId', (req, res) => {
    const examId = req.params.examId;
    const questionId = req.params.questionId;
  
    // Start a transaction
    db.beginTransaction((err) => {
      if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).json({ error: 'Server error' });
      }
  
      // Step 1: Get the subjective_id for the exam
      const getSubjectiveSql = 'SELECT subjective_id FROM subjective WHERE exam_id = ?';
      db.query(getSubjectiveSql, [examId], (err, subjectiveData) => {
        if (err) {
          return db.rollback(() => {
            console.error('Error fetching subjective:', err);
            res.status(500).json({ error: 'Server error' });
          });
        }
        if (subjectiveData.length === 0) {
          return db.rollback(() => {
            res.status(404).json({ error: 'Subjective section not found for this exam' });
          });
        }
        const subjectiveId = subjectiveData[0].subjective_id;
  
        // Step 2: Delete the question
        const deleteSql = 'DELETE FROM subjective_questions WHERE question_id = ? AND subjective_id = ?';
        db.query(deleteSql, [questionId, subjectiveId], (err, result) => {
          if (err) {
            return db.rollback(() => {
              console.error('Error deleting question:', err);
              res.status(500).json({ error: 'Server error' });
            });
          }
          if (result.affectedRows === 0) {
            return db.rollback(() => {
              res.status(404).json({ error: 'Question not found' });
            });
          }
  
          // Step 3: Decrement sno_of_questions in subjective table
          const updateSql = `
            UPDATE subjective
            SET sno_of_questions = sno_of_questions - 1
            WHERE subjective_id = ? AND sno_of_questions > 0
          `;
          db.query(updateSql, [subjectiveId], (err, updateResult) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error updating sno_of_questions:', err);
                res.status(500).json({ error: 'Server error' });
              });
            }
  
            // Commit the transaction
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error('Error committing transaction:', err);
                  res.status(500).json({ error: 'Server error' });
                });
              }
              res.json({ message: 'Question deleted successfully' });
            });
          });
        });
      });
    });
  });
// Get teacher profile
app.get('/teacher/profile/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = `
      SELECT user_id, user_name, user_email, user_phno,user_dob,user_gender
      FROM users
      WHERE user_id = ? AND user_type = 'teacher'
    `;
    db.query(sql, [userId], (err, data) => {
      if (err) {
        console.error('Error fetching teacher profile:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (data.length > 0) {
        return res.json(data[0]);
      } else {
        return res.status(404).json({ error: 'Teacher profile not found' });
      }
    });
  });
  
  // Update teacher profile
  app.put('/teacher/profile/:userId', (req, res) => {
    const userId = req.params.userId;
    const { username, email, phone } = req.body;
    const sql = `
      UPDATE users
      SET user_name = ?, user_email = ?, user_phno = ?
      WHERE user_id = ? AND user_type = 'teacher'
    `;
    db.query(sql, [username, email, phone, userId], (err, result) => {
      if (err) {
        console.error('Error updating teacher profile:', err);
        return res.status(500).json({ error: 'Server error' });
      }
      if (result.affectedRows > 0) {
        return res.json({ message: 'Profile updated successfully' });
      } else {
        return res.status(404).json({ error: 'Teacher profile not found' });
      }
    });
  });
  /*
// Get students attempting the exam
app.get("/teacher/exam/:examId/students", (req, res) => {
    const examId = req.params.examId;
    const sql = `
      SELECT DISTINCT u.user_id, u.username
      FROM users u
      JOIN exam_attempts ea ON u.user_id = ea.student_id
      WHERE ea.exam_id = ? AND u.user_type = 'student'
    `;
    db.query(sql, [examId], (err, data) => {
      if (err) {
        console.error("Error fetching students:", err);
        return res.status(500).json({ error: "Server error" });
      }
      return res.json(data);
    });
  });
  
  // WebSocket for live video streaming
  wss.on("connection", (ws, req) => {
    const [_, examId, studentId] = req.url.split("/").filter(Boolean); // Parse /video/:examId/:studentId
    console.log(`WebSocket connection for exam ${examId}, student ${studentId}`);
  
    // Simulate live video feed (replace with actual camera feed logic)
    const sendFrame = () => {
      const frame = Buffer.from(" Simulated frame data "); // Placeholder for actual video frame
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(frame);
      }
    };
  
    const interval = setInterval(sendFrame, 1000); // Send frame every second
  
    ws.on("close", () => {
      clearInterval(interval);
      console.log(`WebSocket closed for student ${studentId}`);
    });
  
    ws.on("error", (err) => {
      console.error(`WebSocket error for student ${studentId}:`, err);
    });
  });*/
// Store active students per exam
const activeStudents = new Map(); // Map<examId, Set<user_id>>

// WebSocket for student presence and video
wss.on("connection", (ws, req) => {
  const urlParts = req.url.split("/").filter(Boolean);
  const [type, examId, userId] = urlParts;

  if (type === "student") {
    // Student connects to indicate presence
    if (!activeStudents.has(examId)) {
      activeStudents.set(examId, new Set());
    }
    activeStudents.get(examId).add(userId);

    // Fetch student details
    const sql = "SELECT user_id, username FROM users WHERE user_id = ? AND user_type = 'student'";
    db.query(sql, [userId], (err, data) => {
      if (err) console.error("Error fetching student:", err);
      else if (data.length > 0) {
        const student = data[0];
        // Notify all teacher clients for this exam
        wss.clients.forEach((client) => {
          if (
            client.readyState === WebSocket.OPEN &&
            client.url === `/teacher/exam/${examId}/live`
          ) {
            const students = Array.from(activeStudents.get(examId)).map((id) => ({
              user_id: id,
              username: student.username,
            }));
            client.send(JSON.stringify(students));
          }
        });
      }
    });

    ws.on("close", () => {
      activeStudents.get(examId)?.delete(userId);
      if (activeStudents.get(examId)?.size === 0) activeStudents.delete(examId);
      // Notify teachers of updated student list
      wss.clients.forEach((client) => {
        if (
          client.readyState === WebSocket.OPEN &&
          client.url === `/teacher/exam/${examId}/live`
        ) {
          const students = Array.from(activeStudents.get(examId) || []).map((id) => ({
            user_id: id,
            username: student.username, // Note: This assumes username persists; adjust if needed
          }));
          client.send(JSON.stringify(students));
        }
      });
    });
  } else if (type === "video") {
    // Simulate video feed for student
    const interval = setInterval(() => {
      const frame = Buffer.from(" Simulated frame data "); // Placeholder
      if (ws.readyState === WebSocket.OPEN) ws.send(frame);
    }, 1000);
    ws.on("close", () => clearInterval(interval));
  } else if (type === "teacher") {
    // Teacher connects to monitor live students
    ws.url = req.url; // Store URL for filtering
    ws.on("open", () => {
      const students = Array.from(activeStudents.get(examId) || []).map((id) => ({
        user_id: id,
        username: "Unknown", // Placeholder; fetch from DB if needed
      }));
      ws.send(JSON.stringify(students));
    });
  }
});
// Get result statistics for an exam

// router.get('/api/exam-analysis/:exam_id', async (req, res) => {
//   try {
//       const examId = req.params.exam_id;

//       // Basic statistics
//       const [stats] = await db.query(`
//           SELECT 
//               COUNT(*) as total_students,
//               AVG(total) as average_score,
//               MAX(total) as top_score,
//               MIN(total) as lowest_score,
//               SUM(CASE WHEN total >= 50 THEN 1 ELSE 0 END) as pass_count,
//               SUM(CASE WHEN total < 50 THEN 1 ELSE 0 END) as fail_count
//           FROM exam_result
//           WHERE exam_id = ?
//       `, [examId]);

//       // Score distribution for histogram
//       const [distribution] = await db.query(`
//           SELECT 
//               FLOOR(total/10)*10 as score_range,
//               COUNT(*) as student_count
//           FROM exam_result
//           WHERE exam_id = ?
//           GROUP BY FLOOR(total/10)*10
//           ORDER BY score_range
//       `, [examId]);

//       // Top performers
//       const [topPerformers] = await db.query(`
//           SELECT student_regno, total
//           FROM exam_result
//           WHERE exam_id = ?
//           ORDER BY total DESC
//           LIMIT 5
//       `, [examId]);

//       res.json({
//           success: true,
//           data: {
//               ...stats[0],
//               distribution,
//               topPerformers
//           }
//       });
//   } catch (err) {
//       console.error(err);
//       res.status(500).json({ success: false, message: 'Failed to fetch analysis' });
//   }
// });

// // Get list of exams for dropdown
// router.get('/api/exams', async (req, res) => {
//   try {
//       const [exams] = await db.query('SELECT DISTINCT exam_id FROM exam_result ORDER BY exam_id DESC');
//       res.json({ success: true, data: exams });
//   } catch (err) {
//       console.error(err);
//       res.status(500).json({ success: false, message: 'Failed to fetch exams' });
//   }
// });

// module.exports = router;
// Result Analysis Endpoints
app.get('/exams', (req, res) => {
  const sql = "SELECT DISTINCT exam_id FROM exam_result ORDER BY exam_id DESC";
  db.query(sql, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
  });
});

app.get('/exam-analysis/:exam_id', (req, res) => {
  const examId = req.params.exam_id;
  
  // Query for basic statistics
  const statsSql = `
      SELECT 
          COUNT(*) as total_students,
          AVG(total) as average_score,
          MAX(total) as top_score,
          MIN(total) as lowest_score,
          SUM(CASE WHEN total >= 10 THEN 1 ELSE 0 END) as pass_count,
          SUM(CASE WHEN total < 10 THEN 1 ELSE 0 END) as fail_count
      FROM exam_result
      WHERE exam_id = ?
  `;
  
  // Query for score distribution
  const distributionSql = `
      SELECT 
          FLOOR(total/10)*10 as score_range,
          COUNT(*) as student_count
      FROM exam_result
      WHERE exam_id = ?
      GROUP BY FLOOR(total/10)*10
      ORDER BY score_range
  `;
  
  // Query for top performers
  const topPerformersSql = `
      SELECT student_regno, total
      FROM exam_result
      WHERE exam_id = ?
      ORDER BY total DESC
      LIMIT 5
  `;
  
  // Execute all queries
  db.query(statsSql, [examId], (err, stats) => {
      if (err) return res.json(err);
      
      db.query(distributionSql, [examId], (err, distribution) => {
          if (err) return res.json(err);
          
          db.query(topPerformersSql, [examId], (err, topPerformers) => {
              if (err) return res.json(err);
              
              // Combine all results
              return res.json({
                  total_students: stats[0].total_students,
                  average_score: stats[0].average_score,
                  top_score: stats[0].top_score,
                  lowest_score: stats[0].lowest_score,
                  pass_count: stats[0].pass_count,
                  fail_count: stats[0].fail_count,
                  distribution: distribution,
                  topPerformers: topPerformers
              });
          });
      });
  });
});
// Optional: Fallback API for initial student list (if needed)

app.listen(PORT)
