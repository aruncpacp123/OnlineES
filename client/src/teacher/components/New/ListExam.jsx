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
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Exams() {
  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const user_id = usernames?.id;

  const [exam, setExam] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchExams = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/getExams`, { user_id });
      setTimeout(() => {
        setExam(res.data);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error("Error fetching exams:", err);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Function to format date and time
  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Exams</h1>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <Table>
          <TableCaption className="text-gray-600 mb-4">A list of your exams.</TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[100px] font-semibold text-gray-700">#</TableHead>
              <TableHead className="w-[250px] font-semibold text-gray-700">Name</TableHead>
              <TableHead className="w-[250px] font-semibold text-gray-700">Subject</TableHead>
              <TableHead className="w-[500px] font-semibold text-gray-700">Description</TableHead>
              <TableHead className="w-[250px] font-semibold text-gray-700">Starting Date & Time</TableHead>
              <TableHead className="w-[250px] font-semibold text-gray-700">Ending Date & Time</TableHead>

              <TableHead className="font-semibold text-gray-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan="6" className="text-center text-gray-600 font-mono font-extrabold py-10">
                  LOADING...
                </TableCell>
              </TableRow>
            ) : (
              exam.map((item, index) => (
                <TableRow key={index} className="hover:bg-gray-50 transition duration-200">
                  <TableCell className="font-medium text-gray-800">{index + 1}</TableCell>
                  <TableCell className="text-gray-800">{item.exam_name}</TableCell>
                  <TableCell className="text-gray-800">{item.subject_name}</TableCell>
                  <TableCell className="text-gray-800">{item.description}</TableCell>
                  <TableCell className="text-gray-800">
                    {formatDateTime(item.starting_date)}
                  </TableCell>
                  <TableCell className="text-gray-800">
                    {formatDateTime(item.ending_date)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-4 rounded-md shadow-sm transition duration-300" onClick={()=>navigate(`/teacher/exam/${item.exam_id}`)}>
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}