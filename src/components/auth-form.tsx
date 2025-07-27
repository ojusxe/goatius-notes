"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

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
    <form action={handleSubmit}>
      <CardContent className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            required
            placeholder="Enter your email bruv"
            disabled={isPending}
          />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            required
            placeholder="Enter your password bruv"
            disabled={isPending}
          />
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col justify-end gap-6">
        <Button className="w-full">
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : isLoginForm ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </Button>
        <p>
          {isLoginForm
            ? "Don't have an account yet?"
            : "Already have an account?"}{" "}
          <Link
            href={isLoginForm ? "/sign-up" : "/login"}
            className={`text-blue-500 hover:underline ${isPending ? "pointer-events-none opacity-50" : ""}`}
          >
            <Button variant="link" className="p-0">
              {isLoginForm ? "Sign Up" : "Login"}
            </Button>
          </Link>
        </p>
      </CardFooter>
    </form>
  );
}

export default AuthForm;
