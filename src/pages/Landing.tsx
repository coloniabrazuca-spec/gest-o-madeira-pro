import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  TreePine, 
  Package, 
  TrendingUp, 
  BarChart3, 
  Truck, 
  ShoppingCart,
  CheckCircle2,
  MessageCircle
} from "lucide-react";
import heroImage from "@/assets/hero-sawmill.jpg";
import palletsImage from "@/assets/pallets-stack.jpg";
import dashboardImage from "@/assets/dashboard-mockup.jpg";

const Landing = () => {
  const whatsappNumber = "+5515998716029";
  const whatsappMessage = encodeURIComponent("Olá! Vim da plataforma Gestão Serraria e preciso de suporte.");

  return (
    <div className="min-h-screen bg-background">
      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="WhatsApp Suporte"
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      {/* Navigation */}
      <nav className="bg-primary text-primary-foreground sticky top-0 z-40 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TreePine className="h-8 w-8" />
            <span className="text-xl font-bold">Gestão Serraria</span>
          </div>
          <div className="flex gap-3">
            <Link to="/auth">
              <Button variant="secondary" size="sm">
                Entrar
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button variant="secondary" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Serraria com paletes empilhados" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80" />
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-start text-primary-foreground">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 max-w-3xl leading-tight">
            Gestão Serraria
          </h1>
          <p className="text-2xl md:text-3xl mb-8 max-w-2xl">
            Controle completo da sua produção, estoque e vendas
          </p>
          <div className="flex gap-4">
            <Link to="/auth?mode=signup">
              <Button size="lg" variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Começar Agora
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Fazer Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* O que é a plataforma */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Sistema Completo para Sua Serraria
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              A <span className="text-primary font-semibold">Gestão Serraria</span> é uma plataforma profissional 
              desenvolvida especialmente para madereiras e serrarias. Gerencie estoque, produção, vendas, 
              entrada de caminhões e muito mais em um único lugar.
            </p>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Benefícios da Plataforma
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-card-foreground">Aumente a Produtividade</h3>
                <p className="text-muted-foreground">
                  Automatize processos e economize tempo com gestão inteligente de estoque e produção.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-card-foreground">Decisões Baseadas em Dados</h3>
                <p className="text-muted-foreground">
                  Relatórios completos de vendas, lucros e gastos para tomar decisões estratégicas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-card-foreground">Controle Total do Estoque</h3>
                <p className="text-muted-foreground">
                  Notificações automáticas de estoque baixo e rastreamento completo de entradas e saídas.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            Recursos Principais
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img 
                src={palletsImage} 
                alt="Paletes empilhados" 
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-primary rounded-full p-3 h-fit">
                  <Package className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Gestão de Estoque</h3>
                  <p className="text-muted-foreground">
                    Controle completo de madeiras e materiais com alertas automáticos de estoque mínimo.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-accent rounded-full p-3 h-fit">
                  <Truck className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Controle de Caminhões</h3>
                  <p className="text-muted-foreground">
                    Registre entradas e saídas de caminhões com atualização automática do estoque.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-secondary rounded-full p-3 h-fit">
                  <TreePine className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Produção de Paletes</h3>
                  <p className="text-muted-foreground">
                    Acompanhe a produção diária e o consumo de materiais em tempo real.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-primary rounded-full p-3 h-fit">
                  <ShoppingCart className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Sistema de Vendas</h3>
                  <p className="text-muted-foreground">
                    Gerencie vendas com desconto automático do estoque e notificações em tempo real.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Interface Profissional
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Dashboard intuitivo com todas as informações que você precisa em um só lugar
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <img 
              src={dashboardImage} 
              alt="Dashboard da plataforma" 
              className="rounded-lg shadow-2xl border border-border"
            />
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">
            O Que Nossos Clientes Dizem
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <CheckCircle2 key={i} className="h-5 w-5 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "A Gestão Serraria transformou nossa operação. Agora temos controle total do estoque e as vendas aumentaram 40%."
                </p>
                <p className="font-semibold text-foreground">João Silva</p>
                <p className="text-sm text-muted-foreground">Serraria Silva Ltda.</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <CheckCircle2 key={i} className="h-5 w-5 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Sistema perfeito! As notificações de estoque baixo evitaram várias paradas na produção."
                </p>
                <p className="font-semibold text-foreground">Maria Santos</p>
                <p className="text-sm text-muted-foreground">Madeireira Santos & Cia</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <CheckCircle2 key={i} className="h-5 w-5 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Excelente ferramenta! Os relatórios nos ajudam a tomar decisões muito mais assertivas."
                </p>
                <p className="font-semibold text-foreground">Carlos Oliveira</p>
                <p className="text-sm text-muted-foreground">Paletes Premium</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para Transformar Sua Gestão?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Comece agora e tenha controle total da sua serraria em poucos minutos
          </p>
          <Link to="/auth?mode=signup">
            <Button size="lg" variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
              Criar Conta Grátis
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-secondary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TreePine className="h-8 w-8" />
                <span className="text-xl font-bold">Gestão Serraria</span>
              </div>
              <p className="opacity-80">
                Sistema completo de gestão para serrarias e madereiras
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contato</h3>
              <p className="opacity-80 mb-2">WhatsApp: +55 15 99871-6029</p>
              <p className="opacity-80">Email: contato@gestao-serraria.com.br</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Links Rápidos</h3>
              <ul className="space-y-2 opacity-80">
                <li><Link to="/auth" className="hover:underline">Login</Link></li>
                <li><Link to="/auth?mode=signup" className="hover:underline">Criar Conta</Link></li>
                <li><a href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="hover:underline">Suporte</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-secondary-foreground/20 pt-8 text-center opacity-80">
            <p>&copy; 2025 Gestão Serraria. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
