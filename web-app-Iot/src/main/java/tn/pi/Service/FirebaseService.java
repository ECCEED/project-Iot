package tn.pi.Service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;

public class FirebaseService {
    public boolean isAdmin(String idToken) {
        try {

            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);


            Boolean isAdmin = (Boolean) decodedToken.getClaims().get("admin");
            return isAdmin != null && isAdmin;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
