import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  otpVerificationStart,
  otpVerificationSuccess,
  otpVerificationFailure,
} from "../store/slices/authSlice";

export const useAuth = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, otpRequired, email } = useSelector(
    (state) => state.auth
  );

  const login = async (email, password) => {
    dispatch(loginStart());

    try {
      const response = await fetch("http://24.199.107.202/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      console.log("Login response:", data);

      // Check if the login was successful
      if (data.success === true) {
        // Infer OTP requirement based on the response
        const otpRequired = data.message === "OTP sent successfully"; // Check the message

        if (otpRequired) {
          // If OTP is required, save the email and redirect to the OTP verification page
          dispatch(
            loginSuccess({ token: null, user: null, email, otpRequired })
          );
          router.push("/otp-verification");
        } else {
          // If OTP is not required, save the token, user, and email, then redirect to the dashboard
          const authToken = data?.token; // Adjust this based on the actual API response
          const user = data?.user; // Adjust this based on the actual API response

          if (!authToken) {
            throw new Error("Authentication token not found");
          }

          dispatch(
            loginSuccess({ token: authToken, user, email, otpRequired: false })
          );
          router.push("/dashboard");
        }
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err) {
      dispatch(
        loginFailure(err instanceof Error ? err.message : "An error occurred")
      );
    }
  };

  const verifyOtp = async (otp) => {
    dispatch(otpVerificationStart());
    try {
      const response = await fetch(
        "http://24.199.107.202/admin/auth/verify-auth-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ otp, email }),
        }
      );
      if (!response.ok) {
        throw new Error("Invalid OTP");
      }
      const data = await response.json();
      console.log("OTP verification response:", data);
      if (data.success === true) {
        const authToken = data?.data?.token?.createdToken;

        const user = data?.data?.admin;

        if (authToken) {
          dispatch(
            otpVerificationSuccess({
              token: authToken,
              user: user,
            })
          );
          router.push("/dashboard");
        } else {
          throw new Error("Authentication token not found");
        }
      } else {
        throw new Error(data.message || "OTP verification failed");
      }
    } catch (err) {
      dispatch(
        otpVerificationFailure(
          err instanceof Error ? err.message : "An error occurred"
        )
      );
    }
  };

  return { login, verifyOtp, loading, error, otpRequired };
};
