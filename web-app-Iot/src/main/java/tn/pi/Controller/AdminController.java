package tn.pi.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.pi.Service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody String idToken) {
        boolean isAuthenticated = adminService.authenticateAdmin(idToken);

        if (isAuthenticated) {
            return ResponseEntity.ok("Admin logged in successfully!");
        } else {
            return ResponseEntity.status(403).body("Access denied: Invalid admin credentials");
        }
    }
}
