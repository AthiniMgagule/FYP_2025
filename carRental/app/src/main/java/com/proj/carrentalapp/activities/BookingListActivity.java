package com.proj.carrentalapp.activities;

import android.app.AlertDialog;
import android.os.Bundle;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.proj.carrentalapp.R;
import com.proj.carrentalapp.adapters.BookingAdapter;
import com.proj.carrentalapp.api.ApiClient;
import com.proj.carrentalapp.api.ApiService;
import com.proj.carrentalapp.models.Booking;
import com.google.android.material.appbar.MaterialToolbar;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * BookingListActivity
 * Displays user's bookings with cancel and modify options
 */
public class BookingListActivity extends AppCompatActivity implements BookingAdapter.OnBookingActionListener {

    private RecyclerView recyclerViewBookings;
    private ProgressBar progressBar;
    private LinearLayout layoutEmpty;
    private MaterialToolbar toolbar;

    private BookingAdapter bookingAdapter;
    private List<Booking> bookingList;
    private ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_booking_list);

        // Initialize views
        initViews();

        // Initialize API service
        apiService = ApiClient.getApiService();

        // Setup toolbar
        toolbar.setNavigationOnClickListener(v -> finish());

        // Setup RecyclerView
        setupRecyclerView();

        // Load bookings
        loadBookings();
    }

    /**
     * Initialize UI components
     */
    private void initViews() {
        toolbar = findViewById(R.id.toolbar);
        recyclerViewBookings = findViewById(R.id.recyclerViewBookings);
        progressBar = findViewById(R.id.progressBar);
        layoutEmpty = findViewById(R.id.layoutEmpty);
    }

    /**
     * Setup RecyclerView with adapter
     */
    private void setupRecyclerView() {
        bookingList = new ArrayList<>();
        bookingAdapter = new BookingAdapter(this, bookingList, this);

        recyclerViewBookings.setLayoutManager(new LinearLayoutManager(this));
        recyclerViewBookings.setHasFixedSize(true);
        recyclerViewBookings.setAdapter(bookingAdapter);
    }

    /**
     * Load bookings from API
     */
    private void loadBookings() {
        showLoading(true);

        apiService.getUserBookings().enqueue(new Callback<List<Booking>>() {
            @Override
            public void onResponse(Call<List<Booking>> call, Response<List<Booking>> response) {
                showLoading(false);

                if (response.isSuccessful() && response.body() != null) {
                    bookingList.clear();
                    bookingList.addAll(response.body());
                    bookingAdapter.updateList(bookingList);
                    updateEmptyState();
                } else {
                    Toast.makeText(BookingListActivity.this,
                            "Failed to load bookings",
                            Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Booking>> call, Throwable t) {
                showLoading(false);
                Toast.makeText(BookingListActivity.this,
                        "Network error: " + t.getMessage(),
                        Toast.LENGTH_SHORT).show();
            }
        });
    }

    /**
     * Handle booking item click
     */
    @Override
    public void onBookingClick(Booking booking) {
        // Show booking details dialog or navigate to details activity
        showBookingDetailsDialog(booking);
    }

    /**
     * Handle cancel booking
     */
    @Override
    public void onCancelClick(Booking booking) {
        new AlertDialog.Builder(this)
                .setTitle("Cancel Booking")
                .setMessage("Are you sure you want to cancel this booking?")
                .setPositiveButton("Yes", (dialog, which) -> cancelBooking(booking))
                .setNegativeButton("No", null)
                .show();
    }

    /**
     * Handle modify booking
     */
    @Override
    public void onModifyClick(Booking booking) {
        Toast.makeText(this, "Modify booking feature coming soon", Toast.LENGTH_SHORT).show();
        // TODO: Implement modify booking functionality
    }

    /**
     * Cancel booking via API
     */
    private void cancelBooking(Booking booking) {
        apiService.cancelBooking(booking.getId()).enqueue(new Callback<Map<String, Object>>() {
            @Override
            public void onResponse(Call<Map<String, Object>> call, Response<Map<String, Object>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Toast.makeText(BookingListActivity.this,
                            "Booking cancelled successfully",
                            Toast.LENGTH_SHORT).show();
                    loadBookings(); // Reload bookings
                } else {
                    Toast.makeText(BookingListActivity.this,
                            "Failed to cancel booking",
                            Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                Toast.makeText(BookingListActivity.this,
                        "Network error: " + t.getMessage(),
                        Toast.LENGTH_SHORT).show();
            }
        });
    }

    /**
     * Show booking details in dialog
     */
    private void showBookingDetailsDialog(Booking booking) {
        String details = "Booking ID: " + booking.getId() + "\n" +
                "Start Date: " + booking.getStartDate() + "\n" +
                "End Date: " + booking.getEndDate() + "\n" +
                "Total Price: $" + booking.getTotalPrice() + "\n" +
                "Status: " + booking.getStatusDisplay();

        if (booking.getCar() != null) {
            details = "Car: " + booking.getCar().getDisplayName() + "\n" + details;
        }

        new AlertDialog.Builder(this)
                .setTitle("Booking Details")
                .setMessage(details)
                .setPositiveButton("OK", null)
                .show();
    }

    /**
     * Show/hide loading progress
     */
    private void showLoading(boolean show) {
        progressBar.setVisibility(show ? View.VISIBLE : View.GONE);
        recyclerViewBookings.setVisibility(show ? View.GONE : View.VISIBLE);
    }

    /**
     * Update empty state visibility
     */
    private void updateEmptyState() {
        if (bookingList.isEmpty()) {
            layoutEmpty.setVisibility(View.VISIBLE);
            recyclerViewBookings.setVisibility(View.GONE);
        } else {
            layoutEmpty.setVisibility(View.GONE);
            recyclerViewBookings.setVisibility(View.VISIBLE);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        loadBookings();
    }
}