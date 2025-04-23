import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

// ✅ Use env variable
const measurementId = process.env.REACT_APP_GA_MEASUREMENT_ID;
ReactGA.initialize(measurementId); // From .env

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname + location.search;
    console.log("📊 Sending GA pageview for:", path);
    ReactGA.send({ hitType: "pageview", page: path });
  }, [location]);

  return null;
};

export default AnalyticsTracker;
