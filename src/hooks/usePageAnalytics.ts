import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

// Generate a simple session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
};

export function usePageAnalytics() {
  const startTimeRef = useRef<number>(Date.now());
  const hasTrackedViewRef = useRef(false);
  const sessionId = getSessionId();

  useEffect(() => {
    // Track page view on mount
    const trackPageView = async () => {
      if (hasTrackedViewRef.current) return;
      hasTrackedViewRef.current = true;

      try {
        await supabase.from("page_analytics").insert({
          session_id: sessionId,
          page_url: window.location.href,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          event_type: "page_view",
        });
      } catch (error) {
        console.error("Failed to track page view:", error);
      }
    };

    trackPageView();

    // Track bounce/exit when user leaves
    const trackExit = async () => {
      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000);
      const isBounce = timeOnPage < 30; // Consider bounce if less than 30 seconds

      try {
        await supabase.from("page_analytics").insert({
          session_id: sessionId,
          page_url: window.location.href,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          event_type: isBounce ? "bounce" : "exit",
          time_on_page: timeOnPage,
        });
      } catch (error) {
        console.error("Failed to track exit:", error);
      }
    };

    // Use beforeunload to track when user leaves
    const handleBeforeUnload = () => {
      // Use sendBeacon for reliability
      const data = {
        session_id: sessionId,
        page_url: window.location.href,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        event_type: (Date.now() - startTimeRef.current) / 1000 < 30 ? "bounce" : "exit",
        time_on_page: Math.round((Date.now() - startTimeRef.current) / 1000),
      };

      // sendBeacon is more reliable for unload events
      if (navigator.sendBeacon) {
        const url = `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/page_analytics`;
        navigator.sendBeacon(
          url,
          new Blob([JSON.stringify(data)], { type: "application/json" })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [sessionId]);

  // Function to track form submission (not a bounce)
  const trackFormSubmit = async () => {
    const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000);

    try {
      await supabase.from("page_analytics").insert({
        session_id: sessionId,
        page_url: window.location.href,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
        event_type: "form_submit",
        time_on_page: timeOnPage,
      });
    } catch (error) {
      console.error("Failed to track form submit:", error);
    }
  };

  return { trackFormSubmit };
}