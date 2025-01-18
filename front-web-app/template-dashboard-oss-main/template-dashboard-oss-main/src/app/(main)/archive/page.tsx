'use client'; // Mark this component as a Client Component

import { useEffect, useState } from "react";

// TypeScript type for an attendance entry
type AttendanceEntry = {
  id: number;
  studentID: string;
  timestamps: string[];
  course: string;
  studentName?: string;  // Add studentName
  studentPhoto?: string; // Add studentPhoto
};

export default function AttendanceTable() {
  const [attendances, setAttendances] = useState<AttendanceEntry[]>([]);
  const [filteredAttendances, setFilteredAttendances] = useState<AttendanceEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch attendance records and student details when the component mounts
  useEffect(() => {
    async function fetchAttendances() {
      try {
        const response = await fetch("http://localhost:8090/api/attendance"); // API endpoint for getting attendance data
        if (!response.ok) {
          throw new Error("Failed to fetch attendances");
        }
        const data = await response.json();

        // Fetch student details for each attendance record
        const updatedAttendances = await Promise.all(
          data.map(async (attendance: AttendanceEntry) => {
            const studentDetails = await fetchStudentDetails(attendance.studentID); // Fetching student details by studentID
            return {
              ...attendance,
              studentName: studentDetails.name,
              studentPhoto: studentDetails.photoUrl,
            };
          })
        );

        setAttendances(updatedAttendances);
        setFilteredAttendances(updatedAttendances);
      } catch (error: any) {
        console.error("Error fetching attendances:", error);
        setError("There was an error loading attendance data.");
      } finally {
        setLoading(false);
      }
    }

    // Fetch student details by studentID
    async function fetchStudentDetails(studentID: string) {
      const response = await fetch(`http://localhost:8090/api/Students/${studentID}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch student data for ${studentID}`);
      }
      return response.json(); // Assuming it returns { name, photo }
    }

    fetchAttendances();
  }, []);

  // Handle searching
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = attendances.filter((attendance) =>
      attendance.studentID.toLowerCase().includes(query.toLowerCase())
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
          <label
            htmlFor="studentID-search"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Search by Student ID
          </label>
          <input
            id="studentID-search"
            type="text"
            className="mt-2 block w-full rounded-md border-gray-300 bg-white text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:text-gray-300"
            value={searchQuery}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Enter Student ID"
          />
        </div>

        {/* Table for displaying attendance entries */}
        <div className="mt-10 overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-500">
              Loading attendance...
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div> // Display error message
          ) : (
            <>
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="border-b">

                    <th className="px-4 py-2 text-left">Photo</th>
                    <th className="px-4 py-2 text-left">Student ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    {/* Display student name */}
                    <th className="px-4 py-2 text-left">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendances.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-4 text-center text-gray-500"
                      >
                        No attendance records found.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendances.flatMap((attendance) =>
                      attendance.timestamps.map((timestamp, index) => (
                        <tr
                          key={`${attendance.id}-${index}`}
                          className="border-b"
                        >

                          <td className="px-4 py-2">
                            {attendance.studentPhoto ? (
                              <img
                                src={attendance.studentPhoto}
                                alt="Student Photo"
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              "No photo available"
                            )}
                          </td>
                          <td className="px-4 py-2">{attendance.studentID}</td>
                          <td className="px-4 py-2">
                            {attendance.studentName}
                          </td>
                          <td className="px-4 py-2">{timestamp}</td>
                        </tr>
                      )),
                    )
                  )}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </>
  )
}
