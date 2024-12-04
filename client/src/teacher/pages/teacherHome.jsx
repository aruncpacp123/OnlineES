import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import { Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"
import ExamList from '../components/ExamList'
import ExamForm from '../components/ExamForm'
import { Student } from '../components/student'
import { Subjects } from '../components/Subjects'
import { Profile } from '../components/profile'

export default function Home() {
  const navigate = useNavigate();
  const isAuthenticated = JSON.parse(sessionStorage.getItem("username"));
  const userRole = isAuthenticated ? isAuthenticated.userRole :"no" // Example: Replace with your actual logic
useEffect(()=>{
  if (userRole === "teacher") {
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="exam">Exam</TabsTrigger>
                {/* <TabsTrigger value="history">History</TabsTrigger> */}

                <TabsTrigger value="student">Students</TabsTrigger>

                <TabsTrigger value="subject">Subjects</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>

                {/* <TabsTrigger value="more">More</TabsTrigger> */}

              </TabsList>
              <TabsContent value="exam">                 
                  <div className="flex  flex-col ">
                      <div className='text-right mr-5'>
                        <ExamForm />
                      </div>
                      <div className='mt-5 m-7'>
                        <ExamList />
                      </div>
                  </div>
              </TabsContent>
              <TabsContent value="student">
                <Student />
              </TabsContent>
              <TabsContent value="subject">
                <Subjects />
              </TabsContent>
              <TabsContent value="profile">
                <Profile />
              </TabsContent>
            </Tabs>
        </div>
    </div>
  )
}
