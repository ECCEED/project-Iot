package tn.pi.Service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    public boolean authenticateAdmin(String idToken) {
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            Boolean isAdmin = (Boolean) decodedToken.getClaims().get("admin");
            return isAdmin != null && isAdmin;
        } catch (FirebaseAuthException e) {
            e.printStackTrace();
            return false;
        }
    }
}
