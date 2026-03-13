import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Check, Package, CreditCard, Sparkles, Zap, Shield, HelpCircle, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../store';
import { toast } from 'sonner';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '2,500',
    credits: 50,
    pricePerCredit: '50',
    color: 'from-blue-500 to-blue-600',
    shadow: 'shadow-blue-200',
    features: ['50 Visit Credits', 'Basic Analytics Dashboard', 'Email Support', 'Up to 5 Reps', '60-day validity']
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '8,000',
    credits: 200,
    pricePerCredit: '40',
    color: 'from-emerald-500 to-teal-600',
    shadow: 'shadow-emerald-200',
    isPopular: true,
    features: ['200 Visit Credits', 'Advanced Analytics', 'Priority Support', 'Up to 20 Reps', 'Video Call Integration', '90-day validity']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '18,000',
    credits: 500,
    pricePerCredit: '36',
    color: 'from-purple-500 to-purple-600',
    shadow: 'shadow-purple-200',
    features: ['500 Visit Credits', 'Custom Analytics', '24/7 Dedicated Support', 'Unlimited Reps', 'API Access', 'Custom Branding', '180-day validity']
  }
];

export function Bundles() {
  const { user } = useAuth();
  const { credits, setCredits } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null);

  // Summary stats
  const currentTotal = credits[user?.id || ''] || 0;
  
  const handlePurchase = () => {
    if (!selectedPlan || !user) return;
    const newTotal = currentTotal + selectedPlan.credits;
    setCredits(user.id, newTotal);
    setIsModalOpen(false);
    toast.success(`Successfully purchased ${selectedPlan.name} bundle! ${selectedPlan.credits} credits added.`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Visit Bundles</h2>
          <p className="text-slate-500 mt-1">Choose the right credit package for your pharmaceutical operations.</p>
        </div>
        
        {/* Current Balance Card */}
        <Card className="bg-emerald-600 text-white min-w-[240px] shadow-lg shadow-emerald-200 border-none">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium text-emerald-100 uppercase tracking-widest">Active Credits</p>
                <p className="text-2xl font-bold">{currentTotal}</p>
              </div>
            </div>
            <div className="mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: '40%' }} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative flex flex-col h-full border-2 transition-all duration-300 hover:scale-[1.02] ${plan.isPopular ? 'border-emerald-500 shadow-2xl scale-[1.03]' : 'border-slate-100 hover:border-slate-200'}`}
          >
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                Most Popular
              </div>
            )}
            
            <div className={`h-24 bg-gradient-to-br ${plan.color} flex items-center justify-center p-6`}>
              <div className="flex items-center gap-3 text-white">
                {plan.id === 'starter' ? <Sparkles className="h-6 w-6" /> : plan.id === 'professional' ? <Zap className="h-6 w-6" /> : <Shield className="h-6 w-6" />}
                <h3 className="text-xl font-bold">{plan.name}</h3>
              </div>
            </div>

            <CardHeader className="text-center pt-8">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                <span className="text-slate-400 font-semibold">SAR</span>
              </div>
              <p className="text-sm text-slate-500 mt-2">Perfect for small teams just getting started.</p>
            </CardHeader>

            <CardContent className="flex-1 px-8">
              <div className="bg-slate-50 rounded-xl p-4 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{plan.credits} Credits</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{plan.pricePerCredit} SAR/credit</p>
                </div>
                <Package className="h-6 w-6 text-slate-300" />
              </div>

              <ul className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                    <div className={`mt-1 h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 ${plan.isPopular ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <Check className="h-2.5 w-2.5" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>

            <div className="p-8 pt-0 mt-6">
              <Button 
                onClick={() => { setSelectedPlan(plan); setIsModalOpen(true); }}
                className={`w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-slate-200 ${plan.isPopular ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-slate-800'}`}
              >
                {plan.isPopular ? 'Choose Professional' : `Get ${plan.name} Plan`}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Payment Modal */}
      {isModalOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <Card className="w-full max-w-md shadow-2xl overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${selectedPlan.color}`} />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" /> Secure Checkout
              </CardTitle>
              <CardDescription>You are purchasing the <b>{selectedPlan.name}</b> bundle for <b>{selectedPlan.price} SAR</b>.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Card Number</label>
                <div className="relative">
                  <Input placeholder="XXXX XXXX XXXX XXXX" className="h-11" />
                  <CreditCard className="absolute right-3 top-3 h-5 w-5 text-slate-300" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Expiry Date</label>
                  <Input placeholder="MM/YY" className="h-11" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">CVV</label>
                  <Input placeholder="XXX" className="h-11" />
                </div>
              </div>
            </CardContent>
            <div className="p-6 border-t border-slate-100 flex flex-col gap-3">
              <Button onClick={handlePurchase} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-lg font-bold rounded-xl">
                Pay {selectedPlan.price} SAR
              </Button>
              <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="w-full">Cancel</Button>
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium">
                <Shield className="h-3 w-3" /> PCI-DSS Compliant Secure Payment Registry
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
