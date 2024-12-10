package tn.pi.entities;

import jakarta.persistence.Entity;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Admin {
    private String email;
    private String password;
}
