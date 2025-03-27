import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

export default function ViewAnswers() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const student = state?.student || {};
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedMarks, setEditedMarks] = useState({});

  const fetchAnswers = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/getStudentAnswers`, {
        subjective_id: student.subjective_id,
        user_regno: student.user_regno,
      });
      setAnswers(res.data);
      setEditedMarks(
        res.data.reduce((acc, ans) => ({ ...acc, [ans.question_id]: ans.mark }), {})
      );
      setLoading(false);
    } catch (err) {
      console.error("Error fetching answers:", err);
      setLoading(false);
    }
  };

  const handleMarkChange = (questionId, value) => {
    setEditedMarks((prev) => ({ ...prev, [questionId]: value }));
  };

  const saveMarks = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_URL}/updateMarks`, {
        subjective_id: student.subjective_id,
        user_regno: student.user_regno,
        marks: editedMarks,
      });
      alert("Marks updated successfully!");
      navigate(-1); // Go back to the previous page
    } catch (err) {
      console.error("Error updating marks:", err);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-t-xl">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-white rounded-full"></span>
              Student Answers
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                S
              </span>
              <div>
                <p className="text-sm text-gray-500">Register Number</p>
                <p className="text-lg font-medium text-gray-800">{student.user_regno}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                N
              </span>
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="text-lg font-medium text-gray-800">{student.user_name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <p className="text-center text-gray-600 font-mono font-extrabold py-10">LOADING...</p>
        ) : answers.length > 0 ? (
          <div className="space-y-6">
            {answers.map((answer) => (
              <Card
                key={answer.question_id}
                className="bg-white rounded-xl shadow-md border border-gray-100"
              >
                <CardHeader className="bg-purple-50 p-4">
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {answer.question_title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <p className="text-gray-700">
                    <span className="font-medium">Answer:</span> {answer.answer_text}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Max Marks:</span> {answer.max_mark}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Current Marks:</span>
                    <Input
                      type="number"
                      value={editedMarks[answer.question_id] || ""}
                      onChange={(e) =>
                        handleMarkChange(answer.question_id, e.target.value)
                      }
                      className="w-20 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                      min="0"
                      max={answer.max_mark}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="flex justify-end gap-4">
              <Button
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-200"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-200"
                onClick={saveMarks}
              >
                Save Marks
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">No answers submitted by this student.</p>
        )}
      </div>
    </div>
  );
}