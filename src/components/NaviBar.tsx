import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { LogIn, UserPlus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const NaviBar = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <Logo size="md" showText={true} />
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>{t('navbar.features')}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {/* Add features here */}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">
                <LogIn className="mr-2 h-4 w-4" />
                {t('navbar.login')}
              </Link>
            </Button>
            <Button asChild>
              <Link to="/signup">
                <UserPlus className="mr-2 h-4 w-4" />
                {t('navbar.signup')}
              </Link>
            </Button>
          </div>
        </div>
        <div className="md:hidden">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 p-4">
                <Link to="/login" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                  <LogIn className="mr-2 h-4 w-4" />
                  {t('navbar.login')}
                </Link>
                <Link to="/signup" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t('navbar.signup')}
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default NaviBar;
