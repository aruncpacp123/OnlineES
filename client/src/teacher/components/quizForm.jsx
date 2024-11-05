import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardDescription,CardTitle ,} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './navbar';

export default function QuizForm() {
    const answerOptions = ["Option 1","Option 2","Option 3","Option 4"];
    const location = useLocation();
    const exam_id = location.state?.exam_id; 
    const quiz_id = location.state?.quiz_id; 
    const quiz_no = location.state?.quiz_no; 
    const subjective_id = location.state?.subjective_id;
    const subjective_no = location.state?.sub_no;
    const navigate = useNavigate();
    const initialFields = Array.from({ length: quiz_no }, () => ({
        question: '',
        option1: '',
        option2: '',
        option3: '',
        option4: '',
        answer: '',
    }));
    const [formFields, setFormFields] = useState(initialFields);

  const handleInputChange = (index, field, value) => {
    const updatedFields = [...formFields];
    updatedFields[index][field] = value;
    setFormFields(updatedFields);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
        console.log(formFields)
        console.log(quiz_id,quiz_no,subjective_id,subjective_no)

      const res = await axios.post(`http://localhost:5000/addQuizQuestions/${quiz_id}`, formFields);
      if(subjective_id!=null){
        navigate('/teacher/exam/step2',{ state: { exam_id:res.data.exam_id,subjective_id:subjective_id,quiz_id:res.data.quiz_id,sub_no:subjective_no,quiz_no:quiz_no} })
      }
      else
        navigate('/teacher');
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
        <Navbar />
    <div className="flex justify-center items-center mt-20">
      <Tabs defaultValue="quiz" className="w-[700px]">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="quiz" className="border border-black">QUIZ</TabsTrigger>
        </TabsList>
        <TabsContent value="quiz">
            <form onSubmit={submit}>
              {formFields.map((field, index) => (
                <Card className="mb-7" key={index}>
                    <CardHeader>
                        <CardDescription className="text-center tracking-widest"></CardDescription>
                        <CardTitle className="text-center">Question {index+1}</CardTitle>
                    </CardHeader>
                    <CardContent key={index} className="space-y-2">
                        <div className="space-y-1 text-left">
                          <Label htmlFor={`question-${index}`} className="mb-9">Question</Label>
                          <Textarea
                            id={`question-${index}`}
                            placeholder="Enter question..."
                            value={field.question}
                            onChange={(e) => handleInputChange(index, 'question', e.target.value)}
                            className="mt-6"
                          />
                        </div>
                        <div className="space-y-1 text-left">
                          <Label htmlFor={`question-${index}`} className="mb-9">Option 1</Label>
                          <Input
                            id={`option1-${index}`}
                            placeholder="Enter Option 1..."
                            value={field.option1}
                            onChange={(e) => handleInputChange(index, 'option1', e.target.value)}
                            className="mt-6"
                          />
                        </div>
                        <div className="space-y-1 text-left">
                          <Label htmlFor={`option2-${index}`} className="mb-9">Option 2</Label>
                          <Input
                            id={`option2-${index}`}
                            placeholder="Enter Option 2..."
                            value={field.option2}
                            onChange={(e) => handleInputChange(index, 'option2', e.target.value)}
                            className="mt-6"
                          />
                        </div>
                        <div className="space-y-1 text-left">
                          <Label htmlFor={`option3-${index}`} className="mb-9">Option 3</Label>
                          <Input
                            id={`option3-${index}`}
                            placeholder="Enter Option 3..."
                            value={field.option3}
                            onChange={(e) => handleInputChange(index, 'option3', e.target.value)}
                            className="mt-6"
                          />
                        </div>
                        <div className="space-y-1 text-left">
                          <Label htmlFor={`option4-${index}`} className="mb-9">Option 4</Label>
                          <Input
                            id={`option4-${index}`}
                            placeholder="Enter Option 4..."
                            value={field.option4}
                            onChange={(e) => handleInputChange(index, 'option4', e.target.value)}
                            className="mt-6"
                          />
                        </div>

                        <div className="flex flex-col space-y-1.5 text-left">
                          <Label htmlFor={`answer-${index}`}>ANSWER</Label>
                          <Select
                            id={`answer-${index}`}
                            onValueChange={(value) => handleInputChange(index, 'answer', parseInt(value,10))}
                            defaultValue={field.answer}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {
                              answerOptions.map((answer, idx) => (
                                <SelectItem key={idx} value={String(idx+1)}>{answer}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                    </CardContent>
                </Card>
              ))}
              <CardFooter className="justify-center">
                <Button className="min-w-64 mt-8" type="submit" >SUBMIT</Button>
              </CardFooter>
            </form>
        </TabsContent>
      </Tabs>
    </div>
    </div>
  );
}
