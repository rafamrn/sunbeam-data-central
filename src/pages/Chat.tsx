
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Phone, Video, MoreVertical, Paperclip, Smile, Mic } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  isOwn: boolean;
  timestamp: Date;
  sender?: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  isOnline?: boolean;
}

const Chat = () => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<{ [contactId: string]: Message[] }>({});
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'João Silva',
      phone: '+55 85 99999-9999',
      lastMessage: 'Boa tarde! Como está o funcionamento da usina?',
      lastMessageTime: new Date(Date.now() - 300000),
      unreadCount: 2,
      isOnline: true
    },
    {
      id: '2',
      name: 'Maria Santos',
      phone: '+55 51 88888-8888',
      lastMessage: 'Obrigada pelo relatório!',
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 0,
      isOnline: false
    },
    {
      id: '3',
      name: 'Carlos Oliveira',
      phone: '+55 31 77777-7777',
      lastMessage: 'Preciso de ajuda com o sistema',
      lastMessageTime: new Date(Date.now() - 7200000),
      unreadCount: 1,
      isOnline: true
    }
  ];

  // Mensagens iniciais
  useEffect(() => {
    const initialMessages = {
      '1': [
        {
          id: '1',
          text: 'Boa tarde! Como está o funcionamento da usina?',
          isOwn: false,
          timestamp: new Date(Date.now() - 300000),
          sender: 'João Silva',
          status: 'read' as const
        },
        {
          id: '2',
          text: 'Boa tarde, João! A usina está funcionando perfeitamente. Performance de 92% hoje.',
          isOwn: true,
          timestamp: new Date(Date.now() - 240000),
          status: 'read' as const
        }
      ],
      '2': [
        {
          id: '3',
          text: 'Obrigada pelo relatório!',
          isOwn: false,
          timestamp: new Date(Date.now() - 3600000),
          sender: 'Maria Santos',
          status: 'read' as const
        }
      ],
      '3': [
        {
          id: '4',
          text: 'Preciso de ajuda com o sistema',
          isOwn: false,
          timestamp: new Date(Date.now() - 7200000),
          sender: 'Carlos Oliveira',
          status: 'delivered' as const
        }
      ]
    };
    setMessages(initialMessages);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedContact]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      isOwn: true,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), message]
    }));
    setNewMessage('');

    // Simular entrega da mensagem
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [selectedContact.id]: prev[selectedContact.id].map(msg => 
          msg.id === message.id ? { ...msg, status: 'delivered' } : msg
        )
      }));
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(timestamp);
  };

  const getMessageStatus = (status?: string) => {
    switch (status) {
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'read': return '✓✓';
      default: return '';
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] bg-background">
      <div className="flex h-full">
        {/* Lista de conversas */}
        <div className="w-80 border-r bg-background">
          <div className="p-4 border-b bg-primary text-primary-foreground">
            <h2 className="text-lg font-semibold">WhatsApp Business</h2>
            <p className="text-sm opacity-90">Dark Energy Support</p>
          </div>
          
          <ScrollArea className="h-full">
            <div className="p-2">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedContact?.id === contact.id
                      ? 'bg-primary/10'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {contact.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium truncate">{contact.name}</p>
                      {contact.lastMessageTime && (
                        <p className="text-xs text-muted-foreground">
                          {formatTime(contact.lastMessageTime)}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground truncate">
                        {contact.lastMessage}
                      </p>
                      {contact.unreadCount && contact.unreadCount > 0 && (
                        <div className="bg-green-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center">
                          {contact.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Área de chat */}
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              {/* Header do chat */}
              <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={selectedContact.avatar} />
                      <AvatarFallback>{selectedContact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {selectedContact.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{selectedContact.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedContact.isOnline ? 'online' : 'última vez há pouco'}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Mensagens */}
              <ScrollArea className="flex-1 p-4" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="whatsapp-bg" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse"%3E%3Cpath d="M0 0l100 100M100 0L0 100" stroke="%23000" stroke-width="0.1" opacity="0.05"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23whatsapp-bg)"/%3E%3C/svg%3E")' }}>
                <div className="space-y-4">
                  {(messages[selectedContact.id] || []).map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isOwn
                            ? 'bg-green-500 text-white'
                            : 'bg-white text-gray-900 shadow-sm border'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <div className={`text-xs mt-1 flex items-center gap-1 ${
                          message.isOwn ? 'text-green-100 justify-end' : 'text-gray-500'
                        }`}>
                          <span>{formatTime(message.timestamp)}</span>
                          {message.isOwn && (
                            <span className={message.status === 'read' ? 'text-blue-200' : ''}>
                              {getMessageStatus(message.status)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input de mensagem */}
              <div className="p-4 border-t bg-background">
                <div className="flex gap-2 items-end">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 flex items-end gap-2 bg-muted rounded-full px-4 py-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Digite uma mensagem"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>
                  {newMessage.trim() ? (
                    <Button onClick={sendMessage} size="icon" className="rounded-full bg-green-500 hover:bg-green-600">
                      <Send className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon">
                      <Mic className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-muted/20">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-medium">WhatsApp Business</h3>
                <p className="text-muted-foreground">
                  Selecione uma conversa para começar a chat
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
