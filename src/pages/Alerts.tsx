
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePowerPlants } from '@/hooks/usePowerPlants';
import { AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Alerts = () => {
  const { alerts: initialAlerts } = usePowerPlants();
  const [alerts, setAlerts] = useState(initialAlerts);

  const resolveAlert = (alertId: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
    toast({
      title: "Alerta resolvido",
      description: "O alerta foi marcado como resolvido e removido da lista.",
    });
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'warning': return <Clock className="h-4 w-4" />;
      case 'info': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertText = (type: string) => {
    switch (type) {
      case 'critical': return 'Crítico';
      case 'warning': return 'Aviso';
      case 'info': return 'Info';
      default: return type;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alertas</h1>
        <p className="text-muted-foreground">
          Monitoramento de alertas das usinas solares ({alerts.length} ativos)
        </p>
      </div>

      {alerts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-green-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum alerta ativo</h3>
            <p className="text-muted-foreground text-center">
              Todas as usinas estão funcionando normalmente.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${getAlertColor(alert.type)}`}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{alert.plantName}</CardTitle>
                      <CardDescription>
                        {formatTimestamp(alert.timestamp)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getAlertColor(alert.type)}>
                      {getAlertText(alert.type)}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveAlert(alert.id)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Resolver
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{alert.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
