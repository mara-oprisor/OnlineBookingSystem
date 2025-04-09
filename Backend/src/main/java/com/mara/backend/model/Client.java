package com.mara.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@DiscriminatorValue("CLIENT")
public class Client extends User{
    @Column(name = "name")
    private String name;

    @Column(name = "age")
    private Integer age;
}

