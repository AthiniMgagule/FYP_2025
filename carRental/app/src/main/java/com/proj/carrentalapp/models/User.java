package com.proj.carrentalapp.models;

/**
 * User Model Class
 * Represents a customer in the car rental system
 */
public class User {
    private int id;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String driverLicenseNumber;
    private String password; // Only used for registration
    private String token; // JWT token from API

    // Constructors
    public User() {
    }

    public User(String name, String email, String phone, String address,
                String driverLicenseNumber, String password) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.driverLicenseNumber = driverLicenseNumber;
        this.password = password;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDriverLicenseNumber() {
        return driverLicenseNumber;
    }

    public void setDriverLicenseNumber(String driverLicenseNumber) {
        this.driverLicenseNumber = driverLicenseNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                '}';
    }
}