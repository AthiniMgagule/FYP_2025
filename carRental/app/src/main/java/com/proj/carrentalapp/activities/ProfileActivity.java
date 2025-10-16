package com.proj.carrentalapp.activities;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.proj.carrentalapp.R;
import com.proj.carrentalapp.api.ApiClient;
import com.proj.carrentalapp.api.ApiService;
import com.proj.carrentalapp.models.User;
import com.proj.carrentalapp.utils.SessionManager;
import com.google.android.material.appbar.MaterialToolbar;
import com.google.android.material.button.MaterialButton;
import com.google.android.material.textfield.TextInputEditText;

import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * ProfileActivity
 * View and edit user profile information
 */
public class ProfileActivity extends AppCompatActivity {

    private TextInputEditText etName, etEmail, etPhone, etAddress, etDriverLicense;
    private MaterialButton btnUpdate, btnLogout;
    private ProgressBar progressBar;
    private MaterialToolbar toolbar;

    private ApiService apiService;
    private SessionManager sessionManager;
    private boolean isEditMode = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile);

        // Initialize views
        initViews();

        // Initialize API service and session manager
        apiService = ApiClient.getApiService();
        sessionManager = new SessionManager(this);

        // Setup toolbar
        toolbar.setNavigationOnClickListener(v -> finish());

        // Load user profile
        loadProfile();

        // Setup click listeners
        btnUpdate.setOnClickListener(v -> {
            if (isEditMode) {
                updateProfile();
            } else {
                enableEditMode();
            }
        });

        btnLogout.setOnClickListener(v -> showLogoutDialog());
    }

    /**
     * Initialize UI components
     */
    private void initViews() {
        toolbar = findViewById(R.id.toolbar);
        etName = findViewById(R.id.etName);
        etEmail = findViewById(R.id.etEmail);
        etPhone = findViewById(R.id.etPhone);
        etAddress = findViewById(R.id.etAddress);
        etDriverLicense = findViewById(R.id.etDriverLicense);
        btnUpdate = findViewById(R.id.btnUpdate);
        btnLogout = findViewById(R.id.btnLogout);
        progressBar = findViewById(R.id.progressBar);

        // Disable editing initially
        setFieldsEnabled(false);
    }

    /**
     * Load user profile from API
     */
    private void loadProfile() {
        showLoading(true);

        apiService.getUserProfile().enqueue(new Callback<User>() {
            @Override
            public void onResponse(Call<User> call, Response<User> response) {
                showLoading(false);

                if (response.isSuccessful() && response.body() != null) {
                    displayProfile(response.body());
                } else {
                    Toast.makeText(ProfileActivity.this,
                            "Failed to load profile",
                            Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<User> call, Throwable t) {
                showLoading(false);
                Toast.makeText(ProfileActivity.this,
                        "Network error: " + t.getMessage(),
                        Toast.LENGTH_SHORT).show();
            }
        });
    }

    /**
     * Display user profile in UI
     */
    private void displayProfile(User user) {
        etName.setText(user.getName());
        etEmail.setText(user.getEmail());
        etPhone.setText(user.getPhone());
        etAddress.setText(user.getAddress());
        etDriverLicense.setText(user.getDriverLicenseNumber());
    }

    /**
     * Enable edit mode
     */
    private void enableEditMode() {
        isEditMode = true;
        setFieldsEnabled(true);
        btnUpdate.setText("Save Changes");
        etEmail.setEnabled(false); // Email typically cannot be changed
    }

    /**
     * Update user profile
     */
    private void updateProfile() {
        String name = etName.getText().toString().trim();
        String email = etEmail.getText().toString().trim();
        String phone = etPhone.getText().toString().trim();
        String address = etAddress.getText().toString().trim();
        String driverLicense = etDriverLicense.getText().toString().trim();

        // Validate inputs
        if (TextUtils.isEmpty(name)) {
            etName.setError("Name is required");
            etName.requestFocus();
            return;
        }

        if (TextUtils.isEmpty(phone)) {
            etPhone.setError("Phone is required");
            etPhone.requestFocus();
            return;
        }

        if (TextUtils.isEmpty(address)) {
            etAddress.setError("Address is required");
            etAddress.requestFocus();
            return;
        }

        // Create user object
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPhone(phone);
        user.setAddress(address);
        user.setDriverLicenseNumber(driverLicense);

        showLoading(true);

        // Make API call
        apiService.updateProfile(user).enqueue(new Callback<Map<String, Object>>() {
            @Override
            public void onResponse(Call<Map<String, Object>> call, Response<Map<String, Object>> response) {
                showLoading(false);

                if (response.isSuccessful() && response.body() != null) {
                    Toast.makeText(ProfileActivity.this,
                            "Profile updated successfully",
                            Toast.LENGTH_SHORT).show();

                    // Update session
                    sessionManager.updateUserInfo(name, email);

                    // Exit edit mode
                    isEditMode = false;
                    setFieldsEnabled(false);
                    btnUpdate.setText("Edit Profile");
                } else {
                    Toast.makeText(ProfileActivity.this,
                            "Failed to update profile",
                            Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<Map<String, Object>> call, Throwable t) {
                showLoading(false);
                Toast.makeText(ProfileActivity.this,
                        "Network error: " + t.getMessage(),
                        Toast.LENGTH_SHORT).show();
            }
        });
    }

    /**
     * Show logout confirmation dialog
     */
    private void showLogoutDialog() {
        new AlertDialog.Builder(this)
                .setTitle("Logout")
                .setMessage("Are you sure you want to logout?")
                .setPositiveButton("Yes", (dialog, which) -> logout())
                .setNegativeButton("No", null)
                .show();
    }

    /**
     * Logout user
     */
    private void logout() {
        sessionManager.logout();
        ApiClient.clearAuthToken();

        Intent intent = new Intent(this, LoginActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(intent);
        finish();
    }

    /**
     * Enable/disable input fields
     */
    private void setFieldsEnabled(boolean enabled) {
        etName.setEnabled(enabled);
        etPhone.setEnabled(enabled);
        etAddress.setEnabled(enabled);
        etDriverLicense.setEnabled(enabled);
    }

    /**
     * Show/hide loading progress
     */
    private void showLoading(boolean show) {
        progressBar.setVisibility(show ? View.VISIBLE : View.GONE);
        btnUpdate.setEnabled(!show);
    }
}