
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePowerPlants } from '@/hooks/usePowerPlants';
import PerformanceGauge from '@/components/PerformanceGauge';
import { useNavigate } from 'react-router-dom';
import { Zap, Activity, AlertTriangle, Building } from 'lucide-react';

const Dashboard = () => {
  const { plants, alerts } = usePowerPlants();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'alarm' | 'inactive'>('all');

  const filteredPlants = plants.filter(plant => {
    if (statusFilter === 'all') return true;
    return plant.status === statusFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 hover:bg-green-600';
      case 'alarm': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'inactive': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'alarm': return 'Alarme';
      case 'inactive': return 'Inativa';
      default: return status;
    }
  };

  const totalCapacity = plants.reduce((sum, plant) => sum + plant.capacity, 0);
  const totalCurrentPower = plants.reduce((sum, plant) => sum + plant.currentPower, 0);
  const totalPlants = plants.length;
  const plantsInAlarm = plants.filter(p => p.status === 'alarm').length;

  const handlePlantClick = (plantId: string) => {
    navigate(`/plants/${plantId}`);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Monitoramento em tempo real das usinas solares</p>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacidade Total</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity.toLocaleString()} kW</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potência Instantânea Total</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {totalCurrentPower.toLocaleString()} kW
            </div>
            <p className="text-xs text-muted-foreground">
              {((totalCurrentPower / totalCapacity) * 100).toFixed(1)}% da capacidade
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quantidade de Usinas Instaladas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlants}</div>
            <p className="text-xs text-muted-foreground">Total de instalações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">{plantsInAlarm}</div>
            <p className="text-xs text-muted-foreground">{alerts.length} alertas ativos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex gap-2">
        <Button
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('all')}
        >
          Todas ({plants.length})
        </Button>
        <Button
          variant={statusFilter === 'active' ? 'default' : 'outline'}
          className={statusFilter === 'active' ? getStatusColor('active') : ''}
          onClick={() => setStatusFilter('active')}
        >
          Ativas ({plants.filter(p => p.status === 'active').length})
        </Button>
        <Button
          variant={statusFilter === 'alarm' ? 'default' : 'outline'}
          className={statusFilter === 'alarm' ? getStatusColor('alarm') : ''}
          onClick={() => setStatusFilter('alarm')}
        >
          Alarme ({plants.filter(p => p.status === 'alarm').length})
        </Button>
        <Button
          variant={statusFilter === 'inactive' ? 'default' : 'outline'}
          className={statusFilter === 'inactive' ? getStatusColor('inactive') : ''}
          onClick={() => setStatusFilter('inactive')}
        >
          Inativas ({plants.filter(p => p.status === 'inactive').length})
        </Button>
      </div>

      {/* Tabela de usinas */}
      <Card>
        <CardHeader>
          <CardTitle>Usinas Instaladas</CardTitle>
          <CardDescription>Lista completa das usinas em monitoramento</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Capacidade</TableHead>
                <TableHead>Potência Atual</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlants.map((plant) => (
                <TableRow 
                  key={plant.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePlantClick(plant.id);
                  }}
                >
                  <TableCell className="font-medium">{plant.name}</TableCell>
                  <TableCell>{plant.location}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(plant.status)}>
                      {getStatusText(plant.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{plant.capacity} kW</TableCell>
                  <TableCell className="text-green-400">{plant.currentPower} kW</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <PerformanceGauge 
                        value={plant.dailyPerformance} 
                        title="D"
                        size={40}
                      />
                      <PerformanceGauge 
                        value={plant.weeklyPerformance} 
                        title="S"
                        size={40}
                      />
                      <PerformanceGauge 
                        value={plant.monthlyPerformance} 
                        title="M"
                        size={40}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
