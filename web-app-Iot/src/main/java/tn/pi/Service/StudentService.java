package tn.pi.Service;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tn.pi.entities.Student;
import tn.pi.entities.Class;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

@Service
public class StudentService {

    public static final String STUDENT_COLLECTION = "students";
    public static final String CLASS_COLLECTION = "class";
    public static final String STUDENT_ACCOUNTS_COLLECTION = "student_accounts";
    private static final String IMAGE_UPLOAD_DIR = "src/main/resources/uploads/";

    @Autowired
    private JavaMailSender mailSender;

    static {
        File directory = new File(IMAGE_UPLOAD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

    public String saveStudent(Student student, MultipartFile photo) throws ExecutionException, InterruptedException, IOException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        // Validate the class
        if (student.getClassEntity() == null || student.getClassEntity().getID() == null) {
            throw new IllegalArgumentException("Class ID is required for the student.");
        }

        DocumentSnapshot classDoc = dbFirestore.collection(CLASS_COLLECTION)
                .document(String.valueOf(student.getClassEntity().getID()))
                .get()
                .get();

        if (!classDoc.exists()) {
            throw new IllegalArgumentException("Class with ID " + student.getClassEntity().getID() + " does not exist.");
        }

        Class classEntity = classDoc.toObject(Class.class);
        student.setClassEntity(classEntity);

        if (photo != null && !photo.isEmpty()) {
            String fileName = student.getNumInsc() + "_" + photo.getOriginalFilename();
            Path filePath = Paths.get(IMAGE_UPLOAD_DIR + fileName);
            Files.write(filePath, photo.getBytes());
            student.setPhotoUrl("http://localhost:8090/images/" + fileName);
        }

        // Save the student in Firestore
        ApiFuture<WriteResult> studentFuture = dbFirestore.collection(STUDENT_COLLECTION)
                .document(String.valueOf(student.getNumInsc()))
                .set(student);

        // Generate a random password for the student's account
        String plainPassword = generateRandomPassword(8);


        // Save the student account in Firestore
        Map<String, Object> accountData = new HashMap<>();
        accountData.put("id", student.getNumInsc());
        accountData.put("email", student.getMail());
        accountData.put("password", plainPassword);

        ApiFuture<WriteResult> accountFuture = dbFirestore.collection(STUDENT_ACCOUNTS_COLLECTION)
                .document(String.valueOf(student.getNumInsc()))
                .set(accountData);


        sendEmail(student.getMail(), plainPassword);

        return "Student saved and email sent. Update time: " + studentFuture.get().getUpdateTime();
    }

    private String generateRandomPassword(int length) {
        final String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();

        for (int i = 0; i < length; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        return password.toString();
    }



    private void sendEmail(String recipientEmail, String plainPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(recipientEmail);
        message.setSubject("Your Account Details");
        message.setText("Hello,\n\nYour account has been created.\n\n" +
                "Email: " + recipientEmail + "\n" +
                "Password: " + plainPassword + "\n\n" +
                "Please log in and change your password after logging in.");
        mailSender.send(message);
    }

    // Retrieve a single student by their ID
    public Student getStudentDetails(Long numInsc) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(STUDENT_COLLECTION).document(String.valueOf(numInsc));
        ApiFuture<DocumentSnapshot> future = documentReference.get();
        DocumentSnapshot document = future.get();

        if (document.exists()) {
            Student student = document.toObject(Student.class);

            // Fetch the associated class details if present
            if (student.getClassEntity() != null && student.getClassEntity().getID() != null) {
                DocumentSnapshot classDoc = dbFirestore.collection(CLASS_COLLECTION)
                        .document(String.valueOf(student.getClassEntity().getID()))
                        .get()
                        .get();

                if (classDoc.exists()) {
                    Class classEntity = classDoc.toObject(Class.class);
                    student.setClassEntity(classEntity);  // Correctly setting the classEntity
                }
            }

            return student;
        } else {
            throw new IllegalArgumentException("Student with ID " + numInsc + " not found.");
        }
    }

    // Retrieve all students with their associated class details
    public List<Student> getAllStudents() throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        CollectionReference studentsCollection = dbFirestore.collection(STUDENT_COLLECTION);
        ApiFuture<QuerySnapshot> future = studentsCollection.get();
        QuerySnapshot querySnapshot = future.get();

        List<Student> students = new ArrayList<>();
        for (DocumentSnapshot document : querySnapshot.getDocuments()) {
            Student student = document.toObject(Student.class);

            // Fetch the associated class details
            if (student.getClassEntity() != null && student.getClassEntity().getID() != null) {
                DocumentSnapshot classDoc = dbFirestore.collection(CLASS_COLLECTION)
                        .document(String.valueOf(student.getClassEntity().getID()))
                        .get()
                        .get();

                if (classDoc.exists()) {
                    Class classEntity = classDoc.toObject(Class.class);
                    student.setClassEntity(classEntity);  // Correctly setting the classEntity
                }
            }

            students.add(student);
        }

        return students;
    }

    // Delete a student by their ID
    public String deleteStudent(Long numInsc) throws ExecutionException, InterruptedException {
        Firestore dbFirestore = FirestoreClient.getFirestore();
        DocumentReference documentReference = dbFirestore.collection(STUDENT_COLLECTION).document(String.valueOf(numInsc));

        // Delete the document
        ApiFuture<WriteResult> writeResult = documentReference.delete();
        return "Student with ID " + numInsc + " deleted at " + writeResult.get().getUpdateTime();
    }

    public String updateStudent(Long numInsc, Student student) throws ExecutionException, InterruptedException, IOException {
        Firestore dbFirestore = FirestoreClient.getFirestore();

        // Check if the student exists
        DocumentReference studentDocRef = dbFirestore.collection(STUDENT_COLLECTION).document(String.valueOf(numInsc));
        DocumentSnapshot studentDoc = studentDocRef.get().get();

        if (!studentDoc.exists()) {
            throw new IllegalArgumentException("Student with ID " + numInsc + " not found.");
        }

        Student currentStudent = studentDoc.toObject(Student.class);

        // Update fields if provided
        if (student.getName() != null) {
            currentStudent.setName(student.getName());
        }
        if (student.getAge() != 0) {
            currentStudent.setAge(student.getAge());
        }
        if (student.getMail() != null) {
            currentStudent.setMail(student.getMail());
        }

        // Validate and update the classEntity if provided
        if (student.getClassEntity() != null) {
            DocumentReference classRef = dbFirestore.collection("class").document(String.valueOf(student.getClassEntity().getID()));
            if (!classRef.get().get().exists()) {
                throw new IllegalArgumentException("Class with ID " + student.getClassEntity().getID() + " does not exist.");
            }
            currentStudent.setClassEntity(student.getClassEntity());
        }

        // Save the updated student object
        ApiFuture<WriteResult> writeResult = dbFirestore.collection(STUDENT_COLLECTION)
                .document(String.valueOf(numInsc))
                .set(currentStudent);

        return "Student with ID " + numInsc + " updated at " + writeResult.get().getUpdateTime();
    }




}
