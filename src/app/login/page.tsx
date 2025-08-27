"use client";
import AuthForm from "@/components/auth-form";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function LoginPage() {
  const handleGuest = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("guest_mode", "true");
      window.location.replace("/");
    }
  };
  return (
    <div className="mt-20 flex flex-1 flex-col items-center">
      <Card className="w-full max-w-md py-12">
        <CardHeader>
          <CardTitle className="text-center text-3xl">Login</CardTitle>
        </CardHeader>
        <AuthForm type="login" />
        <button
          className="mt-6 w-full rounded bg-muted px-4 py-2 text-muted-foreground hover:bg-muted/80 transition"
          onClick={handleGuest}
        >
          Use as Guest
        </button>
      </Card>
    </div>
  );
}

export default LoginPage;
