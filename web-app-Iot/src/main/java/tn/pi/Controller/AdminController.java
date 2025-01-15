package tn.pi.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.pi.Service.AdminService;
import tn.pi.Service.FirebaseService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {


    private  FirebaseService firebaseService;

    @PostMapping("/login")
    public ResponseEntity<String> adminLogin(@RequestBody String idToken) {
        // Verify if the user is an admin
        boolean isAdmin = firebaseService.isAdmin(idToken);

        if (isAdmin) {
            return ResponseEntity.ok("Admin login successful");
        } else {
            return ResponseEntity.status(403).body("Access denied: You are not an admin.");
        }
    }
}
