'use client';

import { useState } from 'react';
import { Bot, Loader2, Send, Sparkles, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ChatMessage {
  role: 'user' | 'model';
  content: { text: string }[];
}

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const { toast } = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage: ChatMessage = {
      role: 'user',
      content: [{ text: input }],
    };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Chat IA
          </CardTitle>
          <CardDescription>
            Converse com a sua assistente de IA para obter insights e ajuda sobre o seu negócio.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="space-y-6">
              {messages.length === 0 && !isLoading && (
                 <div className="text-center text-muted-foreground pt-16">
                    <Bot className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-lg">Como posso te ajudar hoje?</p>
                    <p className="text-sm">Peça dicas de marketing, ajuda com finanças ou o que mais precisar.</p>
                </div>
              )}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {msg.role === 'model' && (
                    <Avatar className="h-9 w-9 border-2 border-primary/50">
                       <div className="bg-primary h-full w-full flex items-center justify-center">
                         <Sparkles className="h-5 w-5 text-primary-foreground" />
                       </div>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-md rounded-lg px-4 py-3 text-sm',
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {msg.content[0].text}
                  </div>
                   {msg.role === 'user' && (
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="https://picsum.photos/seed/user-avatar/40/40" />
                        <AvatarFallback>SL</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-9 w-9 border-2 border-primary/50">
                       <div className="bg-primary h-full w-full flex items-center justify-center">
                         <Sparkles className="h-5 w-5 text-primary-foreground" />
                       </div>
                    </Avatar>
                    <div className="max-w-md rounded-lg px-4 py-3 text-sm bg-muted flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="mt-auto">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem aqui..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Enviar
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
