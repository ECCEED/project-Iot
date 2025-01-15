'use client'; // Mark this component as a Client Component

import { useEffect, useState } from "react";

// TypeScript type for an attendance entry
type AttendanceEntry = {
  id: number;
  studentId: string;
  timestamps: string[];
  course: string;
};

export default function AttendanceTable() {
  const [attendances, setAttendances] = useState<AttendanceEntry[]>([]);
  const [filteredAttendances, setFilteredAttendances] = useState<AttendanceEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch attendance records when the component mounts
  useEffect(() => {
    async function fetchAttendances() {
      try {
        const response = await fetch("http://localhost:8090/api/attendance"); // API endpoint for getting attendance data
        if (!response.ok) {
          throw new Error("Failed to fetch attendances");
        }
        const data = await response.json();
        setAttendances(data);
        setFilteredAttendances(data); // Initially display all records
      } catch (error: any) {
        console.error("Error fetching attendances:", error);
        setError("There was an error loading attendance data.");
      } finally {
        setLoading(false);
      }
    }
    fetchAttendances();
  }, []);

  // Handle searching
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = attendances.filter((attendance) =>
      attendance.studentId.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredAttendances(filtered);
  };

  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Attendance List
      </h1>
      <div className="mt-4 sm:mt-6 lg:mt-10">
        {/* Search Bar */}
        <div className="mb-4">
          <label htmlFor="studentID-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Search by Student ID
          </label>
          <input
            id="studentID-search"
            type="text"
            className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
            value={searchQuery}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Enter Student ID"
          />
        </div>

        {/* Table for displaying attendance entries */}
        <div className="overflow-x-auto mt-10">
          {loading ? (
            <div className="text-center text-gray-500">Loading attendance...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div> // Display error message
          ) : (
            <>
              <table className="min-w-full table-auto border-collapse">
                <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">ID</th>
                  <th className="py-2 px-4 text-left">Student ID</th>
                  <th className="py-2 px-4 text-left">Timestamp</th>
                  <th className="py-2 px-4 text-left">Course</th>
                </tr>
                </thead>
                <tbody>
                {filteredAttendances.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">
                      No attendance records found.
                    </td>
                  </tr>
                ) : (
                  filteredAttendances.flatMap((attendance) =>
                    attendance.timestamps.map((timestamp, index) => (
                      <tr key={`${attendance.id}-${index}`} className="border-b">
                        <td className="py-2 px-4">{attendance.id}</td>
                        <td className="py-2 px-4">{attendance.studentId}</td>
                        <td className="py-2 px-4">{timestamp}</td>
                        <td className="py-2 px-4">{attendance.course}</td>
                      </tr>
                    ))
                  )
                )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </>
  );
}