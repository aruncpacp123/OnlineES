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

export function Student() {
  const [student, setStudent] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const usernames = JSON.parse(sessionStorage.getItem("username"));
  const inst_id = usernames?.inst_id;

  const deleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.post(`${import.meta.env.VITE_URL}/deleteStudent`, { id });
        fetchStudents();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/getStudents`, { inst_id });
      setStudent(res.data);
    } catch (err) {
      console.error("Error fetching Student Details:", err);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedStudents = [...student].sort((a, b) => {
      if (key === "course_name") {
        return direction === "asc"
          ? a.course_name.localeCompare(b.course_name)
          : b.course_name.localeCompare(a.course_name);
      }
      if (key === "current_sem") {
        return direction === "asc"
          ? a.current_sem - b.current_sem
          : b.current_sem - a.current_sem;
      }
      return 0;
    });
    setStudent(sortedStudents);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 rounded-t-xl">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-white rounded-full"></span>
              Manage Students
            </h2>
          </div>
          {/* <div className="p-6">
            <p className="text-gray-600">
              View and manage students for your institution.
            </p>
          </div> */}
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <Table className="w-full">
            <TableCaption className="text-gray-600 py-4">
              A list of Students
            </TableCaption>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-indigo-50 to-blue-50 hover:bg-indigo-100 transition-all duration-200">
                <TableHead className="w-[100px] text-indigo-700 font-semibold py-3">
                  No.
                </TableHead>
                <TableHead className="w-[200px] text-indigo-700 font-semibold py-3">
                  Register Number
                </TableHead>
                <TableHead className="w-[200px] text-indigo-700 font-semibold py-3">
                  Name
                </TableHead>
                <TableHead className="w-[250px] text-indigo-700 font-semibold py-3">
                  Email
                </TableHead>
                <TableHead
                  className="w-[200px] text-indigo-700 font-semibold py-3 cursor-pointer hover:text-indigo-900"
                  onClick={() => handleSort("course_name")}
                >
                  <div className="flex items-center gap-1">
                    Course
                    {sortConfig.key === "course_name" && (
                      <span>
                        {sortConfig.direction === "asc" ? (
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
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        ) : (
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
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead
                  className="w-[150px] text-indigo-700 font-semibold py-3 cursor-pointer hover:text-indigo-900"
                  onClick={() => handleSort("current_sem")}
                >
                  <div className="flex items-center gap-1">
                    Semester
                    {sortConfig.key === "current_sem" && (
                      <span>
                        {sortConfig.direction === "asc" ? (
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
                              d="M5 15l7-7 7 7"
                            />
                          </svg>
                        ) : (
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
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right text-indigo-700 font-semibold py-3 pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {student.map((item, index) => (
                <TableRow
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
                >
                  <TableCell className="font-medium text-gray-800 py-3">
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-gray-800 py-3">{item.user_regno}</TableCell>
                  <TableCell className="text-gray-800 py-3">{item.user_name}</TableCell>
                  <TableCell className="text-gray-800 py-3 truncate">
                    {item.user_email}
                  </TableCell>
                  <TableCell className="text-gray-800 py-3">{item.course_name}</TableCell>
                  <TableCell className="text-gray-800 py-3">{item.current_sem}</TableCell>
                  <TableCell className="text-right py-3 pr-6">
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded-md shadow-sm transition-all duration-200 hover:scale-105 flex items-center gap-1"
                      onClick={() => deleteStudent(item.user_id)}
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {student.length === 0 && (
          <p className="text-center text-gray-600 mt-6">No students found.</p>
        )}
      </div>
    </div>
  );
}