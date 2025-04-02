"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const { verifyOtp, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await verifyOtp(otp);
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
          Please enter the 6-digit OTP sent to your email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp">OTP</Label>
            <Input
              id="otp"
              type="text"
              className="h-11"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full h-12" disabled={loading}>
            {loading ? "Verifying..." : "Verify OTP"}
          </Button>
        </form>

        <p className="text-sm text-gray-600 text-center">
          Didn’t receive the OTP?{" "}
          <Link href="/resend-otp" className="text-blue-500 hover:underline">
            Resend OTP
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;
