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

export function Subjects() {
  const [subject, setSubject] = useState([]);
  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const user_id = usernames?.id;

  const fetchSubjects = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/getAssignedSubjects`, { user_id });
      setSubject(res.data);
    } catch (err) {
      console.error("Error fetching Subject Details:", err);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Assigned Subjects</h1>
        {/* Optional: Add a button here if you want to include additional functionality */}
        {/* <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300">
          + Add Subject
        </Button> */}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <Table>
          <TableCaption className="text-gray-600 mb-4">A list of subjects assigned to you.</TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[100px] font-semibold text-gray-700">#</TableHead>
              <TableHead className="w-[300px] font-semibold text-gray-700">Course</TableHead>
              <TableHead className="w-[300px] font-semibold text-gray-700">Subject</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subject.map((item, index) => (
              <TableRow key={index} className="hover:bg-gray-50 transition duration-200">
                <TableCell className="font-medium text-gray-800">{index + 1}</TableCell>
                <TableCell className="text-gray-800">{item.course_name}</TableCell>
                <TableCell className="text-gray-800">{item.subject_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}