// admin-frontend/src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/login"; // Fixed casing
import CouponList from "./components/CouponList"; // Fixed naming
import CouponClaim from "./components/couponclaim"; // Added user claim
import ProtectedRoute from "./components/Protectedroute"; // Fixed casing
import NotFound from "./components/error";
import ClaimHistory from "./components/claimhistory";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/claim" element={<CouponClaim />} />

        {/* Protected Routes for Admin */}
        <Route element={<ProtectedRoute />}>
          <Route path="/coupons" element={<CouponList />} />
          <Route path="*" element={<ClaimHistory/>} />
        </Route>

        {/* Catch-all for unknown routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};



export default App;