import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Sale {
  id: string;
  sale_date: string;
  customer_name: string;
  pallet_size: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  payment_method: string;
  notes: string | null;
}

const Vendas = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    customer_name: "",
    pallet_size: "",
    quantity: "",
    unit_price: "",
    payment_method: "dinheiro",
    notes: "",
  });

  const fetchSales = async () => {
    try {
      const { data, error } = await supabase
        .from("sales")
        .select("*")
        .order("sale_date", { ascending: false });

      if (error) throw error;
      setSales(data || []);
    } catch (error) {
      toast.error("Erro ao carregar vendas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const quantity = parseInt(formData.quantity);
    const unitPrice = parseFloat(formData.unit_price);
    const totalPrice = quantity * unitPrice;

    try {
      const { error } = await supabase.from("sales").insert({
        customer_name: formData.customer_name,
        pallet_size: formData.pallet_size,
        quantity,
        unit_price: unitPrice,
        total_price: totalPrice,
        payment_method: formData.payment_method,
        notes: formData.notes || null,
        user_id: user.id,
      });

      if (error) throw error;

      toast.success("Venda registrada!");
      setDialogOpen(false);
      setFormData({ customer_name: "", pallet_size: "", quantity: "", unit_price: "", payment_method: "dinheiro", notes: "" });
      fetchSales();
    } catch (error) {
      toast.error("Erro ao registrar venda");
    }
  };

  const totalSales = sales.reduce((sum, sale) => sum + Number(sale.total_price), 0);

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
            <h1 className="text-3xl font-bold text-foreground">Vendas</h1>
            <p className="text-muted-foreground">Gerencie as vendas de paletes</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Registrar Venda
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Venda</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="customer_name">Cliente</Label>
                  <Input
                    id="customer_name"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    required
                  />
                </div>
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
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit_price">Preço Unitário (R$)</Label>
                  <Input
                    id="unit_price"
                    type="number"
                    step="0.01"
                    value={formData.unit_price}
                    onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="payment_method">Forma de Pagamento</Label>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dinheiro">Dinheiro</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="cartao">Cartão</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                      <SelectItem value="prazo">A Prazo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                {formData.quantity && formData.unit_price && (
                  <div className="p-3 bg-primary/10 rounded">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-primary">
                      R$ {(parseInt(formData.quantity || "0") * parseFloat(formData.unit_price || "0")).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
                <Button type="submit" className="w-full">Registrar Venda</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Total de Vendas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              R$ {totalSales.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-muted-foreground">{sales.length} vendas registradas</p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {sales.map((sale) => (
            <Card key={sale.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{sale.customer_name}</span>
                  <span className="text-lg font-bold text-accent">
                    R$ {Number(sale.total_price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">{new Date(sale.sale_date).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Palete</p>
                    <p className="font-medium">{sale.pallet_size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantidade</p>
                    <p className="font-medium">{sale.quantity} unidades</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pagamento</p>
                    <p className="font-medium capitalize">{sale.payment_method}</p>
                  </div>
                  {sale.notes && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Observações</p>
                      <p className="font-medium">{sale.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sales.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Nenhuma venda registrada
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Vendas;
