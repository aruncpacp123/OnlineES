import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ExamHistory() {
  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const regno = usernames?.regno;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/fetchHistory`, { regno });
      setHistory(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching history:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getScoreDisplay = (mark) => {
    if (mark === -1) return "N/A";
    if (mark === -2) return "Not Attempted";
    if (mark < 0) return "Not Published";
    return mark;
  };
  const getScoreDisplay2 = (mark) => {
    if (mark === -1) return "Not Corrected";
    if (mark === -2) return "N/A";
    if (mark < 0) return "Not Published";
    return mark;
  };
  
  const getTotalDisplay = (quizMark, subMark) => {
    if (subMark < 0) return "Not Published";
    if(quizMark <0)
      return subMark;
    return quizMark + subMark;
  };

  const getScoreColor = (mark) => {
    if (mark < 0) return "text-gray-500";
    if (mark >= 10) return "text-green-600 font-bold";
    if (mark >= 10) return "text-blue-600";
    return "text-red-600";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Exam History</CardTitle>
          <CardDescription>Your complete examination record</CardDescription>
        </CardHeader>
        <CardContent>
          <Table className="border rounded-lg overflow-hidden">
            <TableHeader className="bg-gradient-to-r from-blue-600 to-indigo-700">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-green-500 font-bold">#</TableHead>
                <TableHead className="text-green-500 font-bold">Exam Name</TableHead>
                <TableHead className="text-green-500 font-bold">Subject</TableHead>
                <TableHead className="text-green-500 font-bold">Quiz</TableHead>
                <TableHead className="text-green-500 font-bold">Subjective</TableHead>
                <TableHead className="text-green-500 font-bold">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-8">
                    <div className="flex justify-center items-center space-x-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="text-gray-600">Loading your exam history...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : history.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="6" className="text-center py-8 text-gray-500">
                    No exam history found
                  </TableCell>
                </TableRow>
              ) : (
                history.map((item, index) => (
                  <TableRow 
                    key={index} 
                    className={index % 2 === 0 ? 'bg-gray-50 hover:bg-gray-100' : 'hover:bg-gray-100'}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-semibold">{item.exam_name}</TableCell>
                    <TableCell>{item.subject_name}</TableCell>
                    <TableCell className={getScoreColor(item.quiz_mark)}>
                      {getScoreDisplay(item.quiz_mark)}
                    </TableCell>
                    <TableCell className={getScoreColor(item.subjective_mark)}>
                      {getScoreDisplay2(item.subjective_mark)}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {getTotalDisplay(item.quiz_mark, item.subjective_mark)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Summary Card */}
      {!loading && history.length > 0 && (
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Total Exams Taken</h3>
                <p className="text-2xl font-bold">
                  {/* {history.filter(item => item.quiz_mark >= 0 || item.subjective_mark >= 0).length} */}
                  {history.length}

                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Average Score</h3>
                <p className="text-2xl font-bold">
                  {(() => {
                    const validExams = history.filter(
                      item => item.quiz_mark >= 0 && item.subjective_mark >= 0
                    );
                    if (validExams.length === 0) return "N/A";
                    const avg = validExams.reduce(
                      (sum, item) => sum + item.quiz_mark + item.subjective_mark, 0
                    ) / validExams.length;
                    return avg.toFixed(1);
                  })()}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Highest Score</h3>
                <p className="text-2xl font-bold">
                  {(() => {
                    const validExams = history.filter(
                      item => item.quiz_mark >= 0 && item.subjective_mark >= 0
                    );
                    if (validExams.length === 0) return "N/A";
                    return Math.max(
                      ...validExams.map(item => item.quiz_mark + item.subjective_mark)
                    );
                  })()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
// import React, { useEffect, useState } from 'react'
// import {Table,TableBody,TableCaption,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table"
// import { Button } from "@/components/ui/button"
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// export default function () {
//     const usernames = JSON.parse(sessionStorage.getItem('username'));
//     const regno = usernames?.regno;
//     const course_id = usernames.course;
//     const semester = usernames.sem;
//     const [history,setHistory] = useState([]);
//     const [loading,setLoading] = useState(true)

//     const navigate = useNavigate();

//     const fetchHistory= async ()=>{
//         try {
//             const res = await axios.post(`${import.meta.env.VITE_URL}/fetchHistory`,{regno});
//             setTimeout(() => {
//                 setHistory(res.data);
//                 setLoading(false);
    
//             }, 1000);
//           } catch (err) {
//             console.error("Error fetching history:", err);
//           }

//     };


//     useEffect(()=>{
//         fetchHistory();
//     },[loading]);
//    return (
//     <div>
//         <Table className="">
//             <TableCaption>A list of Exams.</TableCaption>
//             <TableHeader>
//               <TableRow>
//                 <TableHead className="w-[100px]">No.</TableHead>
//                 <TableHead className="w-[250px]">Name</TableHead>
//                 <TableHead className="w-[250px]">Subject</TableHead>
//                 <TableHead className="w-[250px]">Quiz Mark</TableHead>
//                 <TableHead className="w-[250px]">Subjective Mark</TableHead>
//                 <TableHead className="">Total</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody >              
//             {
//                 loading?(<TableRow><TableCell colSpan="6" className="text-center font-mono font-extrabold">LOADING ......</TableCell></TableRow>):
//                 (
//                 history.map((item,index)=>(
//                 <TableRow key={index} className="text-left">
//                   <TableCell className="font-medium">{index+1}</TableCell>
//                   <TableCell>{item.exam_name}</TableCell>
//                   <TableCell>{item.subject_name}</TableCell>

//                   <TableCell>{item.quiz_mark==-1?"Nill":item.quiz_mark}</TableCell>
//                   <TableCell>{item.subjective_mark==-1?"Not Corrected":(item.subjective_mark==-2?"Nill":item.subjective_mark)}</TableCell>
//                   <TableCell>{item.quiz_mark+item.subjective_mark}</TableCell>

                 
//                 </TableRow>
//                 ))
//                 )
//             }
//             </TableBody>
//         </Table>
//     </div>
//   )
// }
