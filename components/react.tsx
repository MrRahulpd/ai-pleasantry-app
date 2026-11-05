'use client';
import { useState } from 'react';

export default function TransformerUI() {
  const checkCompatibility = async () => {
    try {
      const response = await fetch('http://localhost:8000/health');
      setCompatibility(response.ok ? 'Pass' : 'Fail');
      setBackendStatus(response.ok ? 'Connected' : 'Disconnected');
    } catch {
      setCompatibility('Fail');
      setBackendStatus('Disconnected');
    }
  };

  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('Unknown');
  const [compatibility, setCompatibility] = useState('Not Checked');
  
  const generatePleasantry = async () => {
    setError('');
    setOutput('');

    try {
      const response = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Code Error');
      }

      const data = await response.json();
      setOutput(data.output || 'No response received');
    } catch {
      setError('Error: Code Error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold">AI Pleasantry Generator</h1>

        <div>
          <p className="text-sm font-medium">Backend Status</p>
          <p>{backendStatus}</p>
        </div>

        <textarea
          className="w-full border rounded-xl p-3"
          placeholder="Enter prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-xl"
            onClick={generatePleasantry}
          >
            Generate
          </button>

          <button
            className="bg-green-600 text-white px-4 py-2 rounded-xl"
            onClick={checkCompatibility}
          >
            Check Compatibility
          </button>
        </div>

        <div>
          <h2 className="font-semibold">Compatibility Check</h2>
          <p>{compatibility}</p>
        </div>

        <div>
          <h2 className="font-semibold">Output</h2>
          <div className="border rounded-xl p-3 min-h-24 bg-gray-50">
            {output}
          </div>
        </div>

        {error && (
          <div className="border border-red-500 text-red-600 rounded-xl p-3">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
