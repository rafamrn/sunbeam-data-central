
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Check, CreditCard, QrCode, FileText, Shield, Zap, BarChart3, Headphones } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | 'enterprise'>('premium');
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'pix' | 'boleto'>('credit');

  const plans = [
    {
      id: 'basic' as const,
      name: 'Básico',
      price: 99,
      description: 'Ideal para pequenas instalações',
      features: [
        'Até 5 usinas',
        'Monitoramento básico',
        'Relatórios mensais',
        'Suporte por email'
      ],
      color: 'border-gray-300',
      popular: false
    },
    {
      id: 'premium' as const,
      name: 'Premium',
      price: 199,
      description: 'Perfeito para empresas em crescimento',
      features: [
        'Até 25 usinas',
        'Monitoramento em tempo real',
        'Relatórios personalizáveis',
        'Alertas instantâneos',
        'Integração WhatsApp',
        'Suporte prioritário'
      ],
      color: 'border-green-500',
      popular: true
    },
    {
      id: 'enterprise' as const,
      name: 'Enterprise',
      price: 399,
      description: 'Para grandes operações',
      features: [
        'Usinas ilimitadas',
        'Dashboard personalizado',
        'API completa',
        'Relatórios avançados',
        'Integração completa',
        'Suporte 24/7',
        'Gerente dedicado'
      ],
      color: 'border-blue-500',
      popular: false
    }
  ];

  const currentPlan = plans.find(plan => plan.id === selectedPlan)!;

  const handlePayment = () => {
    let paymentTitle = '';
    let paymentDescription = '';

    switch (paymentMethod) {
      case 'credit':
        paymentTitle = 'Pagamento processado';
        paymentDescription = 'Seu cartão será cobrado mensalmente';
        break;
      case 'pix':
        paymentTitle = 'PIX gerado';
        paymentDescription = 'Use o código PIX para completar o pagamento';
        break;
      case 'boleto':
        paymentTitle = 'Boleto gerado';
        paymentDescription = 'Seu boleto foi enviado por email';
        break;
    }

    toast({
      title: paymentTitle,
      description: paymentDescription,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Assinatura Dark Energy Insight</h1>
        <p className="text-muted-foreground">
          Escolha o plano ideal para o seu negócio de energia solar
        </p>
      </div>

      {/* Benefícios da plataforma */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-500" />
            Por que escolher nossa plataforma?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Análise em tempo real</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm">Dados seguros</span>
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-purple-500" />
              <span className="text-sm">Suporte especializado</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-orange-500" />
              <span className="text-sm">Relatórios automáticos</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seleção de planos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative cursor-pointer transition-all hover:scale-105 ${
              selectedPlan === plan.id
                ? `${plan.color} border-2 shadow-lg`
                : 'border hover:border-primary/50'
            }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500">
                Mais Popular
              </Badge>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="space-y-1">
                <div className="text-3xl font-bold">
                  R$ {plan.price}
                  <span className="text-lg font-normal text-muted-foreground">/mês</span>
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resumo e pagamento */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo da Assinatura</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Plano {currentPlan.name}</h3>
              <p className="text-sm text-muted-foreground">{currentPlan.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">R$ {currentPlan.price}</div>
              <div className="text-sm text-muted-foreground">por mês</div>
            </div>
          </div>

          <Separator />

          {/* Métodos de pagamento */}
          <div className="space-y-4">
            <h3 className="font-medium">Método de Pagamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Card
                className={`cursor-pointer border-2 transition-colors ${
                  paymentMethod === 'credit'
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/50'
                }`}
                onClick={() => setPaymentMethod('credit')}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <CreditCard className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Cartão de Crédito</div>
                    <div className="text-xs text-muted-foreground">Cobrança mensal automática</div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer border-2 transition-colors ${
                  paymentMethod === 'pix'
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/50'
                }`}
                onClick={() => setPaymentMethod('pix')}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <QrCode className="h-5 w-5" />
                  <div>
                    <div className="font-medium">PIX</div>
                    <div className="text-xs text-muted-foreground">Pagamento instantâneo</div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer border-2 transition-colors ${
                  paymentMethod === 'boleto'
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/50'
                }`}
                onClick={() => setPaymentMethod('boleto')}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <FileText className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Boleto Bancário</div>
                    <div className="text-xs text-muted-foreground">Vencimento em 7 dias</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Total e botão de pagamento */}
          <div className="space-y-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>R$ {currentPlan.price}/mês</span>
            </div>
            
            <Button 
              onClick={handlePayment} 
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {paymentMethod === 'credit' && 'Assinar Agora'}
              {paymentMethod === 'pix' && 'Gerar PIX'}
              {paymentMethod === 'boleto' && 'Gerar Boleto'}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.
              Você pode cancelar a qualquer momento.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Segurança */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>Pagamento 100% seguro e criptografado</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscription;
