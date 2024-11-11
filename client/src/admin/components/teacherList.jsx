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
  
  
export function TeacherList() {
  const [teacher,setTeacher] = useState([])
  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const inst_id = usernames?.inst_id;
  
  const deleteTeacher = async (id)=>{
    try 
    {
      const res = await axios.post('http://localhost:5000/deleteTeacher', {
        id
      });
    fetchTeachers();
    }catch(err){
        console.error(err);
    }
  };

  const fetchTeachers= async ()=>{
      try {
          const res = await axios.post('http://localhost:5000/fetchTeachers',{inst_id});
          setTeacher(res.data);
        } catch (err) {
          console.error("Error fetching Teacher Details:", err);
        }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);
  
  
  return (
    <div className=''>
        <div className="flex justify-end mr-5">
            
        </div>
        <div className='mt-5 m-7'>
            <Table className="">
                <TableCaption>A list of Teachers.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">No.</TableHead>
                    {/* <TableHead className="w-[230px]">Register Number.</TableHead> */}
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead className="w-[200px]">Email.</TableHead>
                    <TableHead className="w-[200px]">Phone Number.</TableHead>
                    <TableHead className="">Department</TableHead>
                    <TableHead className="">Actions</TableHead>

                  </TableRow>
                </TableHeader>
                <TableBody >
                        {
                            teacher.map((item,index)=>(
                            <TableRow key={index}>
                              <TableCell className="font-medium">{index+1}</TableCell>
                              {/* <TableCell>{item.user_regno}</TableCell> */}
                              <TableCell>{item.user_name}</TableCell>
                              <TableCell>{item.user_email}</TableCell>
                              <TableCell>{item.user_phno}</TableCell>
                              
                              <TableCell>{item.dept_name}</TableCell>
                              <TableCell className="text-right ">
                                {/* <Edit item={item} /> */}
                                <Button className="bg-red-600 mr-12" onClick={(e)=>deleteTeacher(item.user_id)}>Delete</Button>
                              </TableCell>
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
