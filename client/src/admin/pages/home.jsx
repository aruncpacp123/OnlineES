import React from 'react'
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
export default function Home() {
    const navigate = useNavigate();
  return (
    <div>
        <Navbar />
        <div className="flex border-t-4 border-t-slate-800">
            <Tabs defaultValue="exam" className="min-w-full ">
              <TabsList className="grid w-full grid-cols-8">
                <TabsTrigger value="exam">Exam</TabsTrigger>
                <TabsTrigger value="student">Students</TabsTrigger>
                <TabsTrigger value="teacher">Teachers</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>  
                <TabsTrigger value="department">Departments</TabsTrigger>
                <TabsTrigger value="course">Courses</TabsTrigger>
                <TabsTrigger value="subject">Subjects</TabsTrigger>
                <TabsTrigger value="more">More</TabsTrigger>

              </TabsList>
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
