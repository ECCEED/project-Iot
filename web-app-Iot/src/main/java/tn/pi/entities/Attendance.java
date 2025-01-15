package tn.pi.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.google.cloud.firestore.annotation.ServerTimestamp;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.FetchType;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Attendance {

    @Id
    private long id;
    private String studentID;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> timestamps;
}
