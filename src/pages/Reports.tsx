
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePowerPlants } from '@/hooks/usePowerPlants';
import { FileText, Download, MessageCircle, Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Reports = () => {
  const { plants } = usePowerPlants();

  const generateReport = (plantId: string) => {
    toast({
      title: "Relatório gerado",
      description: "O relatório PDF está sendo preparado para download.",
    });
  };

  const sendWhatsApp = (plantId: string) => {
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
      const message = `Relatório de Performance - ${plant.name}\n\nOlá ${plant.owner.name}, seu relatório está disponível!`;
      const phone = plant.owner.phone.replace(/\D/g, '');
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
    }
  };

  const sendEmail = (plantId: string) => {
    const plant = plants.find(p => p.id === plantId);
    if (plant) {
      const subject = `Relatório de Performance - ${plant.name}`;
      const body = `Olá ${plant.owner.name},\n\nSeu relatório de performance está em anexo.\n\nAtenciosamente,\nEquipe de Monitoramento`;
      window.open(`mailto:${plant.owner.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };

  const exportAllReports = () => {
    toast({
      title: "Exportando todos os relatórios",
      description: "Preparando relatórios de todas as usinas...",
    });
  };

  const sendAllWhatsApp = () => {
    toast({
      title: "Enviando relatórios",
      description: "Enviando relatórios via WhatsApp para todos os clientes...",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Gere e envie relatórios de performance das usinas</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportAllReports} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Exportar Todos
          </Button>
          <Button onClick={sendAllWhatsApp} className="bg-green-600 hover:bg-green-700">
            <MessageCircle className="h-4 w-4 mr-2" />
            Enviar Todos WhatsApp
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plants.map((plant) => (
          <Card key={plant.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {plant.name}
              </CardTitle>
              <CardDescription>{plant.owner.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Performance Mensal:</span>
                  <span className={`font-bold ${
                    plant.monthlyPerformance >= 85 ? 'text-green-400' :
                    plant.monthlyPerformance >= 50 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {plant.monthlyPerformance}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Geração Estimada:</span>
                  <span className="font-mono">
                    {plant.monthlyGeneration.toLocaleString()} kWh/mês
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`font-medium ${
                    plant.status === 'active' ? 'text-green-400' :
                    plant.status === 'alarm' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {plant.status === 'active' ? 'Ativa' : 
                     plant.status === 'alarm' ? 'Alarme' : 'Inativa'}
                  </span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button
                  className="w-full"
                  onClick={() => generateReport(plant.id)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Gerar PDF
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => sendWhatsApp(plant.id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => sendEmail(plant.id)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;
