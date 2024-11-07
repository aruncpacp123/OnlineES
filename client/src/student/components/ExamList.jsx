import React, { useEffect, useState } from 'react'
import {Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function () {
    const usernames = JSON.parse(sessionStorage.getItem('username'));
    const course_id = usernames.course;
    const semester = usernames.sem;

    const [exam,setExam] = useState([]);
    const [loading,setLoading] = useState(true)

    const navigate = useNavigate();

    const fetchExams= async ()=>{
        try {
            const res = await axios.post('http://localhost:5000/fetchExams',{course_id,semester});
            setTimeout(() => {
                setExam(res.data);
                setLoading(false);
                console.log(exam)
            }, 2000);
          } catch (err) {
            console.error("Error fetching colleges:", err);
          }

    };

    const attempt =(quiz,subjective,qno,sno,mark,exam_id) =>{
        if(quiz!=null && quiz != 0)
            navigate('/student/exam/quiz',{ state: { quiz_id:quiz,subjective_id:subjective,qno,sno,quizMark:mark,exam_id} })
        else
            navigate('/student/exam/subjective',{ state: { subjective_id:subjective,sno,exam_id} })

    };

    useEffect(()=>{
        fetchExams();
    },[loading]);
   return (
    <div>
        <Table className="">
            <TableCaption>A list of Exams.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">No.</TableHead>
                <TableHead className="w-[250px]">Name</TableHead>
                <TableHead className="w-[250px]">Subject</TableHead>
                <TableHead className="w-[500px]">Description</TableHead>
                <TableHead className="w-[250px]">Date</TableHead>
                <TableHead className="">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody >              
            {
                loading?(<TableRow><TableCell colSpan="6" className="text-center font-mono font-extrabold">LOADING ......</TableCell></TableRow>):
                (
                exam.map((item,index)=>(
                <TableRow key={index} className="text-left">
                  <TableCell className="font-medium">{index+1}</TableCell>
                  <TableCell>{item.exam_name}</TableCell>
                  <TableCell>{item.subject_name}</TableCell>

                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.starting_date}</TableCell>
                  <TableCell className="text-right ">
                    <Button className="bg-red-600 mr-12" onClick={(e)=>attempt(item.quiz_id,item.subjective_id,item.qno_of_questions,item.sno_of_questions,item.mark,item.exam_id)}>Attempt</Button>
                  </TableCell>
                </TableRow>
                ))
                )
            }
            </TableBody>
        </Table>
    </div>
  )
}
