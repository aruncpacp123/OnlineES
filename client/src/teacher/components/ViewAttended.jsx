import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ViewAnswers from './ViewAnswers';
import { List, AlertCircle, Eye, FileText } from 'lucide-react';
import ViewMalpractices from './ViewMalpractices';
import { set } from 'date-fns';
export default function ExamResults() {
    const { examid } = useParams();
    const [exam, setExam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quiz_id, setQuizId] = useState(0);
    const [subjective_id, setSubjectiveId] = useState(0);
    const [quiz, setQuiz] = useState(false);
    const [sub, setSub] = useState(false);
    const [both, setBoth] = useState(false);
    const [list, setList] = useState(true);
    const [answer, setAnswer] = useState(null);
    const [marks, setMarks] = useState({});
    const navigate = useNavigate();
    const [viewMalpractices, setViewMalpractices] = useState(false);
    const [malpracticeStudent, setMalpracticeStudent] = useState(null);
    const viewAnswer = (examDetails) => {
        setList(false);
        setAnswer(examDetails);
    };
    const handleViewMalpractices = (student) => {
      setMalpracticeStudent(student);
      setViewMalpractices(true);
    };
    
    

    const fetchExam = async () => {
        const res = await axios.post(`${import.meta.env.VITE_URL}/fetchExamDetails`, { examid });
        setQuizId(res.data[0].quiz_id);
        setSubjectiveId(res.data[0].subjective_id);
        
        if (res.data[0].quiz_id != 0 && res.data[0].subjective_id != 0) {
            setBoth(true);
            fetchBothAttendeess();
        } else if (res.data[0].quiz_id != 0) {
            setQuiz(true);
            fetchQuizAttendees();
        } else {
            setSub(true);
            fetchSubjectiveAttendees();
        }
    };

    // ... keep your existing fetch functions ...
    const fetchQuizAttendees= async ()=>{
              try {
                  // console.log(details)
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
                  console.log("details")
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
                  // console.log(details)
                  const res = await axios.post(`${import.meta.env.VITE_URL}/getBoth`,{examid});
                  console.log(res.data)
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
                  const res = await axios.post(`${import.meta.env.VITE_URL}/getBothAttendees`, {   });
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
          const onBack=()=>{
            setList(true);
            setViewMalpractices(false);
          }
    useEffect(() => {
        fetchExam();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Exam Results</h1>
                    {(!list || viewMalpractices) && (
                        // (answer || malpracticeStudent) &&
                        <Button 
                            variant="outline" 
                            onClick={() => {onBack()}}
                            className="flex items-center gap-2"
                        >
                            <List size={16} /> Back to List
                        </Button>
                    )}
                </div>

                {list ? (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <Table className="">
                            <TableCaption className="text-gray-500 mt-4">
                                {quiz ? "Quiz Results" : sub ? "Subjective Results" : "Combined Exam Results"}
                            </TableCaption>
                            <TableHeader className="bg-gray-100">
                                <TableRow>
                                    <TableHead className="w-[80px] font-semibold text-gray-700">No.</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Student</TableHead>
                                    {both && <TableHead className="font-semibold text-gray-700">Quiz Mark</TableHead>}
                                    {(sub || both) && <TableHead className="font-semibold text-gray-700">Subjective Mark</TableHead>}
                                    <TableHead className="text-right font-semibold text-gray-700 ">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={both ? 5 : sub ? 4 : 3} className="py-8 text-center">
                                            <div className="flex justify-center items-center space-x-2">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                                <span className="text-gray-600">Loading results...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : exam.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={both ? 5 : sub ? 4 : 3} className="py-8 text-center text-gray-500">
                                            No students have taken this exam yet
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    exam.map((item, index) => (
                                        <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                                            <TableCell className="font-medium text-gray-700">{index + 1}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{item.user_name}</span>
                                                    <span className="text-sm text-gray-500">{item.user_regno}</span>
                                                </div>
                                            </TableCell>
                                            {both && (
                                                <TableCell>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        item.qtotal >= 50 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {item.qtotal}
                                                    </span>
                                                </TableCell>
                                            )}
                                            {(sub || both) && (
                                                <TableCell>
                                                    {marks[item.user_regno] == -1 ? (
                                                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                                                            Pending
                                                        </span>
                                                    ) : (
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            marks[item.user_regno] >= 50 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                            {marks[item.user_regno]}
                                                        </span>
                                                    )}
                                                </TableCell>
                                            )}
                                            <TableCell className="text-right">
                                              <div className="flex justify-end gap-2"> {/* Added flex container */}
                                                {(sub || both) && (
                                                  <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    onClick={() => viewAnswer(item)}
                                                    className="flex items-center gap-1"
                                                  >
                                                    <FileText size={14} /> Answers
                                                  </Button>
                                                )}
                                                <Button 
                                                  variant="outline" 
                                                  size="sm" 
                                                  onClick={() => handleViewMalpractices(item)}
                                                  className="flex items-center gap-1"
                                                >
                                                  <Eye size={14} /> Malpractices
                                                </Button>
                                              </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <ViewAnswers answer={answer} setList={onBack}/>
                    </div>
                )}
                {viewMalpractices && (
                  <ViewMalpractices examDetails={malpracticeStudent} setList={onBack}/>
                )}
                <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
                        <AlertCircle size={20} /> Exam Statistics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <h3 className="text-sm font-medium text-blue-800">Total Students</h3>
                            <p className="text-2xl font-bold text-blue-600 mt-1">
                                {loading ? '--' : exam.length}
                            </p>
                        </div>
                        {/* <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                            <h3 className="text-sm font-medium text-green-800">Average Score</h3>
                            <p className="text-2xl font-bold text-green-600 mt-1">
                                {loading ? '--' : 'Calculate'}
                            </p>
                        </div> */}
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                            <h3 className="text-sm font-medium text-purple-800">Pass Rate</h3>
                            <p className="text-2xl font-bold text-purple-600 mt-1">
                                {loading ? '--' : '100%'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
  // import React, { useEffect, useState,PureComponent } from 'react'
  // import {Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table"
  // import { Button } from "@/components/ui/button"
  // import axios from 'axios';
  // import { useNavigate } from 'react-router-dom';
  // import ViewAnswers from './ViewAnswers';
  // import { useParams } from 'react-router-dom';
  // import { List } from 'lucide-react';
  // export default function() {
  //     const { examid } = useParams();
  //     const [exam,setExam] = useState([]);
  //     const [loading,setLoading] = useState(true);
  //     const [loading2,setLoading2] = useState(true);
      

  //     // const exam_id = details.exam_id;
  //     // const quiz_id = details.quiz_id;
  //     // const subjective_id = details.subjective_id;
  //     const [quiz_id,setQuizId] = useState(0);
  //     const [subjective_id,setSubjectiveId] = useState(0);

  //     const [quiz,setQuiz] = useState(false);
  //     const [sub,setSub] = useState(false);
  //     const [both,setBoth] = useState(false);

  //     const [list,setList] = useState(true);
  //     const [more,setMore] = useState(false);
  //     const [answer,setAnswer] = useState('');

  //     const [marks, setMarks] = useState({});
  //     const navigate = useNavigate();

  //     const viewAnswer =(examDetails) =>{
  //         setList(false);
  //         setMore(true);
  //         setAnswer(examDetails);
  //         console.log(examDetails);

  //         // document.getElementById('inner').innerHTML=`<ViewAnswers />`;
  //     };
  //     const fetchExam = async ()=>{
  //       const res = await axios.post(`${import.meta.env.VITE_URL}/fetchExamDetails`,{examid});
  //       setQuizId(res.data[0].quiz_id);
  //       setSubjectiveId(res.data[0].subjective_id);
  //       console.log(examid)
  //       if(res.data[0].quiz_id !=0 && res.data[0].subjective_id !=0 && res.data[0].quiz_id !=null && res.data[0].subjective_id !=null){
  //         setBoth(true);
  //         console.log(res.data[0])
  //         fetchBothAttendeess();
  //       }
  //       else if(res.data[0].quiz_id !=0 && res.data[0].quiz_id !=null){
  //           setQuiz(true);
  //           fetchQuizAttendees();
  //       }
  //       else{
  //           setSub(true);
  //           console.log("first")
  //           fetchSubjectiveAttendees();
  //       }

  //     }
  //     const fetchQuizAttendees= async ()=>{
  //         try {
  //             // console.log(details)
  //             const res = await axios.post(`${import.meta.env.VITE_URL}/getQuizAttendees`,{quiz_id});
  //             setTimeout(() => {
  //                 setExam(res.data);
  //                 setLoading(false);
  //             }, 2000);
  //           } catch (err) {
  //             console.error("Error fetching colleges:", err);
  //           }
  //     };
  //     const fetchSubjectiveAttendees= async ()=>{
  //         try {
  //             console.log("details")
  //             const res = await axios.post(`${import.meta.env.VITE_URL}/getSubjectiveAttendees`,{subjective_id});
  //             setTimeout(() => {
  //                 setExam(res.data);
  //                 setLoading(false);
  //             }, 2000);
  //           } catch (err) {
  //             console.error("Error fetching colleges:", err);
  //           }
  //     };
  //     const fetchBothAttendeess= async ()=>{
  //         try {
  //             // console.log(details)
  //             const res = await axios.post(`${import.meta.env.VITE_URL}/getBoth`,{examid});
  //             console.log(res.data)
  //             setTimeout(() => {
  //                 setExam(res.data.attendees);
  //                 setMarks(res.data.marks);
  //                 setLoading(false);
  //                 // console.log(res.data)
  //             }, 2000);
  //           } catch (err) {
  //             console.error("Error fetching marks:", err);
  //           }
  //     };
  //     const fetchMark= async (sub_id,regno)=>{
  //         try {
  //             console.log(sub_id,regno)
  //             const res = await axios.post(`${import.meta.env.VITE_URL}/getMark`,{sub_id,regno});
  //             console.log(res.data)
  //             setTimeout(() => {
  //                 setLoading2(false);
  //             }, 2000);
  //             return res.data.mark;
  //           } catch (err) {
  //             console.error("Error fetching colleges:", err);
  //           }
  //     };
  //     const fetchBothAttendees = async () => {
  //         try {
  //             const res = await axios.post(`${import.meta.env.VITE_URL}/getBothAttendees`, {   });
  //             setExam(res.data);
  //             setLoading(false);

  //             // Fetch marks for each attendee
  //             const markPromises = res.data.map(async item => {
  //                 const response = await axios.post(`${import.meta.env.VITE_URL}/getMark`, {
  //                     sub_id: item.subjective_id,
  //                     regno: item.user_regno
  //                 });
  //                 const dat = response.data?.total_mark
  //                 return { [item.user_regno]: dat };
  //             });
              
  //             const markResults = await Promise.all(markPromises);
  //             setMarks(markResults.reduce((acc, curr) => ({ ...acc, ...curr }), {}));
  //         } catch (err) {
  //             console.error("Error fetching attendees or marks:", err);
  //         }
  //     };
  //     useEffect(()=>{
  //         fetchExam();
  //     },[loading,answer]);

        
  //   return (
  //     <div>
  //         {quiz && list &&
  //         <Table className="">
  //             <TableCaption>A list of Exams.</TableCaption>
  //             <TableHeader>
  //               <TableRow>
  //                 <TableHead className="w-[100px]">No.</TableHead>
  //                 <TableHead className="w-[250px]">Student Name</TableHead>
  //                 <TableHead className="w-[250px]">Quiz Mark</TableHead>
              
  //               </TableRow>
  //             </TableHeader>
  //             <TableBody >              
  //             {
  //                 loading?(<TableRow><TableCell colSpan="6" className="text-center font-mono font-extrabold">LOADING ......</TableCell></TableRow>):
  //                 (
  //                 exam.map((item,index)=>(
  //                 <TableRow key={index} className="text-left">
  //                   <TableCell className="font-medium">{index+1}</TableCell>
  //                   <TableCell>{item.user_name}</TableCell>
  //                   <TableCell>{item.total_mark}</TableCell>
  //                 </TableRow>
  //                 ))
  //                 )
  //             }
  //             </TableBody>
  //         </Table>
  //         }
  //         {sub && list &&<>
  //         <Table className="">
  //             <TableCaption>A list of Exams.</TableCaption>
  //             <TableHeader>
  //               <TableRow>
  //                 <TableHead className="w-[100px]">No.</TableHead>
  //                 <TableHead className="w-[250px]">Student Name</TableHead>
  //                 <TableHead className="w-[250px]">Subjective  Mark</TableHead>
  //                 <TableHead className="">Actions</TableHead>
  //               </TableRow>
  //             </TableHeader>
  //             <TableBody >              
  //             {
  //                 loading?(<TableRow><TableCell colSpan="6" className="text-center font-mono font-extrabold">LOADING ......</TableCell></TableRow>):
  //                 (
  //                 exam.map((item,index)=>(
  //                 <TableRow key={index} className="text-left">
  //                   <TableCell className="font-medium">{index+1}</TableCell>
  //                   <TableCell>{item.user_name}</TableCell>
  //                   <TableCell>{item.total_mark==-1?"not corrected":item.total_mark}</TableCell>
  //                   <TableCell className="text-right ">
  //                     <Button className="bg-green-600 mr-12" onClick={(e)=>{viewAnswer(item)}}> View Answers </Button>
  //                   </TableCell>
  //                 </TableRow>
  //                 ))
  //                 )
  //             }
  //             </TableBody>
  //         </Table>

  //         </>
  //         }
  //         {both && list && marks &&
  //         <>
  //         <Table className="">
  //             <TableCaption>A list of Exams.</TableCaption>
  //             <TableHeader>
  //               <TableRow>
  //                 <TableHead className="w-[100px]">No.</TableHead>
  //                 <TableHead className="w-[250px]">Student Name</TableHead>
  //                 <TableHead className="w-[250px]">Quiz Mark</TableHead>

  //                 <TableHead className="w-[250px]">Subjective  Mark</TableHead>
  //                 <TableHead className="">Actions</TableHead>
  //               </TableRow>
  //             </TableHeader>
  //             <TableBody >              
  //             {
  //                 loading?(<TableRow><TableCell colSpan="6" className="text-center font-mono font-extrabold">LOADING ......</TableCell></TableRow>):
  //                 (
  //                 exam.map((item,index)=>(
  //                 <TableRow key={index} className="text-left">
  //                   <TableCell className="font-medium">{index+1}</TableCell>
  //                   <TableCell>{item.user_name}</TableCell>
  //                   <TableCell>{item.qtotal}</TableCell>
  //                   {/* <TableCell>{item.stotal==-1?"Not corrected":item.stotal}</TableCell> */}
  //                   <TableCell>{marks[item.user_regno]==-1 ?"Not Corrected":marks[item.user_regno]}</TableCell>
  //                   {console.log(marks)}
  //                   <TableCell className="text-right ">
  //                     <Button className="bg-green-600 mr-12" onClick={(e)=>{viewAnswer(item)}}> View Answers </Button>
  //                   </TableCell>
  //                 </TableRow>
  //                 ))
  //                 )
  //             }
  //             </TableBody>
  //         </Table>
  //         </>
  //         }
  //         {
  //           more&&!list && <ViewAnswers answer={answer} />
  //         }
  //     </div>
  //   )
  // }
