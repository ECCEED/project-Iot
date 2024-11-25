package tn.pi.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.pi.Service.StudentService;
import tn.pi.entities.Student;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api") // Group student-related endpoints under "/api/students"
public class StudentController {

    @Autowired
    private StudentService studentService;

    // Save a new student
    @PostMapping("/Students")
    public ResponseEntity<String> saveStudent(@RequestBody Student student) {
        try {
            String result = studentService.saveStudent(student);
            return ResponseEntity.status(HttpStatus.CREATED).body("Student saved at: " + result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving student: " + e.getMessage());
        }
    }

    // Get all students
    @GetMapping("/Students")
    @CrossOrigin(origins = "http://localhost:3000") // Allow requests from frontend
    public ResponseEntity<List<Student>> getAllStudents() {
        try {
            List<Student> students = studentService.getAllStudents();
            return ResponseEntity.ok(students);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Get a student by ID
    @GetMapping("/Students/{numInsc}")
    public ResponseEntity<Student> getStudent(@PathVariable("numInsc") Long numInsc) {
        try {
            Student student = studentService.getStudentDetails(numInsc);
            return ResponseEntity.ok(student);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Delete a student by ID
    @DeleteMapping("/Students/{numInsc}")
    public ResponseEntity<String> deleteStudent(@PathVariable("numInsc") Long numInsc) {
        try {
            String result = studentService.deleteStudent(numInsc);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting student: " + e.getMessage());
        }
    }

    // Update a student
    @PutMapping("/Students/{numInsc}")
    public ResponseEntity<String> updateStudent(@PathVariable("numInsc") Long numInsc, @RequestBody Student student) {
        try {
            String result = studentService.updateStudent(numInsc, student);
            return ResponseEntity.ok("Student updated at: " + result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating student: " + e.getMessage());
        }
    }
}
