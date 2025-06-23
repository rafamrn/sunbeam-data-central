
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Settings, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected' | 'error';
  logo: string;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    required: boolean;
  }>;
}

const Integrations = () => {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [isConnecting, setIsConnecting] = useState(false);

  const integrations: Integration[] = [
    {
      id: 'sungrow',
      name: 'Sungrow',
      description: 'Portal de monitoramento Sungrow iSolarCloud',
      status: 'disconnected',
      logo: '🔆',
      fields: [
        { name: 'username', label: 'Usuário', type: 'text', required: true },
        { name: 'password', label: 'Senha', type: 'password', required: true },
        { name: 'appkey', label: 'App Key', type: 'text', required: true },
      ]
    },
    {
      id: 'huawei',
      name: 'Huawei FusionSolar',
      description: 'Portal de monitoramento Huawei FusionSolar',
      status: 'connected',
      logo: '🔋',
      fields: [
        { name: 'username', label: 'Usuário', type: 'text', required: true },
        { name: 'password', label: 'Senha', type: 'password', required: true },
        { name: 'systemCode', label: 'System Code', type: 'text', required: true },
      ]
    },
    {
      id: 'deye',
      name: 'Deye Cloud',
      description: 'Portal de monitoramento Deye Solar',
      status: 'error',
      logo: '☀️',
      fields: [
        { name: 'username', label: 'Usuário', type: 'text', required: true },
        { name: 'password', label: 'Senha', type: 'password', required: true },
      ]
    },
    {
      id: 'apsystems',
      name: 'APsystems',
      description: 'Portal de monitoramento APsystems',
      status: 'disconnected',
      logo: '⚡',
      fields: [
        { name: 'username', label: 'Usuário', type: 'text', required: true },
        { name: 'password', label: 'Senha', type: 'password', required: true },
      ]
    },
    {
      id: 'phb',
      name: 'PHB Solar',
      description: 'Portal de monitoramento PHB',
      status: 'disconnected',
      logo: '🌞',
      fields: [
        { name: 'apikey', label: 'API Key', type: 'text', required: true },
        { name: 'secret', label: 'Secret Key', type: 'password', required: true },
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'disconnected': return <Settings className="h-4 w-4 text-muted-foreground" />;
      default: return <Settings className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'disconnected': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Conectado';
      case 'error': return 'Erro';
      case 'disconnected': return 'Desconectado';
      default: return status;
    }
  };

  const handleConnect = async (integrationId: string) => {
    setIsConnecting(true);
    
    // Simular conexão
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Integração conectada",
      description: "A conexão foi estabelecida com sucesso.",
    });
    
    setIsConnecting(false);
    setSelectedIntegration(null);
    setCredentials({});
  };

  const handleDisconnect = (integrationId: string) => {
    toast({
      title: "Integração desconectada",
      description: "A conexão foi removida.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrações</h1>
        <p className="text-muted-foreground">
          Conecte-se aos portais de monitoramento dos fabricantes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{integration.logo}</div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(integration.status)}
                  <Badge className={getStatusColor(integration.status)}>
                    {getStatusText(integration.status)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedIntegration === integration.id ? (
                <div className="space-y-4">
                  <h4 className="font-medium">Configurar Conexão</h4>
                  {integration.fields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label htmlFor={field.name}>
                        {field.label}
                        {field.required && <span className="text-red-400">*</span>}
                      </Label>
                      <Input
                        id={field.name}
                        type={field.type}
                        value={credentials[field.name] || ''}
                        onChange={(e) => setCredentials({
                          ...credentials,
                          [field.name]: e.target.value
                        })}
                        placeholder={`Digite ${field.label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => handleConnect(integration.id)}
                      disabled={isConnecting}
                      className="flex-1"
                    >
                      {isConnecting ? (
                        <>
                          <Loader className="h-4 w-4 mr-2 animate-spin" />
                          Conectando...
                        </>
                      ) : (
                        'Conectar'
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedIntegration(null);
                        setCredentials({});
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  {integration.status === 'connected' ? (
                    <Button
                      variant="outline"
                      onClick={() => handleDisconnect(integration.id)}
                      className="flex-1"
                    >
                      Desconectar
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setSelectedIntegration(integration.id)}
                      className="flex-1"
                    >
                      Configurar
                    </Button>
                  )}
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Status da sincronização */}
      <Card>
        <CardHeader>
          <CardTitle>Status da Sincronização</CardTitle>
          <CardDescription>
            Configurações de sincronização automática de dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Sincronização Automática</h4>
              <p className="text-sm text-muted-foreground">
                Sincronizar dados a cada 15 minutos
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Alertas de Falha</h4>
              <p className="text-sm text-muted-foreground">
                Notificar quando a sincronização falhar
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Log Detalhado</h4>
              <p className="text-sm text-muted-foreground">
                Manter log detalhado das sincronizações
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Integrations;
