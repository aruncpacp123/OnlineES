import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StudentList({ details }) {
  const [exam, setExam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(false);
  const [sub, setSub] = useState(false);
  const [both, setBoth] = useState(false);
  const [marks, setMarks] = useState({});

  const navigate = useNavigate();
  const { exam_id, quiz_id, subjective_id } = details;

  const fetchQuizAttendees = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/getQuizAttendees`, { quiz_id });
      setExam(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching quiz attendees:", err);
      setLoading(false);
    }
  };

  const fetchSubjectiveAttendees = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/getSubjectiveAttendees`, { subjective_id });
      setExam(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching subjective attendees:", err);
      setLoading(false);
    }
  };

  const fetchBothAttendees = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/getBoth`, { exam_id });
      setExam(res.data.attendees);
      setMarks(res.data.marks);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching both attendees:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quiz_id !== 0 && subjective_id !== 0) {
      setBoth(true);
      fetchBothAttendees();
    } else if (quiz_id !== 0) {
      setQuiz(true);
      fetchQuizAttendees();
    } else {
      setSub(true);
      fetchSubjectiveAttendees();
    }
  }, [exam_id, quiz_id, subjective_id]);

  const handleViewAnswers = (student) => {
    navigate(`/teacher/exam/${exam_id}/student/${student.user_regno}/answers`, { state: { student } });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 rounded-t-xl">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-white rounded-full"></span>
              Exam Attendees - Exam ID: {exam_id}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-600">
              List of students who attempted the exam, including quiz and subjective marks.
            </p>
          </CardContent>
        </Card>

        {loading ? (
          <p className="text-center text-gray-600 font-mono font-extrabold py-10">LOADING...</p>
        ) : exam.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {exam.map((student, index) => (
              <Card
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <CardHeader className="bg-indigo-50 p-4">
                  <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
                    {student.user_name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  {quiz && (
                    <p className="text-gray-700">
                      <span className="font-medium">Quiz Mark:</span> {student.total_mark}
                    </p>
                  )}
                  {sub && (
                    <p className="text-gray-700">
                      <span className="font-medium">Subjective Mark:</span>{" "}
                      {student.total_mark === -1 ? "Not Corrected" : student.total_mark}
                    </p>
                  )}
                  {both && (
                    <>
                      <p className="text-gray-700">
                        <span className="font-medium">Quiz Mark:</span> {student.qtotal}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Subjective Mark:</span>{" "}
                        {marks[student.user_regno] === -1 ? "Not Corrected" : marks[student.user_regno]}
                      </p>
                    </>
                  )}
                  {(sub || both) && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg shadow-sm transition-all duration-200 hover:scale-105"
                      onClick={() => handleViewAnswers(student)}
                    >
                      View Answers
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No students have attempted this exam yet.</p>
        )}
      </div>
    </div>
  );
}