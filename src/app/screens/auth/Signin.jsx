import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Signin = () => {
  return (
    <div>
      <h2>Sign In</h2>
      <Link href="/dashboard">
        <Button>Sign in</Button>
      </Link>
    </div>
  );
};

export default Signin;
