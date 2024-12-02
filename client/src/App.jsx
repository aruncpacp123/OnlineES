import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./login/pages/signIn";
import SignUp from "./login/pages/signup";
import Institution from "./login/pages/institutionSignUp";
import Home from "./admin/pages/home";
import StudentHome from "./student/pages/studentHome";
import TeacherHome from "./teacher/pages/teacherHome";
import ExamForm from "./teacher/components/ExamForm";
import QuizForm from "./teacher/components/quizForm";
import SubjectiveForm from "./teacher/components/SubjectiveForm";
import Quiz from "./student/components/Quiz";
import Subjective from "./student/components/Subjective";
import { Profile } from "./teacher/components/profile";
import PrivateRoute from "./PrivateRoute"; // Import the modified PrivateRoute

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/Instregister" element={<Institution />} />

        {/* Private Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher"
          element={
            <PrivateRoute>
              <TeacherHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/exam"
          element={
            <PrivateRoute>
              <ExamForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/exam/step1"
          element={
            <PrivateRoute>
              <QuizForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/exam/step2"
          element={
            <PrivateRoute>
              <SubjectiveForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/student"
          element={
            <PrivateRoute>
              <StudentHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/exam/quiz"
          element={
            <PrivateRoute>
              <Quiz />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/exam/subjective"
          element={
            <PrivateRoute>
              <Subjective />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
