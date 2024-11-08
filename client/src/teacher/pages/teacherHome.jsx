import React, { useState } from 'react'
import Navbar from '../components/navbar'
import { Tabs,TabsContent,TabsList,TabsTrigger,} from "@/components/ui/tabs"
import { useNavigate } from 'react-router-dom'
import ExamList from '../components/ExamList'
import ExamForm from '../components/ExamForm'

export default function Home() {
  
  const navigate = useNavigate();

  return (
    <div>
        <Navbar />
        <div className="flex border-t-4 border-t-slate-800">
            <Tabs defaultValue="exam" className="min-w-full ">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="exam">Exam</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>

                <TabsTrigger value="student">Students</TabsTrigger>

                <TabsTrigger value="subject">Subjects</TabsTrigger>
                <TabsTrigger value="more">More</TabsTrigger>

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
            </Tabs>
        </div>
    </div>
  )
}
