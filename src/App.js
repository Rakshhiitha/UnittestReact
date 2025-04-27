import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Importing the CSS

function App() {
  const [code, setCode] = useState(""); // State for Python code input
  const [file, setFile] = useState(null); // State for file input
  const [testCases, setTestCases] = useState(""); // State for generated test cases
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(false); // State for loading state
  const [showOutput, setShowOutput] = useState(false); // State for showing output or error box

  // Handle code input change
  const handleCodeChange = (e) => setCode(e.target.value);

  // Handle file input change
  const handleFileChange = (e) => setFile(e.target.files[0]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    setLoading(true); // Set loading to true
    setShowOutput(false); // Hide the output box before generating new output
    const formData = new FormData();
    
    if (code) {
      formData.append("code", code); // Add code to form data
    }

    if (file) {
      formData.append("file", file); // Add file to form data
    }

    if (!code && !file) {
      setError("Please provide either code or a file.");
      setLoading(false);
      return;
    }

    try {
      // Use the correct base URL depending on the environment
      const apiBaseUrl = process.env.REACT_APP_ENV === 'development' 
        ? process.env.REACT_APP_API_BASE_URL_LOCAL
        : process.env.REACT_APP_API_BASE_URL_DEPLOY;

      // Make the API request
      const res = await axios.post(apiBaseUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTestCases(res.data.test_cases); // Set the generated test cases
      setError(""); // Clear error message
      setShowOutput(true); // Show the output box after generating test cases
    } catch (err) {
      setError("Error generating test cases: " + err.message); // Set error message if API call fails
      setTestCases(""); // Clear test cases if there's an error
      setShowOutput(true); // Show the error message box after failure
    } finally {
      setLoading(false); // Set loading to false after the operation is complete
    }
  };

  return (
    <div className="container">
      <div className="box">
        <h1>Python Unit Test Case Generator</h1>

        {/* Form to submit Python code */}
        <form onSubmit={handleSubmit}>
          <textarea
            value={code} // Bind code input value
            onChange={handleCodeChange} // Handle input change
            placeholder="Paste your Python code here..."
            rows="10"
          ></textarea>

          {/* File input */}
          <input type="file" onChange={handleFileChange} />

          <button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate Test Cases"} {/* Change button text based on loading */}
          </button>
        </form>

        <h2>Generated Test Cases</h2>

        {/* Output Box */}
        <div className={`output-box ${showOutput ? 'show' : ''}`}>
          {error ? (
            // Show error if there is one
            <div className={`error ${showOutput ? 'show' : ''}`}>
              {error}
            </div>
          ) : (
            <pre>{testCases || <i>Test cases will appear here...</i>}</pre> // Use <pre> to preserve formatting
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
