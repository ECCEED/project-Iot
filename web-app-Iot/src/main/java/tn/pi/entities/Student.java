package tn.pi.entities;

import jakarta.persistence.*;
import lombok.*;
import org.checkerframework.common.reflection.qual.GetConstructor;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class Student {
    @Id

    private Long NumInsc;
    private String Name;
    private int age;
    private String mail;
    private String photoUrl;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private Class classEntity;

}
