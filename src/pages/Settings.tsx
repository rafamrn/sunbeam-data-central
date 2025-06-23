
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/contexts/ThemeContext';
import { Settings as SettingsIcon, Monitor, Moon, Sun, Type } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Settings = () => {
  const { isDark, toggleTheme, fontSize, setFontSize } = useTheme();

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
  };

  const handleReset = () => {
    setFontSize(14);
    toast({
      title: "Configurações redefinidas",
      description: "As configurações foram restauradas para os valores padrão.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Personalize a experiência do sistema conforme suas preferências
        </p>
      </div>

      {/* Aparência */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Aparência
          </CardTitle>
          <CardDescription>
            Configure o tema e a aparência da interface
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Modo Escuro</Label>
              <p className="text-sm text-muted-foreground">
                Alternar entre tema claro e escuro
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Switch checked={isDark} onCheckedChange={toggleTheme} />
              <Moon className="h-4 w-4" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              <Label className="text-base">Tamanho da Fonte</Label>
            </div>
            <div className="px-3">
              <Slider
                value={[fontSize]}
                onValueChange={(value) => setFontSize(value[0])}
                max={20}
                min={12}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground mt-1">
                <span>Pequeno (12px)</span>
                <span>Atual: {fontSize}px</span>
                <span>Grande (20px)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notificações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            Notificações
          </CardTitle>
          <CardDescription>
            Configure como você deseja receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Alertas por Email</Label>
              <p className="text-sm text-muted-foreground">
                Receber alertas importantes por email
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Notificações Push</Label>
              <p className="text-sm text-muted-foreground">
                Notificações em tempo real no navegador
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Relatórios Automáticos</Label>
              <p className="text-sm text-muted-foreground">
                Envio automático de relatórios semanais
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Sistema</CardTitle>
          <CardDescription>
            Configurações avançadas do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Fuso Horário</Label>
            <Select defaultValue="america-sao_paulo">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="america-sao_paulo">
                  América/São_Paulo (GMT-3)
                </SelectItem>
                <SelectItem value="america-new_york">
                  América/New_York (GMT-5)
                </SelectItem>
                <SelectItem value="europe-london">
                  Europa/Londres (GMT+0)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Frequência de Atualização</Label>
            <Select defaultValue="15">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutos</SelectItem>
                <SelectItem value="15">15 minutos</SelectItem>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">Modo de Desenvolvimento</Label>
              <p className="text-sm text-muted-foreground">
                Mostrar informações de debug
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex gap-4">
        <Button onClick={handleSave} className="flex-1">
          Salvar Configurações
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Restaurar Padrões
        </Button>
      </div>
    </div>
  );
};

export default Settings;
