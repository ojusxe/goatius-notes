import AuthForm from "@/components/auth-form";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function SignUpPage() {
  return (
    <div className="mt-20 flex flex-1 flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl">Sign Up</CardTitle>
        </CardHeader>
        <AuthForm type="sign-up" />
      </Card>
    </div>
  );
}

export default SignUpPage;
