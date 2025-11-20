import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface WoodStock {
  id: string;
  wood_type: string;
  current_quantity: number;
  minimum_quantity: number;
  unit: string;
  supplier: string | null;
}

const Estoque = () => {
  const [stocks, setStocks] = useState<WoodStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    wood_type: "",
    current_quantity: "",
    minimum_quantity: "",
    supplier: "",
  });

  const fetchStocks = async () => {
    try {
      const { data, error } = await supabase
        .from("wood_stock")
        .select("*")
        .order("wood_type");

      if (error) throw error;
      setStocks(data || []);
    } catch (error) {
      toast.error("Erro ao carregar estoque");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase.from("wood_stock").insert({
        wood_type: formData.wood_type,
        current_quantity: parseFloat(formData.current_quantity),
        minimum_quantity: parseFloat(formData.minimum_quantity),
        supplier: formData.supplier || null,
        user_id: user.id,
      });

      if (error) throw error;

      toast.success("Item adicionado ao estoque!");
      setDialogOpen(false);
      setFormData({ wood_type: "", current_quantity: "", minimum_quantity: "", supplier: "" });
      fetchStocks();
    } catch (error) {
      toast.error("Erro ao adicionar item");
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p>Carregando...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Controle de Estoque</h1>
            <p className="text-muted-foreground">Gerencie o estoque de madeira</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Item ao Estoque</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="wood_type">Tipo de Madeira</Label>
                  <Input
                    id="wood_type"
                    value={formData.wood_type}
                    onChange={(e) => setFormData({ ...formData, wood_type: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="current_quantity">Quantidade Atual (m³)</Label>
                  <Input
                    id="current_quantity"
                    type="number"
                    step="0.01"
                    value={formData.current_quantity}
                    onChange={(e) => setFormData({ ...formData, current_quantity: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="minimum_quantity">Quantidade Mínima (m³)</Label>
                  <Input
                    id="minimum_quantity"
                    type="number"
                    step="0.01"
                    value={formData.minimum_quantity}
                    onChange={(e) => setFormData({ ...formData, minimum_quantity: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="supplier">Fornecedor</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">Adicionar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stocks.map((stock) => {
            const isLowStock = stock.current_quantity <= stock.minimum_quantity;
            
            return (
              <Card key={stock.id} className={isLowStock ? "border-destructive" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {stock.wood_type}
                    {isLowStock && <AlertCircle className="h-5 w-5 text-destructive" />}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Quantidade Atual</p>
                      <p className="text-2xl font-bold text-primary">
                        {stock.current_quantity} {stock.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Quantidade Mínima</p>
                      <p className="text-sm">{stock.minimum_quantity} {stock.unit}</p>
                    </div>
                    {stock.supplier && (
                      <div>
                        <p className="text-sm text-muted-foreground">Fornecedor</p>
                        <p className="text-sm">{stock.supplier}</p>
                      </div>
                    )}
                    {isLowStock && (
                      <div className="mt-3 p-2 bg-destructive/10 rounded text-destructive text-sm">
                        ⚠️ Estoque baixo! Reabastecer
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {stocks.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Nenhum item no estoque. Adicione o primeiro item!
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Estoque;
