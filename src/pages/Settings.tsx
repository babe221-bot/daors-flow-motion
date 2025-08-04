import { useState } from "react";
import { User, Shield, Bell, Palette, Save } from "lucide-react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ParticleBackground from "@/components/ParticleBackground";

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSave = () => {
    toast.success("Postavke su uspješno sačuvane!");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ParticleBackground />
      <div className="relative z-20">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <Sidebar isOpen={sidebarOpen} />

        <main className={cn("transition-all duration-300 pt-header", sidebarOpen ? "ml-64" : "ml-16")}>
          <div className="p-6 space-y-6">
            <header className="space-y-2 animate-slide-up-fade">
              <h1 className="text-3xl font-bold gradient-text">Postavke</h1>
              <p className="text-muted-foreground">Upravljajte postavkama vašeg naloga i aplikacije.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column for navigation (optional, can be added later) */}
              <div className="lg:col-span-1">
                {/* Could have a settings sidebar here */}
              </div>

              {/* Right column for settings content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Settings */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User /> Profil</CardTitle>
                    <CardDescription>Ažurirajte vaše lične podatke.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Ime</Label>
                        <Input id="firstName" defaultValue="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Prezime</Label>
                        <Input id="lastName" defaultValue="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Slika profila</Label>
                      <div className="flex items-center gap-4">
                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-16 h-16 rounded-full" />
                        <Button variant="outline">Promijeni sliku</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Shield /> Sigurnost</CardTitle>
                    <CardDescription>Upravljajte vašom lozinkom i sigurnosnim postavkama.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Trenutna lozinka</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nova lozinka</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <Label htmlFor="2fa" className="font-medium">Dvofaktorska autentifikacija (2FA)</Label>
                      <Switch id="2fa" />
                    </div>
                  </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bell /> Obavještenja</CardTitle>
                    <CardDescription>Odaberite kako želite primati obavještenja.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">Email obavještenja</Label>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifications">Push obavještenja</Label>
                      <Switch id="push-notifications" />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipovi obavještenja</Label>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <Switch id="notif-shipment" defaultChecked/>
                          <Label htmlFor="notif-shipment">Status pošiljke</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch id="notif-route" defaultChecked/>
                          <Label htmlFor="notif-route">Promjene rute</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch id="notif-system"/>
                          <Label htmlFor="notif-system">Sistemske poruke</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Appearance Settings */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Palette /> Izgled</CardTitle>
                    <CardDescription>Prilagodite izgled aplikacije.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Tema</Label>
                      <Select defaultValue="dark">
                        <SelectTrigger id="theme">
                          <SelectValue placeholder="Odaberi temu" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Svijetla</SelectItem>
                          <SelectItem value="dark">Tamna</SelectItem>
                          <SelectItem value="system">Sistemska</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Jezik</Label>
                      <Select defaultValue="bs">
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Odaberi jezik" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bs">Bosanski</SelectItem>
                          <SelectItem value="en">Engleski</SelectItem>
                          <SelectItem value="de">Njemački</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button size="lg" onClick={handleSave} className="bg-gradient-primary hover:scale-105 transition-transform">
                    <Save className="mr-2 h-4 w-4" />
                    Sačuvaj promjene
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
