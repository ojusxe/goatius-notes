"use client";

import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

function LogoutButton() {
  const {toast} = useToast();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await new Promise ((resolve) => setTimeout(resolve, 2000))

    // const errorMessage = "Error logging out bruv";
    const errorMessage = null; // Simulating no error for successful logout
    if (!errorMessage) {
      toast ({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        variant: "success",
      });
      router.push("/")
    } else {
      toast ({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
    setLoading(false);
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={loading}
      className="w-24"
    >
      {loading ? <Loader2 className="animate-spin" /> : "Log Out"}
    </Button>
  );
}

export default LogoutButton;
