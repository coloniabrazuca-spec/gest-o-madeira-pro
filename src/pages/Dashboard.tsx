import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  AlertCircle,
  ShoppingCart
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    palletsProduced: 0,
    sales: 0,
    stockTotal: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch today's production
        const today = new Date().toISOString().split('T')[0];
        const { data: productionData } = await supabase
          .from("pallets_production")
          .select("quantity_produced")
          .gte("production_date", today);

        // Fetch today's sales
        const { data: salesData } = await supabase
          .from("sales")
          .select("total_price")
          .gte("sale_date", today);

        // Fetch stock items
        const { data: stockData } = await supabase
          .from("wood_stock")
          .select("id");

        const palletsProduced = productionData?.reduce(
          (sum, item) => sum + item.quantity_produced,
          0
        ) || 0;

        const salesTotal = salesData?.reduce(
          (sum, item) => sum + Number(item.total_price),
          0
        ) || 0;

        setStats({
          palletsProduced,
          sales: salesTotal,
          stockTotal: stockData?.length || 0,
        });
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }


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
              <div className="text-2xl font-bold text-primary">{stats.palletsProduced}</div>
              <p className="text-xs text-muted-foreground">unidades hoje</p>
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
                R$ {stats.sales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">vendas hoje</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tipos de Madeira
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.stockTotal}</div>
              <p className="text-xs text-muted-foreground">em estoque</p>
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
