
import React, { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePowerPlants } from '@/hooks/usePowerPlants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Thermometer, Zap, Activity, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
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

  // Dados simulados para os gráficos baseados na imagem
  const generateChartData = (period: string) => {
    const now = new Date();
    const data = [];
    
    switch (period) {
      case 'daily':
        for (let i = 0; i < 24; i++) {
          data.push({
            time: `${i.toString().padStart(2, '0')}:00`,
            power: Math.max(0, Math.sin((i - 6) * Math.PI / 12) * plant.capacity * 0.8 + Math.random() * 100)
          });
        }
        break;
      case 'monthly':
        for (let i = 1; i <= 30; i++) {
          data.push({
            time: i.toString().padStart(2, '0'),
            power: plant.capacity * 0.4 + Math.random() * plant.capacity * 0.4
          });
        }
        break;
      case 'yearly':
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        months.forEach(month => {
          data.push({
            time: month,
            power: plant.capacity * 0.3 + Math.random() * plant.capacity * 0.3
          });
        });
        break;
    }
    
    return data;
  };

  const chartData = generateChartData(chartPeriod);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'offline': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'warning': return 'Aviso';
      case 'offline': return 'Offline';
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
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
            <span className="text-white text-sm">🏭</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{plant.name}</h1>
            <p className="text-muted-foreground">{plant.location}</p>
          </div>
        </div>
      </div>

      {/* Cards principais de dados */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{plant.dailyPerformance}</div>
            <div className="text-xs text-muted-foreground">kWh</div>
            <div className="text-sm">Rendimento hoje</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">0,00</div>
            <div className="text-xs text-muted-foreground">$</div>
            <div className="text-sm">Receita hoje</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{plant.monthlyPerformance}</div>
            <div className="text-xs text-muted-foreground">MWh</div>
            <div className="text-sm">Rendimento total</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{plant.currentPower}</div>
            <div className="text-xs text-muted-foreground">kW</div>
            <div className="text-sm">Potên. nom. do inversor</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">--</div>
            <div className="text-xs text-muted-foreground">kWh</div>
            <div className="text-sm">Fornecimento da rede elétrica hoje</div>
          </CardContent>
        </Card>
      </div>

      {/* Status dos alertas */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm">Sério</span>
            <span className="font-bold">0</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm">Importante</span>
            <span className="font-bold">0</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm">Secundário</span>
            <span className="font-bold">0</span>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm">Advert.</span>
            <span className="font-bold">0</span>
          </div>
        </Card>
      </div>

      {/* Gráfico principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Tendência de energia</CardTitle>
              <div className="flex gap-2">
                <Select value={chartPeriod} onValueChange={setChartPeriod}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Dia</SelectItem>
                    <SelectItem value="monthly">Mês</SelectItem>
                    <SelectItem value="yearly">Ano</SelectItem>
                  </SelectContent>
                </Select>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 border rounded-md bg-background text-sm"
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Rendimento: <span className="font-bold">{plant.dailyPerformance} kWh</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${Math.round(Number(value))} kW`, 'Saída PV']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="power" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={false}
                    name="Saída PV"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendência de receita</CardTitle>
            <div className="flex gap-2">
              <Select defaultValue="monthly">
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mês</SelectItem>
                  <SelectItem value="yearly">Ano</SelectItem>
                </SelectContent>
              </Select>
              <input
                type="month"
                defaultValue="2025-06"
                className="px-3 py-2 border rounded-md bg-background text-sm"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Rendimento total: <span className="font-bold">0,00 $</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Gráfico de receita mensal
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dados técnicos dos inversores */}
      <Card>
        <CardHeader>
          <CardTitle>Dados Técnicos - Inversores</CardTitle>
          <CardDescription>
            {plant.inverters.length} inversores instalados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {plant.inverters.map((inverter) => (
              <Card key={inverter.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {getStatusIcon(inverter.status)}
                      {inverter.id}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Thermometer className="h-4 w-4" />
                        <span>{inverter.temperature}°C</span>
                      </div>
                      <Badge variant={inverter.status === 'online' ? 'default' : 'destructive'}>
                        {getStatusText(inverter.status)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {inverter.strings.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">Strings Conectadas:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {inverter.strings.map((string) => (
                          <Card key={string.id} className="bg-muted/30">
                            <CardContent className="p-4">
                              <div className="font-medium mb-2">{string.id}</div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="flex items-center gap-1">
                                    <Zap className="h-3 w-3" />
                                    Tensão:
                                  </span>
                                  <span className="font-medium">{string.voltage}V</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="flex items-center gap-1">
                                    <Activity className="h-3 w-3" />
                                    Corrente:
                                  </span>
                                  <span className="font-medium">{string.current}A</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Potência:</span>
                                  <span className="font-medium text-green-600">{string.power}W</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
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
