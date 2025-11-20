import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Production {
  id: string;
  production_date: string;
  pallet_size: string;
  quantity_produced: number;
  wood_type: string;
  wood_consumed: number;
  notes: string | null;
}

const Producao = () => {
  const [productions, setProductions] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    pallet_size: "",
    quantity_produced: "",
    wood_type: "",
    wood_consumed: "",
    notes: "",
  });

  const fetchProductions = async () => {
    try {
      const { data, error } = await supabase
        .from("pallets_production")
        .select("*")
        .order("production_date", { ascending: false });

      if (error) throw error;
      setProductions(data || []);
    } catch (error) {
      toast.error("Erro ao carregar produção");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase.from("pallets_production").insert({
        pallet_size: formData.pallet_size,
        quantity_produced: parseInt(formData.quantity_produced),
        wood_type: formData.wood_type,
        wood_consumed: parseFloat(formData.wood_consumed),
        notes: formData.notes || null,
        user_id: user.id,
      });

      if (error) throw error;

      toast.success("Produção registrada!");
      setDialogOpen(false);
      setFormData({ pallet_size: "", quantity_produced: "", wood_type: "", wood_consumed: "", notes: "" });
      fetchProductions();
    } catch (error) {
      toast.error("Erro ao registrar produção");
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
            <h1 className="text-3xl font-bold text-foreground">Produção de Paletes</h1>
            <p className="text-muted-foreground">Registre a produção diária</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Registrar Produção
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Produção</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="pallet_size">Tamanho do Palete</Label>
                  <Input
                    id="pallet_size"
                    value={formData.pallet_size}
                    onChange={(e) => setFormData({ ...formData, pallet_size: e.target.value })}
                    placeholder="Ex: 120x100"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quantity_produced">Quantidade Produzida</Label>
                  <Input
                    id="quantity_produced"
                    type="number"
                    value={formData.quantity_produced}
                    onChange={(e) => setFormData({ ...formData, quantity_produced: e.target.value })}
                    required
                  />
                </div>
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
                  <Label htmlFor="wood_consumed">Madeira Consumida (m³)</Label>
                  <Input
                    id="wood_consumed"
                    type="number"
                    step="0.01"
                    value={formData.wood_consumed}
                    onChange={(e) => setFormData({ ...formData, wood_consumed: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">Registrar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {productions.map((production) => (
            <Card key={production.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Paletes {production.pallet_size}</span>
                  <span className="text-lg font-normal text-muted-foreground">
                    {new Date(production.production_date).toLocaleDateString("pt-BR")}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Quantidade</p>
                    <p className="text-2xl font-bold text-primary">{production.quantity_produced}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipo de Madeira</p>
                    <p className="font-medium">{production.wood_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Madeira Consumida</p>
                    <p className="font-medium">{production.wood_consumed} m³</p>
                  </div>
                  {production.notes && (
                    <div className="col-span-2 md:col-span-1">
                      <p className="text-sm text-muted-foreground">Observações</p>
                      <p className="font-medium">{production.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {productions.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Nenhuma produção registrada
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Producao;
