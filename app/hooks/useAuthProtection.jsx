import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { signout } from "../store/slices/authSlice";

export const useAuthProtection = ({
  inactivityTimeout = 30 * 60 * 1000,
} = {}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    let timeoutId;
    let lastActivityTime = Date.now();

    // Track user activity
    const trackActivity = () => {
      lastActivityTime = Date.now();
    };

    // Check inactivity
    const checkInactivity = () => {
      const currentTime = Date.now();
      if (currentTime - lastActivityTime > inactivityTimeout) {
        // Logout user due to inactivity
        dispatch(signout());
        router.push("/");
      } else {
        // Reset timeout
        timeoutId = setTimeout(checkInactivity, inactivityTimeout);
      }
    };

    // Redirect to login if not authenticated
    const protectRoute = () => {
      if (!token || !user) {
        router.push("/");
      }
    };

    // Add event listeners for tracking activity
    const activityEvents = [
      "mousemove",
      "keydown",
      "scroll",
      "click",
      "touchstart",
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, trackActivity);
    });

    // Initial route protection check
    protectRoute();

    // Start inactivity check
    timeoutId = setTimeout(checkInactivity, inactivityTimeout);

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, trackActivity);
      });

      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [token, user, inactivityTimeout, dispatch, router]);

  return { token, user };
};
