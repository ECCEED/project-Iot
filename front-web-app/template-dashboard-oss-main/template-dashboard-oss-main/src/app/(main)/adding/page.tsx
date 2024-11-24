'use client';

import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuGroup } from "@/components/Dropdown";
import { cx } from "@/lib/utils";

export default function AddStudent() {
  const [numInsc, setNumInsc] = useState<number>(0); // Student number
  const [name, setName] = useState<string>(''); // Student name
  const [mail, setMail] = useState<string>(''); // Student email
  const [age, setAge] = useState<number>(0); // Student age
  const [error, setError] = useState<string | null>(null); // Error state
  const [success, setSuccess] = useState<string | null>(null); // Success state

  const workspaces = [
    {
      value: "INFO RESEAUX MULTI 1",
      name: "IRM 1",
      initials: " 1",
      color: "bg-indigo-600 dark:bg-indigo-500",
    },
    {
      value: "INFO RESEAUX MULTI 2",
      name: "IRM 2",
      initials: "2",
      color: "bg-green-600 dark:bg-green-500",
    },
    {
      value: "INFO RESEAUX MULTI 3",
      name: "IRM 3",
      initials: " 3",
      color: "bg-yellow-600 dark:bg-yellow-500",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newStudent = { numInsc, name, mail, age };

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

      setSuccess('Student added successfully!');
      setNumInsc(0);
      setName('');
      setMail('');
      setAge(0);
      setError(null);
    } catch (error) {
      console.error('Error adding student:', error);
      setError('There was an error adding the student.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">Add Student</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}

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

        <button
          type="submit"
          className="w-full rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Add Student
        </button>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="mt-4 w-full px-4 py-2 text-center bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300">
            Select Workspace
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full">
            <DropdownMenuLabel>Workspaces ({workspaces.length})</DropdownMenuLabel>
            <DropdownMenuGroup>
              {workspaces.map((workspace) => (
                <DropdownMenuItem key={workspace.value}>
                  <div className="flex w-full items-center gap-x-2.5">
                    <span
                      className={cx(
                        workspace.color,
                        "flex aspect-square size-8 items-center justify-center rounded p-2 text-xs font-medium text-white"
                      )}
                      aria-hidden="true"
                    >
                      {workspace.initials}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{workspace.name}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </form>
    </div>
  );
}
