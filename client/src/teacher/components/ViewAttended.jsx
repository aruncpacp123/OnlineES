import React, { useEffect, useState } from 'react'
import {Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ViewAnswers from './ViewAnswers';
import { List } from 'lucide-react';
export default function({details}) {

    const [exam,setExam] = useState([]);
    const [loading,setLoading] = useState(true);

    const exam_id = details.exam_id;
    const quiz_id = details.quiz_id;
    const subjective_id = details.subjective_id;

    const [quiz,setQuiz] = useState(false);
    const [sub,setSub] = useState(false);
    const [both,setBoth] = useState(false);

    const [list,setList] = useState(true);
    const [more,setMore] = useState(false);
    const [answer,setAnswer] = useState('');

    const navigate = useNavigate();

    const viewAnswer =(examDetails) =>{
        setList(false);
        setMore(true);
        setAnswer(examDetails);
    };

    const fetchQuizAttendees= async ()=>{
        try {
            console.log(details)
            const res = await axios.post('http://localhost:5000/getQuizAttendees',{quiz_id});
            setTimeout(() => {
                setExam(res.data);
                setLoading(false);
            }, 2000);
          } catch (err) {
            console.error("Error fetching colleges:", err);
          }
    };
    const fetchSubjectiveAttendees= async ()=>{
        try {
            console.log(details)
            const res = await axios.post('http://localhost:5000/getSubjectiveAttendees',{subjective_id});
            setTimeout(() => {
                setExam(res.data);
                setLoading(false);
            }, 2000);
          } catch (err) {
            console.error("Error fetching colleges:", err);
          }
    };
    const fetchBothAttendees= async ()=>{
        try {
            console.log(details)
            const res = await axios.post('http://localhost:5000/getBothAttendees',{exam_id});
            setTimeout(() => {
                setExam(res.data);
                setLoading(false);
            }, 2000);
          } catch (err) {
            console.error("Error fetching colleges:", err);
          }
    };


    useEffect(()=>{
        if(quiz_id !=0 && subjective_id !=0){
            setBoth(true);
            fetchBothAttendees();
        }
        else if(quiz_id !=0){
            setQuiz(true);
            fetchQuizAttendees();
        }
        else{
            setSub(true);
            fetchSubjectiveAttendees();
        }
       
    },[loading,answer]);

      
   return (
    <div>
        {quiz && list &&
        <Table className="">
            <TableCaption>A list of Exams.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">No.</TableHead>
                <TableHead className="w-[250px]">Student Name</TableHead>
                <TableHead className="w-[250px]">Quiz Mark</TableHead>
             
              </TableRow>
            </TableHeader>
            <TableBody >              
            {
                loading?(<TableRow><TableCell colSpan="6" className="text-center font-mono font-extrabold">LOADING ......</TableCell></TableRow>):
                (
                exam.map((item,index)=>(
                <TableRow key={index} className="text-left">
                  <TableCell className="font-medium">{index+1}</TableCell>
                  <TableCell>{item.user_name}</TableCell>
                  <TableCell>{item.total_mark}</TableCell>
                </TableRow>
                ))
                )
            }
            </TableBody>
        </Table>
        }
        {sub && list &&
        <Table className="">
            <TableCaption>A list of Exams.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">No.</TableHead>
                <TableHead className="w-[250px]">Student Name</TableHead>
                <TableHead className="w-[250px]">Subjective  Mark</TableHead>
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
                  <TableCell>{item.user_name}</TableCell>
                  <TableCell>{item.total_mark==-1?"not corrected":item.total_mark}</TableCell>
                  <TableCell className="text-right ">
                    <Button className="bg-green-600 mr-12" onClick={(e)=>viewAnswer()}> View Answers </Button>
                  </TableCell>
                </TableRow>
                ))
                )
            }
            </TableBody>
        </Table>
        }
        {both && list &&
        
        <Table className="">
            <TableCaption>A list of Exams.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">No.</TableHead>
                <TableHead className="w-[250px]">Student Name</TableHead>
                <TableHead className="w-[250px]">Quiz Mark</TableHead>

                <TableHead className="w-[250px]">Subjective  Mark</TableHead>
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
                  <TableCell>{item.user_name}</TableCell>
                  <TableCell>{item.qtotal}</TableCell>
                  <TableCell>{item.stotal==-1?"Not corrected":item.stotal}</TableCell>

                  <TableCell className="text-right ">
                    <Button className="bg-green-600 mr-12" onClick={(e)=>{setAnswer(item);viewAnswer(item)}}> View Answers </Button>
                  </TableCell>
                </TableRow>
                ))
                )
            }
            </TableBody>
        </Table>
        }
        {more && answer && <ViewAnswers />}
    </div>
  )
}
