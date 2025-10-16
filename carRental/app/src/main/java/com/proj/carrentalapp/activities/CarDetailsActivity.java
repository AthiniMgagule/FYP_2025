package com.proj.carrentalapp.activities;

import android.app.DatePickerDialog;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;

import com.bumptech.glide.Glide;
import com.proj.carrentalapp.R;
import com.proj.carrentalapp.api.ApiClient;
import com.proj.carrentalapp.api.ApiService;
import com.proj.carrentalapp.models.Booking;
import com.proj.carrentalapp.models.Car;
import com.proj.carrentalapp.utils.Constants;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.chip.Chip;
import com.google.android.material.chip.ChipGroup;
import com.google.android.material.textfield.TextInputEditText;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.TimeUnit;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * CarDetailsActivity
 * Displays detailed car information and handles reservations
 */
public class CarDetailsActivity extends AppCompatActivity {

    private ImageView ivCarImage;
    private TextView tvCarName, tvCategory, tvPrice, tvAvailability;
    private TextView tvSeats, tvTransmission, tvFuelType, tvDescription;
    private TextView tvTotalPrice;
    private ChipGroup chipGroupFeatures;
    private TextInputEditText etStartDate, etEndDate;
    private MaterialButton btnReserve;
    private CardView cardTotalPrice;
    private MaterialToolbar toolbar;

    private Car currentCar;
    private ApiService apiService;
    private Calendar startCalendar, endCalendar;
    private SimpleDateFormat dateFormat;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_car_details);

        // Initialize views
        initViews();

        // Initialize API service
        apiService = ApiClient.getApiService();

        // Initialize date format
        dateFormat = new SimpleDateFormat(Constants.DATE_FORMAT, Locale.getDefault());
        startCalendar = Calendar.getInstance();
        endCalendar = Calendar.getInstance();

        // Setup toolbar
        toolbar.setNavigationOnClickListener(v -> finish());

        // Get car ID from intent
        int carId = getIntent().getIntExtra(Constants.EXTRA_CAR_ID, -1);

        if (carId != -1) {
            loadCarDetails(carId);
        } else {
            Toast.makeText(this, "Invalid car ID", Toast.LENGTH_SHORT).show();
            finish();
        }

        // Setup date pickers
        setupDatePickers();

        // Setup reserve button
        btnReserve.setOnClickListener(v -> createReservation());
    }

    /**
     * Initialize UI components
     */
    private void initViews() {
        toolbar = findViewById(R.id.toolbar);
        ivCarImage = findViewById(R.id.ivCarImage);
        tvCarName = findViewById(R.id.tvCarName);
        tvCategory = findViewById(R.id.tvCategory);
        tvPrice = findViewById(R.id.tvPrice);
        tvAvailability = findViewById(R.id.tvAvailability);
        tvSeats = findViewById(R.id.tvSeats);
        tvTransmission = findViewById(R.id.tvTransmission);
        tvFuelType = findViewById(R.id.tvFuelType);
        tvDescription = findViewById(R.id.tvDescription);
        chipGroupFeatures = findViewById(R.id.chipGroupFeatures);
        etStartDate = findViewById(R.id.etStartDate);
        etEndDate = findViewById(R.id.etEndDate);
        btnReserve = findViewById(R.id.btnReserve);
        tvTotalPrice = findViewById(R.id.tvTotalPrice);
        cardTotalPrice = findViewById(R.id.cardTotalPrice);
    }

    /**
     * Load car details from API
     */
    private void loadCarDetails(int carId) {
        apiService.getCarDetails(carId).enqueue(new Callback<Car>() {
            @Override
            public void onResponse(Call<Car> call, Response<Car> response) {
                if (response.isSuccessful() && response.body() != null) {
                    currentCar = response.body();
                    displayCarDetails();
                } else {
                    Toast.makeText(CarDetailsActivity.this,
                            "Failed to load car details",
                            Toast.LENGTH_SHORT).show();
                    finish();
                }
            }

            @Override
            public void onFailure(Call<Car> call, Throwable t) {
                Toast.makeText(CarDetailsActivity.this,
                        "Network error: " + t.getMessage(),
                        Toast.LENGTH_SHORT).show();
                finish();
            }
        });
    }

    /**
     * Display car details in UI
     */
    private void displayCarDetails() {
        tvCarName.setText(currentCar.getDisplayName());
        tvCategory.setText(currentCar.getCategory());
        tvPrice.setText(String.format(Locale.getDefault(), "$%.2f/day", currentCar.getPricePerDay()));

        // Set availability
        if (currentCar.isAvailable()) {
            tvAvailability.setText("Available");
            tvAvailability.setTextColor(getResources().getColor(android.R.color.holo_green_dark));
            btnReserve.setEnabled(true);
        } else {
            tvAvailability.setText("Not Available");
            tvAvailability.setTextColor(getResources().getColor(android.R.color.holo_red_dark));
            btnReserve.setEnabled(false);
        }

        // Set specifications
        tvSeats.setText(String.valueOf(currentCar.getSeats()));
        tvTransmission.setText(currentCar.getTransmission());
        tvFuelType.setText(currentCar.getFuelType());

        // Set description
        if (currentCar.getDescription() != null) {
            tvDescription.setText(currentCar.getDescription());
        }

        // Load image
        if (currentCar.getImageUrl() != null && !currentCar.getImageUrl().isEmpty()) {
            Glide.with(this)
                    .load(currentCar.getImageUrl())
                    .placeholder(R.drawable.ic_car_placeholder)
                    .error(R.drawable.ic_car_placeholder)
                    .into(ivCarImage);
        }

        // Display features as chips
        if (currentCar.getFeatures() != null && !currentCar.getFeatures().isEmpty()) {
            chipGroupFeatures.removeAllViews();
            for (String feature : currentCar.getFeatures()) {
                Chip chip = new Chip(this);
                chip.setText(feature);
                chip.setClickable(false);
                chipGroupFeatures.addView(chip);
            }
        }
    }

    /**
     * Setup date picker dialogs
     */
    private void setupDatePickers() {
        // Start date picker
        etStartDate.setOnClickListener(v -> {
            Calendar minDate = Calendar.getInstance();

            DatePickerDialog datePickerDialog = new DatePickerDialog(
                    this,
                    (view, year, month, dayOfMonth) -> {
                        startCalendar.set(year, month, dayOfMonth);
                        etStartDate.setText(dateFormat.format(startCalendar.getTime()));

                        // Update end date minimum
                        endCalendar.setTime(startCalendar.getTime());
                        endCalendar.add(Calendar.DAY_OF_MONTH, 1);

                        calculateTotalPrice();
                    },
                    startCalendar.get(Calendar.YEAR),
                    startCalendar.get(Calendar.MONTH),
                    startCalendar.get(Calendar.DAY_OF_MONTH)
            );

            datePickerDialog.getDatePicker().setMinDate(minDate.getTimeInMillis());
            datePickerDialog.show();
        });

        // End date picker
        etEndDate.setOnClickListener(v -> {
            if (etStartDate.getText().toString().isEmpty()) {
                Toast.makeText(this, "Please select start date first", Toast.LENGTH_SHORT).show();
                return;
            }

            DatePickerDialog datePickerDialog = new DatePickerDialog(
                    this,
                    (view, year, month, dayOfMonth) -> {
                        endCalendar.set(year, month, dayOfMonth);
                        etEndDate.setText(dateFormat.format(endCalendar.getTime()));
                        calculateTotalPrice();
                    },
                    endCalendar.get(Calendar.YEAR),
                    endCalendar.get(Calendar.MONTH),
                    endCalendar.get(Calendar.DAY_OF_MONTH)
            );

            datePickerDialog.getDatePicker().setMinDate(startCalendar.getTimeInMillis() + (24 * 60 * 60 * 1000));
            datePickerDialog.show();
        });
    }

    /**
     * Calculate total price based on selected dates
     */
    private void calculateTotalPrice() {
        String startDateStr = etStartDate.getText().toString();
        String endDateStr = etEndDate.getText().toString();

        if (!startDateStr.isEmpty() && !endDateStr.isEmpty()) {
            try {
                Date startDate = dateFormat.parse(startDateStr);
                Date endDate = dateFormat.parse(endDateStr);

                if (startDate != null && endDate != null) {
                    long diffInMillis = endDate.getTime() - startDate.getTime();
                    long days = TimeUnit.MILLISECONDS.toDays(diffInMillis);

                    if (days > 0) {
                        double totalPrice = days * currentCar.getPricePerDay();
                        tvTotalPrice.setText(String.format(Locale.getDefault(), "$%.2f", totalPrice));
                        cardTotalPrice.setVisibility(View.VISIBLE);
                    }
                }
            } catch (ParseException e) {
                e.printStackTrace();
            }
        }
    }

    /**
     * Create reservation
     */
    private void createReservation() {
        String startDateStr = etStartDate.getText().toString();
        String endDateStr = etEndDate.getText().toString();

        // Validate dates
        if (startDateStr.isEmpty()) {
            Toast.makeText(this, "Please select start date", Toast.LENGTH_SHORT).show();
            return;
        }

        if (endDateStr.isEmpty()) {
            Toast.makeText(this, "Please select end date", Toast.LENGTH_SHORT).show();
            return;
        }

        // Create booking object
        Booking booking = new Booking(currentCar.getId(), startDateStr, endDateStr);

        // Make API call
        btnReserve.setEnabled(false);
        apiService.createBooking(booking).enqueue(new Callback<Booking>() {
            @Override
            public void onResponse(Call<Booking> call, Response<Booking> response) {
                btnReserve.setEnabled(true);

                if (response.isSuccessful() && response.body() != null) {
                    Toast.makeText(CarDetailsActivity.this,
                            "Booking created successfully!",
                            Toast.LENGTH_LONG).show();
                    finish();
                } else {
                    Toast.makeText(CarDetailsActivity.this,
                            "Failed to create booking. Please try again.",
                            Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Booking> call, Throwable t) {
                btnReserve.setEnabled(true);
                Toast.makeText(CarDetailsActivity.this,
                        "Network error: " + t.getMessage(),
                        Toast.LENGTH_SHORT).show();
            }
        });
    }
}