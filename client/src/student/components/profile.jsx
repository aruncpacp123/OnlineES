import * as React from "react"
import { useState,useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"

export function Profile() {
    const usernames = JSON.parse(sessionStorage.getItem('username')); 
    const regno=usernames?.regno;
    const name=usernames?.name;
    const email=usernames?.email;
    const course=usernames?.course;
    const sem=usernames?.sem;


    const [student,setStudent] = useState({});
    const [edit,setEdit] = useState(false);
    const [loading,setLoading] = useState(true);
    const studentDetails = async ()=>{
      try{
          const res = await axios.post(`${import.meta.env.VITE_URL}/getStudentDetails`, {user_id});
          setStudent(res.data);
          setLoading(false);
      }
      catch(err){
          console.error("Error Fetching Student Details");
      }
      
  }
    useEffect(()=>{
        studentDetails();
    },[])
  return (

    <Card className="w-[550px]">
      <CardHeader>
        <CardTitle className="text-center">Profile</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        {/* { loading ?"Loading":( */}
            
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="regno"> Register Number</Label>
              <Input id="regno" 
                value={student.user_regno || regno}
                contentEditable={false}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" 
                value={student.user_name || name}
                readOnly
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" 
                value={student.user_email || email}
                readOnly

              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phno">Phone Number</Label>
              <Input id="phno" 
                value={student.user_phno || '9074244885'}
                readOnly
                
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="semester">Semester</Label>
              <Input id="semester" 
                value={student.current_sem || sem}
                readOnly
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="semester">Course</Label>
              <Input id="semester" 
                value={student.current_sem || "MCA"}
                readOnly
              />
            </div>
            <div >
            {/* <Button className="col-span-1" onClick={(e)=>setEdit(true)}>Edit</Button> */}
            </div>
          </div>
          
          {/* ) */}
        {/* } */}
        {/* { edit &&
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="regno"> Register Number</Label>
              <Input id="regno" 
                value={loading?"Loading":student.user_regno}
                contentEditable={false}
                onChange={(e)=>{setStudent((current)=>({...current,user_regno:e.target.value}))}}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" 
                value={student.user_name}
                contentEditable={edit}
                onChange={(e)=>{setStudent((current)=>({...current,user_name:e.target.value}))}}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" 
                value={student.user_email}
                contentEditable={edit}
                onChange={(e)=>{setStudent((current)=>({...current,user_email:e.target.value}))}}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="phno">Phone Number</Label>
              <Input id="phno" 
                value={student.user_phno}
                contentEditable={edit}
                onChange={(e)=>{setStudent((current)=>({...current,user_phno:e.target.value}))}}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="semester">Semester</Label>
              <Input id="semester" 
                value={student.current_sem}
                contentEditable={edit}
                onChange={(e)=>{setStudent((current)=>({...current,current_sem:e.target.value}))}}
              />
            </div>
            <div >
            <Button className="col-span-1" onClick={(e)=>setEdit(true)}>Edit</Button>
            </div>
          </div>
          
        </form>
        }
        */}
      </CardContent>
      
    </Card>
    
  )
}
//implememnt timer and cop paste getbothAttendees function from view Attended.jsx and write that code in server.js */}
{/*
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
import axios from "axios";

export function Profile() {
  const usernames = JSON.parse(sessionStorage.getItem("username"));
  const user_id = usernames?.regno;
  const [student, setStudent] = useState({});
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const studentDetails = async () => {
      try {
        const res = await axios.post("http://localhost:5000/getStudentDetails", { user_id });
        setStudent(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error Fetching Student Details");
      }
    };
    studentDetails();
  }, []);

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:5000/updateStudentDetails", student);
      setEdit(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Error saving profile changes:", err);
      alert("Failed to update profile");
    }
  };

  return (
    <Card className="w-[550px]">
      <CardHeader>
        <CardTitle className="text-center">Profile</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        {!loading && (
          <div className="grid w-full items-center gap-4">
            {["regno", "name", "email", "phno", "semester"].map((field, index) => (
              <div key={index} className="flex flex-col space-y-1.5">
                <Label htmlFor={field}>
                  {field === "regno" ? "Register Number" : field.charAt(0).toUpperCase() + field.slice(1)}
                </Label>
                <Input
                  id={field}
                  value={student[`user_${field}`]}
                  disabled={!edit || field === "regno"}
                  onChange={(e) =>
                    setStudent((current) => ({ ...current, [`user_${field}`]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div>
              {edit ? (
                <Button className="col-span-1" onClick={handleSave}>
                  Save
                </Button>
              ) : (
                <Button className="col-span-1" onClick={() => setEdit(true)}>
                  Edit
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
*/}