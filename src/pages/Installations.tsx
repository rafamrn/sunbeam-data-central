
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePowerPlants } from '@/hooks/usePowerPlants';
import { MapPin, Phone, Mail, Zap } from 'lucide-react';

const Installations = () => {
  const { plants } = usePowerPlants();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Instalações</h1>
        <p className="text-muted-foreground">Informações detalhadas das usinas e proprietários</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {plants.map((plant) => (
          <Card key={plant.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{plant.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {plant.location}
                  </CardDescription>
                </div>
                <Badge className={
                  plant.status === 'active' ? 'bg-green-500' :
                  plant.status === 'alarm' ? 'bg-yellow-500' : 'bg-red-500'
                }>
                  {plant.status === 'active' ? 'Ativa' :
                   plant.status === 'alarm' ? 'Alarme' : 'Inativa'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Informações da Usina */}
              <div>
                <h4 className="font-medium mb-2">Dados da Usina</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Capacidade:</span>
                    <p className="font-mono">{plant.capacity} kW</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Geração Atual:</span>
                    <p className="font-mono text-green-400">{plant.currentPower} kW</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Geração Mensal Estimada:</span>
                    <p className="font-mono flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {plant.monthlyGeneration.toLocaleString()} kWh/mês
                    </p>
                  </div>
                </div>
              </div>

              {/* Informações do Proprietário */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Proprietário</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nome:</span>
                    <p className="font-medium">{plant.owner.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono">{plant.owner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono">{plant.owner.email}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
                    <span className="text-xs">{plant.owner.address}</span>
                  </div>
                </div>
              </div>

              {/* Inversores */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Inversores</h4>
                <div className="text-sm">
                  <span className="text-muted-foreground">Quantidade instalada:</span>
                  <p className="font-medium">{plant.inverters.length} inversores</p>
                  {plant.inverters.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {plant.inverters.map((inverter) => (
                        <div key={inverter.id} className="flex justify-between items-center">
                          <span className="font-mono text-xs">{inverter.id}</span>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              inverter.status === 'online' ? 'border-green-500 text-green-400' :
                              inverter.status === 'warning' ? 'border-yellow-500 text-yellow-400' :
                              'border-red-500 text-red-400'
                            }`}
                          >
                            {inverter.status === 'online' ? 'Online' :
                             inverter.status === 'warning' ? 'Aviso' : 'Offline'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Installations;
