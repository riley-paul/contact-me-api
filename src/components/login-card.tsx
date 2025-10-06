import React from "react";
import LoginButton from "./login-button";
import { Card, CardContent } from "./ui/card";

const LoginCard: React.FC = () => {
  return (
    <article className="">
      <Card>
        <CardContent>
          <LoginButton provider="google" />
          <LoginButton provider="github" />
        </CardContent>
      </Card>
    </article>
  );
};

export default LoginCard;
