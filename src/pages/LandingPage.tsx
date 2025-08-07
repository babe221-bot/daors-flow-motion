import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Truck, 
  Globe, 
  Shield, 
  Zap,
  CheckCircle,
  ArrowRight,
  Languages
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import VideoBackground from '@/components/VideoBackground';
import ParticleBackground from '@/components/ParticleBackground';
import i18n from '@/i18n';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Truck,
      title: "Real-time Tracking",
      description: "Monitor your shipments in real-time with our advanced GPS tracking system."
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Seamless logistics across borders with our extensive international network."
    },
    {
      icon: Shield,
      title: "Secure Handling",
      description: "Military-grade security protocols to ensure your cargo arrives safely."
    },
    {
      icon: Zap,
      title: "Fast Delivery",
      description: "Optimized routes and efficient processes for the fastest delivery times."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen">
      <VideoBackground videoSrc="/Whisk_cauajde4m2myzdrmlwfkyzutnduzyi1hngqzltk.mp4" />
      <ParticleBackground />
      
      <div className="relative z-10">
        {/* Language Selector */}
        <div className="absolute top-4 right-4 z-50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 transition-all duration-300 shadow-md">
                <Languages className="h-5 w-5" />
                <span className="sr-only">Select language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/90 backdrop-blur-lg border-border/50 shadow-lg rounded-lg">
              <DropdownMenuItem onClick={() => {
                console.log('Changing language to bs');
                i18n.changeLanguage('bs').then(() => {
                  console.log('Language changed to bs');
                  console.log('Current language:', i18n.language);
                }).catch((err) => {
                  console.error('Error changing language to bs:', err);
                });
              }} className="cursor-pointer hover:bg-primary/10 transition-colors">
                Bosanski
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                console.log('Changing language to en');
                i18n.changeLanguage('en').then(() => {
                  console.log('Language changed to en');
                  console.log('Current language:', i18n.language);
                }).catch((err) => {
                  console.error('Error changing language to en:', err);
                });
              }} className="cursor-pointer hover:bg-primary/10 transition-colors">
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                console.log('Changing language to hr');
                i18n.changeLanguage('hr').then(() => {
                  console.log('Language changed to hr');
                  console.log('Current language:', i18n.language);
                }).catch((err) => {
                  console.error('Error changing language to hr:', err);
                });
              }} className="cursor-pointer hover:bg-primary/10 transition-colors">
                Hrvatski
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                console.log('Changing language to sr');
                i18n.changeLanguage('sr').then(() => {
                  console.log('Language changed to sr');
                  console.log('Current language:', i18n.language);
                }).catch((err) => {
                  console.error('Error changing language to sr:', err);
                });
              }} className="cursor-pointer hover:bg-primary/10 transition-colors">
                Српски
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                console.log('Changing language to de-CH');
                i18n.changeLanguage('de-CH').then(() => {
                  console.log('Language changed to de-CH');
                  console.log('Current language:', i18n.language);
                }).catch((err) => {
                  console.error('Error changing language to de-CH:', err);
                });
              }} className="cursor-pointer hover:bg-primary/10 transition-colors">
                Schweizer Deutsch
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                console.log('Changing language to fr-CH');
                i18n.changeLanguage('fr-CH').then(() => {
                  console.log('Language changed to fr-CH');
                  console.log('Current language:', i18n.language);
                }).catch((err) => {
                  console.error('Error changing language to fr-CH:', err);
                });
              }} className="cursor-pointer hover:bg-primary/10 transition-colors">
                Français Suisse
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                console.log('Changing language to tr');
                i18n.changeLanguage('tr').then(() => {
                  console.log('Language changed to tr');
                  console.log('Current language:', i18n.language);
                }).catch((err) => {
                  console.error('Error changing language to tr:', err);
                });
              }} className="cursor-pointer hover:bg-primary/10 transition-colors">
                Türkçe
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col justify-center items-center px-4 py-12 text-center backdrop-blur-sm bg-background/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1 
              className="text-4xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Revolutionizing Logistics with AI
            </motion.h1>
            
            {/* Test translation */}
            <motion.p 
              className="text-lg md:text-xl text-foreground/90 mb-6 max-w-3xl mx-auto font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Test translation: {i18n.t('index.title', { lng: 'en' })}
            </motion.p>
            
            <motion.p 
              className="text-xl md:text-3xl text-foreground/90 mb-12 max-w-3xl mx-auto font-light"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Intelligent supply chain solutions that predict, optimize, and automate your logistics operations.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Button asChild size="lg" className="group text-xl px-10 py-7 bg-gradient-to-r from-primary to-blue-700 hover:from-primary/90 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 rounded-full">
                <Link to="/signup">
                  Get Started
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="text-xl px-10 py-7 border-2 backdrop-blur-sm bg-background/30 hover:bg-background/50 rounded-full">
                <Link to="/login">
                  Login
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Animated Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-32 max-w-5xl w-full"
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : {}}
          >
            {[
              { value: "99.9%", label: "On-Time Delivery" },
              { value: "24/7", label: "Tracking" },
              { value: "150+", label: "Countries" },
              { value: "1M+", label: "Shipments" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <Card className="bg-background/40 backdrop-blur-md border-border/50 hover:shadow-xl transition-all duration-300 shadow-lg">
                  <CardContent className="p-6">
                    <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-foreground/80">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our platform offers cutting-edge solutions for modern logistics challenges
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="h-full"
                >
                  <Card className="h-full bg-background/30 backdrop-blur-sm border-border/50 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="bg-primary/10 p-3 rounded-full mb-4">
                        <feature.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Logistics?</h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Join thousands of businesses that trust our platform for their supply chain needs
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="group text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary">
                  <Link to="/signup">
                    Start Free Trial
                    <CheckCircle className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2">
                  <Link to="/contact">
                    Contact Sales
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="py-10 px-4 border-t border-border/50">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-muted-foreground">
              © {new Date().getFullYear()} Logistics Platform. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
