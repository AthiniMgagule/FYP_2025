package com.proj.carrentalapp.api;

import com.proj.carrentalapp.models.Booking;
import com.proj.carrentalapp.models.Car;
import com.proj.carrentalapp.models.Invoice;
import com.proj.carrentalapp.models.LoginRequest;
import com.proj.carrentalapp.models.User;

import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.Query;
import retrofit2.http.QueryMap;

/**
 * ApiService Interface
 * Defines all API endpoints for Retrofit
 */
public interface ApiService {

    // ==================== Authentication ====================

    /**
     * Login user
     */
    @POST("login")
    Call<Map<String, Object>> login(@Body LoginRequest loginRequest);

    /**
     * Register new user
     */
    @POST("register")
    Call<Map<String, Object>> register(@Body User user);

    // ==================== Cars ====================

    /**
     * Get all available cars
     */
    @GET("cars")
    Call<List<Car>> getCars();

    /**
     * Search cars with filters
     */
    @GET("cars/search")
    Call<List<Car>> searchCars(@QueryMap Map<String, String> filters);

    /**
     * Get car details by ID
     */
    @GET("cars/{id}")
    Call<Car> getCarDetails(@Path("id") int carId);

    /**
     * Get available cars (alternative endpoint)
     */
    @GET("cars/available")
    Call<List<Car>> getAvailableCars();

    // ==================== Bookings ====================

    /**
     * Create a new booking
     */
    @POST("bookings")
    Call<Booking> createBooking(@Body Booking booking);

    /**
     * Get user's bookings
     */
    @GET("user/bookings")
    Call<List<Booking>> getUserBookings();

    /**
     * Get all bookings (with optional status filter)
     */
    @GET("bookings")
    Call<List<Booking>> getBookings(@Query("status") String status);

    /**
     * Get booking details by ID
     */
    @GET("bookings/{id}")
    Call<Booking> getBookingDetails(@Path("id") int bookingId);

    /**
     * Update booking
     */
    @PUT("bookings/{id}")
    Call<Booking> updateBooking(@Path("id") int bookingId, @Body Booking booking);

    /**
     * Cancel booking
     */
    @POST("bookings/{id}/cancel")
    Call<Map<String, Object>> cancelBooking(@Path("id") int bookingId);

    /**
     * Delete booking (alternative to cancel)
     */
    @DELETE("bookings/{id}")
    Call<Map<String, Object>> deleteBooking(@Path("id") int bookingId);

    // ==================== User Profile ====================

    /**
     * Get user profile
     */
    @GET("user/profile")
    Call<User> getUserProfile();

    /**
     * Update user profile
     */
    @PUT("user/profile")
    Call<User> updateUserProfile(@Body User user);

    /**
     * Update profile (alternative endpoint)
     */
    @POST("user/profile/update")
    Call<Map<String, Object>> updateProfile(@Body User user);

    // ==================== Invoices ====================

    /**
     * Get user's invoices
     */
    @GET("user/invoices")
    Call<List<Invoice>> getUserInvoices();

    /**
     * Get invoice details by ID
     */
    @GET("invoices/{id}")
    Call<Invoice> getInvoiceDetails(@Path("id") int invoiceId);

    /**
     * Get invoices by booking ID
     */
    @GET("invoices/booking/{bookingId}")
    Call<List<Invoice>> getInvoicesByBooking(@Path("bookingId") int bookingId);
}