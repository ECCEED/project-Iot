'use client'

import { useEffect, useState } from "react"

type AttendanceRecord = {
  studentId: string
  studentName: string
  className: string // The class to which the student belongs (IRM1, IRM2, etc.)
  attendance: Record<string, 'Present' | 'Absent'>
}

type FilterOptions = {
  class: string
  month: string
}

export default function AttendanceRegister() {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([])
  const [dates, setDates] = useState<string[]>([]) 
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Filter and selected state
  const [filter, setFilter] = useState<FilterOptions>({ class: 'IRM1', month: '2024-04' })
  const [filteredData, setFilteredData] = useState<AttendanceRecord[]>([])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const datesPerPage = 5

  // Handle class and month change
  const handleClassChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClass = event.target.value
    setFilter(prevFilter => ({ ...prevFilter, class: selectedClass }))
  }

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMonth = event.target.value
    setFilter(prevFilter => ({ ...prevFilter, month: selectedMonth }))
  }

  // Calculate the indexes of dates to show on the current page
  const indexOfLastDate = currentPage * datesPerPage
  const indexOfFirstDate = indexOfLastDate - datesPerPage
  const currentDates = dates.slice(indexOfFirstDate, indexOfLastDate)

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Mock data (to test locally without an API)
  useEffect(() => {
    const mockData = {
      "records": [
        {
          "studentId": "S001",
          "studentName": "John Doe",
          "className": "IRM1", // Add className property
          "attendance": {
            "2024-04-01": "Present",
            "2024-04-02": "Absent",
            "2024-04-03": "Present",
            "2024-04-04": "Absent",
            "2024-04-05": "Present",
            "2024-04-06": "Present",
            "2024-04-07": "Absent",
            "2024-04-08": "Present",
            "2024-04-09": "Absent",
            "2024-04-10": "Present",
            "2024-04-11": "Absent",
            "2024-04-12": "Present",
            "2024-04-13": "Present",
            "2024-04-14": "Absent",
            "2024-04-15": "Present",
            "2024-05-01": "Absent",
            "2024-05-02": "Present",
            "2024-05-03": "Present",
            "2024-05-04": "Absent",
            "2024-05-05": "Present",
            "2024-05-06": "Present",
            "2024-05-07": "Absent",
            "2024-05-08": "Present",
            "2024-05-09": "Absent",
            "2024-05-10": "Present",
            "2024-05-11": "Present",
            "2024-05-12": "Absent",
            "2024-05-13": "Present",
            "2024-06-01": "Present",
            "2024-06-02": "Absent",
            "2024-06-03": "Present",
            "2024-06-04": "Absent",
            "2024-06-05": "Present"
          }
        },
        {
          "studentId": "S002",
          "studentName": "Jane Smith",
          "className": "IRM1", // Add className property
          "attendance": {
            "2024-04-01": "Absent",
            "2024-04-02": "Present",
            "2024-04-03": "Absent",
            "2024-04-04": "Present",
            "2024-04-05": "Absent",
            "2024-04-06": "Present",
            "2024-04-07": "Absent",
            "2024-04-08": "Present",
            "2024-04-09": "Present",
            "2024-04-10": "Absent",
            "2024-04-11": "Present",
            "2024-04-12": "Absent",
            "2024-04-13": "Present",
            "2024-04-14": "Absent",
            "2024-04-15": "Present",
            "2024-05-01": "Present",
            "2024-05-02": "Absent",
            "2024-05-03": "Present",
            "2024-05-04": "Present",
            "2024-05-05": "Absent",
            "2024-05-06": "Present",
            "2024-05-07": "Absent",
            "2024-05-08": "Present",
            "2024-05-09": "Present",
            "2024-05-10": "Absent",
            "2024-05-11": "Present",
            "2024-05-12": "Present",
            "2024-05-13": "Absent",
            "2024-06-01": "Absent",
            "2024-06-02": "Present",
            "2024-06-03": "Absent",
            "2024-06-04": "Present",
            "2024-06-05": "Absent"
          }
        }
      ],
      "dates": [
        "2024-04-01", "2024-04-02", "2024-04-03", "2024-04-04", "2024-04-05", "2024-04-06", "2024-04-07", "2024-04-08", "2024-04-09", "2024-04-10",
        "2024-04-11", "2024-04-12", "2024-04-13", "2024-04-14", "2024-04-15", "2024-05-01", "2024-05-02", "2024-05-03", "2024-05-04", "2024-05-05",
        "2024-05-06", "2024-05-07", "2024-05-08", "2024-05-09", "2024-05-10", "2024-05-11", "2024-05-12", "2024-05-13", "2024-06-01", "2024-06-02",
        "2024-06-03", "2024-06-04", "2024-06-05"
      ]
    };

    setAttendanceData(mockData.records);
    setDates(mockData.dates);
    setLoading(false);
  }, []);

  // Filter records by class and month
  useEffect(() => {
    // Filter by class first
    const filteredRecords = attendanceData.filter(record => record.className === filter.class);

    // Filter dates that start with the selected month (e.g., '2024-04')
    const filteredDates = dates.filter(date => date.startsWith(filter.month));

    // Filter attendance data by the selected dates
    const filteredData = filteredRecords.map(record => {
      const filteredAttendance: Record<string, 'Present' | 'Absent'> = {};
      filteredDates.forEach(date => {
        filteredAttendance[date] = record.attendance[date] || 'N/A';
      });
      return { ...record, attendance: filteredAttendance };
    });

    setFilteredData(filteredData);
    setDates(filteredDates); // Update the displayed dates
    setCurrentPage(1); // Reset to the first page when the filter changes
  }, [filter, attendanceData]);

  // Calculate the number of pages
  const totalPages = Math.ceil(filteredData.length / datesPerPage);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        <div>
          <label htmlFor="class" className="block text-sm font-medium text-gray-700">Class</label>
          <select
            id="class"
            name="class"
            value={filter.class}
            onChange={handleClassChange}
            className="mt-1 block w-full p-2 bg-white border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="IRM1">IRM1</option>
            <option value="IRM2">IRM2</option>
            <option value="IRM3">IRM3</option>
          </select>
        </div>

        <div>
          <label htmlFor="month" className="block text-sm font-medium text-gray-700">Month</label>
          <select
            id="month"
            name="month"
            value={filter.month}
            onChange={handleMonthChange}
            className="mt-1 block w-full p-2 bg-white border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="2024-04">April 2024</option>
            <option value="2024-05">May 2024</option>
            <option value="2024-06">June 2024</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {filteredData.length === 0 ? (
            <p>No attendance records found for this month and class.</p>
          ) : (
            <div>
              <table className="min-w-full table-auto">
                <thead>
                  <tr>
                    <th className="py-2 px-4 text-left">Student Name</th>
                    {dates.map((date, index) => (
                      <th key={index} className="py-2 px-4 text-left">{date}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((record, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4">{record.studentName}</td>
                      {dates.map((date, dateIndex) => (
                        <td key={dateIndex} className="py-2 px-4">
                          {record.attendance[date] || 'N/A'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Previous
                </button>
                <span className="mx-4">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
