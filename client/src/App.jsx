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
// import Quiz from "./student/components/Quiz";
import Quiz from "./student/components/New/Quiz";
// import Quiz2 from "./student/components/New/Quiz2";
// import Subjective from "./student/components/Subjective";
import Subjective from "./student/components/New/Subjective";

import { Profile } from "./teacher/components/profile";
import PrivateRoute from "./PrivateRoute"; // Import the updated PrivateRoute
import FaceDetectionComponent from "./student/components/Test";
import Demo from "./components/ui/Demo";
import ManageExam from "./teacher/components/New/ManageExam";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SignIn />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/Instregister" element={<Institution />} />

        {/* Private Routes for Admin */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Private Routes for Teacher */}
        <Route
          path="/teacher"
          element={
            <PrivateRoute allowedRoles={["teacher"]}>
              <TeacherHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/exam/:examid"
          element={
            <PrivateRoute allowedRoles={["teacher"]}>
              <ManageExam />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/exam"
          element={
            <PrivateRoute allowedRoles={["teacher"]}>
              <ExamForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/exam/step1"
          element={
            <PrivateRoute allowedRoles={["teacher"]}>
              <QuizForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/exam/step2"
          element={
            <PrivateRoute allowedRoles={["teacher"]}>
              <SubjectiveForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute allowedRoles={["teacher", "admin"]}>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Private Routes for Student */}
        <Route
          path="/student"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <StudentHome />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/exam/quiz"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <Quiz/>
            </PrivateRoute>
          }
        />
        <Route
          path="/student/exam/subjective"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <Subjective />
            </PrivateRoute>
          }
        />
        <Route
          path="/student/exam/test"
          element={
            <PrivateRoute allowedRoles={["student"]}>
              <Demo/>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}
//Here Make a private  route and inside that file check whether user is login route it to '/user' so evry component should a childof yid except login.Then make anaother three router files to chcek unautherized access.wrap student components insdie student route component and if not accssed navigate to 403 unautherized
export default App;
