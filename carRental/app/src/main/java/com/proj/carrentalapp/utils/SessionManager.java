package com.proj.carrentalapp.utils;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * SessionManager Class
 * Manages user session and authentication token storage using SharedPreferences
 */
public class SessionManager {
    private static final String PREF_NAME = "CarRentalSession";
    private static final String KEY_TOKEN = "auth_token";
    private static final String KEY_USER_ID = "user_id";
    private static final String KEY_USER_NAME = "user_name";
    private static final String KEY_USER_EMAIL = "user_email";
    private static final String KEY_IS_LOGGED_IN = "is_logged_in";

    private SharedPreferences preferences;
    private SharedPreferences.Editor editor;
    private Context context;

    // Constructor
    public SessionManager(Context context) {
        this.context = context;
        preferences = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        editor = preferences.edit();
    }

    /**
     * Save user session after successful login
     */
    public void createLoginSession(String token, int userId, String userName, String userEmail) {
        editor.putString(KEY_TOKEN, token);
        editor.putInt(KEY_USER_ID, userId);
        editor.putString(KEY_USER_NAME, userName);
        editor.putString(KEY_USER_EMAIL, userEmail);
        editor.putBoolean(KEY_IS_LOGGED_IN, true);
        editor.apply();
    }

    /**
     * Get authentication token
     */
    public String getToken() {
        return preferences.getString(KEY_TOKEN, null);
    }

    /**
     * Get logged in user ID
     */
    public int getUserId() {
        return preferences.getInt(KEY_USER_ID, -1);
    }

    /**
     * Get logged in user name
     */
    public String getUserName() {
        return preferences.getString(KEY_USER_NAME, "");
    }

    /**
     * Get logged in user email
     */
    public String getUserEmail() {
        return preferences.getString(KEY_USER_EMAIL, "");
    }

    /**
     * Check if user is logged in
     */
    public boolean isLoggedIn() {
        return preferences.getBoolean(KEY_IS_LOGGED_IN, false);
    }

    /**
     * Clear session (logout)
     */
    public void logout() {
        editor.clear();
        editor.apply();
    }

    /**
     * Update user information
     */
    public void updateUserInfo(String userName, String userEmail) {
        editor.putString(KEY_USER_NAME, userName);
        editor.putString(KEY_USER_EMAIL, userEmail);
        editor.apply();
    }
}