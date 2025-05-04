import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, ArrowLeft } from 'lucide-react';

export default function ViewAnswers({ answer,setList }) {
  const regno = answer.user_regno;
  const exam_id = answer.exam_id;
  const subjective_id = answer.subjective_id;

  const [subjectiveAnswers, setSubjectiveAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formFields, setFormFields] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = (index, field, value) => {
    const updatedFields = [...formFields];
    updatedFields[index][field] = value;
    setFormFields(updatedFields);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/addMark/${regno}/${subjective_id}/${exam_id}`, formFields);
      console.log(res.data);
      //navigate(-1); // Go back to previous page
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAnswers = async () => {
    console.log(answer);
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/fetchSubjectiveAnswers`, { regno, subjective_id });
      setSubjectiveAnswers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching Answers:", err);
    }
  };

  useEffect(() => {
    fetchAnswers();
  }, []);

  useEffect(() => {
    if (!loading && subjectiveAnswers.length > 0) {
      const initialFields = subjectiveAnswers.map((question) => ({
        question_id: question.question_id,
        regno: regno,
        mark: question.currentmark,
      }));
      setFormFields(initialFields);
    }
  }, [subjectiveAnswers, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            // onClick={() => navigate(-1)}
            onClick={() => setList(true)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Student Answers Evaluation</h1>
            <p className="text-gray-600">Registration: {regno}</p>
          </div>
          <div className="w-32"></div> {/* Spacer for balance */}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar (Student Info) */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6 h-fit">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FileText className="text-blue-600" size={20} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Exam Details</h3>
                  <p className="text-sm text-gray-500">Subjective Evaluation</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Student:</span>
                  <span className="font-medium">{answer.user_name}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Registration:</span>
                  <span className="font-medium">{regno}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-500">Exam ID:</span>
                  <span className="font-medium">{exam_id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div className="lg:col-span-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-pulse text-gray-500">Loading answers...</div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-6">
                {formFields.map((field, index) => (
                  <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="bg-blue-100 text-blue-800 p-2 rounded-full w-8 h-8 flex items-center justify-center">
                          {index + 1}
                        </div>
                        <span>Question {index + 1}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-gray-700">Question</Label>
                        <Textarea
                          value={subjectiveAnswers[index]?.question_title || ""}
                          readOnly
                          className="bg-gray-50 border-gray-200"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-700">Student Answer</Label>
                        <Textarea
                          value={subjectiveAnswers[index]?.answer || ""}
                          readOnly
                          className="bg-gray-50 border-gray-200 min-h-[120px]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-gray-700">Max Marks</Label>
                          <Input
                            value={subjectiveAnswers[index]?.maxmark || ""}
                            readOnly
                            className="bg-gray-50 border-gray-200"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-gray-700">Your Evaluation</Label>
                          <Input
                            value={formFields[index]?.mark || ""}
                            onChange={(e) => handleInputChange(index, "mark", e.target.value)}
                            className="border-blue-200 focus:border-blue-400"
                            type="number"
                            min="0"
                            max={subjectiveAnswers[index]?.maxmark || 100}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <CardFooter className="flex justify-center pt-6">
                  <Button type="submit" className="min-w-[200px] h-12">
                    <CheckCircle className="mr-2 h-4 w-4" /> Submit Evaluation
                  </Button>
                </CardFooter>
              </form>
            )}
          </div>

          {/* Right Sidebar (Stats/Notes) */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-6 h-fit">
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 flex items-center gap-2">
                <FileText size={18} /> Evaluation Guidelines
              </h3>
              <div className="space-y-3">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-sm text-yellow-700">
                    Please evaluate answers based on accuracy, completeness, and clarity.
                  </p>
                </div>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <p className="text-sm text-blue-700">
                    Partial marks can be awarded for partially correct answers.
                  </p>
                </div>
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <p className="text-sm text-green-700">
                    Maximum marks for each question are shown in the "Max Marks" field.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// import React ,{useEffect, useState} from 'react'
// import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
// import { Button } from '@/components/ui/button';
// import { Label } from "@/components/ui/label";
// import { Textarea } from '@/components/ui/textarea';
// import axios from 'axios';
// import { Input } from '@/components/ui/input';
// import { useNavigate } from 'react-router-dom';
// export default function ViewAnswers({answer}) {
    
//     console.log(answer)
//     const regno = answer.user_regno;
//     const exam_id=answer.exam_id;
//     const subjective_id = answer.subjective_id

//   const [subjectiveAnswers, setSubjectiveAnswers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [formFields, setFormFields] = useState([]);
//   const navigate = useNavigate();

//     const handleInputChange = (index, field, value) => {
//         const updatedFields = [...formFields];
//         updatedFields[index][field] = value;
//         setFormFields(updatedFields);
//       };

//       const submit = async (e) => {
//         e.preventDefault();
//         try {
//             console.log(formFields)
//           const res = await axios.post(`${import.meta.env.VITE_URL}/addMark/${regno}/${subjective_id}/${exam_id}`, formFields);

//             // navigate('/student');
//           console.log(res.data);
//         } catch (err) {
//           console.log(err);
//         }
//       };
    
//       const fetchAnswers= async () => {
//         try {
//           const res = await axios.post(`${import.meta.env.VITE_URL}/fetchSubjectiveAnswers`, { regno,subjective_id });
//           setTimeout(() => {
//             setSubjectiveAnswers(res.data);
//             setLoading(false);
//           }, 2000);
//         } catch (err) {
//           console.error("Error fetching Answers:", err);
//         }
//       };
    
//       useEffect(() => {
//         fetchAnswers();
//       }, [loading]);
    
//       useEffect(() => {
//         if (!loading && subjectiveAnswers.length > 0) {
//           const initialFields = subjectiveAnswers.map((question) => ({
//             question_id: question.question_id,
//             regno:regno,
//             mark: question.currentmark,
//           }));
//           setFormFields(initialFields);
//         }
//       }, [subjectiveAnswers, loading]);
//   return (
//     <>
//         <div className="grid grid-cols-9 ">
//             <div className="flex items-center justify-center col-span-2 bg-slate-200 md:min-h-screen">
//             {subjectiveAnswers[0]?.student_regno || ""}
//             </div>
//             <div className="flex items-center justify-center col-span-5 bg-slate-100">
//                 <form onSubmit={submit}>
//                     {
//                     loading?(<div className="">Loading....</div>):
//                     formFields.map((field, index) => (
//                       <Card className="mb-7 min-w-[600px]" key={index}>
//                         <CardHeader>
//                           <CardTitle className="text-center">Question {index + 1}</CardTitle>
//                         </CardHeader>
//                         <CardContent className="space-y-2">
//                           <div className="space-y-1 text-left">
//                             <Label htmlFor={`question-${index}`} className="mb-9">Question</Label>
//                             <Textarea
//                               id={`question-${index}`}
//                               value={subjectiveAnswers[index]?.question_title || ""}
//                               readOnly
//                               className="mt-6"
//                               />
//                           </div>
//                           <div className="space-y-1 text-left">
//                             <Label htmlFor={`answer-${index}`} className="mb-9">Answer</Label>
//                             <Textarea
//                               id={`answer-${index}`}
//                               value={subjectiveAnswers[index]?.answer || ""}
//                               className="mt-6"
//                               readOnly
                              
//                               />
//                           </div>
//                           <div className="space-y-1 text-left grid grid-cols-6">
//                             <Label htmlFor={`answer-${index}`} className="mb-9">Max Mark</Label>
//                             <Input
//                               id={`answer-${index}`}
//                               value={subjectiveAnswers[index]?.maxmark || ""}
//                               className="mt-6 col-span-2"
//                               readOnly

//                               />
//                               <Label htmlFor={`answer-${index}`} className="mb-9">Current Mark</Label>
//                             <Input
//                               id={`answer-${index}`}
//                               value={formFields[index]?.mark || ""}
//                               className="mt-6 col-span-2"
//                               onChange={(e)=>handleInputChange(index,"mark",e.target.value)}
//                               />
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                     <CardFooter className="justify-center">
//                       <Button className="min-w-64 mt-8" type="submit">SUBMIT</Button>
//                     </CardFooter>
//                 </form>

//             </div>
//             <div className="col-span-2 bg-slate-200">

//             </div>
//         </div>
//     </>
//   )
// }
