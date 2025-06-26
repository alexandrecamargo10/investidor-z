
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, BarChart3, Shield, Smartphone, TrendingUp, PieChart, Zap, Target, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Dashboard Intuitivo",
      description: "Visualize toda sua carteira de investimentos em um só lugar com gráficos elegantes e fáceis de entender."
    },
    {
      icon: <PieChart className="h-8 w-8 text-blue-500" />,
      title: "Análise Completa",
      description: "Acompanhe a performance de cada ativo, categoria e sua rentabilidade total com relatórios detalhados."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: "Controle Total",
      description: "Gerencie suas transações, acompanhe dividendos e mantenha o histórico completo dos seus investimentos."
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-500" />,
      title: "Segurança Total",
      description: "Seus dados estão protegidos com criptografia de ponta e infraestrutura de alta segurança."
    },
    {
      icon: <Smartphone className="h-8 w-8 text-blue-600" />,
      title: "100% Responsivo",
      description: "Acesse sua carteira de qualquer dispositivo - desktop, tablet ou smartphone."
    },
    {
      icon: <Zap className="h-8 w-8 text-blue-500" />,
      title: "Relatórios Instantâneos",
      description: "Gere relatórios personalizados e acompanhe sua evolução patrimonial em tempo real."
    }
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Investidor Pessoa Física",
      comment: "Revolucionou a forma como controlo meus investimentos. Interface limpa e funcionalidades incríveis!",
      rating: 5
    },
    {
      name: "Ana Santos",
      role: "Analista Financeira", 
      comment: "Finalmente uma plataforma que une simplicidade com funcionalidades profissionais. Recomendo!",
      rating: 5
    },
    {
      name: "Roberto Lima",
      role: "Empresário",
      comment: "O melhor controle de carteira que já usei. Design moderno e muito fácil de usar.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">Z</span>
              </div>
              <span className="font-bold text-xl text-slate-900">
                investidor<span className="text-blue-600">Z</span>
              </span>
            </div>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Entrar
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
                <Star className="h-4 w-4" />
                Plataforma #1 em controle de investimentos
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                Gerencie seus
                <span className="block text-blue-600">investimentos</span>
                como um <span className="text-blue-600">pro</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                A plataforma mais completa para controlar sua carteira, acompanhar performance e tomar decisões inteligentes de investimento.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/auth')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-lg"
                >
                  Começar Gratuitamente
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg"
                >
                  Ver Demonstração
                </Button>
              </div>

              <div className="mt-12 flex items-center gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">10k+</div>
                  <div className="text-sm text-slate-600">Usuários ativos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">R$ 50M+</div>
                  <div className="text-sm text-slate-600">Patrimônio gerenciado</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">99.9%</div>
                  <div className="text-sm text-slate-600">Uptime</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-900">Minha Carteira</h3>
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">Z</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-slate-900">R$ 125.430,50</div>
                      <div className="text-sm text-green-600 font-medium">+8,5% este mês</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-slate-900">15</div>
                        <div className="text-xs text-slate-600">Ativos</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-slate-900">R$ 2.1K</div>
                        <div className="text-xs text-slate-600">Dividendos/mês</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Target className="h-4 w-4" />
              Funcionalidades Premium
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Tudo que você precisa para investir melhor
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Funcionalidades profissionais em uma interface simples e elegante
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <CardContent className="p-8">
                  <div className="mb-4 p-3 bg-blue-50 rounded-xl w-fit">{feature.icon}</div>
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

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
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
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para revolucionar seus investimentos?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Junte-se a milhares de investidores que já transformaram sua gestão financeira
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-4 text-lg"
          >
            Comece Sua Jornada Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl">Z</span>
            </div>
            <span className="font-bold text-xl">
              investidor<span className="text-blue-400">Z</span>
            </span>
          </div>
          <div className="text-center text-slate-400">
            <p>&copy; 2024 investidorZ. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
