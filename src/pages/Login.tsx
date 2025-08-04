import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn } from "lucide-react";
import VideoBackground from "@/components/VideoBackground";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Logging in with:", { email, password });
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* TODO: Replace with the actual video file path */}
      <VideoBackground videoSrc="https://www.w3schools.com/html/mov_bbb.mp4" />
      <div className="relative z-10">
        <Card className="w-full max-w-sm glass hover-lift transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-text">Prijavite se</CardTitle>
            <CardDescription>Unesite svoje podatke za pristup</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Lozinka</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                <LogIn className="mr-2 h-4 w-4" /> Prijavi se
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
