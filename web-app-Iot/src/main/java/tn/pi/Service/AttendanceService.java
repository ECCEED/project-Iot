package tn.pi.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;
import tn.pi.entities.Attendance;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class AttendanceService {

    public static final String COLLECTION_NAME = "attendance";
    private static final DateTimeFormatter ISO_DATE_FORMATTER = DateTimeFormatter.ISO_INSTANT;

    // Save an Attendance record to Firestore
    public String saveAttendance(Attendance attendance) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        try {
            ApiFuture<WriteResult> collectionApiFuture = dbFirestore
                    .collection(COLLECTION_NAME)
                    .document(String.valueOf(attendance.getId()))
                    .set(attendance);

            return collectionApiFuture.get().getUpdateTime().toString();
        } catch (Exception e) {
            System.err.println("Error saving attendance: " + e.getMessage());
            throw e;
        }
    }

    // Retrieve Attendance details by ID
    public Attendance getAttendanceById(Long id) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(String.valueOf(id));

        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();

        if (document.exists()) {
            return document.toObject(Attendance.class);
        } else {
            throw new IllegalArgumentException("Attendance record with ID " + id + " not found.");
        }
    }

    // Retrieve all Attendance records
    public List<Attendance> getAllAttendances() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference attendanceCollection = dbFirestore.collection(COLLECTION_NAME);

        ApiFuture<QuerySnapshot> future = attendanceCollection.get();
        QuerySnapshot querySnapshot = future.get();

        List<Attendance> attendances = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            Attendance attendance = document.toObject(Attendance.class);
            attendances.add(attendance);
        }

        return attendances;
    }

    // Add a timestamp to an Attendance record
    public String addTimestampToAttendance(Long id, String timestamp) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(String.valueOf(id));

        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();

        if (document.exists()) {
            Attendance attendance = document.toObject(Attendance.class);
            if (attendance.getTimestamps() == null) {
                attendance.setTimestamps(new ArrayList<>()); // Initialize the list if null
            }
            // Validate and add the timestamp string
            Instant.parse(timestamp); // Ensure it's valid ISO-8601
            attendance.getTimestamps().add(timestamp); // Add the string to the list
            documentReference.set(attendance); // Save the updated record
            return "Timestamp added successfully to Attendance with ID " + id;
        } else {
            throw new IllegalArgumentException("Attendance record with ID " + id + " not found.");
        }
    }

    // Delete an Attendance record by ID
    public String deleteAttendance(Long id) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(String.valueOf(id));

        ApiFuture<WriteResult> writeResult = documentReference.delete();
        return "Attendance record with ID " + id + " deleted at " + writeResult.get().getUpdateTime();
    }
}
