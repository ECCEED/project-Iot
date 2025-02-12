'use client';

import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/Dropdown";
import { cx } from "@/lib/utils";

export default function AddStudent() {
  // State variables
  const [numInsc, setNumInsc] = useState<number>(0); // Student number
  const [name, setName] = useState<string>(''); // Student name
  const [mail, setMail] = useState<string>(''); // Student email
  const [age, setAge] = useState<number>(0); // Student age
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null); // Selected class ID
  const [error, setError] = useState<string | null>(null); // Error state
  const [success, setSuccess] = useState<string | null>(null); // Success state
  const [classes, setClasses] = useState<any[]>([]); // Classes list
  const [photo, setPhoto] = useState<File | null>(null); // Photo file

  // Fetch available classes on component mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch('http://localhost:8090/api/classes', {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch classes');
        }
        const data = await response.json();
        setClasses(data); // Update state with class data
      } catch (err) {
        console.error('Error fetching classes:', err);
        setError('Failed to load classes.');
      }
    };

    fetchClasses();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate selected class
    if (!selectedClassId) {
      setError('Please select a class.');
      return;
    }

    // Create the student object
    const student = {
      numInsc,
      name,
      mail,
      age,
      classEntity: { id: selectedClassId }, // Class reference
    };

    // Create FormData
    const formData = new FormData();
    formData.append('student', JSON.stringify(student)); // Add student as JSON string
    if (photo) {
      formData.append('photo', photo); // Add photo file
    }

    try {
      // Send API request to backend
      const response = await fetch('http://localhost:8090/api/Students', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get detailed error message
        throw new Error(errorText);
      }

      // Success handling
      setSuccess('Student added successfully!');
      setNumInsc(0);
      setName('');
      setMail('');
      setAge(0);
      setSelectedClassId(null);
      setPhoto(null); // Clear form after successful submission
      setError(null);
    } catch (error: any) {
      console.error('Error adding student:', error);
      setError(error.message || 'There was an error adding the student.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">Add Student</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}

        {/* Input Fields */}
        <div className="flex items-center gap-x-2.5">
          <span
            className="flex aspect-square size-8 items-center justify-center rounded bg-indigo-600 p-2 text-xs font-medium text-white"
            aria-hidden="true"
          >
            ID
          </span>
          <input
            id="numInsc"
            type="number"
            placeholder="Number (NumInsc)"
            value={numInsc}
            onChange={(e) => setNumInsc(Number(e.target.value))}
            required
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-all hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-950"
          />
        </div>
        <div className="flex items-center gap-x-2.5">
          <span
            className="flex aspect-square size-8 items-center justify-center rounded bg-indigo-600 p-2 text-xs font-medium text-white"
            aria-hidden="true"
          >
            NA
          </span>
          <input
            id="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-all hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-950"
          />
        </div>
        <div className="flex items-center gap-x-2.5">
          <span
            className="flex aspect-square size-8 items-center justify-center rounded bg-indigo-600 p-2 text-xs font-medium text-white"
            aria-hidden="true"
          >
            EM
          </span>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            required
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-all hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-950"
          />
        </div>
        <div className="flex items-center gap-x-2.5">
          <span
            className="flex aspect-square size-8 items-center justify-center rounded bg-indigo-600 p-2 text-xs font-medium text-white"
            aria-hidden="true"
          >
            AG
          </span>
          <input
            id="age"
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            required
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-all hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-950"
          />
        </div>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="mt-4 w-full px-4 py-2 text-center bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300">
            {selectedClassId ? `Class ID: ${selectedClassId}` : 'Select Class'}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            <DropdownMenuLabel>Available Classes ({classes.length})</DropdownMenuLabel>
            <DropdownMenuGroup>
              {classes.map((classItem) => (
                <DropdownMenuItem
                  key={classItem.id}
                  onClick={() => setSelectedClassId(classItem.id)}
                >
                  <div className="flex w-full items-center gap-x-2.5">
                    <span
                      className={cx(
                        "bg-indigo-500 dark:bg-indigo-400",
                        "flex aspect-square size-8 items-center justify-center rounded p-2 text-xs font-medium text-white"
                      )}
                      aria-hidden="true"
                    >
                      {classItem.id}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        {classItem.name}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* File input for photo */}
        <div className="flex items-center gap-x-2.5 mt-4">
          <span
            className="flex aspect-square size-8 items-center justify-center rounded bg-indigo-600 p-2 text-xs font-medium text-white"
            aria-hidden="true"
          >
            PH
          </span>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files ? e.target.files[0] : null)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm transition-all hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-gray-800 dark:bg-gray-950"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-indigo-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
