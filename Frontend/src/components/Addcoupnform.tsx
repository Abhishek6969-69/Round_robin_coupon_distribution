// admin-frontend/src/components/CouponList/AddCouponForm.tsx
import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000";

interface AddCouponFormProps {
  onAdd: (coupon: Coupon) => void;
  token: string | null;
  setError: (error: string) => void;
}

interface Coupon {
  id: number;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const AddCouponForm: React.FC<AddCouponFormProps> = ({ onAdd, token, setError }) => {
  const [newCoupon, setNewCoupon] = useState({ code: "", isActive: true });

  const addCoupon = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/admin/coupons`, newCoupon, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onAdd(response.data);
      setNewCoupon({ code: "", isActive: true });
      setError("");
    } catch (error) {
      console.error("Error adding coupon:", error);
      setError("Failed to add coupon.");
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl mb-2">Add New Coupon</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Coupon Code"
          value={newCoupon.code}
          onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
          className="p-2 border rounded flex-1"
        />
        <select
          value={newCoupon.isActive.toString()}
          onChange={(e) => setNewCoupon({ ...newCoupon, isActive: e.target.value === "true" })}
          className="p-2 border rounded"
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
        <button
          onClick={addCoupon}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddCouponForm;