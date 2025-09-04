import React from "react";
import LoginButton from "./login-button";
import { Card } from "@radix-ui/themes";

const LoginCard: React.FC = () => {
  return (
    <article className="">
      <Card size="3" className="grid! w-full max-w-sm gap-3">
        <LoginButton provider="google" />
        <LoginButton provider="github" />
      </Card>
    </article>
  );
};

export default LoginCard;
