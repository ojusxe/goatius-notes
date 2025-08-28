"use client";
import AuthForm from "@/components/auth-form";
import { Card, CardHeader, CardTitle, Button } from "@/components/custom";

function LoginPage() {
  const handleGuest = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("guest_mode", "true");
      window.location.replace("/");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: 'var(--surface-elevated)' }}>
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold font-display" style={{ color: 'var(--text-primary)' }}>
            Welcome Back
          </h1>
          <p className="mt-2 font-body" style={{ color: 'var(--text-secondary)' }}>
            Sign in to your Goatius Notes account
          </p>
        </div>

        {/* Auth Form */}
        <AuthForm type="login" />

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

export default LoginPage;
