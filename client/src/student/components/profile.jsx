// import * as React from "react"
// import { useState,useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import axios from "axios"

// export function Profile() {
//     const usernames = JSON.parse(sessionStorage.getItem('username')); 
//     const regno=usernames?.regno;
//     const name=usernames?.name;
//     const email=usernames?.email;
//     const course=usernames?.course;
//     const sem=usernames?.sem;


//     const [student,setStudent] = useState({});
//     const [edit,setEdit] = useState(false);
//     const [loading,setLoading] = useState(true);
//     const studentDetails = async ()=>{
//       try{
//           const res = await axios.post(`${import.meta.env.VITE_URL}/getStudentDetails`, {user_id});
//           setStudent(res.data);
//           setLoading(false);
//       }
//       catch(err){
//           console.error("Error Fetching Student Details");
//       }
      
//   }
//     useEffect(()=>{
//         studentDetails();
//     },[])
//   return (

//     <Card className="w-[550px]">
//       <CardHeader>
//         <CardTitle className="text-center">Profile</CardTitle>
//         <CardDescription></CardDescription>
//       </CardHeader>
//       <CardContent>
//         {/* { loading ?"Loading":( */}
            
//           <div className="grid w-full items-center gap-4">
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="regno"> Register Number</Label>
//               <Input id="regno" 
//                 value={student.user_regno || regno}
//                 contentEditable={false}
//               />
//             </div>
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="name">Name</Label>
//               <Input id="name" 
//                 value={student.user_name || name}
//                 readOnly
//               />
//             </div>
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" 
//                 value={student.user_email || email}
//                 readOnly

//               />
//             </div>
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="phno">Phone Number</Label>
//               <Input id="phno" 
//                 value={student.user_phno || '9074244885'}
//                 readOnly
                
//               />
//             </div>
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="semester">Semester</Label>
//               <Input id="semester" 
//                 value={student.current_sem || sem}
//                 readOnly
//               />
//             </div>
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="semester">Course</Label>
//               <Input id="semester" 
//                 value={student.current_sem || "MCA"}
//                 readOnly
//               />
//             </div>
//             <div >
//             {/* <Button className="col-span-1" onClick={(e)=>setEdit(true)}>Edit</Button> */}
//             </div>
//           </div>
          
//           {/* ) */}
//         {/* } */}
//         {/* { edit &&
//         <form>
//           <div className="grid w-full items-center gap-4">
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="regno"> Register Number</Label>
//               <Input id="regno" 
//                 value={loading?"Loading":student.user_regno}
//                 contentEditable={false}
//                 onChange={(e)=>{setStudent((current)=>({...current,user_regno:e.target.value}))}}
//               />
//             </div>
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="name">Name</Label>
//               <Input id="name" 
//                 value={student.user_name}
//                 contentEditable={edit}
//                 onChange={(e)=>{setStudent((current)=>({...current,user_name:e.target.value}))}}
//               />
//             </div>
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" 
//                 value={student.user_email}
//                 contentEditable={edit}
//                 onChange={(e)=>{setStudent((current)=>({...current,user_email:e.target.value}))}}
//               />
//             </div>
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="phno">Phone Number</Label>
//               <Input id="phno" 
//                 value={student.user_phno}
//                 contentEditable={edit}
//                 onChange={(e)=>{setStudent((current)=>({...current,user_phno:e.target.value}))}}
//               />
//             </div>
//             <div className="flex flex-col space-y-1.5">
//               <Label htmlFor="semester">Semester</Label>
//               <Input id="semester" 
//                 value={student.current_sem}
//                 contentEditable={edit}
//                 onChange={(e)=>{setStudent((current)=>({...current,current_sem:e.target.value}))}}
//               />
//             </div>
//             <div >
//             <Button className="col-span-1" onClick={(e)=>setEdit(true)}>Edit</Button>
//             </div>
//           </div>
          
//         </form>
//         }
//         */}
//       </CardContent>
      
//     </Card>
    
//   )
// }
// //implememnt timer and cop paste getbothAttendees function from view Attended.jsx and write that code in server.js */}
// {/*
// import * as React from "react";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import axios from "axios";

// export function Profile() {
//   const usernames = JSON.parse(sessionStorage.getItem("username"));
//   const user_id = usernames?.regno;
//   const [student, setStudent] = useState({});
//   const [edit, setEdit] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const studentDetails = async () => {
//       try {
//         const res = await axios.post("http://localhost:5000/getStudentDetails", { user_id });
//         setStudent(res.data);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error Fetching Student Details");
//       }
//     };
//     studentDetails();
//   }, []);

//   const handleSave = async () => {
//     try {
//       await axios.post("http://localhost:5000/updateStudentDetails", student);
//       setEdit(false);
//       alert("Profile updated successfully");
//     } catch (err) {
//       console.error("Error saving profile changes:", err);
//       alert("Failed to update profile");
//     }
//   };

//   return (
//     <Card className="w-[550px]">
//       <CardHeader>
//         <CardTitle className="text-center">Profile</CardTitle>
//         <CardDescription></CardDescription>
//       </CardHeader>
//       <CardContent>
//         {!loading && (
//           <div className="grid w-full items-center gap-4">
//             {["regno", "name", "email", "phno", "semester"].map((field, index) => (
//               <div key={index} className="flex flex-col space-y-1.5">
//                 <Label htmlFor={field}>
//                   {field === "regno" ? "Register Number" : field.charAt(0).toUpperCase() + field.slice(1)}
//                 </Label>
//                 <Input
//                   id={field}
//                   value={student[`user_${field}`]}
//                   disabled={!edit || field === "regno"}
//                   onChange={(e) =>
//                     setStudent((current) => ({ ...current, [`user_${field}`]: e.target.value }))
//                   }
//                 />
//               </div>
//             ))}
//             <div>
//               {edit ? (
//                 <Button className="col-span-1" onClick={handleSave}>
//                   Save
//                 </Button>
//               ) : (
//                 <Button className="col-span-1" onClick={() => setEdit(true)}>
//                   Edit
//                 </Button>
//               )}
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }
// */}
import * as React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Save, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export function Profile() {
  const usernames = JSON.parse(sessionStorage.getItem('username')); 
  const userId = usernames?.id;
  const [student, setStudent] = useState({
    user_regno: usernames?.regno || '',
    user_name: usernames?.name || '',
    user_email: usernames?.email || '',
    user_phno: usernames?.phno || '',
    current_sem: usernames?.sem || '',
    course: usernames?.course || ''
  });
  
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  const studentDetails = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/getStudentDetails`, { user_id: userId });
      setStudent(res.data);
      setAvatarUrl(res.data.avatar_url || '');
      setLoading(false);
    } catch (err) {
      console.error("Error Fetching Student Details");
      toast.error("Failed to load profile data");
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.post(`${import.meta.env.VITE_URL}/updateStudentDetails`, {
        user_id: userId,
        ...student
      });
      toast.success("Profile updated successfully");
      setEdit(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setStudent(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('user_id', userId);

    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/uploadAvatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setAvatarUrl(res.data.avatar_url);
      toast.success("Profile picture updated");
    } catch (err) {
      console.error("Error uploading avatar:", err);
      toast.error("Failed to update profile picture");
    }
  };

  useEffect(() => {
    studentDetails();
  }, []);

  const getInitials = (name) => {
    if (!name) return '';
    const names = name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex  justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-24 relative">
          <div className="absolute -bottom-12 left-6">
            <div className="relative group">
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="bg-indigo-100 text-indigo-700 text-2xl font-bold">
                  {getInitials(student.user_name)}
                </AvatarFallback>
              </Avatar>
              {edit && (
                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                  <Pencil className="h-4 w-4 text-gray-700" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={handleAvatarUpload}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <CardHeader className="pt-16">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{student.user_name}</CardTitle>
              <CardDescription className="text-gray-600">
                {student.course} • Semester {student.current_sem}
              </CardDescription>
            </div>
            {!edit ? (
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setEdit(true)}
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => {
                    setEdit(false);
                    studentDetails(); // Reset changes
                  }}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  className="gap-2 bg-blue-600 hover:bg-blue-700"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="regno" className="text-gray-600">Register Number</Label>
                <Input 
                  id="regno" 
                  value={student.user_regno}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="name" className="text-gray-600">Full Name</Label>
                <Input 
                  id="name" 
                  value={student.user_name}
                  readOnly={!edit}
                  onChange={(e) => handleInputChange('user_name', e.target.value)}
                  className={edit ? "bg-white" : "bg-gray-50"}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="email" className="text-gray-600">Email Address</Label>
                <Input 
                  id="email" 
                  value={student.user_email}
                  readOnly={!edit}
                  onChange={(e) => handleInputChange('user_email', e.target.value)}
                  className={edit ? "bg-white" : "bg-gray-50"}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="phno" className="text-gray-600">Phone Number</Label>
                <Input 
                  id="phno" 
                  value={student.user_phno}
                  readOnly={!edit}
                  onChange={(e) => handleInputChange('user_phno', e.target.value)}
                  className={edit ? "bg-white" : "bg-gray-50"}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="semester" className="text-gray-600">Semester</Label>
                <Input 
                  id="semester" 
                  value={student.current_sem}
                  readOnly={!edit}
                  onChange={(e) => handleInputChange('current_sem', e.target.value)}
                  className={edit ? "bg-white" : "bg-gray-50"}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="course" className="text-gray-600">Course</Label>
                <Input 
                  id="course" 
                  value={student.course}
                  readOnly={!edit}
                  onChange={(e) => handleInputChange('course', e.target.value)}
                  className={edit ? "bg-white" : "bg-gray-50"}
                />
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t pt-4">
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}