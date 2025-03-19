import React, { useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';

const FaceDetectionComponent = () => {
  const videoRef = useRef(null);

  const initializeFaceDetection = async () => {
    try {
      // Load the face detection model
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      console.log('Face detection model loaded successfully');

      const videoElement = videoRef.current;
      if (videoElement) {
        // Start the video stream from the webcam
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        videoElement.play();

        // Create a canvas to overlay face detection results
        const canvas = faceapi.createCanvasFromMedia(videoElement);
        document.body.append(canvas);

        // Match canvas dimensions to video dimensions
        const displaySize = { width: videoElement.width, height: videoElement.height };
        faceapi.matchDimensions(canvas, displaySize);

        // Position the canvas on top of the video
        canvas.style.position = 'absolute';
        canvas.style.top = `${videoElement.offsetTop}px`;
        canvas.style.left = `${videoElement.offsetLeft}px`;
        canvas.style.zIndex = 10;

        // Continuously detect faces
        setInterval(async () => {
          const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions());

          // Draw detections on the canvas
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          faceapi.draw.drawDetections(canvas, resizedDetections);

          // Check if more than one face is detected
          if (detections.length > 1) {
            alert('More than one person detected!');
            // Log the event or notify the proctor
            console.log('Multiple faces detected:', detections.length);
          }
        }, 1000); // Check every second
      }
    } catch (error) {
      console.error('Error initializing face detection:', error);
    }
  };

  useEffect(() => {
    initializeFaceDetection();
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <video ref={videoRef} autoPlay muted width="640" height="480"></video>
    </div>
  );
};

export default FaceDetectionComponent;