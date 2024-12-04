import React ,{useEffect, useState} from 'react'
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
export default function ViewAnswers({answer}) {
    
    console.log(answer)
    const regno = answer.user_regno;
    const exam_id=answer.exam_id;
    const subjective_id = answer.subjective_id

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
            console.log(formFields)
          const res = await axios.post(`${import.meta.env.VITE_URL}/addMark/${regno}/${subjective_id}/${exam_id}`, formFields);

            // navigate('/student');
          console.log(res.data);
        } catch (err) {
          console.log(err);
        }
      };
    
      const fetchAnswers= async () => {
        try {
          const res = await axios.post(`${import.meta.env.VITE_URL}/fetchSubjectiveAnswers`, { regno,subjective_id });
          setTimeout(() => {
            setSubjectiveAnswers(res.data);
            setLoading(false);
          }, 2000);
        } catch (err) {
          console.error("Error fetching Answers:", err);
        }
      };
    
      useEffect(() => {
        fetchAnswers();
      }, [loading]);
    
      useEffect(() => {
        if (!loading && subjectiveAnswers.length > 0) {
          const initialFields = subjectiveAnswers.map((question) => ({
            question_id: question.question_id,
            regno:regno,
            mark: question.currentmark,
          }));
          setFormFields(initialFields);
        }
      }, [subjectiveAnswers, loading]);
  return (
    <>
        <div className="grid grid-cols-9 ">
            <div className="flex items-center justify-center col-span-2 bg-slate-200 md:min-h-screen">
            {subjectiveAnswers[0]?.student_regno || ""}
            </div>
            <div className="flex items-center justify-center col-span-5 bg-slate-100">
                <form onSubmit={submit}>
                    {
                    loading?(<div className="">Loading....</div>):
                    formFields.map((field, index) => (
                      <Card className="mb-7 min-w-[600px]" key={index}>
                        <CardHeader>
                          <CardTitle className="text-center">Question {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="space-y-1 text-left">
                            <Label htmlFor={`question-${index}`} className="mb-9">Question</Label>
                            <Textarea
                              id={`question-${index}`}
                              value={subjectiveAnswers[index]?.question_title || ""}
                              readOnly
                              className="mt-6"
                              />
                          </div>
                          <div className="space-y-1 text-left">
                            <Label htmlFor={`answer-${index}`} className="mb-9">Answer</Label>
                            <Textarea
                              id={`answer-${index}`}
                              value={subjectiveAnswers[index]?.answer || ""}
                              className="mt-6"
                              readOnly
                              
                              />
                          </div>
                          <div className="space-y-1 text-left grid grid-cols-6">
                            <Label htmlFor={`answer-${index}`} className="mb-9">Max Mark</Label>
                            <Input
                              id={`answer-${index}`}
                              value={subjectiveAnswers[index]?.maxmark || ""}
                              className="mt-6 col-span-2"
                              readOnly

                              />
                              <Label htmlFor={`answer-${index}`} className="mb-9">Current Mark</Label>
                            <Input
                              id={`answer-${index}`}
                              value={formFields[index]?.mark || ""}
                              className="mt-6 col-span-2"
                              onChange={(e)=>handleInputChange(index,"mark",e.target.value)}
                              />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <CardFooter className="justify-center">
                      <Button className="min-w-64 mt-8" type="submit">SUBMIT</Button>
                    </CardFooter>
                </form>

            </div>
            <div className="col-span-2 bg-slate-200">

            </div>
        </div>
    </>
  )
}
