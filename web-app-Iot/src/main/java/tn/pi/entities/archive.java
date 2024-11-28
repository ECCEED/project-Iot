package tn.pi.entities;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Entity;

import jakarta.persistence.Id;
import lombok.*;

import java.sql.Time;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class archive {
    @Id
    private long id;
    private String StudentID;
    private String status;
    private Instant date;
    private String clas;
    private String course;



}
