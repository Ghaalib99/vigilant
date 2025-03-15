import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  otpVerificationStart,
  otpVerificationSuccess,
  otpVerificationFailure,
  signout,
} from "../store/slices/authSlice";

export const useAuth = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, otpRequired, email } = useSelector(
    (state) => state.auth
  );

  // Login function
  const login = async (email, password) => {
    dispatch(loginStart());

    try {
      const response = await fetch(
        "https://api.npfvigilant.ng/admin/auth/login",
        {
          // mode: "no-cors",
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();
      console.log("Login response:", data);

      if (data.success === true) {
        const otpRequired = data.message === "OTP sent successfully";

        if (otpRequired) {
          dispatch(
            loginSuccess({ token: null, user: null, email, otpRequired })
          );
          router.push("/otp-verification");
        } else {
          const authToken = data?.token;
          const user = data?.user;

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

  // verify otp
  const verifyOtp = async (otp) => {
    dispatch(otpVerificationStart());
    try {
      const response = await fetch(
        "https://api.npfvigilant.ng/admin/auth/verify-auth-token",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
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

  // Logout function
  const logout = () => {
    console.log("logout");
    dispatch(signout());
    router.push("/");
  };

  return { login, verifyOtp, logout, loading, error, otpRequired };
};
