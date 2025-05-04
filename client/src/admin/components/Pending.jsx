import React, { useEffect, useState } from 'react';
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
} from "@/components/ui/table";
import { User, Users, Mail, BookOpen, GraduationCap, X, Check, Loader2 } from 'lucide-react';

export default function Pending() {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const inst_id = usernames?.inst_id;

  const updateStudentStatus = async (student_id, status) => {
    try {
      await axios.post(`${import.meta.env.VITE_URL}/updatePendingStudent`, { status, student_id });
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/getPendingStudents`, { inst_id });
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  const updateTeacherStatus = async (teacher_id, status) => {
    try {
      await axios.post(`${import.meta.env.VITE_URL}/updatePendingTeacher`, { status, teacher_id });
      fetchTeachers();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/getPendingTeacher`, { inst_id });
      setTeachers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchStudents();
    fetchTeachers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Users className="h-8 w-8" />
              Pending Approvals
            </h1>
            <p className="text-blue-100 mt-2">
              Review and approve new student and teacher registrations
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="student" className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 h-12">
            <TabsTrigger 
              value="student" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Students ({students.length})
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="teacher" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Teachers ({teachers.length})
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="student" className="mt-6">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="hover:bg-gray-50">
                    <TableHead className="w-12 text-gray-600">#</TableHead>
                    <TableHead className="text-gray-600">Student</TableHead>
                    <TableHead className="text-gray-600">Email</TableHead>
                    <TableHead className="text-gray-600">Details</TableHead>
                    <TableHead className="text-right text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                          <p className="text-gray-600">Loading student data...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-64 text-center text-gray-500">
                        No pending student approvals
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((item, index) => (
                      <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium text-gray-700">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{item.user_name}</span>
                            <span className="text-sm text-gray-500">{item.user_regno}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700 truncate max-w-[200px]">
                          {item.user_email}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm">
                              <span className="font-medium">Course:</span> {item.course_name}
                            </span>
                            <span className="text-sm">
                              <span className="font-medium">Semester:</span> {item.sem_no}
                            </span>
                            <span className="text-sm">
                              <span className="font-medium">Gender:</span> {item.user_gender}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="success" 
                              size="sm" 
                              onClick={() => updateStudentStatus(item.user_id, "approved")}
                              className="flex items-center gap-1"
                            >
                              <Check className="h-4 w-4" /> Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => updateStudentStatus(item.user_id, "rejected")}
                              className="flex items-center gap-1"
                            >
                              <X className="h-4 w-4" /> Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Teachers Tab */}
          <TabsContent value="teacher" className="mt-6">
            <div className="rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="hover:bg-gray-50">
                    <TableHead className="w-12 text-gray-600">#</TableHead>
                    <TableHead className="text-gray-600">Teacher</TableHead>
                    <TableHead className="text-gray-600">Email</TableHead>
                    <TableHead className="text-gray-600">Department</TableHead>
                    <TableHead className="text-right text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                          <p className="text-gray-600">Loading teacher data...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : teachers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-64 text-center text-gray-500">
                        No pending teacher approvals
                      </TableCell>
                    </TableRow>
                  ) : (
                    teachers.map((item, index) => (
                      <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium text-gray-700">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{item.user_name}</span>
                            <span className="text-sm text-gray-500">{item.user_gender}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-700 truncate max-w-[200px]">
                          {item.user_email}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                            {item.dept_name}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="success" 
                              size="sm" 
                              onClick={() => updateTeacherStatus(item.user_id, "approved")}
                              className="flex items-center gap-1"
                            >
                              <Check className="h-4 w-4" /> Approve
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => updateTeacherStatus(item.user_id, "rejected")}
                              className="flex items-center gap-1"
                            >
                              <X className="h-4 w-4" /> Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
// import React, { useEffect, useState } from 'react'
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import axios from 'axios';
// import {
//     Table,
//     TableBody,
//     TableCaption,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
//   } from "@/components/ui/table"
// export default function Pending() {

//     const [students,setStudents] = useState([]);
//     const [teachers,setTeachers] = useState([]);
//     const [load,setLoad] = useState(true);
//     const usernames = JSON.parse(sessionStorage.getItem('username'));
//     const inst_id = usernames?.inst_id;

//     const updateStudentStatus =async (student_id,status)=>{
        
//         try 
//         {
//           const res = await axios.post(`${import.meta.env.VITE_URL}/updatePendingStudent`,{status,student_id});
//         }catch(err){
//             console.error(err);
//         }
//       }

//     const fetchStudents= async ()=>{
//           try {
//               const res = await axios.post(`${import.meta.env.VITE_URL}/getPendingStudents`,{inst_id});
//               setStudents(res.data);
//               setLoad(false);
//               console.log(students)
//             } catch (err) {
//               console.error("Error fetching students:", err);
//             }
//       };

//       const updateTeacherStatus =async (teacher_id,status)=>{
        
//         try 
//         {
//           const res = await axios.post(`${import.meta.env.VITE_URL}/updatePendingTeacher`,{status,teacher_id});
//         }catch(err){
//             console.error(err);
//         }
//       }

//     const fetchTeachers= async ()=>{
//           try {
//               const res = await axios.post(`${import.meta.env.VITE_URL}/getPendingTeacher`,{inst_id});
//               setTeachers(res.data);
//               setLoad(false);
//               console.log(students)
//             } catch (err) {
//               console.error("Error fetching students:", err);
//             }
//       };
      
    
//       useEffect(() => {
//         setLoad(true);
//         fetchStudents();
//         fetchTeachers();
//       }, []);
//   return (
    
//     <div className="flex border-t-4 border-t-slate-800">
//         <Tabs defaultValue="student" className="min-w-full ">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="student">Students</TabsTrigger>
//             <TabsTrigger value="teacher">Teachers</TabsTrigger>
//           </TabsList>
//           <TabsContent value="student">
//                 <div className='mt-5 m-7'>
//                             <Table className="">
//                                 <TableCaption>A list of Students.</TableCaption>
//                                 <TableHeader>
//                                   <TableRow>
//                                     <TableHead className="w-[200px]">No.</TableHead>
//                                     <TableHead className="w-[1000px]">Name</TableHead>
//                                     <TableHead className="w-[1000px]">Email</TableHead>
//                                     <TableHead className="w-[1000px]">RegNo</TableHead>
//                                     <TableHead className="w-[1000px]">Gender</TableHead>
//                                     <TableHead className="w-[1000px]">Course</TableHead>
//                                     <TableHead className="w-[1000px]">Semester</TableHead>
//                                     <TableHead className="">Actions</TableHead>
//                                   </TableRow>
//                                 </TableHeader>
//                                 {
//                                     load ? "Loading" :(
                                
//                                 <TableBody >
//                                         {
//                                             students.map((item,index)=>(
//                                             <TableRow key={index}>
//                                               <TableCell className="font-medium">{index+1}</TableCell>
//                                               <TableCell>{item.user_name}</TableCell>
//                                               <TableCell>{item.user_email}</TableCell>
//                                               <TableCell>{item.user_regno}</TableCell>
//                                               <TableCell>{item.user_gender}</TableCell>
//                                               <TableCell>{item.course_name}</TableCell>
//                                               <TableCell>{item.sem_no}</TableCell>

//                                               <TableCell className="text-right min-w-[300px] ">
//                                                 <Button className="bg-green-600 mr-12" onClick={(e)=>updateStudentStatus(item.user_id,"approved")}>Approve</Button>
//                                                 <Button className="bg-red-600 mr-12" onClick={(e)=>updateStudentStatus(item.user_id,"rejected")}>Reject</Button>
//                                               </TableCell>
//                                             </TableRow>
//                                             ))
//                                         }
//                                 </TableBody>
//                                ) }
//                             </Table>
//                         </div>
//           </TabsContent>
//           <TabsContent value="teacher">
//           <div className='mt-5 m-7'>
//                             <Table className="">
//                                 <TableCaption>A list of Teachers.</TableCaption>
//                                 <TableHeader>
//                                   <TableRow>
//                                     <TableHead className="w-[200px]">No.</TableHead>
//                                     <TableHead className="w-[1000px]">Name</TableHead>
//                                     <TableHead className="w-[1000px]">Email</TableHead>
//                                     <TableHead className="w-[1000px]">Gender</TableHead>
//                                     <TableHead className="w-[1000px]">Department</TableHead>
//                                     <TableHead className="">Actions</TableHead>
//                                   </TableRow>
//                                 </TableHeader>
//                                 {
//                                     load ? "Loading" :(
                                
//                                 <TableBody >
//                                         {
//                                             teachers.map((item,index)=>(
//                                             <TableRow key={index}>
//                                               <TableCell className="font-medium">{index+1}</TableCell>
//                                               <TableCell>{item.user_name}</TableCell>
//                                               <TableCell>{item.user_email}</TableCell>
//                                               <TableCell>{item.user_gender}</TableCell>
//                                               <TableCell>{item.dept_name}</TableCell>
//                                               <TableCell className="text-right min-w-[300px] ">
//                                                 <Button className="bg-green-600 mr-12" onClick={(e)=>updateTeacherStatus(item.user_id,"approved")}>Approve</Button>
//                                                 <Button className="bg-red-600 mr-12" onClick={(e)=>updateStudentStatus(item.user_id,"rejected")}>Reject</Button>
//                                               </TableCell>
//                                             </TableRow>
//                                             ))
//                                         }
//                                 </TableBody>
//                                ) }
//                             </Table>
//                         </div>
//           </TabsContent>
//         </Tabs>
//     </div>
//   )
// }
