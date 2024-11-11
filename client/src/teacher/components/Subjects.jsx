import React, { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

  import axios from 'axios'
  
export function Subjects() {
 
  const [subject,setSubject] = useState([])
 
  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const user_id = usernames?.id;
  


  const fetchSubjects= async ()=>{
      try {
          const res = await axios.post('http://localhost:5000/getAssignedSubjects',{user_id});
          setSubject(res.data);
        } catch (err) {
          console.error("Error fetching Student Details:", err);
        }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);
  
  
  return (
    <div className=''>
        <div className="flex justify-end mr-5">
            
        </div>
        <div className='mt-5 m-7'>
            <Table className="">
                <TableCaption>A list of subjects.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">No.</TableHead>
                    <TableHead className="w-[230px]">Course </TableHead>
                    <TableHead className="w-[200px]">Subject</TableHead>
                

                  </TableRow>
                </TableHeader>
                <TableBody >
                        {
                            subject.map((item,index)=>(
                            <TableRow key={index}>
                              <TableCell className="font-medium">{index+1}</TableCell>
                              <TableCell>{item.course_name}</TableCell>
                              <TableCell>{item.subject_name}</TableCell>
                              
                            </TableRow>
                            ))
                        }
                </TableBody>
                
            </Table>
        </div>
        {/* <div className="flex justify-center mr-5">
            <Button className="bg-green-400" >ADD</Button>
        </div> */}
    </div>
    
  )
}
