package tn.pi.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.pi.Service.StudentService;
import tn.pi.entities.Student;

import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api")

public class StudentController {
    @Autowired
    private StudentService studentService;
    @PostMapping("/Students")
    public String saveStudent(@RequestBody Student student) throws ExecutionException, InterruptedException {
        return studentService.saveStudent(student);
    }
    @GetMapping("/Students/{NumsInsc}")
    public Student getStudent(@PathVariable("NumsInsc") Long NumInsc) throws ExecutionException, InterruptedException {
        return studentService.getStudentDetailes(NumInsc);
    }
    @DeleteMapping("/Students/{NumsInsc}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long NumsInsc) {
        try {
            String result = studentService.deleteStudent(NumsInsc);
            return ResponseEntity.ok(result);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting student: " + e.getMessage());
        }
    }
    @PutMapping("/Students/{NumsInsc}")
    public ResponseEntity<String> updateStudent(@PathVariable Long NumsInsc, @RequestBody Student student) {
        try {
            String result = studentService.updateStudent(NumsInsc, student);
            return ResponseEntity.ok(result);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating student: " + e.getMessage());
        }
    }




}
