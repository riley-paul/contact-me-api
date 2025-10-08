import React from "react";
import LoginButton from "./login-button";
import { Card } from "@radix-ui/themes";

const LoginCard: React.FC = () => {
  return (
    <Card className="w-full max-w-sm">
      <LoginButton provider="google" />
      <LoginButton provider="github" />
    </Card>
  );
};

export default LoginCard;
