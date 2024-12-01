'use client';

import { useEffect, useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import Swal from "sweetalert2";

type ClassEntity = {
  id: string;
  name: string;
};

type Student = {
  numInsc: string;
  name: string;
  mail: string;
  age: number;
  classEntity: ClassEntity;
  photoUrl: string;
};

export default function Example() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [classes, setClasses] = useState<ClassEntity[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const studentResponse = await fetch("http://localhost:8090/api/Students");
        if (!studentResponse.ok) throw new Error("Failed to fetch students");
        const studentData = await studentResponse.json();
        setStudents(studentData);
        setFilteredStudents(studentData);

        const classResponse = await fetch("http://localhost:8090/api/classes");
        if (!classResponse.ok) throw new Error("Failed to fetch classes");
        const classData = await classResponse.json();
        setClasses(classData);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleDelete = async (studentId: string) => {
    try {
      const confirm = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      });

      if (confirm.isConfirmed) {
        // Call the DELETE API to delete the student
        const response = await fetch(`http://localhost:8090/api/Students/${studentId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error("Failed to delete the student.");
        }

        // Remove the student from the filtered list
        setFilteredStudents((prev) => prev.filter((student) => student.numInsc !== studentId));

        // Show success message
        await Swal.fire("Deleted!", "The student has been deleted.", "success");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Swal.fire("Error!", error.message || "Failed to delete the student.", "error");
      } else {
        Swal.fire("Error!", "An unknown error occurred.", "error");
      }
    }
  };

  const handleEdit = async (studentId: string) => {
    const student = students.find((s) => s.numInsc === studentId);

    if (!student) return;

    const { value: formValues } = await Swal.fire({
      title: "Edit Student",
      html: `
      <input id="swal-name" class="swal2-input" placeholder="Name" value="${student.name}">
      <input id="swal-mail" class="swal2-input" placeholder="Email" value="${student.mail}">
      <input id="swal-age" class="swal2-input" placeholder="Age" value="${student.age}">
      <select id="swal-class" class="swal2-select">
        ${classes
        .map(
          (classEntity) =>
            `<option value="${classEntity.id}" ${
              classEntity.id === student.classEntity?.id ? "selected" : ""
            }>${classEntity.name}</option>`
        )
        .join("")}
      </select>
    `,
      showCancelButton: true,
      confirmButtonText: "Save",
      preConfirm: () => ({
        name: (document.getElementById("swal-name") as HTMLInputElement).value,
        mail: (document.getElementById("swal-mail") as HTMLInputElement).value,
        age: +(document.getElementById("swal-age") as HTMLInputElement).value,
        classEntity: {
          id: (document.getElementById("swal-class") as HTMLSelectElement).value,
          name: (document.getElementById("swal-class") as HTMLSelectElement)
            .options[
            (document.getElementById("swal-class") as HTMLSelectElement).selectedIndex
            ].text,
        },
      }),
    });

    if (formValues) {
      try {
        // Call the PUT API to update the student's details
        const response = await fetch(`http://localhost:8090/api/Students/${studentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formValues,
            numInsc: studentId, // Ensure the numInsc is included
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update the student.");
        }

        // Update the student in the filtered list
        setFilteredStudents((prev) =>
          prev.map((student) =>
            student.numInsc === studentId ? { ...student, ...formValues } : student
          )
        );

        // Show success message
        await Swal.fire("Updated!", "The student's details have been updated.", "success");
      } catch (error: unknown) {
        if (error instanceof Error) {
          Swal.fire("Error!", error.message || "Failed to update the student.", "error");
        } else {
          Swal.fire("Error!", "An unknown error occurred.", "error");
        }
      }
    }
  };

  const handleClassFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClass = event.target.value;
    setSelectedClass(selectedClass);

    if (selectedClass === '') {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(students.filter((student) => student.classEntity.name === selectedClass));
    }
  };

  return (
    <>
      <h1 className="text-lg font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
        Student List
      </h1>
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
          {classes.map((classEntity) => (
            <option key={classEntity.id} value={classEntity.name}>
              {classEntity.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-4 sm:mt-6 lg:mt-10">
        <div className="mt-10 overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-500">Loading students...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Photo</th>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Age</th>
                  <th className="px-4 py-2 text-left">Class</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-4 text-center text-gray-500">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr key={student.numInsc} className="border-b">
                      <td className="px-4 py-2">
                        <img
                          src={student.photoUrl}
                          alt={`${student.name}'s photo`}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-4 py-2">{student.numInsc}</td>
                      <td className="px-4 py-2">{student.name}</td>
                      <td className="px-4 py-2">{student.mail}</td>
                      <td className="px-4 py-2">{student.age}</td>
                      <td className="px-4 py-2">
                        {student.classEntity?.name || "No class assigned"}
                      </td>
                      <td className="flex space-x-4 px-4 py-2">
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(student.numInsc)}
                        >
                          <FiTrash size={18} />
                        </button>
                        <button
                          className="text-blue-500 hover:text-blue-700"
                          onClick={() => handleEdit(student.numInsc)}
                        >
                          <FiEdit size={18} />
                        </button>
                      </td>
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
