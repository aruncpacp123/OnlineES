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
import axios from "axios";

function Edit({ item }) {
  const [name, setName] = useState(item.dept_name);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const updateDepartment = async (id) => {
    try {
      await axios.post(`${import.meta.env.VITE_URL}/updateDepartment`, { name, id });
      setIsDialogOpen(false);
      setName("");
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
      <DialogContent className="sm:max-w-[500px] bg-white rounded-xl shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Edit Department
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Update the department name below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium">
              Department Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => updateDepartment(item.dept_id)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function Departments() {
  const [name, setName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const usernames = JSON.parse(sessionStorage.getItem("username"));
  const inst_id = usernames?.inst_id;

  const addDepartment = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_URL}/addDepartment`, { name, inst_id });
      fetchDepartments();
      setIsDialogOpen(false);
      setName("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteDepartment = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axios.post(`${import.meta.env.VITE_URL}/deleteDepartment`, { id });
        fetchDepartments();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/getDepartments`, { inst_id });
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-t-xl">
            <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-white rounded-full"></span>
              Manage Departments
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex justify-between items-center">
            <p className="text-gray-600">
              View and manage departments for your institution.
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
                  onClick={() => setIsDialogOpen(true)}
                >
                  + Add Department
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] bg-white rounded-xl shadow-lg">
                <form onSubmit={addDepartment}>
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-gray-800">
                      Add New Department
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">
                      Enter the name to add a new department.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Department Name
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"
                    >
                      Add Department
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {departments.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept, index) => (
              <Card
                key={dept.dept_id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200"
              >
                <CardContent className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-800">{dept.dept_name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Edit item={dept} />
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1 px-3 rounded-md shadow-sm transition-all duration-200 hover:scale-105"
                      onClick={() => deleteDepartment(dept.dept_id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No departments found.</p>
        )}
      </div>
    </div>
  );
}