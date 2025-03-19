import { useState } from 'react';
import axios from 'axios';


function Demo() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  async function generateAnswer() {
    setAnswer("loading....");
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${googleApiKey}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          contents: [
            { parts: [{ text: question }] },
          ],
        },
      });
      setAnswer(response.data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error("Error generating answer:", error);
      setAnswer("Failed to generate answer. Please try again.");
    }
  }

  function clearAnswer() {
    setAnswer("");
  }

  return (
    <div className='container'>
      <h1>Chat AI</h1>
      <textarea
        className='textarea'
        placeholder='Ask me anything?'
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        cols="30"
        rows="10"
      ></textarea>
      <div className="button-container">
        <button onClick={generateAnswer} className="button">
          Generate Answer
        </button>
        <button onClick={clearAnswer} className="button">
          Clear Answer
        </button>
      </div>
      {answer && (
        <div className="answer-box">
          <pre>{answer}</pre>
        </div>
      )}
    </div>
  );
}

export default Demo;