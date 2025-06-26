
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, BarChart3, Shield, Smartphone, TrendingUp, PieChart } from "lucide-react";

export function LandingPage() {
  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-financialBlue-600" />,
      title: "Dashboard Intuitivo",
      description: "Visualize toda sua carteira de investimentos em um só lugar com gráficos elegantes e fáceis de entender."
    },
    {
      icon: <PieChart className="h-8 w-8 text-financialGreen-600" />,
      title: "Análise Completa",
      description: "Acompanhe a performance de cada ativo, categoria e sua rentabilidade total com relatórios detalhados."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-financialBlue-600" />,
      title: "Cotações em Tempo Real",
      description: "Mantenha-se atualizado com as cotações mais recentes de ações, FIIs, criptos e Tesouro Direto."
    },
    {
      icon: <Shield className="h-8 w-8 text-financialGreen-600" />,
      title: "Segurança Total",
      description: "Seus dados estão protegidos com criptografia de ponta e infraestrutura de alta segurança."
    },
    {
      icon: <Smartphone className="h-8 w-8 text-financialBlue-600" />,
      title: "100% Responsivo",
      description: "Acesse sua carteira de qualquer dispositivo - desktop, tablet ou smartphone."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-financialGreen-600" />,
      title: "Relatórios Avançados",
      description: "Exporte relatórios personalizados e acompanhe dividendos, rendimentos e IR de forma automática."
    }
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Investidor Pessoa Física",
      comment: "Revolucionou a forma como controlo meus investimentos. Interface limpa e funcionalidades incríveis!"
    },
    {
      name: "Ana Santos",
      role: "Analista Financeira",
      comment: "Finalmente uma plataforma que une simplicidade com funcionalidades profissionais. Recomendo!"
    },
    {
      name: "Roberto Lima",
      role: "Empresário",
      comment: "O melhor custo-benefício do mercado. Por R$ 19,90 tenho tudo que preciso para gerenciar minha carteira."
    }
  ];

  const faqs = [
    {
      question: "Como funciona o investidorZ?",
      answer: "O investidorZ é uma plataforma web onde você registra seus investimentos e acompanha automaticamente a performance através de cotações em tempo real."
    },
    {
      question: "Quais tipos de investimentos posso acompanhar?",
      answer: "Você pode acompanhar ações, FIIs, Tesouro Direto, criptomoedas, renda fixa e outros tipos de investimentos."
    },
    {
      question: "É seguro inserir meus dados?",
      answer: "Sim! Utilizamos criptografia de ponta e não solicitamos senhas de corretoras. Você apenas insere dados das suas operações."
    },
    {
      question: "Posso cancelar minha assinatura a qualquer momento?",
      answer: "Sim, você pode cancelar sua assinatura a qualquer momento através do seu painel de usuário."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-financialBlue-900 via-financialBlue-800 to-financialGreen-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-white to-financialGreen-100"></div>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              investidor<span className="text-financialGreen-400">Z</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-slide-up">
              A plataforma mais completa para controlar e otimizar sua carteira de investimentos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Button size="lg" className="bg-white text-financialBlue-900 hover:bg-financialGreen-50 font-semibold px-8 py-4 text-lg">
                Comece Grátis Agora
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 font-semibold px-8 py-4 text-lg">
                Ver Demonstração
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Tudo que você precisa para investir melhor
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Funcionalidades profissionais em uma interface simples e elegante
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover-scale border-slate-200">
                <CardContent className="p-8">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Plano Simples e Transparente
          </h2>
          <p className="text-xl text-slate-600 mb-12">
            Um único plano com todas as funcionalidades que você precisa
          </p>
          
          <Card className="max-w-md mx-auto border-2 border-financialBlue-200 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Plano Premium</h3>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-financialBlue-600">R$ 19</span>
                  <span className="text-xl text-slate-500">,90/mês</span>
                </div>
                
                <ul className="space-y-4 mb-8 text-left">
                  {[
                    "Dashboard completo com gráficos",
                    "Cotações em tempo real",
                    "Controle de dividendos",
                    "Relatórios detalhados",
                    "Análise de rentabilidade",
                    "Suporte prioritário",
                    "Acesso em todos os dispositivos"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-financialGreen-600" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button className="w-full bg-financialBlue-600 hover:bg-financialBlue-700 font-semibold py-3">
                  Assinar Agora
                </Button>
                
                <p className="text-sm text-slate-500 mt-4">
                  Cancele a qualquer momento
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              O que nossos usuários dizem
            </h2>
            <p className="text-xl text-slate-600">
              Depoimentos reais de quem já transformou seus investimentos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-scale">
                <CardContent className="p-8">
                  <p className="text-slate-600 mb-6 italic">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-slate-600">
              Tire suas dúvidas sobre o investidorZ
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover-scale">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-financialBlue-600 to-financialGreen-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para revolucionar seus investimentos?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Junte-se a milhares de investidores que já transformaram sua gestão financeira
          </p>
          <Button size="lg" className="bg-white text-financialBlue-900 hover:bg-financialGreen-50 font-semibold px-8 py-4 text-lg">
            Comece Sua Jornada Agora
          </Button>
        </div>
      </section>
    </div>
  );
}
