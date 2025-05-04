// import React, { useEffect, useRef, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import * as faceapi from 'face-api.js';
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from '@/components/ui/button';
// import { Label } from "@/components/ui/label";
// import { Textarea } from '@/components/ui/textarea';
// import { Progress } from "@/components/ui/progress";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
// import axios from 'axios';

// export default function SubjectiveExam() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const detectionIntervalRef = useRef(null);
//   const warningTimeoutRef = useRef(null);

//   // Get state from location or initialize
//   const alertCount = location.state?.alertCount || 0;
//   const timeLeftFromQuiz = location.state?.timeLeft;
//   const duration = location.state?.duration || 60; // Default 60 minutes if not provided

//   const [timeLeft, setTimeLeft] = useState(
//     timeLeftFromQuiz || { hours: 0, minutes: duration, seconds: 0 }
//   );
  
//   const subjective_id = location.state?.subjective_id;
//   const sno = location.state?.sno;
//   const exam_id = location.state?.exam_id;
//   const quiz_id = location.state?.quiz_id;
//   const [warningMessage, setWarningMessage] = useState('');
//   const [showWarning, setShowWarning] = useState(false);
//   const [modelsLoaded, setModelsLoaded] = useState(false);
//   const [referenceFaceDescriptor, setReferenceFaceDescriptor] = useState(null);
//   const [progress, setProgress] = useState(0);

//   const usernames = JSON.parse(sessionStorage.getItem('username'));
//   const regno = usernames.regno;
//   const userId = usernames.id;
//   const studentName = usernames.name;

//   const [subjectiveQuestions, setSubjectiveQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [formFields, setFormFields] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [alertCountState, setAlertCountState] = useState(alertCount);

//   // Disable copy/paste
//   useEffect(() => {
//     const preventDefault = (e) => e.preventDefault();
//     document.addEventListener('copy', preventDefault);
//     document.addEventListener('paste', preventDefault);
//     document.addEventListener('cut', preventDefault);
    
//     return () => {
//       document.removeEventListener('copy', preventDefault);
//       document.removeEventListener('paste', preventDefault);
//       document.removeEventListener('cut', preventDefault);
//     };
//   }, []);

//   const enterFullscreen = () => {
//     const element = document.documentElement;
//     if (element.requestFullscreen) {
//       element.requestFullscreen().catch(err => {
//         console.error('Fullscreen error:', err);
//       });
//     }
//   };

//   const handleInputChange = (index, value) => {
//     const updatedFields = [...formFields];
//     updatedFields[index].answer = value;
//     setFormFields(updatedFields);
//   };

//   const submit = async (e) => {
//     e?.preventDefault();
//     try {
//       const res = await axios.post(
//         `${import.meta.env.VITE_URL}/attemptSubjective/${regno}/${subjective_id}/${quiz_id}/${exam_id}`,
//         formFields
//       );
//       stopCamera();
//       navigate('/student');
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const fetchSubjective = async () => {
//     try {
//       const res = await axios.post(`${import.meta.env.VITE_URL}/fetchSubjectiveQuestions`, { subjective_id });
//       setSubjectiveQuestions(res.data);
//       setLoading(false);
//       setProgress(Math.round(((currentQuestionIndex + 1) / res.data.length) * 100));
//     } catch (err) {
//       console.error("Error fetching questions:", err);
//     }
//   };

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: { width: 640, height: 480, facingMode: 'user' } 
//       });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
//     } catch (error) {
//       console.error('Error accessing camera:', error);
//       setWarningMessage('Camera access denied. Exam monitoring disabled.');
//       setShowWarning(true);
//     }
//   };

//   const stopCamera = () => {
//     if (videoRef.current && videoRef.current.srcObject) {
//       videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//       videoRef.current.srcObject = null;
//     }
//   };

//   const captureFrame = async () => {
//     if (!videoRef.current || !canvasRef.current) return null;
    
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');
//     canvas.width = videoRef.current.videoWidth;
//     canvas.height = videoRef.current.videoHeight;
//     context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
//     return canvas.toDataURL('image/jpeg');
//   };

//   const logMalpractice = async (type, imageData) => {
//     try {
//       await axios.post(`${import.meta.env.VITE_URL}/logMalpractice`, {
//         exam_id,
//         student_id: userId,
//         type,
//         image: imageData,
//         timestamp: new Date().toISOString()
//       });
//     } catch (error) {
//       console.error('Error logging malpractice:', error);
//     }
//   };

//   const loadFaceApiModels = async () => {
//     try {
//       await Promise.all([
//         faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//         faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//         faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//         faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
//       ]);
//       setModelsLoaded(true);
      
//       // Load reference image
//       const referenceImage = await faceapi.fetchImage(`/reference_images/${regno}.jpg`);
//       const detections = await faceapi.detectAllFaces(referenceImage)
//         .withFaceLandmarks()
//         .withFaceDescriptors();
      
//       if (detections.length > 0) {
//         setReferenceFaceDescriptor(detections[0].descriptor);
//       }
//     } catch (error) {
//       console.error('Error loading face-api models:', error);
//     }
//   };

//   const initializeFaceDetection = async () => {
//     if (!modelsLoaded || !videoRef.current || !referenceFaceDescriptor) return;

//     detectionIntervalRef.current = setInterval(async () => {
//       const detections = await faceapi.detectAllFaces(
//         videoRef.current,
//         new faceapi.TinyFaceDetectorOptions()
//       ).withFaceLandmarks().withFaceDescriptors();

//       const frameImage = await captureFrame();

//       // No face detected
//       if (detections.length === 0) {
//         const newCount = alertCountState + 1;
//         setAlertCountState(newCount);
//         setWarningMessage('No face detected! Please position yourself in front of the camera.');
//         setShowWarning(true);
//         await logMalpractice('NO_FACE', frameImage);
        
//         if (newCount >= 3) {
//           clearInterval(detectionIntervalRef.current);
//           submit(new Event('submit'));
//         }
//         return;
//       }

//       // Multiple faces detected
//       if (detections.length > 1) {
//         const newCount = alertCountState + 1;
//         setAlertCountState(newCount);
//         setWarningMessage('Multiple persons detected! Only one person should be visible.');
//         setShowWarning(true);
//         await logMalpractice('MULTIPLE_FACES', frameImage);
        
//         if (newCount >= 3) {
//           clearInterval(detectionIntervalRef.current);
//           submit(new Event('submit'));
//         }
//         return;
//       }

//       // Face recognition check
//       const faceDescriptor = detections[0].descriptor;
//       const distance = faceapi.euclideanDistance(faceDescriptor, referenceFaceDescriptor);
      
//       if (distance > 0.5) { // Threshold for face recognition
//         const newCount = alertCountState + 1;
//         setAlertCountState(newCount);
//         setWarningMessage('Unauthorized person detected! This will be reported.');
//         setShowWarning(true);
//         await logMalpractice('UNAUTHORIZED_PERSON', frameImage);
        
//         if (newCount >= 3) {
//           clearInterval(detectionIntervalRef.current);
//           submit(new Event('submit'));
//         }
//         return;
//       }

//       // All checks passed
//       setShowWarning(false);
//     }, 5000); // Check every 5 seconds
//   };

//   useEffect(() => {
//     enterFullscreen();
//     fetchSubjective();
//     startCamera();
//     loadFaceApiModels();

//     return () => {
//       if (detectionIntervalRef.current) {
//         clearInterval(detectionIntervalRef.current);
//       }
//       if (warningTimeoutRef.current) {
//         clearTimeout(warningTimeoutRef.current);
//       }
//       stopCamera();
//     };
//   }, []);

//   useEffect(() => {
//     if (modelsLoaded && referenceFaceDescriptor) {
//       initializeFaceDetection();
//     }
//   }, [modelsLoaded, referenceFaceDescriptor]);

//   useEffect(() => {
//     if (showWarning) {
//       warningTimeoutRef.current = setTimeout(() => {
//         setShowWarning(false);
//       }, 5000);
//     }
//     return () => {
//       if (warningTimeoutRef.current) {
//         clearTimeout(warningTimeoutRef.current);
//       }
//     };
//   }, [showWarning]);

//   useEffect(() => {
//     const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/student/${exam_id}/${userId}`);
//     ws.onopen = () => console.log("Student WebSocket opened");
//     ws.onclose = () => console.log("Student WebSocket closed");

//     return () => ws.close();
//   }, [exam_id, userId]);

//   useEffect(() => {
//     if (!loading && subjectiveQuestions.length > 0) {
//       const initialFields = subjectiveQuestions.map((question) => ({
//         question_id: question.question_id,
//         answer: '',
//       }));
//       setFormFields(initialFields);
//     }
//   }, [subjectiveQuestions, loading]);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prevTime) => {
//         const { hours, minutes, seconds } = prevTime;
//         if (hours === 0 && minutes === 0 && seconds === 0) {
//           clearInterval(timer);
//           submit(new Event('submit'));
//           return prevTime;
//         }
//         if (seconds > 0) {
//           return { ...prevTime, seconds: seconds - 1 };
//         } else if (minutes > 0) {
//           return { hours, minutes: minutes - 1, seconds: 59 };
//         } else if (hours > 0) {
//           return { hours: hours - 1, minutes: 59, seconds: 59 };
//         }
//         return prevTime;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     if (subjectiveQuestions.length > 0) {
//       setProgress(Math.round(((currentQuestionIndex + 1) / subjectiveQuestions.length) * 100));
//     }
//   }, [currentQuestionIndex, subjectiveQuestions]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
//       {/* Header Section */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">{studentName}</h1>
//           <p className="text-gray-600">Registration: {regno}</p>
//         </div>
        
//         <div className="flex flex-col items-end">
//           <div className="text-3xl font-mono font-bold text-blue-600">
//             {`${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
//           </div>
//           <div className={`text-lg font-semibold ${alertCountState > 1 ? 'text-red-600' : 'text-yellow-600'}`}>
//             Warnings: {alertCountState}/3
//           </div>
//         </div>
//       </div>

//       {/* Warning Alert */}
//       {showWarning && (
//         <Alert variant="destructive" className="mb-6 animate-fade-in">
//           <ExclamationTriangleIcon className="h-4 w-4" />
//           <AlertTitle>Warning!</AlertTitle>
//           <AlertDescription>{warningMessage}</AlertDescription>
//         </Alert>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Camera Panel */}
//         <div className="lg:col-span-1 order-2 lg:order-1">
//           <Card className="h-full shadow-lg">
//             <CardHeader>
//               <CardTitle>Exam Monitoring</CardTitle>
//               <CardDescription>Live camera feed with face recognition</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
//                 <video 
//                   ref={videoRef} 
//                   autoPlay 
//                   playsInline
//                   muted
//                   className="w-full h-full object-cover"
//                 />
//                 <canvas ref={canvasRef} className="hidden" />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Questions Panel */}
//         <div className="lg:col-span-2 order-1 lg:order-2">
//           <form onSubmit={submit} className="space-y-6">
//             {loading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-pulse text-gray-500">Loading questions...</div>
//               </div>
//             ) : (
//               <Card className="shadow-lg">
//                 <CardHeader>
//                   <div className="flex justify-between items-center">
//                     <CardTitle>
//                       Question {currentQuestionIndex + 1} of {subjectiveQuestions.length}
//                     </CardTitle>
//                     <div className="text-sm text-gray-500">
//                       {Math.round(((currentQuestionIndex + 1) / subjectiveQuestions.length) * 100)}% Complete
//                     </div>
//                   </div>
//                   <Progress value={progress} className="h-2" />
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   <div className="bg-gray-50 p-4 rounded-lg">
//                     <Textarea
//                       value={subjectiveQuestions[currentQuestionIndex]?.question_title || ""}
//                       readOnly
//                       className="text-lg font-medium border-none bg-transparent resize-none focus-visible:ring-0"
//                     />
//                   </div>
                  
//                   <div className="space-y-2">
import React, { useEffect, useRef, useState } from 'react';
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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import axios from 'axios';

export default function SubjectiveExam() {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const warningTimeoutRef = useRef(null);

  // State from location or initialization
  const alertCount = location.state?.alertCount || 0;
  const timeLeftFromQuiz = location.state?.timeLeft;
  const duration = location.state?.duration || 60;

  // Component state
  const [timeLeft, setTimeLeft] = useState(
    timeLeftFromQuiz || { hours: 0, minutes: duration, seconds: 0 }
  );
  const [timeWarnings, setTimeWarnings] = useState({
    halfTime: false,
    quarterTime: false,
    fiveMinutes: false,
    oneMinute: false
  });
  const [warningMessage, setWarningMessage] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [referenceFaceDescriptor, setReferenceFaceDescriptor] = useState(null);
  const [progress, setProgress] = useState(0);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [answerErrors, setAnswerErrors] = useState([]);

  // Exam data
  const subjective_id = location.state?.subjective_id;
  const exam_id = location.state?.exam_id;
  const quiz_id = location.state?.quiz_id;

  // User data
  const usernames = JSON.parse(sessionStorage.getItem('username'));
  const regno = usernames.regno;
  const userId = usernames.id;
  const studentName = usernames.name;

  // Exam content
  const [subjectiveQuestions, setSubjectiveQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formFields, setFormFields] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [alertCountState, setAlertCountState] = useState(alertCount);

  // Security measures
  useEffect(() => {
    console.log(quiz_id)
    const preventDefault = (e) => {
      e.preventDefault();
      setAlertCountState(prev => {
        const newCount = prev + 1;
        setWarningMessage('Copy/paste is disabled during exams');
        setShowWarning(true);
        return newCount;
      });
    };
    
    document.addEventListener('copy', preventDefault);
    document.addEventListener('paste', preventDefault);
    document.addEventListener('cut', preventDefault);
    
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setAlertCountState(prev => {
          const newCount = prev + 1;
          setWarningMessage('Tab switching detected! This is prohibited.');
          setShowWarning(true);
          if (newCount >= 3) submit(new Event('submit'));
          return newCount;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('copy', preventDefault);
      document.removeEventListener('paste', preventDefault);
      document.removeEventListener('cut', preventDefault);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Fullscreen and initialization
  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().catch(err => {
        console.error('Fullscreen error:', err);
      });
    }
  };

  // Answer handling
  const handleInputChange = (index, value) => {
    const updatedFields = [...formFields];
    updatedFields[index].answer = value;
    setFormFields(updatedFields);
  };

  // Autosave functionality
  useEffect(() => {
    const autosave = async () => {
      if (formFields.length > 0 && !loading) {
        try {
          await axios.post(
            `${import.meta.env.VITE_URL}/autosaveSubjective/${userId}/${exam_id}`,
            { answers: formFields }
          );
          setLastSaved(new Date());
        } catch (err) {
          console.error("Autosave failed:", err);
        }
      }
    };
    
    const saveInterval = setInterval(autosave, 30000);
    return () => clearInterval(saveInterval);
  }, [formFields, loading]);

  // Submission handling
  const validateAnswers = () => {
    const errors = [];
    formFields.forEach((field, index) => {
      if (!field.answer || field.answer.length < 20) {
        errors.push(index);
      }
    });
    setAnswerErrors(errors);
    return errors.length === 0;
  };

  const submit = async (e) => {
    e?.preventDefault();
    
    if (!validateAnswers()) {
      setWarningMessage('Some answers are too short. Minimum 20 characters required.');
      setShowWarning(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const finalImage = await captureFrame();
      
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/attemptSubjective/${regno}/${subjective_id}/${quiz_id}/${exam_id}`,formFields
        // {
        //   answers: formFields,
        //   final_image: finalImage,
        //   warnings: alertCountState
        // }
      );
      
      // await axios.post(`${import.meta.env.VITE_URL}/logExamCompletion`, {
      //   exam_id,
      //   student_id: userId,
      //   status: 'completed',
      //   warnings: alertCountState
      // });
      
      navigate('/student', { state: { submitted: true } });
    } catch (err) {
      console.error("Submission error:", err);
      setWarningMessage('Submission failed. Please try again.');
      setShowWarning(true);
    } finally {
      setIsSubmitting(false);
      stopCamera();
    }
  };

  // Camera and face detection
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

  // Face API setup
  const loadFaceApiModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      ]);
      setModelsLoaded(true);
      
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

  const initializeFaceDetection = async () => {
    if (!modelsLoaded || !videoRef.current || !referenceFaceDescriptor) return;

    detectionIntervalRef.current = setInterval(async () => {
      try {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceDescriptors();

        const frameImage = await captureFrame();

        // No face detected
        if (detections.length === 0) {
          handleViolation('NO_FACE', frameImage);
          return;
        }

        // Multiple faces detected
        if (detections.length > 1) {
          handleViolation('MULTIPLE_FACES', frameImage);
          return;
        }

        // Face recognition check
        const faceDescriptor = detections[0].descriptor;
        const distance = faceapi.euclideanDistance(faceDescriptor, referenceFaceDescriptor);
        
        if (distance > 0.5) {
          handleViolation('UNAUTHORIZED_PERSON', frameImage);
          return;
        }

        // All checks passed
        setShowWarning(false);
      } catch (error) {
        console.error("Face detection error:", error);
      }
    }, 5000);
  };

  const handleViolation = (type, frameImage) => {
    const newCount = alertCountState + 1;
    setAlertCountState(newCount);
    
    const messages = {
      'NO_FACE': 'No face detected! Please position yourself in front of the camera.',
      'MULTIPLE_FACES': 'Multiple persons detected! Only one person should be visible.',
      'UNAUTHORIZED_PERSON': 'Unauthorized person detected! This will be reported.'
    };
    
    setWarningMessage(messages[type]);
    setShowWarning(true);
    logMalpractice(type, frameImage);
    
    if (newCount >= 3) {
      clearInterval(detectionIntervalRef.current);
      submit(new Event('submit'));
    }
  };

  // Data fetching
  const fetchSubjective = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/fetchSubjectiveQuestions`, { subjective_id });
      setSubjectiveQuestions(res.data);
      setLoading(false);
      setProgress(Math.round(((currentQuestionIndex + 1) / res.data.length) * 100));
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  // Timer management
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const { hours, minutes, seconds } = prevTime;
        if (hours === 0 && minutes === 0 && seconds === 0) {
          clearInterval(timer);
          submit(new Event('submit'));
          return prevTime;
        }
        
        const newTime = seconds > 0 
          ? { ...prevTime, seconds: seconds - 1 }
          : minutes > 0
            ? { hours, minutes: minutes - 1, seconds: 59 }
            : { hours: hours - 1, minutes: 59, seconds: 59 };
        
        // Time warnings
        const totalSeconds = newTime.hours * 3600 + newTime.minutes * 60 + newTime.seconds;
        const totalDuration = duration * 60;
        
        if (totalSeconds <= totalDuration * 0.5 && !timeWarnings.halfTime) {
          setWarningMessage('Half of your time has elapsed!');
          setShowWarning(true);
          setTimeWarnings(prev => ({...prev, halfTime: true}));
        }
        else if (totalSeconds <= totalDuration * 0.25 && !timeWarnings.quarterTime) {
          setWarningMessage('Only 25% of your time remaining!');
          setShowWarning(true);
          setTimeWarnings(prev => ({...prev, quarterTime: true}));
        }
        else if (totalSeconds <= 300 && !timeWarnings.fiveMinutes) {
          setWarningMessage('Only 5 minutes remaining!');
          setShowWarning(true);
          setTimeWarnings(prev => ({...prev, fiveMinutes: true}));
        }
        else if (totalSeconds <= 60 && !timeWarnings.oneMinute) {
          setWarningMessage('Final minute!');
          setShowWarning(true);
          setTimeWarnings(prev => ({...prev, oneMinute: true}));
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration, timeWarnings]);

  // Initial setup
  useEffect(() => {
    enterFullscreen();
    fetchSubjective();
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
      return () => clearTimeout(warningTimeoutRef.current);
    }
  }, [showWarning]);

  useEffect(() => {
    const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}/student/${exam_id}/${userId}`);
    ws.onopen = () => console.log("Student WebSocket opened");
    ws.onclose = () => console.log("Student WebSocket closed");
    return () => ws.close();
  }, [exam_id, userId]);

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
    if (subjectiveQuestions.length > 0) {
      setProgress(Math.round(((currentQuestionIndex + 1) / subjectiveQuestions.length) * 100));
    }
  }, [currentQuestionIndex, subjectiveQuestions]);

  // Review Screen Component
  const ReviewScreen = () => (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Review Your Answers</CardTitle>
          <CardDescription>Please verify all answers before submission</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {formFields.map((field, index) => (
            <div key={index} className={`space-y-2 border-b pb-4 ${answerErrors.includes(index) ? 'bg-red-50' : ''}`}>
              <h3 className="font-medium">Question {index + 1}</h3>
              <p className="text-sm text-muted-foreground">
                {subjectiveQuestions[index]?.question_title}
              </p>
              <div className="bg-gray-50 p-3 rounded-md mt-2">
                {field.answer || <span className="text-gray-400">No answer provided</span>}
              </div>
              {answerErrors.includes(index) && (
                <p className="text-sm text-red-500">This answer is too short (minimum 20 characters)</p>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => setShowReview(false)}>
            Continue Editing
          </Button>
          <Button onClick={submit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Confirm Submission"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{studentName}</h1>
          <p className="text-gray-600">Exam ID: {exam_id}</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-sm text-muted-foreground">
            {lastSaved ? (
              <span className="flex items-center">
                <CheckCircledIcon className="h-4 w-4 mr-1 text-green-500" />
                Saved at {new Date(lastSaved).toLocaleTimeString()}
              </span>
            ) : "Waiting to save..."}
          </div>
          <div className="flex flex-col items-end">
            <div className="text-3xl font-mono font-bold text-blue-600">
              {`${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
            </div>
            <div className={`text-lg font-semibold ${alertCountState > 1 ? 'text-red-600' : 'text-yellow-600'}`}>
              <ExclamationTriangleIcon className="inline mr-1 h-4 w-4" />
              Warnings: {alertCountState}/3
            </div>
          </div>
        </div>
      </div>

      {/* Warning Alert */}
      {showWarning && (
        <Alert variant={warningMessage.includes('Unauthorized') ? 'destructive' : 'warning'} className="mb-6 animate-fade-in">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>{warningMessage.includes('Unauthorized') ? 'Security Alert' : 'Warning'}</AlertTitle>
          <AlertDescription>{warningMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Navigator Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <Card className="sticky top-6 shadow-lg h-[calc(100vh-120px)] overflow-y-auto">
            <CardHeader>
              <CardTitle>Questions</CardTitle>
              <CardDescription>Jump to any question</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2">
              {subjectiveQuestions.map((_, index) => (
                <Button
                  key={index}
                  variant={
                    currentQuestionIndex === index 
                      ? "default" 
                      : formFields[index]?.answer 
                        ? "secondary" 
                        : "outline"
                  }
                  size="sm"
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowReview(true)}
              >
                Review Answers
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => submit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Main Questions Panel */}
        <div className="lg:col-span-2">
          <form onSubmit={(e) => { e.preventDefault(); setShowReview(true); }}>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-pulse text-gray-500">Loading questions...</div>
              </div>
            ) : (
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      Question {currentQuestionIndex + 1} of {subjectiveQuestions.length}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {Math.round(((currentQuestionIndex + 1) / subjectiveQuestions.length) * 100)}% Complete
                    </div>
                  </div>
                  <Progress value={progress} className="h-2" />
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <Textarea
                      value={subjectiveQuestions[currentQuestionIndex]?.question_title || ""}
                      readOnly
                      className="text-lg font-medium border-none bg-transparent resize-none focus-visible:ring-0"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Your Answer</Label>
                    <div className="relative">
                      <Textarea
                        value={formFields[currentQuestionIndex]?.answer || ''}
                        onChange={(e) => handleInputChange(currentQuestionIndex, e.target.value)}
                        className="min-h-[300px] font-mono text-base"
                        placeholder={`Answer question ${currentQuestionIndex + 1} in detail (minimum 20 characters)...`}
                      />
                      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                        {formFields[currentQuestionIndex]?.answer?.length || 0} characters
                      </div>
                    </div>
                    {answerErrors.includes(currentQuestionIndex) && (
                      <p className="text-sm text-red-500">This answer is too short (minimum 20 characters required)</p>
                    )}
                  </div>
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
                  
                  {currentQuestionIndex < subjectiveQuestions.length - 1 ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                    >
                      Next Question
                    </Button>
                  ) : (
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Review & Submit
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )}
          </form>
        </div>

        {/* Monitoring Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6 shadow-lg">
            <CardHeader>
              <CardTitle>Exam Monitoring</CardTitle>
              <CardDescription>
                {modelsLoaded ? "Active" : "Initializing..."}
              </CardDescription>
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
                {!modelsLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-2"></div>
                      <p>Loading face detection</p>
                    </div>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Face Detection</span>
                  <span className={`text-sm ${
                    modelsLoaded ? 'text-green-500' : 'text-yellow-500'
                  }`}>
                    {modelsLoaded ? "Active" : "Loading..."}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">WebSocket</span>
                  <span className="text-sm text-green-500">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Fullscreen</span>
                  <span className="text-sm text-green-500">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Review Screen */}
      {showReview && <ReviewScreen />}
    </div>
  );
}