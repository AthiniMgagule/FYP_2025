package com.proj.carrentalapp.adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.cardview.widget.CardView;
import androidx.recyclerview.widget.RecyclerView;

import com.proj.carrentalapp.R;
import com.proj.carrentalapp.models.Booking;

import java.util.List;
import java.util.Locale;

/**
 * BookingAdapter Class
 * RecyclerView adapter for displaying booking list
 */
public class BookingAdapter extends RecyclerView.Adapter<BookingAdapter.BookingViewHolder> {

    private Context context;
    private List<Booking> bookingList;
    private OnBookingActionListener listener;

    // Interface for booking actions
    public interface OnBookingActionListener {
        void onBookingClick(Booking booking);
        void onCancelClick(Booking booking);
        void onModifyClick(Booking booking);
    }

    // Constructor
    public BookingAdapter(Context context, List<Booking> bookingList, OnBookingActionListener listener) {
        this.context = context;
        this.bookingList = bookingList;
        this.listener = listener;
    }

    @NonNull
    @Override
    public BookingViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_booking, parent, false);
        return new BookingViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull BookingViewHolder holder, int position) {
        Booking booking = bookingList.get(position);

        // Set booking details
        holder.tvBookingId.setText(String.format(Locale.getDefault(), "Booking #%d", booking.getId()));

        // Display car information if available
        if (booking.getCar() != null) {
            holder.tvCarInfo.setText(booking.getCar().getDisplayName());
        } else {
            holder.tvCarInfo.setText("Car ID: " + booking.getCarId());
        }

        holder.tvStartDate.setText("From: " + booking.getStartDate());
        holder.tvEndDate.setText("To: " + booking.getEndDate());
        holder.tvTotalPrice.setText(String.format(Locale.getDefault(), "Total: $%.2f", booking.getTotalPrice()));
        holder.tvStatus.setText(booking.getStatusDisplay());

        // Set status color
        int statusColor;
        switch (booking.getStatus().toLowerCase()) {
            case "confirmed":
                statusColor = context.getResources().getColor(android.R.color.holo_blue_dark);
                break;
            case "active":
                statusColor = context.getResources().getColor(android.R.color.holo_green_dark);
                break;
            case "completed":
                statusColor = context.getResources().getColor(android.R.color.darker_gray);
                break;
            case "cancelled":
                statusColor = context.getResources().getColor(android.R.color.holo_red_dark);
                break;
            default:
                statusColor = context.getResources().getColor(android.R.color.holo_orange_dark);
        }
        holder.tvStatus.setTextColor(statusColor);

        // Show/hide action buttons based on booking status
        if (booking.isCancellable()) {
            holder.btnCancel.setVisibility(View.VISIBLE);
            holder.btnModify.setVisibility(View.VISIBLE);
        } else {
            holder.btnCancel.setVisibility(View.GONE);
            holder.btnModify.setVisibility(View.GONE);
        }

        // Set click listeners
        holder.cardView.setOnClickListener(v -> {
            if (listener != null) {
                listener.onBookingClick(booking);
            }
        });

        holder.btnCancel.setOnClickListener(v -> {
            if (listener != null) {
                listener.onCancelClick(booking);
            }
        });

        holder.btnModify.setOnClickListener(v -> {
            if (listener != null) {
                listener.onModifyClick(booking);
            }
        });
    }

    @Override
    public int getItemCount() {
        return bookingList.size();
    }

    /**
     * Update booking list
     */
    public void updateList(List<Booking> newList) {
        bookingList.clear();
        bookingList.addAll(newList);
        notifyDataSetChanged();
    }

    // ViewHolder class
    static class BookingViewHolder extends RecyclerView.ViewHolder {
        CardView cardView;
        TextView tvBookingId;
        TextView tvCarInfo;
        TextView tvStartDate;
        TextView tvEndDate;
        TextView tvTotalPrice;
        TextView tvStatus;
        Button btnCancel;
        Button btnModify;

        public BookingViewHolder(@NonNull View itemView) {
            super(itemView);
            cardView = itemView.findViewById(R.id.cardView);
            tvBookingId = itemView.findViewById(R.id.tvBookingId);
            tvCarInfo = itemView.findViewById(R.id.tvCarInfo);
            tvStartDate = itemView.findViewById(R.id.tvStartDate);
            tvEndDate = itemView.findViewById(R.id.tvEndDate);
            tvTotalPrice = itemView.findViewById(R.id.tvTotalPrice);
            tvStatus = itemView.findViewById(R.id.tvStatus);
            btnCancel = itemView.findViewById(R.id.btnCancel);
            btnModify = itemView.findViewById(R.id.btnModify);
        }
    }
}