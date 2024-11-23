package tn.pi.Service;


import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;
import tn.pi.entities.Student;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class StudentService {
    public static final String COLLECTION_NAME = "students";

    public String saveStudent(Student student) throws ExecutionException, InterruptedException {

        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionApiFuture=dbFirestore.collection(COLLECTION_NAME).document(String.valueOf(student.getNumInsc())).set(student);
        return collectionApiFuture.get().getUpdateTime().toString();
    }

    public Student getStudentDetailes(Long numInsc) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        // Use numInsc as the document ID
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(String.valueOf(numInsc));

        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();

        // Check if the document exists
        if (document.exists()) {
            // Convert the document to a Student object
            return document.toObject(Student.class);
        } else {
            // Handle the case where the document does not exist
            throw new IllegalArgumentException("Student with ID " + numInsc + " not found.");
        }
    }
    public List<Student> getAllStudents() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        // Reference to the Firestore collection
        CollectionReference studentsCollection = dbFirestore.collection(COLLECTION_NAME);

        // Get all documents in the collection
        ApiFuture<QuerySnapshot> future = studentsCollection.get();

        // Get the query snapshot and extract the documents
        QuerySnapshot querySnapshot = future.get();

        List<Student> students = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            // Convert each document to a Student object and add to the list
            Student student = document.toObject(Student.class);
            students.add(student);
        }

        return students;
    }
    public String deleteStudent(Long numInsc) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        // Reference the document by numInsc
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(String.valueOf(numInsc));

        // Delete the document
        ApiFuture<WriteResult> writeResult = documentReference.delete();

        // Confirm deletion with the update time
        return "Document with ID " + numInsc + " deleted at " + writeResult.get().getUpdateTime();
    }
    public String updateStudent(Long numInsc, Student student) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        // Reference the document by numInsc
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(String.valueOf(numInsc));

        // Update the document fields with the student object
        ApiFuture<WriteResult> writeResult = documentReference.set(student);

        // Return confirmation with the update time
        return "Document with ID " + numInsc + " updated at " + writeResult.get().getUpdateTime();
    }



}
