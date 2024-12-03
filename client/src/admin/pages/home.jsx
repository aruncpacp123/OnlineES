import React,{useEffect} from 'react'
import Navbar from '../components/navbar'
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Departments from '../components/departments'
import Courses from '../components/courses'
import { useNavigate } from 'react-router-dom'
import Subjects from '../components/subjects'
import { Student } from '../components/student'
import { TeacherList } from '../components/TeacherList'
import Exam from '../components/Exam'
export default function Home() {

    const navigate = useNavigate();
    const isAuthenticated = JSON.parse(sessionStorage.getItem("username"));
    const userRole = isAuthenticated ? isAuthenticated.userRole :"no" // Example: Replace with your actual logic
    useEffect(()=>{
      if (userRole === "admin") {
        console.log("first")
    }else{
      const logout = ()=>{
        // sessionStorage.removeItem("username");
        navigate('/')
    }
    logout();
    
    }
    },[]);
  return (
    <div>
        <Navbar />
        <div className="flex border-t-4 border-t-slate-800">
            <Tabs defaultValue="exam" className="min-w-full ">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="exam">Exam</TabsTrigger>
                <TabsTrigger value="student">Students</TabsTrigger>
                <TabsTrigger value="teacher">Teachers</TabsTrigger>
                {/* <TabsTrigger value="pending">Pending</TabsTrigger>   */}
                <TabsTrigger value="department">Departments</TabsTrigger>
                <TabsTrigger value="course">Courses</TabsTrigger>
                <TabsTrigger value="subject">Subjects</TabsTrigger>
                {/* <TabsTrigger value="more">More</TabsTrigger> */}
              </TabsList>
              <TabsContent value="exam">
                <Exam />
              </TabsContent>
              <TabsContent value="student">
                <Student />
              </TabsContent>
              <TabsContent value="teacher">
                <TeacherList />
              </TabsContent>
            
              <TabsContent value="department">
                <Departments />
              </TabsContent>
              <TabsContent value="course">
                {/* {navigate('/admin/courses')} */}
                <Courses />
              </TabsContent>
              <TabsContent value="subject">
                <Subjects />
              </TabsContent>
            </Tabs>
        </div>
    </div>
  )
}
