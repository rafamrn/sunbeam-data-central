
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { usePowerPlants } from '@/hooks/usePowerPlants';
import { MapPin, Phone, Mail, Zap, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Installations = () => {
  const { plants } = usePowerPlants();
  const [editingPlant, setEditingPlant] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (plant: any) => {
    setEditingPlant({ ...plant });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    // Aqui você salvaria os dados - por enquanto apenas mostra toast
    toast({
      title: "Dados atualizados",
      description: "As informações da instalação foram salvas com sucesso.",
    });
    setIsDialogOpen(false);
    setEditingPlant(null);
  };

  const updateField = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditingPlant((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditingPlant((prev: any) => ({
        ...prev,
        [field]: value
      }));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Instalações</h1>
        <p className="text-muted-foreground">Gerenciar informações das usinas e proprietários</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Instalações</CardTitle>
          <CardDescription>Clique em "Editar" para alterar os dados de cada instalação</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usina</TableHead>
                <TableHead>Proprietário</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Geração Estimada</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plants.map((plant) => (
                <TableRow key={plant.id}>
                  <TableCell className="font-medium">{plant.name}</TableCell>
                  <TableCell>{plant.owner.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {plant.owner.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {plant.owner.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-1">
                      <MapPin className="h-3 w-3 mt-0.5" />
                      <span className="text-xs">{plant.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>{plant.capacity} kW</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {plant.monthlyGeneration.toLocaleString()} kWh/mês
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      plant.status === 'active' ? 'bg-green-500' :
                      plant.status === 'alarm' ? 'bg-yellow-500' : 'bg-red-500'
                    }>
                      {plant.status === 'active' ? 'Ativa' :
                       plant.status === 'alarm' ? 'Alarme' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(plant)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de edição */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Instalação</DialogTitle>
            <DialogDescription>
              Altere as informações da usina e do proprietário
            </DialogDescription>
          </DialogHeader>
          
          {editingPlant && (
            <div className="grid gap-4 py-4">
              <div className="space-y-4">
                <h4 className="font-medium">Dados da Usina</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome da Usina</Label>
                    <Input
                      id="name"
                      value={editingPlant.name}
                      onChange={(e) => updateField('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Localização</Label>
                    <Input
                      id="location"
                      value={editingPlant.location}
                      onChange={(e) => updateField('location', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Capacidade (kW)</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={editingPlant.capacity}
                      onChange={(e) => updateField('capacity', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthlyGeneration">Geração Mensal Estimada (kWh)</Label>
                    <Input
                      id="monthlyGeneration"
                      type="number"
                      value={editingPlant.monthlyGeneration}
                      onChange={(e) => updateField('monthlyGeneration', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Dados do Proprietário</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ownerName">Nome</Label>
                    <Input
                      id="ownerName"
                      value={editingPlant.owner.name}
                      onChange={(e) => updateField('owner.name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={editingPlant.owner.phone}
                      onChange={(e) => updateField('owner.phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editingPlant.owner.email}
                      onChange={(e) => updateField('owner.email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={editingPlant.owner.address}
                      onChange={(e) => updateField('owner.address', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Installations;
