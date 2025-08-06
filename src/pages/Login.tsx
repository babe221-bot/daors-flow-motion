import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { ROLES } from "@/lib/types";
import VideoBackground from "@/components/VideoBackground";

const Login = () => {
  const { t } = useTranslation();
  const { isAuthenticated, login, user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await login(email, password);
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    if (user?.role === ROLES.CLIENT) {
      return <Navigate to="/portal/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      <VideoBackground videoSrc="/Whisk_cauajde4m2myzdrmlwfkyzutnduzyi1hngqzltk.mp4" />
      <div className="relative z-10">
        <Card className="w-full max-w-md glass hover-lift transition-all duration-300">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl gradient-text">{t('login.title', 'Login to your Account')}</CardTitle>
            <CardDescription>{t('login.description', 'Enter your credentials to access the dashboard.')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('login.email', 'Email')}</Label>
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
                <Label htmlFor="password">{t('login.password', 'Password')}</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('login.loading', 'Logging in...') : t('login.submit', 'Login')}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              {t('login.no_account', "Don't have an account?")}{' '}
              <Link to="/signup" className="underline">
                {t('login.signup', 'Sign up')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
