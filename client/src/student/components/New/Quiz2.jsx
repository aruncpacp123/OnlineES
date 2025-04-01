import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as faceapi from "face-api.js";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";

export default function Quiz2() {
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
  const [examName, setExamName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(true);
  const [formFields, setFormFields] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [malpracticeLog, setMalpracticeLog] = useState([]);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [referenceDescriptor, setReferenceDescriptor] = useState(null);

  const usernames = JSON.parse(sessionStorage.getItem("username"));
  const regno = usernames.regno;
  const userId = usernames.id;

  const handleRadioChange = (index, value) => {
    const updatedFields = [...formFields];
    updatedFields[index].answer = value;
    setFormFields(updatedFields);
  };

  const enterFullscreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) element.requestFullscreen();
    else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_URL}/attemptQuiz/${regno}/${quiz_id}/${quizMark}/${exam_id}`,
        formFields
      );
      stopCamera();
      if (subjective_id) {
        navigate("/student/exam/subjective", {
          state: { subjective_id, exam_id, quiz_id, duration },
        });
      } else {
        navigate("/student");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchQuiz = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_URL}/fetchQuizQuestions`, { quiz_id });
      setQuizQuestions(res.data.questions || []);
      setExamName(res.data.exam_name || "Unnamed Exam");
      setStudentName(usernames.name || "Student");
      setLoading(false);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const loadFaceApiModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      ]);
      setModelsLoaded(true);
    } catch (error) {
      console.error("Error loading face-api models:", error);
    }
  };

  const loadReferenceImage = async () => {
    const img = await faceapi.fetchImage("/reference_images/TVE23MCA-2019.jpeg"); // Adjust path
    const detection = await faceapi
      .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
    if (detection) setReferenceDescriptor(detection.descriptor);
  };

  const logMalpractice = async (type, imageData) => {
    const logEntry = { type, timestamp: new Date().toISOString(), image: imageData };
    setMalpracticeLog((prev) => {
      const newLog = [...prev, logEntry];
      if (newLog.length >= 3) {
        submit(new Event("submit"));
      }
      return newLog;
    });

    // try {
    //   await axios.post(`${import.meta.env.VITE_URL}/logMalpractice`, {
    //     exam_id,
    //     user_id: userId,
    //     type,
    //     image: imageData,
    //   });
    // } catch (err) {
    //   console.error("Error logging malpractice:", err);
    // }
  };

  const captureFrame = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL("image/jpeg");
  };

  const initializeFaceDetection = async () => {
    if (!modelsLoaded || !videoRef.current) return;

    detectionIntervalRef.current = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      const imageData = captureFrame();

      if (detections.length > 1) {
        logMalpractice("Multiple Persons Detected", imageData);
      } else if (detections.length === 0) {
        logMalpractice("No Person Detected", imageData);
      } else if (referenceDescriptor) {
        const distance = faceapi.euclideanDistance(
          detections[0].descriptor,
          referenceDescriptor
        );
        if (distance > 0.6) { // Threshold for mismatch
          logMalpractice("Another Person Detected", imageData);
        }
      }
    }, 2000); // Check every 2 seconds
  };

  useEffect(() => {
    enterFullscreen();
    fetchQuiz();
    startCamera();
    loadFaceApiModels();
    loadReferenceImage();

    return () => {
      if (detectionIntervalRef.current) clearInterval(detectionIntervalRef.current);
      stopCamera();
    };
  }, []);

  useEffect(() => {
    if (modelsLoaded) initializeFaceDetection();
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
        answer: "",
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
          submit(new Event("submit"));
          return prevTime;
        }
        if (seconds > 0) return { ...prevTime, seconds: seconds - 1 };
        else if (minutes > 0) return { hours, minutes: minutes - 1, seconds: 59 };
        else if (hours > 0) return { hours: hours - 1, minutes: 59, seconds: 59 };
        return prevTime;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-gray-100 p-6 flex flex-col items-center">
      {/* Header Section */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-6 bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-indigo-800">{examName}</h1>
          <span className="text-lg text-gray-600">({studentName})</span>
        </div>
        <div className="text-xl font-semibold text-indigo-600">
          Time Left: {`${String(timeLeft.hours).padStart(2, "0")}:${String(timeLeft.minutes).padStart(2, "0")}:${String(timeLeft.seconds).padStart(2, "0")}`}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl flex gap-6">
        {/* Quiz Section (Centered) */}
        <div className="flex-1">
          <form onSubmit={submit} className="space-y-6">
            {loading ? (
              <div className="text-center text-gray-600 font-mono font-extrabold">LOADING...</div>
            ) : (
              <Card className="bg-white rounded-xl shadow-lg border border-indigo-200">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-4 rounded-t-xl">
                  <CardTitle className="text-center text-xl font-semibold">
                    Question {currentQuestionIndex + 1} of {quizQuestions.length}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <Textarea
                    value={quizQuestions[currentQuestionIndex]?.question_title || ""}
                    readOnly
                    className="bg-gray-50 border-gray-200 text-gray-800 rounded-md resize-none"
                  />
                  <RadioGroup
                    value={formFields[currentQuestionIndex]?.answer}
                    onValueChange={(value) => handleRadioChange(currentQuestionIndex, value)}
                    className="space-y-3"
                  >
                    {["option1", "option2", "option3", "option4"].map((opt, optIndex) => (
                      <div className="flex items-center space-x-3" key={optIndex}>
                        <RadioGroupItem
                          value={optIndex + 1}
                          id={`${opt}-${currentQuestionIndex}`}
                          className="border-indigo-500 text-indigo-500"
                        />
                        <Label
                          htmlFor={`${opt}-${currentQuestionIndex}`}
                          className="text-gray-700 hover:text-indigo-600 transition-colors"
                        >
                          {quizQuestions[currentQuestionIndex]?.[opt] || ""}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
                <CardFooter className="flex justify-between p-4 border-t border-gray-100">
                  <Button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md shadow-sm transition-all duration-200 hover:scale-105"
                    onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    disabled={currentQuestionIndex === quizQuestions.length - 1}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm transition-all duration-200 hover:scale-105"
                    onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </CardFooter>
              </Card>
            )}
            {currentQuestionIndex === quizQuestions.length - 1 && (
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg shadow-md transition-all duration-300 hover:scale-105"
              >
                Submit Quiz
              </Button>
            )}
          </form>
        </div>

        {/* Camera and Malpractice Log */}
        <div className="w-80 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">Live Camera</h3>
            <div className="w-full h-48 bg-black rounded-md overflow-hidden">
              <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">Malpractice Log</h3>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {malpracticeLog.length === 0 ? (
                <p className="text-gray-600">No malpractices detected.</p>
              ) : (
                malpracticeLog.map((log, index) => (
                  <p key={index} className="text-sm text-red-600">
                    {log.timestamp} - {log.type}
                  </p>
                ))
              )}
            </div>
            <p className="text-sm text-red-600 mt-2">Warnings: {malpracticeLog.length}/3</p>
          </div>
        </div>
      </div>
    </div>
  );
}