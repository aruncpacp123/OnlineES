import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import axios from 'axios';

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const warningTimeoutRef = useRef(null);

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
  const [warningMessage, setWarningMessage] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [referenceFaceDescriptor, setReferenceFaceDescriptor] = useState(null);
  const [progress, setProgress] = useState(0);

  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const regno = usernames.regno;
  const userId = usernames.id;
  const studentName = usernames.name;

  const handleRadioChange = (index, value) => {
    const updatedFields = [...formFields];
    updatedFields[index].answer = value;
    setFormFields(updatedFields);
  };

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().catch(err => {
        console.error('Fullscreen error:', err);
      });
    }
  };

  const submit = async (e) => {
    e?.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/attemptQuiz/${regno}/${quiz_id}/${quizMark}/${exam_id}`,
        formFields
      );
      stopCamera();
      if (subjective_id) {
        navigate('/student/exam/subjective', { 
          state: { subjective_id, exam_id, quiz_id, alertCount, timeLeft} 
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
      setProgress(Math.round(((currentQuestionIndex + 1) / res.data.length) * 100));
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: 'user' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setWarningMessage('Camera access denied. Exam monitoring disabled.');
      setShowWarning(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const loadFaceApiModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      ]);
      setModelsLoaded(true);
      
      // Load reference image
      const referenceImage = await faceapi.fetchImage(`/reference_images/${regno}.jpeg`);
      const detections = await faceapi.detectAllFaces(referenceImage)
        .withFaceLandmarks()
        .withFaceDescriptors();
      
      if (detections.length > 0) {
        setReferenceFaceDescriptor(detections[0].descriptor);
      }
    } catch (error) {
      console.error('Error loading face-api models:', error);
    }
  };

  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/jpeg');
  };

  const logMalpractice = async (type, imageData) => {
    try {
      await axios.post(`${import.meta.env.VITE_URL}/logMalpractice`, {
        exam_id,
        student_id: regno,
        type,
        image: imageData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error logging malpractice:', error);
    }
  };

  const initializeFaceDetection = async () => {
    if (!modelsLoaded || !videoRef.current || !referenceFaceDescriptor) return;

    detectionIntervalRef.current = setInterval(async () => {
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks().withFaceDescriptors();

      const frameImage = await captureFrame();

      // No face detected
      if (detections.length === 0) {
        console.log(alertCount)
        
        const newCount = alertCount + 1;
        console.log(newCount)
        setAlertCount(newCount);
        setWarningMessage('No face detected! Please position yourself in front of the camera.');
        setShowWarning(true);
        await logMalpractice('NO_FACE', frameImage);
        
        if (newCount >= 3) {
          clearInterval(detectionIntervalRef.current);
          submit(new Event('submit'));
        }
        return;
      }
      // Multiple faces detected
      if (detections.length > 1) {
        const newCount = alertCount + 1;
        setAlertCount(newCount);
        setWarningMessage('Multiple persons detected! Only one person should be visible.');
        setShowWarning(true);
        await logMalpractice('MULTIPLE_FACES', frameImage);
        
        if (newCount >= 3) {
          clearInterval(detectionIntervalRef.current);
          submit(new Event('submit'));
        }
        return;
      }

      // Face recognition check
      const faceDescriptor = detections[0].descriptor;
      const distance = faceapi.euclideanDistance(faceDescriptor, referenceFaceDescriptor);
      
      if (distance > 0.5) { // Threshold for face recognition
        const newCount = alertCount + 1;
        setAlertCount(newCount);
        setWarningMessage('Unauthorized person detected! This will be reported.');
        setShowWarning(true);
        await logMalpractice('UNAUTHORIZED_PERSON', frameImage);
        
        if (newCount >= 3) {
          clearInterval(detectionIntervalRef.current);
          submit(new Event('submit'));
        }
        return;
      }

      // All checks passed
      setShowWarning(false);
    }, 5000); // Check every 5 seconds
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
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (modelsLoaded && referenceFaceDescriptor) {
      initializeFaceDetection();
    }
  }, [modelsLoaded, referenceFaceDescriptor]);

  useEffect(() => {
    if (showWarning) {
      warningTimeoutRef.current = setTimeout(() => {
        setShowWarning(false);
      }, 5000);
    }
    return () => {
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
    };
  }, [showWarning]);

  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/student/${exam_id}/${userId}`);
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

  useEffect(() => {
    if (quizQuestions.length > 0) {
      setProgress(Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100));
    }
  }, [currentQuestionIndex, quizQuestions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{studentName}</h1>
          <p className="text-gray-600">Registration: {regno}</p>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="text-3xl font-mono font-bold text-blue-600">
            {`${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
          </div>
          <div className={`text-lg font-semibold ${alertCount > 1 ? 'text-red-600' : 'text-yellow-600'}`}>
            Warnings: {alertCount}/3
          </div>
        </div>
      </div>

      {/* Warning Alert */}
      {showWarning && (
        <Alert variant="destructive" className="mb-6 animate-fade-in">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Warning!</AlertTitle>
          <AlertDescription>{warningMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Panel */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <Card className="h-full shadow-lg">
            <CardHeader>
              <CardTitle>Exam Monitoring</CardTitle>
              <CardDescription>Live camera feed with face recognition</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Panel */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <form onSubmit={submit} className="space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-pulse text-gray-500">Loading questions...</div>
              </div>
            ) : (
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      Question {currentQuestionIndex + 1} of {quizQuestions.length}
                    </CardTitle>
                    <div className="text-sm text-gray-500">
                      {Math.round(((currentQuestionIndex + 1) / quizQuestions.length) * 100)}% Complete
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Textarea
                      value={quizQuestions[currentQuestionIndex]?.question_title || ""}
                      readOnly
                      className="text-lg font-medium border-none bg-transparent resize-none focus-visible:ring-0"
                    />
                  </div>
                  
                  <RadioGroup
                    value={formFields[currentQuestionIndex]?.answer}
                    onValueChange={(value) => handleRadioChange(currentQuestionIndex, value)}
                    className="space-y-3"
                  >
                    {['option1', 'option2', 'option3', 'option4'].map((opt, optIndex) => (
                      <div 
                        className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                          formFields[currentQuestionIndex]?.answer === String(optIndex + 1) 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        key={optIndex}
                      >
                        <RadioGroupItem 
                          value={String(optIndex + 1)} 
                          id={`${opt}-${currentQuestionIndex}`} 
                        />
                        <Label 
                          htmlFor={`${opt}-${currentQuestionIndex}`}
                          className="text-base font-normal cursor-pointer"
                        >
                          {quizQuestions[currentQuestionIndex]?.[opt] || ""}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  <div className="text-sm text-gray-500">
                    Selected: {formFields[currentQuestionIndex]?.answer || 'None'}
                  </div>
                  {/* {currentQuestionIndex < quizQuestions.length - 1 ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    >
                      Next Question
                    </Button>
                  ) : (
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Submit Exam
                    </Button>
                  )} */}
                  <Button
                    type="button"
                    onClick={() => {
                      if (currentQuestionIndex < quizQuestions.length - 1) {
                        setCurrentQuestionIndex((prev) => prev + 1);
                      } else {
                        submit();
                      }
                    }}
                    className={currentQuestionIndex === quizQuestions.length - 1 ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Submit Exam'}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}