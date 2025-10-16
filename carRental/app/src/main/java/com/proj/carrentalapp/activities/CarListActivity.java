package com.proj.carrentalapp.activities;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.proj.carrentalapp.R;
import com.proj.carrentalapp.adapters.CarAdapter;
import com.proj.carrentalapp.api.ApiClient;
import com.proj.carrentalapp.api.ApiService;
import com.proj.carrentalapp.models.Car;
import com.proj.carrentalapp.utils.Constants;
import com.google.android.material.chip.Chip;
import com.google.android.material.chip.ChipGroup;
import com.google.android.material.textfield.TextInputEditText;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * CarListActivity
 * Displays list of available cars with search and filter functionality
 */
public class CarListActivity extends AppCompatActivity implements CarAdapter.OnCarClickListener {

    private RecyclerView recyclerViewCars;
    private TextInputEditText etSearch;
    private ChipGroup chipGroupCategory;
    private ProgressBar progressBar;
    private LinearLayout layoutEmpty;

    private CarAdapter carAdapter;
    private List<Car> carList;
    private ApiService apiService;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_car_list);

        // Initialize views
        initViews();

        // Initialize API service
        apiService = ApiClient.getApiService();

        // Setup RecyclerView
        setupRecyclerView();

        // Setup search
        setupSearch();

        // Setup category filter
        setupCategoryFilter();

        // Load cars
        loadCars();
    }

    /**
     * Initialize UI components
     */
    private void initViews() {
        recyclerViewCars = findViewById(R.id.recyclerViewCars);
        etSearch = findViewById(R.id.etSearch);
        chipGroupCategory = findViewById(R.id.chipGroupCategory);
        progressBar = findViewById(R.id.progressBar);
        layoutEmpty = findViewById(R.id.layoutEmpty);
    }

    /**
     * Setup RecyclerView with adapter
     */
    private void setupRecyclerView() {
        carList = new ArrayList<>();
        carAdapter = new CarAdapter(this, carList, this);

        recyclerViewCars.setLayoutManager(new LinearLayoutManager(this));
        recyclerViewCars.setHasFixedSize(true);
        recyclerViewCars.setAdapter(carAdapter);
    }

    /**
     * Setup search functionality
     */
    private void setupSearch() {
        etSearch.addTextChangedListener(new TextWatcher() {
            @Override
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {
            }

            @Override
            public void onTextChanged(CharSequence s, int start, int before, int count) {
                carAdapter.filter(s.toString());
                updateEmptyState();
            }

            @Override
            public void afterTextChanged(Editable s) {
            }
        });
    }

    /**
     * Setup category filter chips
     */
    private void setupCategoryFilter() {
        chipGroupCategory.setOnCheckedStateChangeListener((group, checkedIds) -> {
            if (checkedIds.isEmpty()) {
                carAdapter.filterByCategory("All");
            } else {
                int checkedId = checkedIds.get(0);
                Chip chip = findViewById(checkedId);
                if (chip != null) {
                    carAdapter.filterByCategory(chip.getText().toString());
                }
            }
            updateEmptyState();
        });
    }

    /**
     * Load cars from API
     */
    private void loadCars() {
        showLoading(true);

        apiService.getCars().enqueue(new Callback<List<Car>>() {
            @Override
            public void onResponse(Call<List<Car>> call, Response<List<Car>> response) {
                showLoading(false);

                if (response.isSuccessful() && response.body() != null) {
                    carList.clear();
                    carList.addAll(response.body());
                    carAdapter.updateList(carList);
                    updateEmptyState();
                } else {
                    Toast.makeText(CarListActivity.this,
                            "Failed to load cars",
                            Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Car>> call, Throwable t) {
                showLoading(false);
                Toast.makeText(CarListActivity.this,
                        "Network error: " + t.getMessage(),
                        Toast.LENGTH_SHORT).show();
            }
        });
    }

    /**
     * Handle car item click
     */
    @Override
    public void onCarClick(Car car) {
        Intent intent = new Intent(this, CarDetailsActivity.class);
        intent.putExtra(Constants.EXTRA_CAR_ID, car.getId());
        startActivity(intent);
    }

    /**
     * Show/hide loading progress
     */
    private void showLoading(boolean show) {
        progressBar.setVisibility(show ? View.VISIBLE : View.GONE);
        recyclerViewCars.setVisibility(show ? View.GONE : View.VISIBLE);
    }

    /**
     * Update empty state visibility
     */
    private void updateEmptyState() {
        if (carAdapter.getItemCount() == 0) {
            layoutEmpty.setVisibility(View.VISIBLE);
            recyclerViewCars.setVisibility(View.GONE);
        } else {
            layoutEmpty.setVisibility(View.GONE);
            recyclerViewCars.setVisibility(View.VISIBLE);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Reload cars when returning to this activity
        loadCars();
    }
}