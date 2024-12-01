package tn.pi.entities;

import jakarta.persistence.*;
import lombok.*;
import org.checkerframework.common.reflection.qual.GetConstructor;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class Class {
    @Id
    private Long ID;
    private String Name;



}