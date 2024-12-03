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
  
export function Student() {
 
  const [student,setStudent] = useState([])
 
  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const dept_id = usernames?.department;
  


  const fetchStudents= async ()=>{
      try {
          const res = await axios.post(`${import.meta.env.VITE_URL}/getStudentsByDepartment`,{dept_id});
          setStudent(res.data);
        } catch (err) {
          console.error("Error fetching Student Details:", err);
        }
  };

  useEffect(() => {
    fetchStudents();
  }, []);
  
  
  return (
    <div className=''>
        <div className="flex justify-end mr-5">
            
        </div>
        <div className='mt-5 m-7'>
            <Table className="">
                <TableCaption>A list of Students.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">No.</TableHead>
                    <TableHead className="w-[230px]">Register Number.</TableHead>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead className="w-[200px]">Email.</TableHead>
                    {/* <TableHead className="w-[200px]">Date of Birth.</TableHead> */}
                    <TableHead className="">Course</TableHead>
                    <TableHead className="">Semester</TableHead>

                  </TableRow>
                </TableHeader>
                <TableBody >
                        {
                            student.map((item,index)=>(
                            <TableRow key={index}>
                              <TableCell className="font-medium">{index+1}</TableCell>
                              <TableCell>{item.user_regno}</TableCell>
                              <TableCell>{item.user_name}</TableCell>
                              <TableCell>{item.user_email}</TableCell>
                              {/* <TableCell>{item.user_dob}</TableCell> */}
                              
                              <TableCell>{item.course_name}</TableCell>
                              <TableCell>{item.current_sem}</TableCell>
                              
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
