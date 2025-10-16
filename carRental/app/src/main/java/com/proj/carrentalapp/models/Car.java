package com.proj.carrentalapp.models;

import java.util.List;

/**
 * Car Model Class
 * Represents a vehicle available for rent
 */
public class Car {
    private int id;
    private String make;
    private String model;
    private int year;
    private String category; // e.g., SUV, Sedan, Compact, Luxury
    private double pricePerDay;
    private boolean available;
    private String imageUrl;
    private String licensePlate;
    private int seats;
    private String transmission; // Automatic or Manual
    private String fuelType; // Petrol, Diesel, Electric, Hybrid
    private List<String> features; // GPS, Child Seat, Bluetooth, etc.
    private String description;

    // Constructors
    public Car() {
    }

    public Car(int id, String make, String model, int year, String category,
               double pricePerDay, boolean available) {
        this.id = id;
        this.make = make;
        this.model = model;
        this.year = year;
        this.category = category;
        this.pricePerDay = pricePerDay;
        this.available = available;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getMake() {
        return make;
    }

    public void setMake(String make) {
        this.make = make;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getPricePerDay() {
        return pricePerDay;
    }

    public void setPricePerDay(double pricePerDay) {
        this.pricePerDay = pricePerDay;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public int getSeats() {
        return seats;
    }

    public void setSeats(int seats) {
        this.seats = seats;
    }

    public String getTransmission() {
        return transmission;
    }

    public void setTransmission(String transmission) {
        this.transmission = transmission;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public List<String> getFeatures() {
        return features;
    }

    public void setFeatures(List<String> features) {
        this.features = features;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    // Helper method to get car display name
    public String getDisplayName() {
        return year + " " + make + " " + model;
    }

    // Helper method to check if car has a specific feature
    public boolean hasFeature(String feature) {
        return features != null && features.contains(feature);
    }

    @Override
    public String toString() {
        return "Car{" +
                "id=" + id +
                ", make='" + make + '\'' +
                ", model='" + model + '\'' +
                ", year=" + year +
                ", category='" + category + '\'' +
                ", pricePerDay=" + pricePerDay +
                ", available=" + available +
                '}';
    }
}