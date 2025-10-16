package com.proj.carrentalapp.utils;

/**
 * Constants Class
 * Contains all application-wide constants
 */
public class Constants {

    // API Configuration
    public static final String BASE_URL = "http://10.0.2.2:8000/api/";

    // API Endpoints
    public static final String ENDPOINT_LOGIN = "login";
    public static final String ENDPOINT_REGISTER = "register";
    public static final String ENDPOINT_CARS = "cars";
    public static final String ENDPOINT_CAR_DETAILS = "cars/{id}";
    public static final String ENDPOINT_BOOKINGS = "bookings";
    public static final String ENDPOINT_USER_BOOKINGS = "user/bookings";
    public static final String ENDPOINT_CANCEL_BOOKING = "bookings/{id}/cancel";
    public static final String ENDPOINT_UPDATE_BOOKING = "bookings/{id}";
    public static final String ENDPOINT_PROFILE = "user/profile";
    public static final String ENDPOINT_UPDATE_PROFILE = "user/profile/update";
    public static final String ENDPOINT_INVOICES = "user/invoices";

    // Intent Extra Keys
    public static final String EXTRA_CAR_ID = "car_id";
    public static final String EXTRA_CAR_OBJECT = "car_object";
    public static final String EXTRA_BOOKING_ID = "booking_id";
    public static final String EXTRA_BOOKING_OBJECT = "booking_object";

    // Request Codes
    public static final int REQUEST_LOGIN = 1001;
    public static final int REQUEST_EDIT_PROFILE = 1002;
    public static final int REQUEST_BOOKING = 1003;

    // Date Format
    public static final String DATE_FORMAT = "yyyy-MM-dd";
    public static final String DISPLAY_DATE_FORMAT = "MMM dd, yyyy";
    public static final String DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

    // Booking Status
    public static final String STATUS_PENDING = "pending";
    public static final String STATUS_CONFIRMED = "confirmed";
    public static final String STATUS_ACTIVE = "active";
    public static final String STATUS_COMPLETED = "completed";
    public static final String STATUS_CANCELLED = "cancelled";

    // Error Messages
    public static final String ERROR_NETWORK = "Network error. Please check your connection.";
    public static final String ERROR_SERVER = "Server error. Please try again later.";
    public static final String ERROR_INVALID_CREDENTIALS = "Invalid email or password.";
    public static final String ERROR_GENERIC = "Something went wrong. Please try again.";

    // Success Messages
    public static final String SUCCESS_LOGIN = "Login successful!";
    public static final String SUCCESS_REGISTER = "Registration successful!";
    public static final String SUCCESS_BOOKING = "Booking created successfully!";
    public static final String SUCCESS_CANCEL_BOOKING = "Booking cancelled successfully!";
    public static final String SUCCESS_UPDATE_PROFILE = "Profile updated successfully!";
}