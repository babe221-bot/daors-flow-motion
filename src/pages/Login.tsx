import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Logo from "@/components/Logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { useTranslation } from 'react-i18next'; // Temporarily disabled
import { ROLES } from "@/lib/types"; // Import Role type
import ParticleBackground from "@/components/ParticleBackground";

const Login = () => {
  // const { t } = useTranslation(); // Temporarily disabled
  const { isAuthenticated, login, user, loading: authLoading, loginAsGuest } = useAuth(); // Destructure loginAsGuest
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => { // Added type for event
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error: loginError } = await login(email, password);
      if (loginError) {
        setError(loginError.message);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => { // Handler for guest login
    setLoading(true); // Use the same loading state for guest login
    setError('');
    try {
      const { error: guestError } = await loginAsGuest();
      if (guestError) {
        setError(guestError.message);
      }
      // Navigation is handled by the useEffect hook in AuthProvider based on isAuthenticated
    } catch (err) {
      setError('An unexpected error occurred during guest login.');
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
    // Redirect based on role
    if (user?.role === ROLES.CLIENT || user?.role === ROLES.GUEST) { // Check for GUEST role as well
      return <Navigate to="/portal" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-background overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10 w-full max-w-md p-4 sm:p-6 md:p-8">
        <Card className="w-full bg-card/80 backdrop-blur-lg border-border/20 shadow-2xl rounded-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <Logo size="lg" showText={true} linkTo="/" />
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground pt-2">
              Sign in to continue to Daors Flow-Motion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-muted-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input/50 border-border/30 focus:ring-primary/50"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-muted-foreground">Password</Label>
                  <Link to="#" className="text-sm text-primary/80 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input/50 border-border/30 focus:ring-primary/50"
                />
              </div>
              {error && <p className="text-sm text-destructive text-center">{error}</p>}
              <Button type="submit" className="w-full text-lg py-6 rounded-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/40" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full text-lg py-6 rounded-lg bg-input/50 border-border/30" onClick={handleGuestLogin} disabled={loading}>
                Sign In as Guest
              </Button>
            </div>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              No account yet?{' '}
              <Link to="/signup" className="font-semibold text-primary/90 hover:underline">
                Create one
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
