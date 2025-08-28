"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, Input, Button } from "@/components/custom";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { loginAction, signUpAction } from "@/actions/users";

type Props = {
  type: "login" | "sign-up";
};

function AuthForm({ type }: Props) {
  const isLoginForm = type === "login";

  const router = useRouter();
  const { toast } = useToast();

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      let errorMessage;
      let title;
      let description;

      if (isLoginForm) {
        errorMessage = (await loginAction(email, password)).errorMessage;
        title = "Logged in";
        description = "Welcome back, you GOAT!";
      } else {
        errorMessage = (await signUpAction(email, password)).errorMessage;
        title = "Signed Up";
        description = "Welcome to the GOAT community! Check your email to verify your account.";
      }

      if(!errorMessage) {
        toast({
          title,
          description,
          variant: "success",
        });
        router.replace("/");
      } else {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      }
    });
  };

  return (
    <Card variant="elevated" className="w-full max-w-md mx-auto">
      <form action={handleSubmit} className="flex flex-col gap-6">
        <CardContent>
          <div className="space-y-4">
            <Input
              type="email"
              id="email"
              name="email"
              required
              label="Email"
              placeholder="Enter your email"
              disabled={isPending}
            />
            <Input
              type="password"
              id="password"
              name="password"
              required
              label="Password"
              placeholder="Enter your password"
              disabled={isPending}
            />
          </div>
        </CardContent>
        
        <div className="px-6 pb-6 flex flex-col gap-4">
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="animate-pulse" size={16} />
            ) : isLoginForm ? (
              "Login"
            ) : (
              "Sign Up"
            )}
          </Button>
          
          <p className="text-center text-secondary text-sm font-body">
            {isLoginForm
              ? "Don't have an account yet?"
              : "Already have an account?"}{" "}
            <Link
              href={isLoginForm ? "/sign-up" : "/login"}
              className={`text-link hover:text-link-hover transition-smooth font-medium ${isPending ? "pointer-events-none opacity-50" : ""}`}
            >
              {isLoginForm ? "Sign Up" : "Login"}
            </Link>
          </p>
        </div>
      </form>
    </Card>
  );
}

export default AuthForm;
