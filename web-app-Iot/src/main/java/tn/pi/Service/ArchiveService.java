package tn.pi.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.stereotype.Service;
import tn.pi.entities.archive;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class ArchiveService {

    public static final String COLLECTION_NAME = "archive";

    // Save an archive to Firestore
    public String saveArchive(archive archiveEntity) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        ApiFuture<WriteResult> collectionApiFuture = dbFirestore
                .collection(COLLECTION_NAME)
                .document(String.valueOf(archiveEntity.getId())) // Use the ID as the document key
                .set(archiveEntity);

        return collectionApiFuture.get().getUpdateTime().toString();
    }

    // Retrieve archive details by ID
    public archive getArchiveDetails(Long ID) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        // Use ID as the document key
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(String.valueOf(ID));

        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();

        if (document.exists()) {
            // Convert the document to an archive object
            return document.toObject(archive.class);
        } else {
            throw new IllegalArgumentException("Archive with ID " + ID + " not found.");
        }
    }

    // Retrieve all archives from the collection
    public List<archive> getAllArchives() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        // Reference to the Firestore collection
        CollectionReference archiveCollection = dbFirestore.collection(COLLECTION_NAME);

        // Get all documents in the collection
        ApiFuture<QuerySnapshot> future = archiveCollection.get();
        QuerySnapshot querySnapshot = future.get();

        // Create a list to store archive objects
        List<archive> archives = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            // Convert each document to an archive object and add to the list
            archive archiveEntity = document.toObject(archive.class);
            archives.add(archiveEntity);
        }

        return archives;
    }

    // Delete an archive by ID
    public String deleteArchive(Long ID) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        // Reference the document by ID
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(String.valueOf(ID));

        // Delete the document
        ApiFuture<WriteResult> writeResult = documentReference.delete();

        return "Document with ID " + ID + " deleted at " + writeResult.get().getUpdateTime();
    }

    // Update an archive by ID
    public String updateArchive(Long ID, archive archiveEntity) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        // Reference the document by IDv
        DocumentReference documentReference = dbFirestore.collection(COLLECTION_NAME).document(String.valueOf(ID));

        // Update the document fields with the archive object
        ApiFuture<WriteResult> writeResult = documentReference.set(archiveEntity);

        return "Document with ID " + ID + " updated at " + writeResult.get().getUpdateTime();
    }
}