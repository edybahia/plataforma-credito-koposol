
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { KoposolLogo } from '@/components/KoposolLogo';
import { ArrowRight, CheckCircle, TrendingUp, Users, Shield, Star, Quote, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8 text-primary" />,
      title: "Aumente suas vendas",
      description: "Acesso exclusivo a produtos de crédito com as melhores condições do mercado. Diversifique seu portfólio e maximize seus resultados com soluções que realmente vendem.",
      highlight: "Até 85% de aprovação"
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Suporte especializado",
      description: "Equipe dedicada de especialistas em crédito para apoiar você em cada etapa do processo. Treinamentos, materiais de apoio e suporte técnico completo.",
      highlight: "Suporte 24/7"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Processo seguro e ágil",
      description: "Plataforma robusta com análise automatizada e criteriosa. Processo 100% digital com aprovação em tempo real e máxima segurança para você e seus clientes.",
      highlight: "Aprovação em minutos"
    }
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Integrador há 2 anos",
      company: "Silva Consultoria",
      content: "A Koposol transformou meu negócio. Em 6 meses, tripliquei minha receita com as comissões. O suporte é excepcional e a plataforma é muito intuitiva.",
      rating: 5,
      revenue: "R$ 45k/mês"
    },
    {
      name: "Ana Rodrigues",
      role: "Integradora há 1 ano",
      company: "AR Soluções Financeiras",
      content: "Melhor decisão que tomei foi me tornar parceira da Koposol. Os produtos são excelentes e a taxa de aprovação é impressionante. Recomendo para todos!",
      rating: 5,
      revenue: "R$ 32k/mês"
    },
    {
      name: "Roberto Santos",
      role: "Integrador há 3 anos",
      company: "Santos & Associados",
      content: "Trabalho com várias empresas, mas a Koposol se destaca pela qualidade do atendimento e agilidade nos processos. Meus clientes sempre ficam satisfeitos.",
      rating: 5,
      revenue: "R$ 58k/mês"
    }
  ];

  const benefits = [
    "Processo 100% digital",
    "Suporte completo durante todo o processo",
    "Comissões atrativas",
    "Sistema de gestão integrado"
  ];

  const faqs = [
    {
      question: "Como funciona o sistema de comissões?",
      answer: "Você recebe comissões atrativas por cada proposta aprovada. Os valores variam de acordo com o produto e valor do crédito, com pagamentos realizados mensalmente via PIX ou transferência bancária."
    },
    {
      question: "Preciso ter experiência no mercado de crédito?",
      answer: "Não é necessário ter experiência prévia. Oferecemos treinamento completo, materiais de apoio e suporte contínuo para que você possa começar a vender com confiança desde o primeiro dia."
    },
    {
      question: "Qual o investimento inicial para ser parceiro?",
      answer: "Não há nenhum investimento inicial. O cadastro é 100% gratuito e você só precisa dos seus documentos pessoais e empresariais para começar a trabalhar conosco."
    },
    {
      question: "Como é o suporte técnico e comercial?",
      answer: "Oferecemos suporte 24/7 através de WhatsApp, e-mail e telefone. Nossa equipe de especialistas está sempre disponível para tirar dúvidas sobre produtos, processos e estratégias de venda."
    },
    {
      question: "Quanto tempo leva para aprovar uma proposta?",
      answer: "Nossa plataforma oferece análise em tempo real. A maioria das propostas são aprovadas em poucos minutos, e casos mais complexos podem levar até 24 horas para análise completa."
    },
    {
      question: "Posso trabalhar com outros parceiros simultaneamente?",
      answer: "Sim, você tem total liberdade para trabalhar com quantos parceiros desejar. Não temos exclusividade, pois acreditamos que a diversificação fortalece seu negócio."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <KoposolLogo size="md" />
            <Button
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              Fazer Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Seja bem-vindo, <br />
                  <span className="koposol-text-gradient">Parceiro Koposol!</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Aqui suas vendas estão na prioridade para serem realizadas.
                  Junte-se aos nossos parceiros e potencialize seus resultados
                  com soluções de crédito inovadoras.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button
                size="lg"
                className="bg-primary text-white hover:bg-primary/90 text-xl px-8 py-6 h-auto font-semibold"
                onClick={() => navigate('/register')}
              >
                Quero ser parceiro
              </Button>
            </div>

            {/* Right side - Image */}
            <div className="animate-slide-in-right">
              <div className="relative">
                <div className="absolute inset-0 koposol-gradient rounded-3xl transform rotate-6"></div>
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  alt="Equipe trabalhando em escritório moderno"
                  className="relative z-10 rounded-3xl shadow-2xl w-full h-[500px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-primary/70 via-primary/60 to-purple-400 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <span className="text-primary font-semibold text-sm uppercase tracking-wide">Vantagens Exclusivas</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Por que escolher a Koposol?
            </h2>
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Oferecemos as melhores condições do mercado e ferramentas exclusivas para que você 
              alcance resultados extraordinários em suas vendas de crédito.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="group border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 bg-white/95 backdrop-blur-sm hover:bg-white relative overflow-hidden">
                <CardContent className="p-10 text-center relative">
                  {/* Highlight badge */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-4 py-2 rounded-full font-bold shadow-lg transform rotate-12 group-hover:rotate-6 transition-transform duration-300">
                    {feature.highlight}
                  </div>
                  
                  {/* Icon container */}
                  <div className="relative mb-8">
                    <div className="w-28 h-28 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-2xl flex items-center justify-center mx-auto shadow-xl border border-primary/20 group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-primary/10 rounded-xl flex items-center justify-center">
                        {feature.icon}
                      </div>
                    </div>
                    {/* Decorative ring */}
                    <div className="absolute inset-0 w-28 h-28 mx-auto rounded-2xl border-2 border-primary/20 group-hover:border-primary/40 transition-colors duration-300"></div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {feature.description}
                  </p>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-primary/20 group-hover:from-primary to-primary/60 transition-all duration-300"></div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats section */}
          <div className="grid md:grid-cols-4 gap-8 bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">500+</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Parceiros Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">85%</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Taxa de Aprovação</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">R$ 50M+</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Volume Processado</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">24/7</div>
              <div className="text-white/80 text-sm uppercase tracking-wide">Suporte Disponível</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-gradient-to-br from-primary/40 via-primary/25 to-purple-300 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-white rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <span className="text-primary font-semibold text-sm uppercase tracking-wide">Processo Simples</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">
              Como funciona na prática?
            </h2>
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              Em apenas 4 passos simples você se torna um parceiro Koposol e começa a gerar receita
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative mb-16">
            {/* Connection lines */}
            <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-white/20 via-white/40 to-white/20 z-0"></div>
            
            {[
              {
                step: "01",
                title: "Cadastre-se",
                description: "Preencha o formulário com seus dados e documentos necessários",
                icon: "📝"
              },
              {
                step: "02", 
                title: "Aprovação",
                description: "Nossa equipe analisa e aprova seu cadastro em até 24 horas",
                icon: "✅"
              },
              {
                step: "03",
                title: "Treinamento",
                description: "Receba acesso à plataforma e materiais de treinamento completos",
                icon: "🎓"
              },
              {
                step: "04",
                title: "Comece a vender",
                description: "Inicie suas vendas e receba comissões atrativas por cada aprovação",
                icon: "💰"
              }
            ].map((item, index) => (
              <div key={index} className="relative z-10">
                <div className="group bg-white/95 backdrop-blur-sm hover:bg-white rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-white/20 text-center relative overflow-hidden">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-lg shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                    {item.step}
                  </div>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                  
                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 to-primary/20 group-hover:from-primary to-primary/60 transition-all duration-300"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-6 h-auto font-semibold shadow-xl"
              onClick={() => navigate('/register')}
            >
              Começar agora mesmo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-20 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-32 h-32 bg-purple-400 rounded-full blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block bg-primary/10 rounded-full px-6 py-2 mb-6">
              <span className="text-primary font-semibold text-sm uppercase tracking-wide">Histórias de Sucesso</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              O que nossos integradores dizem
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Conheça as histórias reais de parceiros que transformaram seus negócios com a Koposol
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="group border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-white relative overflow-hidden">
                <CardContent className="p-8 relative">
                  {/* Background gradient */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-primary"></div>
                  
                  {/* Quote icon */}
                  <div className="flex items-center justify-between mb-6">
                    <Quote className="h-10 w-10 text-primary/30" />
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  {/* Testimonial content */}
                  <blockquote className="text-gray-700 mb-8 leading-relaxed text-lg italic font-medium">
                    "{testimonial.content}"
                  </blockquote>
                  
                  {/* Revenue highlight */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 font-medium">Receita Média Mensal</span>
                      <span className="text-2xl font-bold text-green-600">{testimonial.revenue}</span>
                    </div>
                  </div>
                  
                  {/* Author info */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                      <p className="text-sm text-primary font-semibold">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to action */}
          <div className="text-center mt-16">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Pronto para ser o próximo caso de sucesso?
              </h3>
              <p className="text-gray-600 mb-6">
                Junte-se a mais de 500 integradores que já transformaram seus negócios
              </p>
              <Button
                size="lg"
                className="bg-primary text-white hover:bg-primary/90 text-lg px-8 py-6 h-auto font-semibold"
                onClick={() => navigate('/register')}
              >
                Quero começar agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block bg-primary/10 rounded-full px-6 py-2 mb-6">
              <span className="text-primary font-semibold text-sm uppercase tracking-wide">Dúvidas Frequentes</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Esclarecemos as principais dúvidas sobre nossa parceria
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <button
                    className="w-full px-8 py-6 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex-shrink-0">
                      {openFaq === index ? (
                        <Minus className="h-5 w-5 text-primary" />
                      ) : (
                        <Plus className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </button>
                  {openFaq === index && (
                    <div className="px-8 pb-6 bg-gray-50">
                      <p className="text-gray-700 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-primary/5 to-purple-50 rounded-2xl p-8 border border-primary/10">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Ainda tem dúvidas?
                </h3>
                <p className="text-gray-600 mb-6">
                  Nossa equipe está pronta para esclarecer qualquer questão sobre nossa parceria
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Falar no WhatsApp
                  </Button>
                  <Button
                    className="bg-primary text-white hover:bg-primary/90"
                    onClick={() => navigate('/register')}
                  >
                    Quero me cadastrar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 koposol-gradient">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Pronto para começar sua jornada como parceiro?
            </h2>
            <p className="text-xl text-purple-100">
              Junte-se a centenas de parceiros que já confiam na Koposol
              para impulsionar seus negócios.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-purple-700 hover:bg-gray-100 text-lg px-8 py-6 h-auto"
              onClick={() => navigate('/register')}
            >
              Iniciar cadastro agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <KoposolLogo className="brightness-0 invert" />
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">
                © 2024 Koposol. Todos os direitos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
