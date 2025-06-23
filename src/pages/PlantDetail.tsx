
import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePowerPlants } from '@/hooks/usePowerPlants';
import PowerGauge from '@/components/PowerGauge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Thermometer, Zap, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { plants } = usePowerPlants();
  const [chartPeriod, setChartPeriod] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const plant = plants.find(p => p.id === id);

  if (!plant) {
    return <Navigate to="/dashboard" replace />;
  }

  // Dados simulados para os gráficos
  const generateChartData = (period: string) => {
    const now = new Date();
    const data = [];
    
    switch (period) {
      case 'daily':
        for (let i = 23; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 60 * 60 * 1000);
          data.push({
            time: time.getHours() + ':00',
            power: Math.max(0, Math.sin((time.getHours() - 6) * Math.PI / 12) * plant.capacity * 0.8 + Math.random() * 100)
          });
        }
        break;
      case 'monthly':
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          data.push({
            time: date.getDate() + '/' + (date.getMonth() + 1),
            power: plant.capacity * 0.4 + Math.random() * plant.capacity * 0.4
          });
        }
        break;
      case 'yearly':
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          data.push({
            time: date.toLocaleDateString('pt-BR', { month: 'short' }),
            power: plant.capacity * 0.3 + Math.random() * plant.capacity * 0.3
          });
        }
        break;
      default:
        break;
    }
    
    return data;
  };

  const chartData = generateChartData(chartPeriod);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'alarm': return 'bg-yellow-500';
      case 'inactive': return 'bg-red-500';
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'alarm': return 'Alarme';
      case 'inactive': return 'Inativa';
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'warning': return 'Aviso';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{plant.name}</h1>
          <p className="text-muted-foreground">{plant.location}</p>
        </div>
        <Badge className={getStatusColor(plant.status)}>
          {getStatusText(plant.status)}
        </Badge>
      </div>

      {/* Informações básicas e Power Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações da Usina</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Capacidade Instalada</span>
              <p className="text-lg font-bold">{plant.capacity} kW</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Geração Atual</span>
              <p className="text-lg font-bold text-green-400">{plant.currentPower} kW</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Performance Diária</span>
              <p className="text-lg font-bold">{plant.dailyPerformance}%</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Performance Mensal</span>
              <p className="text-lg font-bold">{plant.monthlyPerformance}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Medidor de Potência</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <PowerGauge 
              currentPower={plant.currentPower}
              maxPower={plant.capacity}
            />
          </CardContent>
        </Card>
      </div>

      {/* Controles do gráfico */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Análise de Geração</CardTitle>
            <div className="flex gap-2">
              <Select value={chartPeriod} onValueChange={setChartPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${Math.round(Number(value))} kW`, 'Potência']}
                />
                <Line 
                  type="monotone" 
                  dataKey="power" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Dados técnicos dos inversores */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Técnicos - Inversores</CardTitle>
          <CardDescription>
            {plant.inverters.length} inversores instalados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {plant.inverters.map((inverter) => (
              <Card key={inverter.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{inverter.id}</CardTitle>
                    <Badge className={getStatusColor(inverter.status)}>
                      {getStatusText(inverter.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    <span className="text-sm">Temperatura: {inverter.temperature}°C</span>
                  </div>
                  
                  {inverter.strings.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Strings:</h4>
                      <div className="space-y-2">
                        {inverter.strings.map((string) => (
                          <div key={string.id} className="bg-muted/50 p-3 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">{string.id}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Zap className="h-3 w-3" />
                                <span>{string.voltage}V</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                <span>{string.current}A</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{string.power}W</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantDetail;
