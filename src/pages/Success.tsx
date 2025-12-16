import { CheckCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-primary" />
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-serif font-bold text-foreground">
            Registration Successful!
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Thank you for your submission. Your personalized Astro-Vastu analysis report will be sent to your{" "}
            <span className="text-primary font-semibold inline-flex items-center gap-1">
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </span>{" "}
            within 24-48 hours.
          </p>
        </div>

        {/* WhatsApp Info Card */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-3">
          <div className="flex items-center justify-center gap-2 text-primary">
            <MessageCircle className="w-6 h-6" />
            <span className="font-semibold">WhatsApp Delivery</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Please ensure your WhatsApp is active on the phone number you provided. Our Vastu experts will reach out to you shortly.
          </p>
        </div>

        {/* Back Button */}
        <Button 
          variant="outline" 
          onClick={() => navigate("/")}
          className="mt-6"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default Success;
