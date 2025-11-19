import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  ShoppingCart
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setLoading(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  // Mock data - will be replaced with real data from database
  const todayStats = {
    palletsProduced: 45,
    sales: 12800,
    profit: 8400,
    expenses: 4400,
    stockTotal: 156,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral da sua operação</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Paletes Produzidos Hoje
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{todayStats.palletsProduced}</div>
              <p className="text-xs text-muted-foreground">unidades</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Vendas do Dia
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                R$ {todayStats.sales.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">em vendas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lucro do Dia
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                R$ {todayStats.profit.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">+65% margem</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Gastos do Dia
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                R$ {todayStats.expenses.toLocaleString('pt-BR')}
              </div>
              <p className="text-xs text-muted-foreground">em despesas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total em Estoque
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{todayStats.stockTotal}</div>
              <p className="text-xs text-muted-foreground">itens</p>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Alertas de Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Estoque baixo: Madeira Pinus</p>
                    <p className="text-xs text-muted-foreground">Apenas 15 m³ restantes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-destructive/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Estoque baixo: Pregos</p>
                    <p className="text-xs text-muted-foreground">Apenas 3 kg restantes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-accent" />
                Últimas Vendas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-accent mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Construtora ABC</p>
                    <p className="text-xs text-muted-foreground">50 paletes 120x100 - R$ 5.000,00</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-accent mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">Transportadora XYZ</p>
                    <p className="text-xs text-muted-foreground">30 paletes 100x80 - R$ 2.800,00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
