"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { PasswordInput } from "@/components/PasswordInput";
import { useAuth } from "@/app/hooks/useAuth";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div className="bg-white w-full h-screen flex justify-center items-center">
      <div className="w-[90%] md:w-[50%] lg:w-[30%] border rounded-xl p-6 flex flex-col space-y-4">
        <Image
          src="/Logo.png"
          width={150}
          height={150}
          alt="Vigilant logo"
          className="mx-auto mb-4"
        />
        <p className="text-sm text-gray-600 text-center">
          Fill the fields below to login to your admin dashboard.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="h-11"
              placeholder="Input email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              placeholder="Input password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* {error && <p className="text-sm text-red-500">{error}</p>} */}

          <Button type="submit" className="w-full h-12" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="text-sm text-gray-600 text-center">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
