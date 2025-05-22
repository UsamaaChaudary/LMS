import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OnlineFee.css";
import paymentAnimation from "../animations/payment-animation.json";
import assignmentLogo from "../assets/icons/assignment-logo.png";
import canteenLogo from "../assets/icons/order-food-logo.png";
import checkedLogo from "../assets/icons/checked.png";
import resultLogo from "../assets/icons/result-logo.png";
import logOutLogo from "../assets/icons/loggout.png";
import submitFee from "../assets/icons/fee-logo.png";
import coursesLogo from "../assets/icons/courses-logo.png";
import bookLogo from "../assets/icons/book-logo.png";

const stripePromise = loadStripe("pk_test_51RLRwfPtrQyQr3DgPFMvBJpMbzze66yXm289s8as6GD87UTrJu8FE7UulMUbjmDYxDUCWJHgJQolCm5qxdHCqq6300wkBspx3M", {
  advancedFraudSignals: false,
});

const CheckoutForm = () => {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Show processing toast
    const toastId = toast.loading("Processing your payment...", {
      position: "top-center",
      autoClose: false,
      closeButton: false,
    });

    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        toast.update(toastId, {
          render: "You must be logged in to make a payment",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
        setIsProcessing(false);
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/payment/create-payment-intent",
        { amount: parseFloat(amount) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const clientSecret = response?.data?.clientSecret;
      if (!clientSecret) {
        toast.update(toastId, {
          render: "Failed to get payment details from server",
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
        setIsProcessing(false);
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.update(toastId, {
          render: result.error.message,
          type: "error",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
        setIsProcessing(false);
      } else if (result.paymentIntent.status === "succeeded") {
        await axios.post(
          "http://localhost:5000/api/payment/record-payment",
          {
            paymentIntentId: result.paymentIntent.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        toast.update(toastId, {
          render: "Payment successful!",
          type: "success",
          isLoading: false,
          autoClose: 5000,
          closeButton: true,
        });
        
        setAmount("");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      const errorMessage = err?.response?.data?.error || "An error occurred while processing your payment";
      
      toast.update(toastId, {
        render: errorMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
        closeButton: true,
      });
      
      setIsProcessing(false);
    }
  };

  return (
    <form className="online-fee-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="fee-input-label">Amount (PKR)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="fee-amount-input"
          disabled={isProcessing}
        />
      </div>
      <div className="form-group">
        <label className="card-input-label">Card Details</label>
        <CardElement className="card-details-input" options={{disabled: isProcessing}} />
      </div>
      <button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="payment-submit-btn"
      >
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const OnlineFee = ({ studentId }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="online-fee-page">
      {/* Toast container */}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <div className="dashboardSidebar">
      <div className="sidebarLink" onClick={() => navigate("/student-dashboard")}>
          <div className="sidebarText" style={{ display: "flex", alignItems: "flex-start" }}>
            <span style={{ fontSize: "24px", marginRight: "15px", marginTop: "-10px" }}>📊</span>
            <span style={{ fontSize: "14px", position: "relative", top: "-1px" }}>Dashboard</span>
          </div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/upload-assignment")}>
          <img
            src={assignmentLogo}
            alt="assignment logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Assignment Upload</div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/request-book")}>
          <img
            src={bookLogo}
            alt="request book logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Request Book</div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/order-food")}>
          <img
            src={canteenLogo}
            alt="canteen logo"
            style={{ width: "50px", height: "30px", marginLeft: -10 }}
          />
          <div className="sidebarText" style={{ marginLeft: -10 }}>Order Food</div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/my-approvals")}>
          <img
            src={checkedLogo}
            alt="checked logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">My Approvals</div>
        </div>

        <div className="sidebarLink" onClick={() => navigate("/results")}>
          <img
            src={resultLogo}
            alt="result logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Result</div>
        </div>

       

        <div className="sidebarLink" onClick={() => navigate("/courses")}>
          <img
            src={coursesLogo}
            alt="courses logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Courses</div>
        </div>

        <div className="sidebarLink" onClick={handleLogout}>
          <img
            src={logOutLogo}
            alt="logout logo"
            style={{ width: "30px", height: "30px" }}
          />
          <div className="sidebarText">Logout</div>
        </div>
      </div>

      <div className="online-fee-content-area">
        <div className="online-fee-background">
          <div className="online-fee-form-container">
            <Lottie
              autoplay
              loop
              animationData={paymentAnimation}
              speed={1.5}
              className="payment-animation"
            />
            
            <Elements stripe={stripePromise}>
              <CheckoutForm studentId={studentId} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlineFee;