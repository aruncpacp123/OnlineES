import React, { useEffect, useState } from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
export default function Pending() {

    const [students,setStudents] = useState([]);
    const [teachers,setTeachers] = useState([]);
    const [load,setLoad] = useState(true);
    const usernames = JSON.parse(sessionStorage.getItem('username'));
    const inst_id = usernames?.inst_id;

    const updateStudentStatus =async (student_id,status)=>{
        
        try 
        {
          const res = await axios.post(`${import.meta.env.VITE_URL}/updatePendingStudent`,{status,student_id});
        }catch(err){
            console.error(err);
        }
      }

    const fetchStudents= async ()=>{
          try {
              const res = await axios.post(`${import.meta.env.VITE_URL}/getPendingStudents`,{inst_id});
              setStudents(res.data);
              setLoad(false);
              console.log(students)
            } catch (err) {
              console.error("Error fetching students:", err);
            }
      };

      const updateTeacherStatus =async (teacher_id,status)=>{
        
        try 
        {
          const res = await axios.post(`${import.meta.env.VITE_URL}/updatePendingTeacher`,{status,teacher_id});
        }catch(err){
            console.error(err);
        }
      }

    const fetchTeachers= async ()=>{
          try {
              const res = await axios.post(`${import.meta.env.VITE_URL}/getPendingTeacher`,{inst_id});
              setTeachers(res.data);
              setLoad(false);
              console.log(students)
            } catch (err) {
              console.error("Error fetching students:", err);
            }
      };
      
    
      useEffect(() => {
        setLoad(true);
        fetchStudents();
        fetchTeachers();
      }, []);
  return (
    
    <div className="flex border-t-4 border-t-slate-800">
        <Tabs defaultValue="student" className="min-w-full ">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Students</TabsTrigger>
            <TabsTrigger value="teacher">Teachers</TabsTrigger>
          </TabsList>
          <TabsContent value="student">
                <div className='mt-5 m-7'>
                            <Table className="">
                                <TableCaption>A list of Students.</TableCaption>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[200px]">No.</TableHead>
                                    <TableHead className="w-[1000px]">Name</TableHead>
                                    <TableHead className="w-[1000px]">Email</TableHead>
                                    <TableHead className="w-[1000px]">RegNo</TableHead>
                                    <TableHead className="w-[1000px]">Gender</TableHead>
                                    <TableHead className="w-[1000px]">Course</TableHead>
                                    <TableHead className="w-[1000px]">Semester</TableHead>
                                    <TableHead className="">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                {
                                    load ? "Loading" :(
                                
                                <TableBody >
                                        {
                                            students.map((item,index)=>(
                                            <TableRow key={index}>
                                              <TableCell className="font-medium">{index+1}</TableCell>
                                              <TableCell>{item.user_name}</TableCell>
                                              <TableCell>{item.user_email}</TableCell>
                                              <TableCell>{item.user_regno}</TableCell>
                                              <TableCell>{item.user_gender}</TableCell>
                                              <TableCell>{item.course_name}</TableCell>
                                              <TableCell>{item.sem_no}</TableCell>

                                              <TableCell className="text-right min-w-[300px] ">
                                                <Button className="bg-green-600 mr-12" onClick={(e)=>updateStudentStatus(item.user_id,"approved")}>Approve</Button>
                                                <Button className="bg-red-600 mr-12" onClick={(e)=>updateStudentStatus(item.user_id,"rejected")}>Reject</Button>
                                              </TableCell>
                                            </TableRow>
                                            ))
                                        }
                                </TableBody>
                               ) }
                            </Table>
                        </div>
          </TabsContent>
          <TabsContent value="teacher">
          <div className='mt-5 m-7'>
                            <Table className="">
                                <TableCaption>A list of Teachers.</TableCaption>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="w-[200px]">No.</TableHead>
                                    <TableHead className="w-[1000px]">Name</TableHead>
                                    <TableHead className="w-[1000px]">Email</TableHead>
                                    <TableHead className="w-[1000px]">Gender</TableHead>
                                    <TableHead className="w-[1000px]">Department</TableHead>
                                    <TableHead className="">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                {
                                    load ? "Loading" :(
                                
                                <TableBody >
                                        {
                                            teachers.map((item,index)=>(
                                            <TableRow key={index}>
                                              <TableCell className="font-medium">{index+1}</TableCell>
                                              <TableCell>{item.user_name}</TableCell>
                                              <TableCell>{item.user_email}</TableCell>
                                              <TableCell>{item.user_gender}</TableCell>
                                              <TableCell>{item.dept_name}</TableCell>
                                              <TableCell className="text-right min-w-[300px] ">
                                                <Button className="bg-green-600 mr-12" onClick={(e)=>updateTeacherStatus(item.user_id,"approved")}>Approve</Button>
                                                <Button className="bg-red-600 mr-12" onClick={(e)=>updateStudentStatus(item.user_id,"rejected")}>Reject</Button>
                                              </TableCell>
                                            </TableRow>
                                            ))
                                        }
                                </TableBody>
                               ) }
                            </Table>
                        </div>
          </TabsContent>
        </Tabs>
    </div>
  )
}
