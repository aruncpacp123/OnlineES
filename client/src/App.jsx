import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignIn from './login/pages/signIn';
import SignUp from './login/pages/signup';
import Institution from './login/pages/institutionSignUp';
import { UserProvider } from './login/utils/contexts/userContext';
import Home from './admin/pages/home';
import Courses from './admin/components/courses';
import StudentHome from './student/pages/studentHome';
import TeacherHome from './teacher/pages/teacherHome';
import ExamForm from './teacher/components/ExamForm';
import QuizForm from './teacher/components/quizForm';
import SubjectiveForm from './teacher/components/SubjectiveForm';
import Quiz from './student/components/Quiz';
import Subjective from './student/components/Subjective';
import { Profile } from './teacher/components/profile';
function App() {
  return(
    <UserProvider>{/*Also include Priavte routing */}
        <Router>
            <Routes>
              {/* Login Paths */}
                <Route path="/" element={<SignIn/>} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/Instregister" element={<Institution />} />

              {/* Admin Paths */}

              <Route path='/admin' element={<Home />} ></Route>``


              {/* Teacher Paths */}
              <Route path='/teacher' element={<TeacherHome />} />
              <Route path='/teacher/exam' element={<ExamForm/>} />
              <Route path='/teacher/exam/step1' element={<QuizForm />} />
              <Route path='/teacher/exam/step2' element={<SubjectiveForm />} />
              <Route path='/profile' element={<Profile />} />


              {/* Student Paths */}
              <Route path='/student' element={<StudentHome />} />
              <Route path='/student/exam/quiz' element={<Quiz />} />
              <Route path='/student/exam/subjective' element={<Subjective />} />


            </Routes>
        </Router>
    </UserProvider>

  )
}

export default App
