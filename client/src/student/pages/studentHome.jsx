import React, { useContext, useState } from 'react'
import Navbar from '../components/navbar'
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog"
import { Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from 'react-router-dom'
import ExamList from '../components/ExamList'

export default function Home() {
    const navigate = useNavigate();

  return (
    <div>
        <Navbar />
        <div className="flex border-t-4 border-t-slate-800">
            <Tabs defaultValue="exam" className="min-w-full ">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="exam">Exam</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="student">Profile</TabsTrigger>
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
            </Tabs>
        </div>
    </div>
  )
}
