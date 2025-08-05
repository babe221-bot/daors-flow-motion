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
import { useTranslation } from "react-i18next";

const Settings = () => {
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSave = () => {
    toast.success(t("settings.saveChanges.success"));
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
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
              <h1 className="text-3xl font-bold gradient-text">{t('settings.title')}</h1>
              <p className="text-muted-foreground">{t('settings.description')}</p>
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
                    <CardTitle className="flex items-center gap-2"><User /> {t('settings.profile')}</CardTitle>
                    <CardDescription>{t('settings.profile.description')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">{t('settings.profile.firstName')}</Label>
                        <Input id="firstName" defaultValue="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">{t('settings.profile.lastName')}</Label>
                        <Input id="lastName" defaultValue="Doe" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('settings.profile.email')}</Label>
                      <Input id="email" type="email" defaultValue="john.doe@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('settings.profile.picture')}</Label>
                      <div className="flex items-center gap-4">
                        <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-16 h-16 rounded-full" />
                        <Button variant="outline">{t('settings.profile.changePicture')}</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Security Settings */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Shield /> {t('settings.security')}</CardTitle>
                    <CardDescription>{t('settings.security.description')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">{t('settings.security.currentPassword')}</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t('settings.security.newPassword')}</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <Label htmlFor="2fa" className="font-medium">{t('settings.security.2fa')}</Label>
                      <Switch id="2fa" />
                    </div>
                  </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bell /> {t('settings.notifications')}</CardTitle>
                    <CardDescription>{t('settings.notifications.description')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">{t('settings.notifications.email')}</Label>
                      <Switch id="email-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="push-notifications">{t('settings.notifications.push')}</Label>
                      <Switch id="push-notifications" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('settings.notifications.types')}</Label>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                          <Switch id="notif-shipment" defaultChecked/>
                          <Label htmlFor="notif-shipment">{t('settings.notifications.shipmentStatus')}</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch id="notif-route" defaultChecked/>
                          <Label htmlFor="notif-route">{t('settings.notifications.routeChanges')}</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch id="notif-system"/>
                          <Label htmlFor="notif-system">{t('settings.notifications.systemMessages')}</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Appearance Settings */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Palette /> {t('settings.appearance')}</CardTitle>
                    <CardDescription>{t('settings.appearance.description')}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme">{t('settings.appearance.theme')}</Label>
                      <Select defaultValue="dark">
                        <SelectTrigger id="theme">
                          <SelectValue placeholder={t('settings.appearance.theme.placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">{t('settings.appearance.theme.light')}</SelectItem>
                          <SelectItem value="dark">{t('settings.appearance.theme.dark')}</SelectItem>
                          <SelectItem value="system">{t('settings.appearance.theme.system')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">{t('settings.appearance.language')}</Label>
                      <Select defaultValue={i18n.language} onValueChange={handleLanguageChange}>
                        <SelectTrigger id="language">
                          <SelectValue placeholder={t('settings.appearance.language.placeholder')} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bs">{t('settings.appearance.language.bosnian')}</SelectItem>
                          <SelectItem value="en">{t('settings.appearance.language.english')}</SelectItem>
                          <SelectItem value="hr">{t('settings.appearance.language.croatian')}</SelectItem>
                          <SelectItem value="sr">{t('settings.appearance.language.serbian')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button size="lg" onClick={handleSave} className="bg-gradient-primary hover:scale-105 transition-transform">
                    <Save className="mr-2 h-4 w-4" />
                    {t('settings.saveChanges')}
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
