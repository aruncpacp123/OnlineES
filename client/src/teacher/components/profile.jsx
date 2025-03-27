import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function Profile() {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFields, setEditFields] = useState({
    username: '',
    email: '',
    phone: '',
  });

  // Fetch teacher profile from sessionStorage and API
  const fetchTeacherProfile = async () => {
    const usernames = JSON.parse(sessionStorage.getItem('username'));
    const user_id = usernames?.id;

    if (!user_id) {
      console.error('No user ID found in sessionStorage');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/teacher/profile/${user_id}`);
      setTeacher(res.data);
      setEditFields({
        username: res.data.user_name,
        email: res.data.user_email,
        phone: res.data.user_phno || '', // Handle null phone
      });
      setLoading(false);
    } catch (err) {
      console.log(user_id);
      console.error('Error fetching teacher profile:', err);
      setLoading(false);
    }
  };

  // Update teacher profile
  const updateTeacherProfile = async () => {
    const usernames = JSON.parse(sessionStorage.getItem('username'));
    const user_id = usernames?.id;

    try {
      await axios.put(`${import.meta.env.VITE_URL}/teacher/profile/${user_id}`, editFields);
      setEditDialogOpen(false);
      fetchTeacherProfile(); // Refresh profile
    } catch (err) {
      console.error('Error updating teacher profile:', err);
    }
  };

  useEffect(() => {
    fetchTeacherProfile();
  }, []);

  return (
    <div className="bg-gray-100 p-6 flex justify-center">
      <Card className="bg-white rounded-xl shadow-lg max-w-lg w-full border border-gray-200">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 p-6 rounded-t-xl">
          <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-white rounded-full"></span>
            Teacher Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {loading ? (
            <p className="text-center text-gray-600 font-mono font-extrabold">LOADING...</p>
          ) : teacher ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                    U
                  </span>
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="text-lg font-medium text-gray-800">{teacher.user_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                    E
                  </span>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-lg font-medium text-gray-800">{teacher.user_email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                    P
                  </span>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-lg font-medium text-gray-800">
                      {teacher.user_phno || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                    G
                  </span>
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="text-lg font-medium text-gray-800">
                      {teacher.user_gender || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                    D
                  </span>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p className="text-lg font-medium text-gray-800">
                      {new Date(teacher.user_dob).toLocaleDateString() || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 hover:scale-105">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] bg-white rounded-xl shadow-lg">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-semibold text-gray-800">
                        Edit Profile
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Update your profile details below.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                      <div className="space-y-2">
                        <Label htmlFor="username" className="text-gray-700 font-medium">
                          Username
                        </Label>
                        <Input
                          id="username"
                          value={editFields.username}
                          onChange={(e) => setEditFields({ ...editFields, username: e.target.value })}
                          className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={editFields.email}
                          onChange={(e) => setEditFields({ ...editFields, email: e.target.value })}
                          className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-gray-700 font-medium">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          value={editFields.phone}
                          onChange={(e) => setEditFields({ ...editFields, phone: e.target.value })}
                          className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={updateTeacherProfile}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition-all duration-300"
                      >
                        Save Changes
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600">No profile data found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}