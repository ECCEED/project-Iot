package tn.pi.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tn.pi.Service.StudentService;
import tn.pi.entities.Student;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api") // Group student-related endpoints under "/api/students"
@CrossOrigin(origins = "http://localhost:3000") // Allow requests from frontend
public class StudentController {

    @Autowired
    private StudentService studentService;

    // Save a new student with file upload
    @PostMapping("/Students")
    public ResponseEntity<String> saveStudent(
            @RequestPart("student") String studentJson,
            @RequestPart(value = "photo", required = false) MultipartFile photo
    ) {
        try {
            // Convert the JSON string to a Student object
            ObjectMapper objectMapper = new ObjectMapper();
            Student student = objectMapper.readValue(studentJson, Student.class);

            // Call the service to save the student
            String result = studentService.saveStudent(student, photo);
            return ResponseEntity.status(HttpStatus.CREATED).body("Student saved at: " + result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (ExecutionException | InterruptedException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving student: " + e.getMessage());
        }
    }

    // Get all students
    @GetMapping("/Students")
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

    @PutMapping(value = "/Students/{numInsc}", consumes = "application/json")
    public ResponseEntity<String> updateStudent(@PathVariable Long numInsc,
                                                @RequestBody Student student) throws ExecutionException, InterruptedException {
        try {
            // Ensure that NumInsc from the path variable remains unchanged.
            student.setNumInsc(numInsc); // This is just to ensure no modification on the number

            // Call the service method to update the student, excluding photoUrl update.
            String updateResult = studentService.updateStudent(numInsc, student);
            return new ResponseEntity<>(updateResult, HttpStatus.OK);
        } catch (IllegalArgumentException | IOException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

}
