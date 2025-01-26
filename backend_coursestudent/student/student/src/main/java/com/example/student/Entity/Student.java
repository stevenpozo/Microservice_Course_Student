package com.example.student.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "student")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @NotBlank(message = "First name cannot be blank")
    @Size(max = 50, message = "First name must be at most 50 characters")
    @Pattern(
            regexp = "^[A-Za-zÑñÁáÉéÍíÓóÚú]{1,15}( [A-Za-zÑñÁáÉéÍíÓóÚú]{1,15})*( [A-Za-zÑñÁáÉéÍíÓóÚú]{1,15})?$",
            message = "Last name must contain only letters"
    )
    @Column(name = "first_name", nullable = false)
    private String first_name;

    @NotBlank(message = "Last name cannot be blank")
    @Size(max = 50, message = "Last name must be at most 50 characters")
    @Pattern(
            regexp = "^[A-Za-zÑñÁáÉéÍíÓóÚú]{1,15}( [A-Za-zÑñÁáÉéÍíÓóÚú]{1,15})*( [A-Za-zÑñÁáÉéÍíÓóÚú]{1,15})?$",
            message = "Last name must contain only letters"
    )
    @Column(name = "last_name", nullable = false)
    private String last_name;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @NotNull(message = "Birthday cannot be null")
    @Past(message = "Birthday must be a past date")
    @Column(name = "birthday", nullable = false)
    private Date birthday;

    @NotBlank(message = "Phone number cannot be blank")
    @Pattern(
            regexp = "\\+?[0-9]+",
            message = "Phone number must be valid and contain only numbers (optionally starting with +)"
    )
    @Size(min = 7, max = 15, message = "Phone number must be between 7 and 15 characters")
    @Column(name = "phone_number", nullable = false)
    private String phone_number;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime created_at;

    // Getters and setters...

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public String getPhone_number() {
        return phone_number;
    }

    public void setPhone_number(String phone_number) {
        this.phone_number = phone_number;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }
}
