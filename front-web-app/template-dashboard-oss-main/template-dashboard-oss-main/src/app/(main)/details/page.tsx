'use client'

import { useEffect, useState } from "react"

type ClassEntity = {
  id: string
  name: string
}

type Student = {
  numInsc: string
  name: string
  mail: string
  age: number
  classEntity: ClassEntity
}

export default function Example() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]) // To hold filtered students
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null) // Error state to handle fetch errors
  const [selectedClass, setSelectedClass] = useState<string>('') // Selected class filter state
  const [classes, setClasses] = useState<ClassEntity[]>([]) // State to hold available classes

  // Fetch students and classes when the component mounts
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch students
        const studentResponse = await fetch("http://localhost:8090/api/Students", {
          method: 'GET',
        });
        if (!studentResponse.ok) {
          throw new Error("Failed to fetch students");
        }
        const studentData = await studentResponse.json();
        setStudents(studentData);
        setFilteredStudents(studentData); // Initially show all students

        // Fetch classes
        const classResponse = await fetch("http://localhost:8090/api/classes", {
          method: 'GET',
        });
        if (!classResponse.ok) {
          throw new Error("Failed to fetch classes");
        }
        const classData = await classResponse.json();
        setClasses(classData); // Store fetched classes
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    }

    fetchData();
  }, []);

  // Handle filtering students by class
  const handleClassFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClass = event.target.value;
    setSelectedClass(selectedClass);

    if (selectedClass === '') {
      setFilteredStudents(students); // If no class selected, show all students
    } else {
      const filtered = students.filter(student => student.classEntity.name === selectedClass);
      setFilteredStudents(filtered);
    }
  };

  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Student List
      </h1>

      {/* Class filter dropdown */}
      <div className="mt-4 sm:mt-6 lg:mt-10">
        <label
          htmlFor="classFilter"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Filter by Class
        </label>
        <select
          id="classFilter"
          value={selectedClass}
          onChange={handleClassFilterChange}
          className="mt-2 block w-40 rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Classes</option>
          {/* Dynamically generate class options */}
          {classes.map((classEntity) => (
            <option key={classEntity.id} value={classEntity.name}>
              {classEntity.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 sm:mt-6 lg:mt-10">
        {/* Table for displaying students */}
        <div className="mt-10 overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-500">Loading students...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div> // Display error message
          ) : (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Age</th>
                  <th className="px-4 py-2 text-left">Class</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.numInsc} className="border-b">
                      <td className="px-4 py-2">{student.numInsc}</td>
                      <td className="px-4 py-2">{student.name}</td>
                      <td className="px-4 py-2">{student.mail}</td>
                      <td className="px-4 py-2">{student.age}</td>
                      <td className="px-4 py-2">
                        {student.classEntity.name}
                      </td>{" "}
                      {/* Display class name */}
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
