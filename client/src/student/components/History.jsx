import React, { useEffect, useState } from 'react'
import {Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function () {
    const usernames = JSON.parse(sessionStorage.getItem('username'));
    const regno = usernames?.regno;
    const course_id = usernames.course;
    const semester = usernames.sem;
    const [history,setHistory] = useState([]);
    const [loading,setLoading] = useState(true)

    const navigate = useNavigate();

    const fetchHistory= async ()=>{
        try {
            const res = await axios.post('http://localhost:5000/fetchHistory',{regno});
            setTimeout(() => {
                setHistory(res.data);
                setLoading(false);
    
            }, 1000);
          } catch (err) {
            console.error("Error fetching history:", err);
          }

    };


    useEffect(()=>{
        fetchHistory();
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
                <TableHead className="w-[250px]">Quiz Mark</TableHead>
                <TableHead className="w-[250px]">Subjective Mark</TableHead>
                <TableHead className="">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody >              
            {
                loading?(<TableRow><TableCell colSpan="6" className="text-center font-mono font-extrabold">LOADING ......</TableCell></TableRow>):
                (
                history.map((item,index)=>(
                <TableRow key={index} className="text-left">
                  <TableCell className="font-medium">{index+1}</TableCell>
                  <TableCell>{item.exam_name}</TableCell>
                  <TableCell>{item.subject_name}</TableCell>

                  <TableCell>{item.quiz_mark==-1?"Nill":item.quiz_mark}</TableCell>
                  <TableCell>{item.subjective_mark==-1?"Not Corrected":(item.subjective_mark==-2?"Nill":item.subjective_mark)}</TableCell>
                  <TableCell>{item.quiz_mark+item.subjective_mark}</TableCell>

                 
                </TableRow>
                ))
                )
            }
            </TableBody>
        </Table>
    </div>
  )
}
