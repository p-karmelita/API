import { useNavigate } from 'react-router-dom';
import { Bot, DollarSign, Globe, Shield, Zap, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { connectWallet } from '../api/mockApi';

export default function Landing() {
  const navigate = useNavigate();

  const handleConnectWallet = () => {
    connectWallet();
    navigate('/dashboard');
  };

  const handleStartNow = () => {
    navigate('/login');
  };

  const features = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: 'AI-Powered Automation',
      description: 'Natural language commands to schedule and manage payments automatically',
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: 'Secure USDC Payments',
      description: 'Fast, stable, and transparent cryptocurrency transactions',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Arc Blockchain Integration',
      description: 'Built on cutting-edge blockchain technology for maximum security',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Smart Contract Security',
      description: 'Automated execution with built-in safety and verification',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Settlements',
      description: 'Real-time payment processing with no delays',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar onConnectWallet={handleConnectWallet} />

      <main>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              PayMind
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              Smart Real Estate Payments
            </p>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Automate real estate transactions with AI + USDC + Arc blockchain.
              Say goodbye to manual payments and hello to intelligent automation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button variant="primary" size="lg" onClick={handleConnectWallet}>
                Connect Wallet
              </Button>
              <Button variant="outline" size="lg" onClick={handleStartNow}>
                Start Now <ArrowRight className="w-4 h-4 ml-2 inline" />
              </Button>
            </div>

            <div className="mt-6">
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View Presentation →
              </a>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PayMind?
            </h2>
            <p className="text-lg text-gray-600">
              The future of real estate payments is here
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Real Estate Payments?
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of real estate professionals using AI-powered payment automation
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleStartNow}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Get Started Today
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 text-sm">
            © 2025 PayMind. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
