import React, { useContext, useState } from 'react'
import Navbar from '../components/navbar'
import { Button } from "@/components/ui/button"
import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useNavigate } from 'react-router-dom'
import ExamList from '../components/ExamList'
import ExamForm from '../components/ExamForm'
// import { UserContext } from '@/login/utils/contexts/logincredentials'
import { ExamProvider } from '../utils/contexts'
import { ExamContext } from '../utils/contexts'
import QuizForm from '../components/quizForm'
export default function Home() {
    const navigate = useNavigate();
    const [add,setAdd] = useState(false);
    const [step1,setStep1] = useState(false);
    const [step2,setStep2] = useState(false);
    // const {login} = useContext(ExamContext);
    // setExam({add:false,step1:false,step2:false})
    // login({add:false,step1:false,step2:false})
    const create = ()=>{
      navigate('/teacher/exam')
    }
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
                        <Button variant="outline" className="mr-5 bg-slate-600 text-white mt-5" onClick={create}>ADD</Button>

                        {/* <ExamForm /> */}
                        <QuizForm />
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
