import React from "react";
import LoginButton from "./login-button";
import { Card } from "@radix-ui/themes";

const LoginCard: React.FC = () => {
  return (
    <Card className="grid w-full max-w-xs gap-4" size="2">
      <LoginButton provider="google" />
      <LoginButton provider="github" />
    </Card>
  );
};

export default LoginCard;
