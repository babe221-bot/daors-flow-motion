import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { LogIn, Tv2 } from "lucide-react";
import VideoBackground from "@/components/VideoBackground";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show2FA, setShow2FA] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd verify credentials first
    setShow2FA(true);
  };

  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle 2FA logic here
    console.log("Submitting 2FA code");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* TODO: Replace with the actual video file path */}
      <VideoBackground videoSrc="https://www.w3schools.com/html/mov_bbb.mp4" />
      <div className="relative z-10">
        <Card className="w-full max-w-sm glass hover-lift transition-all duration-300">
          {show2FA ? (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl gradient-text">Unesite 2FA kod</CardTitle>
                <CardDescription>Kod je poslat na vaš uređaj</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handle2FASubmit} className="space-y-4">
                  <div className="flex justify-center">
                    <InputOTP maxLength={6}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button type="submit" className="w-full">
                    Potvrdi
                  </Button>
                </form>
              </CardContent>
            </>
          ) : (
            <>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember-me" />
                      <Label htmlFor="remember-me" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Zapamti me
                      </Label>
                    </div>
                    <a href="#" className="text-sm text-primary hover:underline">
                      Zaboravili ste lozinku?
                    </a>
                  </div>
                  <Button type="submit" className="w-full">
                    <LogIn className="mr-2 h-4 w-4" /> Prijavi se
                  </Button>
                </form>
                <div className="relative my-4">
                  <Separator />
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Ili nastavite sa
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline">
                    <Tv2 className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                  <Button variant="outline">
                    <Tv2 className="mr-2 h-4 w-4" />
                    Facebook
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Login;
