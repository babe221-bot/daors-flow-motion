import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { mockUsers } from "@/lib/mock-users";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserIcon } from "lucide-react";
import VideoBackground from "@/components/VideoBackground";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ROLES } from "@/lib/types";

const Login = () => {
  const { t } = useTranslation();
  const { user, login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    if (user?.role === ROLES.CLIENT) {
      return <Navigate to="/portal/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
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
      </div>
    </div>
  );
};

export default Login;
