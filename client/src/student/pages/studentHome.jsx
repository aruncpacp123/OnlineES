import React, { useContext, useState ,useEffect} from 'react'
import Navbar from '../components/navbar'
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog"
import { Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import ExamList from '../components/ExamList'
import { Profile } from '../components/profile'
import History from '../components/history'

export default function Home() {
    const navigate = useNavigate();
    const isAuthenticated = JSON.parse(sessionStorage.getItem("username"));
    const userRole = isAuthenticated ? isAuthenticated.userRole :"no" // Example: Replace with your actual logic
    useEffect(()=>{
      if (userRole === "student") {
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
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="more">More</TabsTrigger>

              </TabsList>
              <TabsContent value="exam">                 
                  <div className="flex  flex-col ">
                      <div className='text-right mr-5'>
                        <ExamList />
                      </div>
                      <div className='mt-5 m-7'>

                      </div>
                  </div>
              </TabsContent>
              <TabsContent value="profile">
                <div className='flex justify-center items-center'>
                    <Profile />

                </div>
              </TabsContent>
              <TabsContent value="history">
                <div className='flex justify-center items-center'>
                    <History />

                </div>
              </TabsContent>
            </Tabs>
        </div>
    </div>
  )
}
