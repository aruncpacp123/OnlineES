import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ExamList() {
  const usernames = JSON.parse(sessionStorage.getItem("username"));
  const course_id = usernames.course;
  const semester = usernames.sem;

  const [exam, setExam] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchExams = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/fetchExams`, {
        course_id,
        semester,
      });
      setTimeout(() => {
        setExam(res.data);
        setLoading(false);
      }, 2000);
    } catch (err) {
      console.error("Error fetching exams:", err);
    }
  };

  const attempt = (quiz, subjective, qno, sno, mark, exam_id, duration) => {
    if (quiz != null && quiz != 0) {
      navigate("/student/exam/quiz", {
        state: { quiz_id: quiz, subjective_id: subjective, qno, sno, quizMark: mark, exam_id, duration },
      });
    } else {
      navigate("/student/exam/subjective", {
        state: { subjective_id: subjective, sno, exam_id, quiz_id: 0, duration },
      });
    }
  };

  useEffect(() => {
    fetchExams();
  }, []); // Removed loading from dependency to avoid infinite loop

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-t-xl">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-white rounded-full"></span>
              Exam List
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600">
              View and attempt exams scheduled for your course and semester.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <Table className="w-full">
            <TableCaption className="text-gray-600 py-4">
              A list of Exams
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-purple-50 to-indigo-50 hover:bg-purple-100 transition-all duration-200">
                <TableHead className="w-[100px] text-purple-700 font-semibold py-3">
                  No.
                </TableHead>
                <TableHead className="w-[250px] text-purple-700 font-semibold py-3">
                  Name
                </TableHead>
                <TableHead className="w-[250px] text-purple-700 font-semibold py-3">
                  Subject
                </TableHead>
                <TableHead className="w-[350px] text-purple-700 font-semibold py-3">
                  Description
                </TableHead>
                <TableHead className="w-[240px] text-purple-700 font-semibold py-3">
                  Starting Date
                </TableHead>
                <TableHead className="w-[230px] text-purple-700 font-semibold py-3">
                  Ending Date
                </TableHead>
                <TableHead className="text-right text-purple-700 font-semibold py-3 pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan="7" className="text-center text-gray-600 font-mono font-extrabold py-10">
                    LOADING...
                  </TableCell>
                </TableRow>
              ) : (
                exam.map((item, index) => (
                  <TableRow
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
                  >
                    <TableCell className="font-medium text-gray-800 py-3 text-left">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-gray-800 py-3 text-left">{item.exam_name}</TableCell>
                    <TableCell className="text-gray-800 py-3 text-left">{item.subject_name}</TableCell>
                    <TableCell className="text-gray-800 py-3 text-left">{item.description}</TableCell>
                    <TableCell className="text-gray-800 py-3 text-left">
                      {new Date(item.starting_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute:"numeric",
                        hour12:true
                      })}
                    </TableCell>
                    <TableCell className="text-gray-800 py-3">
                      {new Date(item.ending_date).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute:"numeric",
                        hour12:true
                      })}
                    </TableCell>
                    <TableCell className="text-right py-3 pr-6">
                      <Button
                        className="bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium py-1 px-4 rounded-md shadow-sm transition-all duration-200 hover:scale-105 flex items-center gap-1"
                        onClick={() =>
                          attempt(
                            item.quiz_id,
                            item.subjective_id,
                            item.qno_of_questions,
                            item.sno_of_questions,
                            item.mark,
                            item.exam_id,
                            item.duration
                          )
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 15l-6-6m0 0l-6 6m6-6v12"
                          />
                        </svg>
                        Attempt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {!loading && exam.length === 0 && (
          <p className="text-center text-gray-600 mt-6">No exams found.</p>
        )}
      </div>
    </div>
  );
}