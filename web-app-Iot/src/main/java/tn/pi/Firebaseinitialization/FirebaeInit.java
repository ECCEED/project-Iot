    package tn.pi.Firebaseinitialization;

    import com.google.auth.oauth2.GoogleCredentials;
    import com.google.firebase.FirebaseApp;
    import com.google.firebase.FirebaseOptions;
    import org.springframework.stereotype.Service;

    import javax.annotation.PostConstruct;
    import java.io.FileInputStream;
    import java.io.IOException;
    @Service

    public class FirebaeInit {
        @PostConstruct


        public void init() {
            FileInputStream
                    fis = null;
            try {
                FileInputStream serviceAccount = new FileInputStream("src/main/resources/serviceAccountKey.json");

                FirebaseOptions options = new FirebaseOptions.Builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .setStorageBucket("iot-project-d7202.firebasestorage.app")
                        .build();

                FirebaseApp.initializeApp(options);
            } catch (IOException e) {
                throw new RuntimeException("Failed to initialize Firebase", e);
            }
        }
    }
