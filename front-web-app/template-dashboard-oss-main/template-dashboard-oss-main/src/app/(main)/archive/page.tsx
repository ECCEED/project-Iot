'use client' // Mark this component as a Client Component

import { useEffect, useState } from "react"

type Student = {
  numInsc: string
  name: string
  mail: string
  age: number
}

export default function Example() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null) // Error state to handle fetch errors

  // Fetch students when the component mounts
  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch("http://localhost:8090/api/getStudents") // API endpoint for getting students
        if (!response.ok) {
          throw new Error("Failed to fetch students")
        }
        const data = await response.json()
        setStudents(data)
      } catch (error: any) {
        console.error("Error fetching students:", error)
        setError("There was an error loading student data.")
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [])

  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Student List
      </h1>
      <div className="mt-4 sm:mt-6 lg:mt-10">

        {/* Table for displaying students */}
        <div className="overflow-x-auto mt-10">
          {loading ? (
            <div className="text-center text-gray-500">Loading students...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div> // Display error message
          ) : (
            <table className="min-w-full table-auto border-collapse">
              <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Age</th>
              </tr>
              </thead>
              <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.numInsc} className="border-b">
                    <td className="py-2 px-4">{student.numInsc}</td>
                    <td className="py-2 px-4">{student.name}</td>
                    <td className="py-2 px-4">{student.mail}</td>
                    <td className="py-2 px-4">{student.age}</td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
