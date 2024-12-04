
import React ,{useEffect, useState} from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import {Card,CardContent,CardDescription,CardFooter,CardHeader,CardTitle,} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import axios from 'axios';
export default function Quiz() {
    
  const location = useLocation();
  const navigate = useNavigate();
  const subjective_id = location.state?.subjective_id;

  const sno = location.state?.sno;
  const exam_id = location.state?.exam_id;
  const quiz_id = location.state?.quiz_id;
  const duration = location.state?.duration;

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: duration, seconds: 0 });


  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const regno = usernames.regno;

  const [subjectiveQuestions, setSubjectiveQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formFields, setFormFields] = useState([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const handleInputChange = (index, field, value) => {
        const updatedFields = [...formFields];
        updatedFields[index][field] = value;
        setFormFields(updatedFields);
      };
      const submit = async (e) => {
        e.preventDefault();
        try {
        const res = await axios.post(`${import.meta.env.VITE_URL}/attemptSubjective/${regno}/${subjective_id}/${quiz_id}/${exam_id}`, formFields);

            navigate('/student');
          console.log(res.data);
        } catch (err) {
          console.log(err);
        }
      };

      const fetchSubjective = async () => {
        try {
          const res = await axios.post(`${import.meta.env.VITE_URL}/fetchSubjectiveQuestions`, { subjective_id });
          setTimeout(() => {
            setSubjectiveQuestions(res.data);
            setLoading(false);
          }, 2000);
        } catch (err) {
          console.error("Error fetching questions:", err);
        }
      };
    
      useEffect(() => {
        fetchSubjective();
      }, [loading]);
    
      useEffect(() => {
        if (!loading && subjectiveQuestions.length > 0) {
          const initialFields = subjectiveQuestions.map((question) => ({
            question_id: question.question_id,
            answer: '',
          }));
          setFormFields(initialFields);
        }
      }, [subjectiveQuestions, loading]);
      useEffect(() => {
        const timer = setInterval(() => {
          setTimeLeft((prevTime) => {
            const { hours, minutes, seconds } = prevTime;
            if (hours === 0 && minutes === 0 && seconds === 0) {
              clearInterval(timer);
              submit(new Event('submit')); // Automatically submit form when timer ends
              return prevTime;
            }
    
            if (seconds > 0) {
              return { ...prevTime, seconds: seconds - 1 };
            } else if (minutes > 0) {
              return { hours, minutes: minutes - 1, seconds: 59 };
            } else if (hours > 0) {
              return { hours: hours - 1, minutes: 59, seconds: 59 };
            }
            return prevTime;
          });
        }, 1000);
    
        return () => clearInterval(timer); // Cleanup interval on component unmount
      }, []);
  return (
    <>
        <div className="grid grid-cols-9 ">
            <div className="flex items-center justify-center col-span-2 bg-slate-200 md:min-h-screen">
            <div className="text-3xl">
            {`${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
          </div>
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
                              value={subjectiveQuestions[index]?.question_title || ""}
                              readOnly
                              className="mt-6"
                              />
                          </div>
                          <div className="space-y-1 text-left">
                            <Label htmlFor={`answer-${index}`} className="mb-9">Answer</Label>
                            <Textarea
                              id={`answer-${index}`}
                              value={formFields[index].answer}
                              placeholder="Type your answer here"
                              className="mt-6"
                              onChange={(e)=>handleInputChange(index,"answer",e.target.value)}
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
/*
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from 'axios';

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const quiz_id = location.state?.quiz_id;
  const subjective_id = location.state?.subjective_id;
  const qno = location.state?.qno;
  const sno = location.state?.sno;
  const quizMark = location.state?.quizMark;

  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const regno = usernames.regno;
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formFields, setFormFields] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleRadioChange = (index, value) => {
    const updatedFields = [...formFields];
    updatedFields[index].answer = value;
    setFormFields(updatedFields);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
    const res = await axios.post(`http://localhost:5000/attemptQuiz/${regno}/${quiz_id}/${quizMark}`, formFields);
      if (subjective_id) {
        navigate('/student/exam/subjective',{ state: { subjective_id,sno} })
      } else {
        navigate('/student');
      }
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchQuiz = async () => {
    try {
      const res = await axios.post('http://localhost:5000/fetchQuizQuestions', { quiz_id });
      setTimeout(() => {
        setQuizQuestions(res.data);
        setLoading(false);
      }, 2000);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [loading]);

  useEffect(() => {
    if (!loading && quizQuestions.length > 0) {
      const initialFields = quizQuestions.map((question) => ({
        question_id: question.question_id,
        answer: '',
        correctanswer:question.answer
      }));
      setFormFields(initialFields);
    }
  }, [quizQuestions, loading]);

  return (
    <>
      <div className="grid grid-cols-9 ">
        <div className="flex items-center justify-center col-span-2 bg-slate-200 md:min-h-screen">
          hello
        </div>
        <div className="flex items-center justify-center col-span-5 bg-slate-100">
          <form onSubmit={submit} className='text-center'>
            {loading ? (
              <div>Loading....</div>
            ) : (
              <Card className="mb-7 min-w-[600px]">
                <CardHeader>
                  <CardTitle className="text-center">
                    Question {currentQuestionIndex + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1 text-left">
                    <Label htmlFor={`question-${currentQuestionIndex}`} className="mb-9">Question</Label>
                    <Textarea
                      id={`question-${currentQuestionIndex}`}
                      value={quizQuestions[currentQuestionIndex]?.question_title || ""}
                      readOnly
                      className="mt-6"
                    />
                  </div>
                  <RadioGroup
                    value={formFields[currentQuestionIndex]?.answer}
                    onValueChange={(value) => handleRadioChange(currentQuestionIndex, value)}
                  >
                    {['option1', 'option2', 'option3', 'option4'].map((opt, optIndex) => (
                      <div className="space-y-1 text-left" key={optIndex}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value={optIndex + 1}
                            id={`${opt}-${currentQuestionIndex}`}
                          />
                          <Label htmlFor={`${opt}-${currentQuestionIndex}`}>
                            {quizQuestions[currentQuestionIndex]?.[opt] || ""}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <input type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                    value="previous"
                  />
                    
                  
                  <input type="button"
                    disabled={currentQuestionIndex === quizQuestions.length - 1}
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    value="next"

                  />
                    
                
                </CardFooter>
              </Card>
            )}
            {currentQuestionIndex === quizQuestions.length - 1 && (
              <Button className="mt-8 " type="submit">SUBMIT</Button>
            )}
          </form>
        </div>
        <div className="col-span-2 bg-slate-200"></div>
      </div>
    </>
  );
}
*/