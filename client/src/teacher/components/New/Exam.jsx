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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function ExamDetails() {
  const { examid } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [examFields, setExamFields] = useState({
    exam_name: '',
    description: '',
    starting_date: '',
    ending_date: '',
    duration: '',
  });

  const fetchExamDetails = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/exams/${examid}`);
      setExam(res.data);
      setExamFields({
        exam_name: res.data.exam_name,
        description: res.data.description,
        starting_date: res.data.starting_date,
        ending_date: res.data.ending_date,
        duration: res.data.duration,
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching exam details:", err);
      setLoading(false);
    }
  };

  const updateExam = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_URL}/exams/${examid}`, examFields);
      setEditDialogOpen(false);
      fetchExamDetails();
    } catch (err) {
      console.error("Error updating exam:", err);
    }
  };

  const deleteExam = async () => {
    if (window.confirm("Are you sure you want to delete this exam?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_URL}/exams/${examid}`);
        navigate('/exams');
      } catch (err) {
        console.error("Error deleting exam:", err);
      }
    }
  };

  useEffect(() => {
    fetchExamDetails();
  }, [examid]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Exam Details</h1>
        <div className="space-x-4">
          <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
              >
                Edit Exam
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white rounded-xl shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-gray-800">
                  Update Exam
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Modify the exam details below and save your changes.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="space-y-2">
                  <Label htmlFor="exam_name" className="text-gray-700 font-medium">
                    Exam Name
                  </Label>
                  <Input
                    id="exam_name"
                    value={examFields.exam_name}
                    onChange={(e) => setExamFields({ ...examFields, exam_name: e.target.value })}
                    className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700 font-medium">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={examFields.description}
                    onChange={(e) => setExamFields({ ...examFields, description: e.target.value })}
                    className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="starting_date" className="text-gray-700 font-medium">
                    Starting Date & Time
                  </Label>
                  <Input
                    id="starting_date"
                    type="datetime-local"
                    value={examFields.starting_date ? examFields.starting_date.slice(0, 16) : ''}
                    onChange={(e) => setExamFields({ ...examFields, starting_date: e.target.value })}
                    className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ending_date" className="text-gray-700 font-medium">
                    Ending Date & Time
                  </Label>
                  <Input
                    id="ending_date"
                    type="datetime-local"
                    value={examFields.ending_date ? examFields.ending_date.slice(0, 16) : ''}
                    onChange={(e) => setExamFields({ ...examFields, ending_date: e.target.value })}
                    className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-gray-700 font-medium">
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    value={examFields.duration}
                    onChange={(e) => setExamFields({ ...examFields, duration: e.target.value })}
                    className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={updateExam}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
            onClick={deleteExam}
          >
            Delete Exam
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {loading ? (
          <p className="text-center text-gray-600 font-mono font-extrabold py-10">LOADING...</p>
        ) : exam ? (
          <Table>
            <TableCaption className="text-gray-600 mb-4">Details of the selected exam.</TableCaption>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[200px] font-semibold text-gray-700">Field</TableHead>
                <TableHead className="font-semibold text-gray-700">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50 transition duration-200">
                <TableCell className="font-medium text-gray-800">Exam Name</TableCell>
                <TableCell className="text-gray-800">{exam.exam_name}</TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50 transition duration-200">
                <TableCell className="font-medium text-gray-800">Subject</TableCell>
                <TableCell className="text-gray-800">{exam.subject_name}</TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50 transition duration-200">
                <TableCell className="font-medium text-gray-800">Description</TableCell>
                <TableCell className="text-gray-800">{exam.description}</TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50 transition duration-200">
                <TableCell className="font-medium text-gray-800">Starting Date & Time</TableCell>
                <TableCell className="text-gray-800">
                  {new Date(exam.starting_date).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50 transition duration-200">
                <TableCell className="font-medium text-gray-800">Ending Date & Time</TableCell>
                <TableCell className="text-gray-800">
                  {new Date(exam.ending_date).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50 transition duration-200">
                <TableCell className="font-medium text-gray-800">Duration (minutes)</TableCell>
                <TableCell className="text-gray-800">{exam.duration}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <p className="text-center text-gray-600">No exam found.</p>
        )}
      </div>
    </div>
  );
}