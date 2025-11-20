import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Truck {
  id: string;
  license_plate: string;
  driver_name: string;
  supplier: string;
  wood_type: string;
  quantity: number;
  unit: string;
  status: string;
  entry_date: string;
  exit_date: string | null;
}

const Caminhoes = () => {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [filteredTrucks, setFilteredTrucks] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [formData, setFormData] = useState({
    license_plate: "",
    driver_name: "",
    supplier: "",
    wood_type: "",
    quantity: "",
  });

  const fetchTrucks = async () => {
    try {
      const { data, error } = await supabase
        .from("trucks")
        .select("*")
        .order("entry_date", { ascending: false });

      if (error) throw error;
      setTrucks(data || []);
      setFilteredTrucks(data || []);
    } catch (error) {
      toast.error("Erro ao carregar caminhões");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrucks();
  }, []);

  useEffect(() => {
    const filtered = trucks.filter(
      (truck) =>
        truck.license_plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        truck.driver_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        truck.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTrucks(filtered);
  }, [searchTerm, trucks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase.from("trucks").insert({
        license_plate: formData.license_plate.toUpperCase(),
        driver_name: formData.driver_name,
        supplier: formData.supplier,
        wood_type: formData.wood_type,
        quantity: parseFloat(formData.quantity),
        user_id: user.id,
      });

      if (error) throw error;

      toast.success("Caminhão registrado!");
      setDialogOpen(false);
      setFormData({ license_plate: "", driver_name: "", supplier: "", wood_type: "", quantity: "" });
      fetchTrucks();
    } catch (error) {
      toast.error("Erro ao registrar caminhão");
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
            <h1 className="text-3xl font-bold text-foreground">Controle de Caminhões</h1>
            <p className="text-muted-foreground">Registre entrada e saída de caminhões</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Registrar Entrada
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Entrada de Caminhão</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="license_plate">Placa</Label>
                  <Input
                    id="license_plate"
                    value={formData.license_plate}
                    onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
                    placeholder="ABC-1234"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="driver_name">Motorista</Label>
                  <Input
                    id="driver_name"
                    value={formData.driver_name}
                    onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="supplier">Fornecedor</Label>
                  <Input
                    id="supplier"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
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
                  <Label htmlFor="quantity">Quantidade (m³)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">Registrar</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por placa, motorista ou fornecedor..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filteredTrucks.map((truck) => (
            <Card key={truck.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{truck.license_plate}</span>
                  <Badge variant={truck.status === "entrada" ? "default" : "secondary"}>
                    {truck.status === "entrada" ? "Na serraria" : "Saiu"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Motorista</p>
                    <p className="font-medium">{truck.driver_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fornecedor</p>
                    <p className="font-medium">{truck.supplier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Madeira</p>
                    <p className="font-medium">{truck.wood_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantidade</p>
                    <p className="font-medium">{truck.quantity} {truck.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Entrada</p>
                    <p className="font-medium">
                      {new Date(truck.entry_date).toLocaleString("pt-BR")}
                    </p>
                  </div>
                  {truck.exit_date && (
                    <div>
                      <p className="text-sm text-muted-foreground">Saída</p>
                      <p className="font-medium">
                        {new Date(truck.exit_date).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTrucks.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              {searchTerm ? "Nenhum caminhão encontrado" : "Nenhum caminhão registrado"}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Caminhoes;
