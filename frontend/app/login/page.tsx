"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { login } from "@/services/auth.service";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";


export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await login({
        email,
        password,
      });

      localStorage.setItem("token", response.token);

      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <Card className="w-[420px] shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl">
            FestSphere
          </CardTitle>

          <p className="text-center text-gray-500">
            Welcome Back 👋
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}