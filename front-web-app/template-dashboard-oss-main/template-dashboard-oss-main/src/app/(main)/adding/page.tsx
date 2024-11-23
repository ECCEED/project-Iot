'use client'

import { useState } from 'react';

type Student = {
  numInsc: number;
  name: string;
  mail: string;
  age: number;
};

export default function AddStudent() {
  const [numInsc, setNumInsc] = useState<number>(0); 
  const [name, setName] = useState<string>('');
  const [mail, setMail] = useState<string>('');
  const [age, setAge] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const newStudent: Student = { numInsc, name, mail, age };
  
    try {
      const response = await fetch('http://localhost:8090/api/Students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStudent),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add student');
      }
  
      const data = await response.text(); // Use text() instead of json()
      console.log('Raw response:', data);
  
      // Set success message without JSON parsing
      setSuccess('Student added successfully!');
      setName('');
      setMail('');
      setAge(0);
      setNumInsc(0);
    } catch (error) {
      console.error('Error adding student:', error);
      setError('There was an error adding the student.');
    }
  };
  
  

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">Add Student</h1>
      <form onSubmit={handleSubmit} className="mt-6">
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}

        <div className="mb-4">
          <label htmlFor="numInsc" className="block text-gray-700">Number (NumInsc)</label>
          <input
            id="numInsc"
            type="number"
            value={numInsc}
            onChange={(e) => setNumInsc(Number(e.target.value))}
            required
            className="mt-1 block w-full border rounded px-3 py-2 text-black"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full border rounded px-3 py-2 text-black"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            required
            className="mt-1 block w-full border rounded px-3 py-2 text-black"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="age" className="block text-gray-700">Age</label>
          <input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            required
            className="mt-1 block w-full border rounded px-3 py-2 text-black"
          />
        </div>

        <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded">
          Add Student
        </button>
      </form>
    </div>
  );
}
