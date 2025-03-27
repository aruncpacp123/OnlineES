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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from 'axios';
import { Outlet } from 'react-router-dom';
import Teachers from './teachers';
import Assign from './Assign';

export default function Subjects() {
  const [subjectFields, setSubjectFields] = useState({
    name: '',
    course_id: '',
    sem: '',
  });
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const inst_id = usernames?.inst_id;
  const totalSemesters = 8;

  const addSubject = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/addSubject`, subjectFields);
      console.log(res);
      setIsDialogOpen(false);
      fetchSubjects();
      setSubjectFields({ name: '', course_id: '', sem: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSubject = async (id) => {
    try {
      await axios.post(`${import.meta.env.VITE_URL}/deleteSubject`, { id });
      fetchSubjects();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/getSubjects`, { inst_id });
      setSubjects(res.data);
    } catch (err) {
      console.error("Error fetching Subjects:", err);
    }
  };

  const fetchCourses = async (dept_id) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/fetchCourses`, { dept_id });
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching Courses:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/getDepartments`, { inst_id });
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching Departments:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchSubjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Subjects Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
              onClick={() => setIsDialogOpen(true)}
            >
              + Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white rounded-xl shadow-lg">
            <form onSubmit={addSubject}>
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-gray-800 text-center">
                  Add New Subject
                </DialogTitle>
                <DialogDescription className="text-gray-500 text-center">
                  Fill in the details to add a new subject.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-6">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-gray-700 font-medium text-right">
                    Subject Name
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                    value={subjectFields.name}
                    onChange={(e) =>
                      setSubjectFields((current) => ({ ...current, name: e.target.value }))
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-gray-700 font-medium text-right">
                    Department
                  </Label>
                  <Select
                    id="department"
                    className="col-span-3"
                    onValueChange={(value) => fetchCourses(parseInt(value, 10))}
                  >
                    <SelectTrigger className="col-span-3 border-gray-300 rounded-md">
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="bg-white shadow-md rounded-md">
                      {departments.map((item) => (
                        <SelectItem
                          value={String(item.dept_id)}
                          key={item.dept_id}
                          className="hover:bg-indigo-50"
                        >
                          {item.dept_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="course" className="text-gray-700 font-medium text-right">
                    Course
                  </Label>
                  <Select
                    id="course"
                    onValueChange={(value) =>
                      setSubjectFields((current) => ({
                        ...current,
                        course_id: parseInt(value, 10),
                      }))
                    }
                  >
                    <SelectTrigger className="col-span-3 border-gray-300 rounded-md">
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="bg-white shadow-md rounded-md">
                      {courses.map((item) => (
                        <SelectItem
                          value={String(item.course_id)}
                          key={item.course_id}
                          className="hover:bg-indigo-50"
                        >
                          {item.course_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="semester" className="text-gray-700 font-medium text-right">
                    Semester
                  </Label>
                  <Select
                    id="semester"
                    onValueChange={(value) =>
                      setSubjectFields((current) => ({
                        ...current,
                        sem: parseInt(value, 10),
                      }))
                    }
                  >
                    <SelectTrigger className="col-span-3 border-gray-300 rounded-md">
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="bg-white shadow-md rounded-md">
                      {Array.from({ length: totalSemesters }, (_, index) => (
                        <SelectItem
                          value={String(index + 1)}
                          key={index}
                          className="hover:bg-indigo-50"
                        >
                          {index + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
                >
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <Table>
          <TableCaption className="text-gray-500 mb-4">A list of all subjects.</TableCaption>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[80px] font-semibold text-gray-700">No.</TableHead>
              <TableHead className="w-[250px] font-semibold text-gray-700">Name</TableHead>
              <TableHead className="w-[120px] font-semibold text-gray-700">Semester</TableHead>
              <TableHead className="w-[250px] font-semibold text-gray-700">Course</TableHead>
              <TableHead className="w-[250px] font-semibold text-gray-700">Teachers</TableHead>
              <TableHead className="text-center font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subjects.map((item, index) => (
              <TableRow key={index} className="hover:bg-gray-50 transition duration-200">
                <TableCell className="font-medium text-gray-800">{index + 1}</TableCell>
                <TableCell className="text-gray-800">{item.subject_name}</TableCell>
                <TableCell className="text-gray-800">{item.course_sem}</TableCell>
                <TableCell className="text-gray-800">{item.course_name}</TableCell>
                <TableCell className="text-gray-800">
                  <Teachers value={item.subject_id} />
                </TableCell>
                <TableCell className="text-right space-x-4">
                  <Assign
                    sub_id={item.subject_id}
                    dept_id={item.dept_id}
                    sub_name={item.subject_name}
                  />
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-4 rounded-md shadow-sm transition duration-300"
                    onClick={() => deleteSubject(item.subject_id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Outlet />
    </div>
  );
}