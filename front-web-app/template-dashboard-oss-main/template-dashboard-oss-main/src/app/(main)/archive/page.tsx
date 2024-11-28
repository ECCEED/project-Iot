'use client'; // Mark this component as a Client Component

import { useEffect, useState } from "react";

// TypeScript type for an archive entry
type ArchiveEntry = {
  id: number;
  studentID: string;
  status: string;
  date: string; 
  clas: string;
  course: string; // New field for course
};

export default function ArchiveTable() {
  const [archives, setArchives] = useState<ArchiveEntry[]>([]);
  const [filteredArchives, setFilteredArchives] = useState<ArchiveEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedClas, setSelectedClas] = useState<string | null>(null);
  const [searchStudentID, setSearchStudentID] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const resultsPerPage = 10;

  // Fetch archive entries when the component mounts
  useEffect(() => {
    async function fetchArchives() {
      try {
        const response = await fetch("http://localhost:8090/api/archives"); // API endpoint for getting archives
        if (!response.ok) {
          throw new Error("Failed to fetch archives");
        }
        const data = await response.json();
        setArchives(data);
        setFilteredArchives(data); // Initially display all records
      } catch (error: any) {
        console.error("Error fetching archives:", error);
        setError("There was an error loading archive data.");
      } finally {
        setLoading(false);
      }
    }
    fetchArchives();
  }, []);

  // Handle filtering archives
  const applyFilters = (
    month: number | null, 
    clas: string | null, 
    studentID: string, 
    course: string | null
  ) => {
    let filtered = archives;

    if (month) {
      filtered = filtered.filter((archive) => {
        const archiveDate = new Date(archive.date);
        return archiveDate.getMonth() + 1 === month;
      });
    }

    if (clas) {
      filtered = filtered.filter((archive) => archive.clas === clas);
    }

    if (studentID.trim()) {
      filtered = filtered.filter((archive) =>
        archive.studentID.toLowerCase().includes(studentID.toLowerCase())
      );
    }

    if (course) {
      filtered = filtered.filter((archive) => archive.course === course);
    }

    setCurrentPage(1); // Reset to the first page whenever filters change
    setFilteredArchives(filtered);
  };

  // Pagination calculations
  const totalResults = filteredArchives.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const paginatedResults = filteredArchives.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Archive List
      </h1>
      <div className="mt-4 sm:mt-6 lg:mt-10">

        {/* Filters */}
        <div className="mb-4 grid grid-cols-2 gap-4">
          {/* Month and Class Filters */}
          <div>
            <label htmlFor="month-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Month
            </label>
            <select
              id="month-select"
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
              value={selectedMonth || ""}
              onChange={(event) => {
                const month = parseInt(event.target.value, 10);
                setSelectedMonth(month);
                applyFilters(month, selectedClas, searchStudentID, selectedCourse);
              }}
            >
              <option value="">All</option>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>

          <div>
            <label htmlFor="classe-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Class
            </label>
            <select
              id="classe-select"
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
              value={selectedClas || ""}
              onChange={(event) => {
                const clas = event.target.value || null;
                setSelectedClas(clas);
                applyFilters(selectedMonth, clas, searchStudentID, selectedCourse);
              }}
            >
              <option value="">All</option>
              <option value="IRM1">IRM1</option>
              <option value="IRM2">IRM2</option>
              <option value="IRM3">IRM3</option>
            </select>
          </div>

          {/* Student ID and Course Filters */}
          <div>
            <label htmlFor="studentID-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Student ID
            </label>
            <input
              id="studentID-input"
              type="text"
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
              value={searchStudentID}
              onChange={(event) => {
                const studentID = event.target.value;
                setSearchStudentID(studentID);
                applyFilters(selectedMonth, selectedClas, studentID, selectedCourse);
              }}
              placeholder="Enter Student ID"
            />
          </div>

          <div>
            <label htmlFor="course-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by Course
            </label>
            <select
              id="course-select"
              className="mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300"
              value={selectedCourse || ""}
              onChange={(event) => {
                const course = event.target.value || null;
                setSelectedCourse(course);
                applyFilters(selectedMonth, selectedClas, searchStudentID, course);
              }}
            >
              <option value="">All</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
              <option value="Python">Python</option>
              <option value="Math">Math</option>
              <option value="Physics">Physics</option>
            </select>
          </div>
        </div>

        {/* Table for displaying archive entries */}
        <div className="overflow-x-auto mt-10">
          {loading ? (
            <div className="text-center text-gray-500">Loading archives...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div> // Display error message
          ) : (
            <>
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">ID</th>
                    <th className="py-2 px-4 text-left">Student ID</th>
                    <th className="py-2 px-4 text-left">Status</th>
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Class</th>
                    <th className="py-2 px-4 text-left">Course</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedResults.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-gray-500">
                        No archives found.
                      </td>
                    </tr>
                  ) : (
                    paginatedResults.map((archive) => (
                      <tr key={archive.id} className="border-b">
                        <td className="py-2 px-4">{archive.id}</td>
                        <td className="py-2 px-4">{archive.studentID}</td>
                        <td className="py-2 px-4">{archive.status}</td>
                        <td className="py-2 px-4">{new Date(archive.date).toLocaleString()}</td>
                        <td className="py-2 px-4">{archive.clas}</td>
                        <td className="py-2 px-4">{archive.course}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination controls */}
              <div className="mt-4 flex items-center justify-center">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className={`px-4 py-2 mx-1 rounded-md ${
                    currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 text-white"
                  }`}
                >
                  Previous
                </button>
                <span className="px-4 py-2 mx-1 text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className={`px-4 py-2 mx-1 rounded-md ${
                    currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 text-white"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
