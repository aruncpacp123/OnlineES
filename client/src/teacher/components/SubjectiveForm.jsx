import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardDescription,CardTitle ,} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Navbar from './navbar';

export default function SubjectiveForm() {
    const answerOptions = ["Option 1","Option 2","Option 3","Option 4"];
    const location = useLocation();
    const exam_id = location.state?.exam_id; 
    const quiz_id = location.state?.quiz_id; 
    const quiz_no = location.state?.quiz_no; 
    const subjective_id = location.state?.subjective_id;
    const subjective_no = location.state?.sub_no;
  const initialFields = Array.from({ length: subjective_no }, () => ({
    question: '',
    mark: '',
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
      const res = await axios.post(`http://localhost:5000/addSubjectiveQuestions/${subjective_id}`, formFields);
      
        navigate('/teacher')
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
        <Navbar />
    <div className="flex justify-center items-center mt-20">
      <Tabs defaultValue="subjective" className="w-[700px]">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="subjective" className="border border-black">SUBJECTIVE</TabsTrigger>
        </TabsList>
        <TabsContent value="subjective">
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
                          <Label htmlFor={`mark-{index}`} className="mb-9">Mark</Label>
                          <Input
                            id={`mark-${index}`}
                            placeholder="Enter Mark"
                            value={field.mark}
                            onChange={(e) => handleInputChange(index, 'mark', e.target.value)}
                            className="mt-6"
                          />
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
