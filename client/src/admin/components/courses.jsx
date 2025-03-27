import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import axios from "axios";
import { Outlet } from "react-router-dom";

function Edit({ item }) {
  const [courseFields, setCourseFields] = useState({
    name: item.course_name,
    sem: item.sem_no,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updateCourse = async (id) => {
    try {
      await axios.post(`${import.meta.env.VITE_URL}/updateCourse`, { courseFields, id });
      setIsDialogOpen(false);
      setCourseFields({ name: "", sem: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded-lg shadow-sm transition-all duration-200 hover:scale-105"
          onClick={() => setIsDialogOpen(true)}
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Edit Course
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Update course details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Course Name
            </Label>
            <Input
              id="name"
              value={courseFields.name}
              onChange={(e) => setCourseFields((current) => ({ ...current, name: e.target.value }))}
              className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sem" className="text-gray-700 font-medium">
              No. of Semesters
            </Label>
            <Input
              id="sem"
              type="number"
              value={courseFields.sem}
              onChange={(e) => setCourseFields((current) => ({ ...current, sem: e.target.value }))}
              className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => updateCourse(item.course_id)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Courses() {
  const [courseFields, setCourseFields] = useState({
    name: "",
    dept_name: "",
    sem: "",
  });
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const usernames = JSON.parse(sessionStorage.getItem("username"));
  const inst_id = usernames?.inst_id;

  const addCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_URL}/addCourse`, courseFields);
      fetchCourses();
      setIsDialogOpen(false);
      setCourseFields({ name: "", dept_name: "", sem: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.post(`${import.meta.env.VITE_URL}/deleteCourse`, { id });
        fetchCourses();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/getCourses`, { inst_id });
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
    fetchCourses();
    fetchDepartments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 rounded-t-xl">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-white rounded-full"></span>
              Manage Courses
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex justify-between items-center">
            <p className="text-gray-600">
              View and manage courses for your institution.
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
                  onClick={() => setIsDialogOpen(true)}
                >
                  + Add Course
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-white rounded-xl shadow-lg">
                <form onSubmit={addCourse}>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-gray-800">
                      Add New Course
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Enter details to add a new course.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Course Name
                      </Label>
                      <Input
                        id="name"
                        value={courseFields.name}
                        onChange={(e) =>
                          setCourseFields((current) => ({ ...current, name: e.target.value }))
                        }
                        className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sem" className="text-gray-700 font-medium">
                        No. of Semesters
                      </Label>
                      <Input
                        id="sem"
                        type="number"
                        value={courseFields.sem}
                        onChange={(e) =>
                          setCourseFields((current) => ({ ...current, sem: e.target.value }))
                        }
                        className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-gray-700 font-medium">
                        Department
                      </Label>
                      <Select
                        id="department"
                        onValueChange={(value) =>
                          setCourseFields((current) => ({ ...current, dept_name: parseInt(value, 10) }))
                        }
                      >
                        <SelectTrigger className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md">
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.dept_id} value={String(dept.dept_id)}>
                              {dept.dept_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"
                    >
                      Add Course
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {courses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => (
              <Card
                key={course.course_id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200 overflow-hidden"
              >
                <CardHeader className="bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 p-4 border-b border-gray-100">
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <span className="w-3 h-3 bg-indigo-600 rounded-full shadow-sm"></span>
                    <span className="truncate">{course.course_name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Semesters:</span>
                    <span className="text-sm text-gray-800 font-semibold bg-gray-50 px-2 py-1 rounded-full">
                      {course.sem_no}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Department:</span>
                    <span className="text-sm text-gray-800 font-semibold truncate">{course.dept_name}</span>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Edit item={course} />
                    <Button
                      className="bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium py-1.5 px-4 rounded-md shadow-sm transition-all duration-200 hover:scale-105 flex items-center gap-1"
                      onClick={() => deleteCourse(course.course_id)}
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No courses found.</p>
        )}
      </div>
      <Outlet />
    </div>
  );
}