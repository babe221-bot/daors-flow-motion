import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

const PortalProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">
          View and manage your account details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>This is the information associated with your login.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatarUrl} alt={user.username} />
              <AvatarFallback><User className="h-10 w-10" /></AvatarFallback>
            </Avatar>
            <div>
              <p className="text-2xl font-bold">{user.username}</p>
              <p className="text-muted-foreground">{user.role}</p>
              <p className="text-sm text-muted-foreground">ID: {user.id}</p>
            </div>
          </div>
          <Button disabled>Edit Profile (Coming Soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortalProfile;
