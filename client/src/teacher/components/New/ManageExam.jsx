import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../../components/navbar'
import { Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"
import Questions from './Questions';
import ResultAnalysis from './ResultAnalysis';
import Malpractice from './Malpractice';
import { Button } from '@/components/ui/button';
import TeacherLiveDashboard from './Live';
import StudentList from './Mark';
import ViewAttended from '../ViewAttended';


export default function ManageExam() {
  const navigate = useNavigate();
  const isAuthenticated = JSON.parse(sessionStorage.getItem("username"));
  const userRole = isAuthenticated ? isAuthenticated.userRole :"no" // Example: Replace with your actual logic
  const goBack = ()=>{
    navigate('/teacher')
  }
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
// const fetchExam()=>{

// }
},[]);
  

  return (
    <div>
        <Navbar />
        <div className="flex border-t-4 border-t-slate-800">
            <Button className="fixed right-3 px-5 text-lg" onClick={goBack}><i class="bi bi-box-arrow-in-left"></i></Button>
            <Tabs defaultValue="question" className="min-w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="question">Questions</TabsTrigger>
                <TabsTrigger value="live">Live</TabsTrigger>
                <TabsTrigger value="mark">Students Marks</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="malpractice">Malpractices</TabsTrigger>
              </TabsList>
              <TabsContent value="question">               
                  <Questions/> 
              </TabsContent>
              <TabsContent value="live">                 
                  <TeacherLiveDashboard /> 
              </TabsContent>
              <TabsContent value="mark">                 
                  {/* <StudentList />  */}
                  <ViewAttended />
              </TabsContent>
              <TabsContent value="analysis">                 
                  <ResultAnalysis /> 
              </TabsContent>
              <TabsContent value="malpractice">                 
                  <Malpractice /> 
              </TabsContent>              
            </Tabs>
        </div>
    </div>
  )
}
