package com.proj.carrentalapp.api;

import com.proj.carrentalapp.utils.Constants;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.util.concurrent.TimeUnit;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

/**
 * ApiClient Class
 * Singleton pattern for Retrofit instance configuration
 */
public class ApiClient {
    private static Retrofit retrofit = null;
    private static String authToken = null;

    /**
     * Get Retrofit instance
     */
    public static Retrofit getClient() {
        if (retrofit == null) {
            // Configure Gson
            Gson gson = new GsonBuilder()
                    .setLenient()
                    .create();

            // Configure OkHttpClient with authentication interceptor
            OkHttpClient okHttpClient = new OkHttpClient.Builder()
                    .connectTimeout(30, TimeUnit.SECONDS)
                    .readTimeout(30, TimeUnit.SECONDS)
                    .writeTimeout(30, TimeUnit.SECONDS)
                    .addInterceptor(chain -> {
                        Request original = chain.request();
                        Request.Builder requestBuilder = original.newBuilder();

                        // Add authorization header if token exists
                        if (authToken != null && !authToken.isEmpty()) {
                            requestBuilder.header("Authorization", "Bearer " + authToken);
                        }

                        // Add common headers
                        requestBuilder.header("Accept", "application/json");
                        requestBuilder.header("Content-Type", "application/json");

                        Request request = requestBuilder.build();
                        return chain.proceed(request);
                    })
                    .build();

            // Build Retrofit instance
            retrofit = new Retrofit.Builder()
                    .baseUrl(Constants.BASE_URL)
                    .client(okHttpClient)
                    .addConverterFactory(GsonConverterFactory.create(gson))
                    .build();
        }
        return retrofit;
    }

    /**
     * Set authentication token for API requests
     */
    public static void setAuthToken(String token) {
        authToken = token;
        // Reset retrofit instance to apply new token
        retrofit = null;
    }

    /**
     * Clear authentication token
     */
    public static void clearAuthToken() {
        authToken = null;
        retrofit = null;
    }

    /**
     * Get API Service instance
     */
    public static ApiService getApiService() {
        return getClient().create(ApiService.class);
    }
}