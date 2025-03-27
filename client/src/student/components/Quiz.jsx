
import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
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
  const videoRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  const quiz_id = location.state?.quiz_id;
  const subjective_id = location.state?.subjective_id;
  const quizMark = location.state?.quizMark;
  const exam_id = location.state?.exam_id;
  const duration = location.state?.duration;

  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: duration, seconds: 0 });
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formFields, setFormFields] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [alertCount, setAlertCount] = useState(0);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const regno = usernames.regno;
  const userId = usernames.id;


  const handleRadioChange = (index, value) => {
    const updatedFields = [...formFields];
    updatedFields[index].answer = value;
    setFormFields(updatedFields);
  };

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/attemptQuiz/${regno}/${quiz_id}/${quizMark}/${exam_id}`,
        formFields
      );
      stopCamera();
      if (subjective_id) {
        navigate('/student/exam/subjective', { 
          state: { subjective_id, exam_id, quiz_id, duration } 
        });
      } else {
        navigate('/student');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchQuiz = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/fetchQuizQuestions`, { quiz_id });
      setQuizQuestions(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
  if (videoRef.current && videoRef.current.stream) {
    const tracks = videoRef.current.stream.getTracks();
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
  }
};
  const loadFaceApiModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      ]);
      setModelsLoaded(true);
    } catch (error) {
      console.error('Error loading face-api models:', error);
    }
  };

  const initializeFaceDetection = () => {
    if (!modelsLoaded || !videoRef.current) return;

    detectionIntervalRef.current = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );

      if (detections.length > 1) {
        setAlertCount(prev => {
          const newCount = prev + 1;
          alert(`Multiple persons detected! Warning ${newCount}/3`);
          
          if (newCount >= 3) {
            clearInterval(detectionIntervalRef.current);
            //submit(new Event('submit'));
          }
          return newCount;
        });
      } else if (detections.length === 0) {
        setAlertCount(prev => {
          const newCount = prev + 1;
          alert(`No person detected! Warning ${newCount}/3`);
          
          if (newCount >= 3) {
            clearInterval(detectionIntervalRef.current);
            submit(new Event('submit'));
          }
          return newCount;
        });  
      }
    }, 2000); // Check every 2 seconds
  };

  useEffect(() => {
    enterFullscreen();
    fetchQuiz();
    startCamera();
    loadFaceApiModels();

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (modelsLoaded) {
      initializeFaceDetection();
    }
  }, [modelsLoaded]);
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:5000/student/${exam_id}/${userId}`);
    ws.onopen = () => console.log("Student WebSocket opened");
    ws.onclose = () => console.log("Student WebSocket closed");

    return () => ws.close();
  }, [exam_id, userId]);
  useEffect(() => {
    if (!loading && quizQuestions.length > 0) {
      const initialFields = quizQuestions.map((question) => ({
        question_id: question.question_id,
        answer: '',
        correctanswer: question.answer,
      }));
      setFormFields(initialFields);
    }
  }, [quizQuestions, loading]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const { hours, minutes, seconds } = prevTime;
        if (hours === 0 && minutes === 0 && seconds === 0) {
          clearInterval(timer);
          submit(new Event('submit'));
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

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold">
          Quiz Timer: {`${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
        </div>
        <div className="text-red-600">
          Warnings: {alertCount}/3
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1"></div>

        <div className="col-span-1">
          <form onSubmit={submit} className="space-y-6">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center">
                    Question {currentQuestionIndex + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={quizQuestions[currentQuestionIndex]?.question_title || ""}
                    readOnly
                    className="mt-4"
                  />
                  <RadioGroup
                    value={formFields[currentQuestionIndex]?.answer}
                    onValueChange={(value) => handleRadioChange(currentQuestionIndex, value)}
                  >
                    {['option1', 'option2', 'option3', 'option4'].map((opt, optIndex) => (
                      <div className="flex items-center space-x-2" key={optIndex}>
                        <RadioGroupItem value={optIndex + 1} id={`${opt}-${currentQuestionIndex}`} />
                        <Label htmlFor={`${opt}-${currentQuestionIndex}`}>
                          {quizQuestions[currentQuestionIndex]?.[opt] || ""}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    disabled={currentQuestionIndex === quizQuestions.length - 1}
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </CardFooter>
              </Card>
            )}
            {currentQuestionIndex === quizQuestions.length - 1 && (
              <Button type="submit" className="w-full mt-6">
                SUBMIT
              </Button>
            )}
          </form>
        </div>

        <div className="col-span-1 flex justify-end">
          <div className="w-64 h-48 bg-black rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}