
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageCircle, Phone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  timestamp: Date;
  sender?: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Como posso ajudá-lo hoje?',
      isOwn: false,
      timestamp: new Date(Date.now() - 300000),
      sender: 'Suporte'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      isOwn: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simular resposta automática
    setTimeout(() => {
      const autoReply: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Obrigado pela sua mensagem! Nossa equipe irá responder em breve.',
        isOwn: false,
        timestamp: new Date(),
        sender: 'Suporte'
      };
      setMessages(prev => [...prev, autoReply]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const connectWhatsApp = () => {
    toast({
      title: "WhatsApp conectado",
      description: "Integração com WhatsApp configurada com sucesso!",
    });
  };

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Chat de Suporte</h1>
          <p className="text-muted-foreground">
            Comunicação direta com clientes via WhatsApp
          </p>
        </div>
        <Button onClick={connectWhatsApp} className="bg-green-600 hover:bg-green-700">
          <MessageCircle className="h-4 w-4 mr-2" />
          Conectar WhatsApp
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lista de conversas */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Conversas Ativas</CardTitle>
            <CardDescription>3 conversas em andamento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 cursor-pointer">
              <Avatar>
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">João Silva</p>
                <p className="text-xs text-muted-foreground">Usina Solar Norte</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
              <Avatar>
                <AvatarFallback>MS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">Maria Santos</p>
                <p className="text-xs text-muted-foreground">Usina Solar Sul</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
              <Avatar>
                <AvatarFallback>CO</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">Carlos Oliveira</p>
                <p className="text-xs text-muted-foreground">Usina Solar Leste</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chat principal */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">João Silva</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  +55 85 99999-9999
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <ScrollArea className="h-96 w-full p-4 border rounded-lg">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isOwn
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
