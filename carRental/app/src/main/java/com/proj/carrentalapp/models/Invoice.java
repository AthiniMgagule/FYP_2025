package com.proj.carrentalapp.models;

/**
 * Invoice Model Class
 * Represents billing information for completed rentals
 */
public class Invoice {
    private int id;
    private int bookingId;
    private Booking booking; // Nested booking object
    private double subtotal;
    private double tax;
    private double discount;
    private double totalAmount;
    private String paymentStatus; // paid, unpaid, pending
    private String paymentMethod; // credit_card, debit_card, cash, bank_transfer
    private String invoiceDate;
    private String dueDate;
    private String invoiceNumber;

    // Constructors
    public Invoice() {
    }

    public Invoice(int bookingId, double subtotal, double tax, double totalAmount) {
        this.bookingId = bookingId;
        this.subtotal = subtotal;
        this.tax = tax;
        this.totalAmount = totalAmount;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getBookingId() {
        return bookingId;
    }

    public void setBookingId(int bookingId) {
        this.bookingId = bookingId;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    public double getTax() {
        return tax;
    }

    public void setTax(double tax) {
        this.tax = tax;
    }

    public double getDiscount() {
        return discount;
    }

    public void setDiscount(double discount) {
        this.discount = discount;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getInvoiceDate() {
        return invoiceDate;
    }

    public void setInvoiceDate(String invoiceDate) {
        this.invoiceDate = invoiceDate;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    // Helper methods
    public boolean isPaid() {
        return "paid".equalsIgnoreCase(paymentStatus);
    }

    public String getPaymentStatusDisplay() {
        if (paymentStatus == null) return "Unknown";
        return paymentStatus.substring(0, 1).toUpperCase() + paymentStatus.substring(1).toLowerCase();
    }

    @Override
    public String toString() {
        return "Invoice{" +
                "id=" + id +
                ", invoiceNumber='" + invoiceNumber + '\'' +
                ", bookingId=" + bookingId +
                ", totalAmount=" + totalAmount +
                ", paymentStatus='" + paymentStatus + '\'' +
                '}';
    }
}