package tn.pi.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.pi.Service.ArchiveService;
import tn.pi.entities.archive;

import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/api")
public class ArchiveController {

    @Autowired
    private ArchiveService archiveService;

    // Endpoint to save an archive
    @PostMapping("/archives")
    public ResponseEntity<String> saveArchive(@RequestBody archive archiveEntity) {
        try {
            String result = archiveService.saveArchive(archiveEntity);
            return ResponseEntity.ok(result);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving archive: " + e.getMessage());
        }
    }

    // Endpoint to retrieve all archives
    @GetMapping("/archives")
    public ResponseEntity<List<archive>> getAllArchives() {
        try {
            List<archive> archives = archiveService.getAllArchives();
            return ResponseEntity.ok(archives);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null); // Optionally, return an empty list or a custom error response.
        }
    }

    // Endpoint to retrieve a specific archive by ID
    @GetMapping("/archives/{id}")
    public ResponseEntity<archive> getArchive(@PathVariable("id") Long id) {
        try {
            archive archiveEntity = archiveService.getArchiveDetails(id);
            return ResponseEntity.ok(archiveEntity);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Endpoint to delete an archive by ID
    @DeleteMapping("/archives/{id}")
    public ResponseEntity<String> deleteArchive(@PathVariable Long id) {
        try {
            String result = archiveService.deleteArchive(id);
            return ResponseEntity.ok(result);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting archive: " + e.getMessage());
        }
    }

    // Endpoint to update an archive by ID
    @PutMapping("/archives/{id}")
    public ResponseEntity<String> updateArchive(@PathVariable Long id, @RequestBody archive archiveEntity) {
        try {
            String result = archiveService.updateArchive(id, archiveEntity);
            return ResponseEntity.ok(result);
        } catch (ExecutionException | InterruptedException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating archive: " + e.getMessage());
        }
    }
}
