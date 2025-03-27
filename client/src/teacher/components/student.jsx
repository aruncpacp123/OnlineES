import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from 'axios';

export function Student() {
  const [student, setStudent] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' }); // Track sorting state
  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const dept_id = usernames?.department;

  const fetchStudents = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/getStudentsByDepartment`, { dept_id });
      setStudent(res.data);
    } catch (err) {
      console.error("Error fetching Student Details:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Sorting function
  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const sortedArray = [...student].sort((a, b) => {
      if (key === 'course_name') {
        return direction === 'asc'
          ? a.course_name.localeCompare(b.course_name)
          : b.course_name.localeCompare(a.course_name);
      }
      if (key === 'current_sem') {
        return direction === 'asc'
          ? a.current_sem - b.current_sem
          : b.current_sem - a.current_sem;
      }
      return 0;
    });

    setStudent(sortedArray);
    setSortConfig({ key, direction });
  };

  // Helper to display sort arrow
  const getSortArrow = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
    return ' ↕'; // Default arrow indicating sortable column
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Students Management</h1>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <Table>
          <TableCaption className="text-gray-600 mb-4">A list of students in your department.</TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[100px] font-semibold text-gray-700">#</TableHead>
              <TableHead className="w-[230px] font-semibold text-gray-700">Register Number</TableHead>
              <TableHead className="w-[200px] font-semibold text-gray-700">Name</TableHead>
              <TableHead className="w-[250px] font-semibold text-gray-700">Email</TableHead>
              <TableHead
                className="w-[200px] font-semibold text-gray-700 cursor-pointer hover:text-indigo-600 transition duration-200"
                onClick={() => sortData('course_name')}
              >
                Course{getSortArrow('course_name')}
              </TableHead>
              <TableHead
                className="font-semibold text-gray-700 cursor-pointer hover:text-indigo-600 transition duration-200"
                onClick={() => sortData('current_sem')}
              >
                Semester{getSortArrow('current_sem')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {student.map((item, index) => (
              <TableRow key={index} className="hover:bg-gray-50 transition duration-200">
                <TableCell className="font-medium text-gray-800">{index + 1}</TableCell>
                <TableCell className="text-gray-800">{item.user_regno}</TableCell>
                <TableCell className="text-gray-800">{item.user_name}</TableCell>
                <TableCell className="text-gray-800">{item.user_email}</TableCell>
                <TableCell className="text-gray-800">{item.course_name}</TableCell>
                <TableCell className="text-gray-800">{item.current_sem}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}