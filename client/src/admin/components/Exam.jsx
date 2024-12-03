import React, { useEffect, useState } from 'react'
import {Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ViewAttended from '@/teacher/components/ViewAttended';

export default function () {
    const usernames = JSON.parse(sessionStorage.getItem('username'));
    const inst_id = usernames?.inst_id;

    const [exam,setExam] = useState([]);
    const [loading,setLoading] = useState(true)
    const [list,setList] = useState(true)
    const [view,setView] = useState(false);
    const [answer,setAnswer] = useState(false);
    const [examId,setExamId] = useState('');
    const navigate = useNavigate();

    const fetchExams= async ()=>{
        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/getAllExams`,{inst_id});
            setTimeout(() => {
                setExam(res.data);
                setLoading(false);
                console.log(exam)
            }, 2000);
          } catch (err) {
            console.error("Error fetching Exams:", err);
          }

    };

    const viewAnswer =(examDetails) =>{
        setList(false);
        setView(true);
        setAnswer(false);
        setExamId(examDetails);
    };

    useEffect(()=>{
        fetchExams();
    },[loading]);
   return (
    <div>
      {list && !view && !answer &&
        <div>
          <Table className="">
              <TableCaption>A list of Exams.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">No.</TableHead>
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead className="w-[500px]">Description</TableHead>
                  <TableHead className="w-[250px]">Course</TableHead>
                  <TableHead className="w-[250px]">Subject</TableHead>
                  <TableHead className="w-[250px]">Teacher</TableHead>
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
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.course_name}</TableCell>
                    <TableCell>{item.subject_name}</TableCell>
                    <TableCell>{item.user_name}</TableCell>
                    <TableCell>{item.starting_date}</TableCell>
                    <TableCell className="text-right ">
                      <Button className="bg-green-600 mr-12" onClick={(e)=>viewAnswer(item)}> View Details</Button>
                    </TableCell>
                  </TableRow>
                  ))
                  )
              }
              </TableBody>
          </Table>
        </div>
        }
        {
          !list && view && !answer &&
          <ViewAttended details={examId}/>
        }
    </div>

  )
}
