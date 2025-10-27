
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Bot, Send, User } from "lucide-react";
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { chatbotGuidedOrientation } from '@/ai/flows/chatbot-guided-orientation';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'bot';
  text: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Bonjour! Je suis votre assistant sur UmwugaHome. Comment puis-je vous aider à trouver un artisan, une formation ou un métier ?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatbotGuidedOrientation({ query: input });
      const botMessage: Message = { role: 'bot', text: result.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = { role: 'bot', text: "Désolé, une erreur s'est produite. Veuillez réessayer." };
      setMessages(prev => [...prev, errorMessage]);
      console.error('Chatbot error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="rounded-full h-16 w-16 shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <Bot className="h-8 w-8" />
        </Button>
      </div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-full max-w-md p-0 flex flex-col">
            <Card className="h-full flex flex-col border-0 rounded-none">
              <SheetHeader className="p-4 border-b">
                 <SheetTitle className='flex items-center gap-2'>
                    <Bot className="h-6 w-6 text-primary" />
                     <span className='font-headline'>Assistant Umwuga</span>
                </SheetTitle>
                 <SheetDescription className='sr-only'>
                    Conteneur de conversation pour le chatbot d'assistance.
                 </SheetDescription>
              </SheetHeader>
              <CardContent className="flex-1 overflow-hidden p-4">
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex items-start gap-3",
                          message.role === 'user' ? "justify-end" : "justify-start"
                        )}
                      >
                        {message.role === 'bot' && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot size={20}/></AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            "rounded-lg p-3 max-w-xs md:max-w-sm text-sm",
                            message.role === 'user'
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          )}
                        >
                          {message.text}
                        </div>
                         {message.role === 'user' && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback><User size={20}/></AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                       <div className="flex items-start gap-3 justify-start">
                         <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot size={20}/></AvatarFallback>
                          </Avatar>
                        <div className="rounded-lg p-3 bg-muted text-sm">
                          <div className="flex items-center gap-2">
                             <div className="h-2 w-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="h-2 w-2 bg-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="h-2 w-2 bg-foreground rounded-full animate-bounce"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="p-4 border-t">
                <div className="flex w-full items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Posez votre question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isLoading}
                  />
                  <Button type="submit" onClick={handleSend} disabled={isLoading}>
                    <Send className="h-4 w-4"/>
                  </Button>
                </div>
              </CardFooter>
            </Card>
        </SheetContent>
      </Sheet>
    </>
  );
}
