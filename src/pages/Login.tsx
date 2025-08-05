 feature/document-and-gps-tracking
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { mockUsers } from "@/lib/mock-users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserIcon } from "lucide-react";
import VideoBackground from "@/components/VideoBackground";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Login = () => {
  const { t } = useTranslation();
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <VideoBackground videoSrc="https://www.w3schools.com/html/mov_bbb.mp4" />
      <div className="relative z-10">
        <Card className="w-full max-w-md glass hover-lift transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-text">{t('login.title', 'Select a User to Login')}</CardTitle>
            <CardDescription>{t('login.description', 'Choose a role to experience the application from different perspectives.')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockUsers.map((user) => (
              <Button
                key={user.id}
                onClick={() => login(user.id)}
                className="w-full justify-start gap-4 p-6 text-lg h-auto"
                variant="outline"
              >
                <Avatar>
                  <AvatarImage src={user.avatarUrl} alt={user.username} />
                  <AvatarFallback><UserIcon /></AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-bold">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getUserByEmail, User } from "@/lib/auth";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null);
    const user = await getUserByEmail(values.email);

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      if (user.role === "admin") {
        navigate("/");
      } else {
        navigate("/customer-dashboard");
      }
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        </Form>
 main
      </div>
    </div>
  );
};

export default Login;
