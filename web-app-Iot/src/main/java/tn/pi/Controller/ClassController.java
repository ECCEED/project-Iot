package tn.pi.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.pi.Service.ClassService;
import tn.pi.entities.Class;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api")
public class ClassController {

    @Autowired
    private ClassService classService;

    // Endpoint to save a classPOS
    @PostMapping("/classes")
    public ResponseEntity<String> saveClass(@RequestBody Class classEntity) {
        try {
            String result = classService.saveClass(classEntity);
            return ResponseEntity.ok(result);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving class: " + e.getMessage());
        }
    }

    // Endpoint to retrieve all classes
    @GetMapping("/classes")
    public ResponseEntity<List<Class>> getAllClasses() {
        try {
            List<Class> classes = classService.getAllClasses();
            return ResponseEntity.ok(classes);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // You can also return an empty list or a custom error response.
        }
    }

    // Endpoint to retrieve a specific class by ID
    @GetMapping("/classes/{id}")
    public ResponseEntity<Class> getClass(@PathVariable("id") Long id) {
        try {
            Class classEntity = classService.getClassDetails(id);
            return ResponseEntity.ok(classEntity);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Endpoint to delete a class by ID
    @DeleteMapping("/classes/{id}")
    public ResponseEntity<String> deleteClass(@PathVariable Long id) {
        try {
            String result = classService.deleteClass(id);
            return ResponseEntity.ok(result);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting class: " + e.getMessage());
        }
    }

    // Endpoint to update a class by ID
    @PutMapping("/classes/{id}")
    public ResponseEntity<String> updateClass(@PathVariable Long id, @RequestBody Class classEntity) {
        try {
            String result = classService.updateClass(id, classEntity);
            return ResponseEntity.ok(result);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating class: " + e.getMessage());
        }
    }
}
