import React from "react";
import LoginButton from "./login-button";
import { Card, CardTitle, CardHeader, CardFooter } from "./ui/card";

const LoginCard: React.FC = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardFooter className="grid gap-2">
        <LoginButton provider="google" />
        <LoginButton provider="github" />
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
