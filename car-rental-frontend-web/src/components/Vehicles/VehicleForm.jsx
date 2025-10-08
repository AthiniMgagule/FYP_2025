import React, { useState, useEffect } from "react";
import { createVehicle, updateVehicle } from "../../services/api";
import { FaTimes } from "react-icons/fa";

const VehicleForm = ({ vehicle, onClose }) => {
  const [formData, setFormData] = useState({
    registrationNumber: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    category: "economy",
    color: "",
    numberOfSeats: 5,
    mileage: 0,
    dailyRate: 0,
    status: "available",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Prefill form if editing
  useEffect(() => {
    if (vehicle) {
      setFormData({
        registrationNumber: vehicle.registration_number || "",
        make: vehicle.make || "",
        model: vehicle.model || "",
        year: vehicle.year || new Date().getFullYear(),
        category: vehicle.category || "economy",
        color: vehicle.color || "",
        numberOfSeats: vehicle.number_of_seats || 5,
        mileage: vehicle.mileage || 0,
        dailyRate: vehicle.daily_rate || 0,
        status: vehicle.status || "available",
      });
    }
  }, [vehicle]);

  // ✅ Handle form field changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (vehicle) {
        await updateVehicle(vehicle.vehicle_id, formData);
      } else {
        await createVehicle(formData);
      }
      onClose(); // Close modal after success
    } catch (err) {
      console.error("Vehicle save error:", err);
      setError(err.response?.data?.message || "Error saving vehicle");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {vehicle ? "Edit Vehicle" : "Add New Vehicle"}
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            {/* Registration Number */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Registration Number *
              </label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => handleChange("registrationNumber", e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Make */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Make *</label>
              <input
                type="text"
                value={formData.make}
                onChange={(e) => handleChange("make", e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Model */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Model *</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => handleChange("model", e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Year *</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => handleChange("year", e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="economy">Economy</option>
                <option value="luxury">Luxury</option>
                <option value="SUV">SUV</option>
                <option value="van">Van</option>
                <option value="sports">Sports</option>
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Color</label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleChange("color", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Number of Seats */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Number of Seats
              </label>
              <input
                type="number"
                value={formData.numberOfSeats}
                onChange={(e) => handleChange("numberOfSeats", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Mileage */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Mileage</label>
              <input
                type="number"
                step="0.01"
                value={formData.mileage}
                onChange={(e) => handleChange("mileage", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Daily Rate */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Daily Rate ($) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.dailyRate}
                onChange={(e) => handleChange("dailyRate", e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? "Saving..." : vehicle ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;