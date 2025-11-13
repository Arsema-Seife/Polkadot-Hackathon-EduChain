import { Button } from '@/components/ui/button';
import { Shield, GraduationCap, CheckCircle, Lock, Globe, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: Shield,
      title: 'Blockchain Verified',
      description: 'Every credential is secured on the Polkadot blockchain, ensuring immutability and trust.'
    },
    {
      icon: Lock,
      title: 'Your Keys, Your Data',
      description: 'Full control over your academic records with secure wallet-based authentication.'
    },
    {
      icon: Zap,
      title: 'Instant Verification',
      description: 'Share and verify credentials in seconds with QR codes and shareable links.'
    },
    {
      icon: Globe,
      title: 'Globally Recognized',
      description: 'Accepted by universities and employers worldwide with blockchain proof.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">EduChain</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="outline" onClick={() => navigate('/onboarding')}>
              Login
            </Button>
            <Button onClick={() => navigate('/onboarding')} className="glow-on-hover">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <CheckCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Secured by Polkadot Blockchain</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Your Academic Credentials,
            <span className="gradient-text"> Blockchain Secured</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Store, manage, and share your educational credentials with complete security and control. 
            Your wallet is your academic key — keep it safe.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button size="lg" onClick={() => navigate('/onboarding')} className="glow-on-hover text-lg h-12 px-8">
              Create Your Wallet
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/verify')} className="text-lg h-12 px-8">
              Verify Credential
            </Button>
          </div>

          <div className="pt-8 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>No setup fees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Free verification</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Lifetime storage</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose EduChain?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="card-lift bg-card border rounded-xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-primary to-secondary rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg mb-8 opacity-90">
            Join thousands of students and universities using blockchain credentials
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/onboarding')} className="h-12 px-8">
            Create Your Free Wallet
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 EduChain. Secured by Polkadot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
