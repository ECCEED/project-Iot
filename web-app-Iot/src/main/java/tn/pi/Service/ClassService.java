package tn.pi.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;
import tn.pi.entities.Class;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;


@Service
public class ClassService {
    public static final String COLLECTION_NAME = "class";

    // Save a class to Firestore
    public String saveClass(Class classEntity) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionApiFuture = dbFirestore
                .collection(COLLECTION_NAME)
                .document(String.valueOf(classEntity.getID())) // Fixed instance-level call to getID()
                .set(classEntity);

        return collectionApiFuture.get().getUpdateTime().toString();
    }

    // Retrieve class details by ID
    public Class getClassDetails(Long ID) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        // Use ID as the document ID
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(String.valueOf(ID));

        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();

        // Check if the document exists
        if (document.exists()) {
            // Convert the document to a Class object
            return document.toObject(Class.class);
        } else {
            throw new IllegalArgumentException("Class with ID " + ID + " not found.");
        }
    }

    // Retrieve all classes from the collection
    public List<Class> getAllClasses() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        // Reference to the Firestore collection
        CollectionReference classCollection = dbFirestore.collection(COLLECTION_NAME);

        // Get all documents in the collection
        ApiFuture<QuerySnapshot> future = classCollection.get();
        QuerySnapshot querySnapshot = future.get();

        // Create a list to store the class objects
        List<Class> classes = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            // Convert each document to a Class object and add to the list
            Class classEntity = document.toObject(Class.class);
            classes.add(classEntity);
        }

        return classes;
    }

    // Delete a class by ID
    public String deleteClass(Long ID) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        // Reference the document by ID
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(String.valueOf(ID));

        // Delete the document
        ApiFuture<WriteResult> writeResult = documentReference.delete();

        return "Document with ID " + ID + " deleted at " + writeResult.get().getUpdateTime();
    }

    // Update a class by ID
    public String updateClass(Long ID, Class classEntity) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        // Reference the document by ID
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(String.valueOf(ID));

        // Update the document fields with the class object
        ApiFuture<WriteResult> writeResult = documentReference.set(classEntity);

        return "Document with ID " + ID + " updated at " + writeResult.get().getUpdateTime();
    }
}
