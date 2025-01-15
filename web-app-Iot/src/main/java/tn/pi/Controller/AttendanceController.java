package tn.pi.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.pi.entities.Attendance;
import tn.pi.Service.AttendanceService;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    // Create or update an Attendance record
    @PostMapping("/attendance")
    public ResponseEntity<String> saveAttendance(@RequestBody Attendance attendance) {
        try {
            String result = attendanceService.saveAttendance(attendance);
            return ResponseEntity.ok("Attendance saved successfully at: " + result);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error saving attendance: " + e.getMessage());
        }
    }

    // Retrieve Attendance by ID
    @GetMapping("/attendance/{id}")
    public ResponseEntity<?> getAttendanceById(@PathVariable Long id) {
        try {
            Attendance attendance = attendanceService.getAttendanceById(id);
            return ResponseEntity.ok(attendance);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error retrieving attendance: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Retrieve all Attendance records
    @GetMapping("/attendance")
    public ResponseEntity<?> getAllAttendances() {
        try {
            List<Attendance> attendances = attendanceService.getAllAttendances();
            return ResponseEntity.ok(attendances);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error retrieving all attendances: " + e.getMessage());
        }
    }

    // Add a timestamp to an Attendance record
    @PostMapping("/attendance/{id}/timestamps")
    public ResponseEntity<String> addTimestampToAttendance(@PathVariable Long id, @RequestBody String timestamp) {
        try {
            // Validate and format the timestamp string
            Instant.parse(timestamp); // Ensure it's a valid ISO-8601 format
            String result = attendanceService.addTimestampToAttendance(id, timestamp);
            return ResponseEntity.ok(result);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error adding timestamp: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid timestamp format: " + e.getMessage());
        }
    }

    // Delete an Attendance record
    @DeleteMapping("/attendance/{id}")
    public ResponseEntity<String> deleteAttendance(@PathVariable Long id) {
        try {
            String result = attendanceService.deleteAttendance(id);
            return ResponseEntity.ok(result);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.internalServerError().body("Error deleting attendance: " + e.getMessage());
        }
    }
}
