package com.proj.carrentalapp.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.proj.carrentalapp.R;
import com.proj.carrentalapp.models.Car;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

/**
 * CarAdapter Class
 * RecyclerView adapter for displaying car list
 */
public class CarAdapter extends RecyclerView.Adapter<CarAdapter.CarViewHolder> {

    private Context context;
    private List<Car> carList;
    private List<Car> carListFull; // For search/filter functionality
    private OnCarClickListener listener;

    // Interface for click events
    public interface OnCarClickListener {
        void onCarClick(Car car);
    }

    // Constructor
    public CarAdapter(Context context, List<Car> carList, OnCarClickListener listener) {
        this.context = context;
        this.carList = carList;
        this.carListFull = new ArrayList<>(carList);
        this.listener = listener;
    }

    @NonNull
    @Override
    public CarViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_car, parent, false);
        return new CarViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull CarViewHolder holder, int position) {
        Car car = carList.get(position);

        // Set car details
        holder.tvCarName.setText(car.getDisplayName());
        holder.tvCarCategory.setText(car.getCategory());
        holder.tvCarPrice.setText(String.format(Locale.getDefault(), "$%.2f/day", car.getPricePerDay()));

        // Set availability status
        if (car.isAvailable()) {
            holder.tvAvailability.setText("Available");
            holder.tvAvailability.setTextColor(context.getResources().getColor(android.R.color.holo_green_dark));
        } else {
            holder.tvAvailability.setText("Not Available");
            holder.tvAvailability.setTextColor(context.getResources().getColor(android.R.color.holo_red_dark));
        }

        // Load car image with Glide
        if (car.getImageUrl() != null && !car.getImageUrl().isEmpty()) {
            Glide.with(context)
                    .load(car.getImageUrl())
                    .placeholder(R.drawable.ic_car_placeholder)
                    .error(R.drawable.ic_car_placeholder)
                    .into(holder.ivCarImage);
        } else {
            holder.ivCarImage.setImageResource(R.drawable.ic_car_placeholder);
        }

        // Set click listener
        holder.cardView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onCarClick(car);
            }
        });
    }

    @Override
    public int getItemCount() {
        return carList.size();
    }

    /**
     * Update car list
     */
    public void updateList(List<Car> newList) {
        carList.clear();
        carList.addAll(newList);
        carListFull = new ArrayList<>(newList);
        notifyDataSetChanged();
    }

    /**
     * Filter cars by search query
     */
    public void filter(String query) {
        carList.clear();

        if (query.isEmpty()) {
            carList.addAll(carListFull);
        } else {
            String lowerCaseQuery = query.toLowerCase(Locale.getDefault());

            for (Car car : carListFull) {
                if (car.getMake().toLowerCase(Locale.getDefault()).contains(lowerCaseQuery) ||
                        car.getModel().toLowerCase(Locale.getDefault()).contains(lowerCaseQuery) ||
                        car.getCategory().toLowerCase(Locale.getDefault()).contains(lowerCaseQuery)) {
                    carList.add(car);
                }
            }
        }

        notifyDataSetChanged();
    }

    /**
     * Filter cars by category
     */
    public void filterByCategory(String category) {
        carList.clear();

        if (category == null || category.isEmpty() || category.equals("All")) {
            carList.addAll(carListFull);
        } else {
            for (Car car : carListFull) {
                if (car.getCategory().equalsIgnoreCase(category)) {
                    carList.add(car);
                }
            }
        }

        notifyDataSetChanged();
    }

    // ViewHolder class
    static class CarViewHolder extends RecyclerView.ViewHolder {
        CardView cardView;
        ImageView ivCarImage;
        TextView tvCarName;
        TextView tvCarCategory;
        TextView tvCarPrice;
        TextView tvAvailability;

        public CarViewHolder(@NonNull View itemView) {
            super(itemView);
            cardView = itemView.findViewById(R.id.cardView);
            ivCarImage = itemView.findViewById(R.id.ivCarImage);
            tvCarName = itemView.findViewById(R.id.tvCarName);
            tvCarCategory = itemView.findViewById(R.id.tvCarCategory);
            tvCarPrice = itemView.findViewById(R.id.tvCarPrice);
            tvAvailability = itemView.findViewById(R.id.tvAvailability);
        }
    }
}