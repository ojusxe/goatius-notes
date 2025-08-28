"use client";
import AuthForm from "@/components/auth-form";
import { Button } from "@/components/custom";

function SignUpPage() {
  const handleGuest = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("guest_mode", "true");
      window.location.replace("/");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-surface-elevated">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary font-display">
            Join Goatius
          </h1>
          <p className="mt-2 text-secondary font-body">
            Create your account and start taking notes
          </p>
        </div>

        {/* Auth Form */}
        <AuthForm type="sign-up" />

        {/* Guest Option */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={handleGuest}
            className="w-full"
          >
            Continue as Guest
          </Button>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
