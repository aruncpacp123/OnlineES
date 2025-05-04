import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ViewAttended from '@/teacher/components/ViewAttended';
import { Calendar, BookOpen, User, Bookmark, Info, ChevronRight } from 'lucide-react';

export default function ExamList() {
    const usernames = JSON.parse(sessionStorage.getItem('username'));
    const inst_id = usernames?.inst_id;

    const [exam, setExam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [list, setList] = useState(true);
    const [view, setView] = useState(false);
    const [examId, setExamId] = useState('');
    const navigate = useNavigate();

    const fetchExams = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_URL}/getAllExams`, { inst_id });
            setExam(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching Exams:", err);
        }
    };

    const viewDetails = (examDetails) => {
        setList(false);
        setView(true);
        setExamId(examDetails);
    };

    useEffect(() => {
        fetchExams();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                {list && !view && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                                <BookOpen className="h-8 w-8 text-blue-600" />
                                Exam Management
                            </h1>
                            <div className="text-sm text-gray-500">
                                {exam.length} exams found
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <Table className="">
                                <TableCaption className="text-gray-500 text-lg font-medium p-4">
                                    <div className="flex items-center gap-2">
                                        <Info className="h-5 w-5 text-blue-500" />
                                        List of all exams in your institution
                                    </div>
                                </TableCaption>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="w-[50px] font-semibold text-gray-700">#</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Exam</TableHead>
                                        <TableHead className="font-semibold text-gray-700">Description</TableHead>
                                        <TableHead className="font-semibold text-gray-700">
                                            <div className="flex items-center gap-1">
                                                <Bookmark className="h-4 w-4" /> Course
                                            </div>
                                        </TableHead>
                                        <TableHead className="font-semibold text-gray-700">Subject</TableHead>
                                        <TableHead className="font-semibold text-gray-700">
                                            <div className="flex items-center gap-1">
                                                <User className="h-4 w-4" /> Teacher
                                            </div>
                                        </TableHead>
                                        <TableHead className="font-semibold text-gray-700">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" /> Date
                                            </div>
                                        </TableHead>
                                        <TableHead className="text-right font-semibold text-gray-700">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="py-12 text-center">
                                                <div className="flex flex-col items-center justify-center gap-3">
                                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                                                    <span className="text-gray-600">Loading exam data...</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : exam.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="py-12 text-center text-gray-500">
                                                No exams found in your institution
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        exam.map((item, index) => (
                                            <TableRow key={index} className="hover:bg-gray-50 transition-colors group">
                                                <TableCell className="font-medium text-gray-700">{index + 1}</TableCell>
                                                <TableCell>
                                                    <div className="font-medium text-gray-800">{item.exam_name}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-gray-600 line-clamp-1">{item.description}</div>
                                                </TableCell>
                                                <TableCell className="text-gray-700">{item.course_name}</TableCell>
                                                <TableCell className="text-gray-700">{item.subject_name}</TableCell>
                                                <TableCell className="text-gray-700">{item.user_name}</TableCell>
                                                <TableCell className="text-gray-700">
                                                    {new Date(item.starting_date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        onClick={() => viewDetails(item)}
                                                        className="flex items-center gap-1 group-hover:bg-blue-50"
                                                    >
                                                        <ChevronRight className="h-4 w-4" /> Details
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}

                {!list && view && (
                    <div className="space-y-6">
                        <Button 
                            variant="outline" 
                            onClick={() => {
                                setList(true);
                                setView(false);
                            }}
                            className="flex items-center gap-2 mb-6"
                        >
                            <ChevronRight className="h-4 w-4 transform rotate-180" /> Back to Exams
                        </Button>
                        <ViewAttended details={examId} />
                    </div>
                )}
            </div>
        </div>
    );
}
// import React, { useEffect, useState } from 'react'
// import {Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import ViewAttended from '@/teacher/components/ViewAttended';

// export default function () {
//     const usernames = JSON.parse(sessionStorage.getItem('username'));
//     const inst_id = usernames?.inst_id;

//     const [exam,setExam] = useState([]);
//     const [loading,setLoading] = useState(true)
//     const [list,setList] = useState(true)
//     const [view,setView] = useState(false);
//     const [answer,setAnswer] = useState(false);
//     const [examId,setExamId] = useState('');
//     const navigate = useNavigate();

//     const fetchExams= async ()=>{
//         try {
//             const res = await axios.post(`${import.meta.env.VITE_URL}/getAllExams`,{inst_id});
//             setTimeout(() => {
//                 setExam(res.data);
//                 setLoading(false);
//                 console.log(exam)
//             }, 2000);
//           } catch (err) {
//             console.error("Error fetching Exams:", err);
//           }

//     };

//     const viewAnswer =(examDetails) =>{
//       console.log(examDetails)
//         setList(false);
//         setView(true);
//         setAnswer(false);
//         setExamId(examDetails);
//     };

//     useEffect(()=>{
//         fetchExams();
//     },[loading]);
//    return (
//     <div>
//       {list && !view && !answer &&
//         <div>
//           <Table className="">
//               <TableCaption>A list of Exams.</TableCaption>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="w-[100px]">No.</TableHead>
//                   <TableHead className="w-[250px]">Name</TableHead>
//                   <TableHead className="w-[500px]">Description</TableHead>
//                   <TableHead className="w-[250px]">Course</TableHead>
//                   <TableHead className="w-[250px]">Subject</TableHead>
//                   <TableHead className="w-[250px]">Teacher</TableHead>
//                   <TableHead className="w-[250px]">Date</TableHead>
//                   {/* <TableHead className="">Actions</TableHead> */}
//                 </TableRow>
//               </TableHeader>
//               <TableBody >              
//               {
//                   loading?(<TableRow><TableCell colSpan="6" className="text-center font-mono font-extrabold">LOADING ......</TableCell></TableRow>):
//                   (
//                   exam.map((item,index)=>(
//                   <TableRow key={index} className="text-left">
//                     <TableCell className="font-medium">{index+1}</TableCell>
//                     <TableCell>{item.exam_name}</TableCell>
//                     <TableCell>{item.description}</TableCell>
//                     <TableCell>{item.course_name}</TableCell>
//                     <TableCell>{item.subject_name}</TableCell>
//                     <TableCell>{item.user_name}</TableCell>
//                     <TableCell>{item.starting_date}</TableCell>
//                     <TableCell className="text-right ">
//                       <Button className="bg-green-600 mr-12" onClick={(e)=>viewAnswer(item)}> View Details</Button>
//                     </TableCell>
//                   </TableRow>
//                   ))
//                   )
//               }
//               </TableBody>
//           </Table>
//         </div>
//         }
//         {
//           !list && view && !answer &&
//           <ViewAttended details={examId}/>
//         }
//     </div>

//   )
// }
