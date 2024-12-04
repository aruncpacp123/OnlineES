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
    const [loading2,setLoading2] = useState(true);


    const exam_id = details.exam_id;
    const quiz_id = details.quiz_id;
    const subjective_id = details.subjective_id;

    const [quiz,setQuiz] = useState(false);
    const [sub,setSub] = useState(false);
    const [both,setBoth] = useState(false);

    const [list,setList] = useState(true);
    const [more,setMore] = useState(false);
    const [answer,setAnswer] = useState('');

    const [marks, setMarks] = useState({});
    const navigate = useNavigate();

    const viewAnswer =(examDetails) =>{
        setList(false);
        setMore(true);
        setAnswer(examDetails);

        // document.getElementById('inner').innerHTML=`<ViewAnswers />`;
    };

    const fetchQuizAttendees= async ()=>{
        try {
            console.log(details)
            const res = await axios.post(`${import.meta.env.VITE_URL}/getQuizAttendees`,{quiz_id});
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
            const res = await axios.post(`${import.meta.env.VITE_URL}/getSubjectiveAttendees`,{subjective_id});
            setTimeout(() => {
                setExam(res.data);
                setLoading(false);
            }, 2000);
          } catch (err) {
            console.error("Error fetching colleges:", err);
          }
    };
    const fetchBothAttendeess= async ()=>{
        try {
            console.log(details)
            const res = await axios.post(`${import.meta.env.VITE_URL}/getBoth`,{exam_id});
            setTimeout(() => {
                setExam(res.data.attendees);
                setMarks(res.data.marks);
                setLoading(false);
                // console.log(res.data)
            }, 2000);
          } catch (err) {
            console.error("Error fetching marks:", err);
          }
    };
    const fetchMark= async (sub_id,regno)=>{
        try {
            console.log(sub_id,regno)
            const res = await axios.post(`${import.meta.env.VITE_URL}/getMark`,{sub_id,regno});
            console.log(res.data)
            setTimeout(() => {
                setLoading2(false);
            }, 2000);
            return res.data.mark;
          } catch (err) {
            console.error("Error fetching colleges:", err);
          }
    };
    const fetchBothAttendees = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/getBothAttendees`, { exam_id });
            setExam(res.data);
            setLoading(false);

            // Fetch marks for each attendee
            const markPromises = res.data.map(async item => {
                const response = await axios.post(`${import.meta.env.VITE_URL}/getMark`, {
                    sub_id: item.subjective_id,
                    regno: item.user_regno
                });
                const dat = response.data?.total_mark
                return { [item.user_regno]: dat };
            });
            
            const markResults = await Promise.all(markPromises);
            setMarks(markResults.reduce((acc, curr) => ({ ...acc, ...curr }), {}));
        } catch (err) {
            console.error("Error fetching attendees or marks:", err);
        }
    };
    useEffect(()=>{
        if(quiz_id !=0 && subjective_id !=0){
            setBoth(true);
            fetchBothAttendeess();
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
                    <Button className="bg-green-600 mr-12" onClick={(e)=>{viewAnswer(item)}}> View Answers </Button>
                  </TableCell>
                </TableRow>
                ))
                )
            }
            </TableBody>
        </Table>
        }
        {both && list && marks &&
        
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
                  {/* <TableCell>{item.stotal==-1?"Not corrected":item.stotal}</TableCell> */}
                  <TableCell>{marks[item.user_regno]==-1 ?"Not Corrected":marks[item.user_regno]}</TableCell>
                   {console.log(marks)}
                  <TableCell className="text-right ">
                    <Button className="bg-green-600 mr-12" onClick={(e)=>{viewAnswer(item)}}> View Answers </Button>
                  </TableCell>
                </TableRow>
                ))
                )
            }
            </TableBody>
        </Table>
        }
        {more && answer && <ViewAnswers answer={answer}/>}
    </div>
  )
}
