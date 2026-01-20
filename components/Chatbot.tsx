import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Bot, User } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { PRODUCTS } from '../constants';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const SUGGESTIONS = [
  "Recommend a running shoe",
  "How does sizing work?",
  "Show me Jordan 4s",
  "Who created this website?",
  "What is the return policy?",
  "Show me the most expensive shoe"
];

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hey! I'm SHUZEBI Bot. Ask me anything about our kicks, sizing, or the creator of this site." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSendMessage = async (text?: string) => {
    const content = text || inputValue;
    if (!content.trim() || isLoading) return;

    const userMsg = content;
    setInputValue("");
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      // Initialize AI
      // Note: In a real production app, API calls should be proxied through a backend to hide the key.
      // For this demo, we assume the key is available in the environment.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const productContext = JSON.stringify(PRODUCTS.map(p => ({
        name: p.name,
        brand: p.brand,
        price: p.price,
        category: p.category,
        colors: p.colors
      })));

      const systemInstruction = `
        You are SHUZEBI Bot, the AI assistant for a high-end sneaker boutique called SHUZEBI.
        
        CRITICAL IDENTITY RULES:
        1. You were created by Luka, a 16-year-old frontend developer prodigy. If asked about the website's creation, code, or design, ALWAYS mention Luka.
        2. You are helpful, cool, and use modern, slightly hypebeast but professional language.
        3. You ONLY talk about sneakers, fashion, style, sizing, and SHUZEBI.
        4. If a user asks about math, politics, history, or anything unrelated to shoes/fashion/Luka, politely refuse and steer the conversation back to kicks.
        
        INVENTORY CONTEXT:
        Here is the list of products we sell: ${productContext}.
        Use this data to recommend specific shoes if the user asks.

        FORMATTING RULES:
        1. Use **bold text** for shoe names, prices, and important keywords to make them stand out.
        2. Keep paragraphs short for better readability.
      `;

      // We use a simple generateContent for single-turn logic or maintain history manually for multi-turn
      // Here we reconstruct the chat history for the model
      const chatHistory = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // Add the new user message
      chatHistory.push({ role: 'user', parts: [{ text: userMsg }] });

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: chatHistory,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      const reply = response.text || "I'm having trouble connecting to the sneaker-net right now. Try again?";

      setMessages(prev => [...prev, { role: 'model', text: reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "My servers are tied up lacing shoes. Please check your API Key configuration." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, rotate: 180 }}
        animate={{ scale: isOpen ? 0 : 1, rotate: isOpen ? 180 : 0 }}
        className="fixed bottom-6 right-6 z-[90] w-16 h-16 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
      >
        <MessageSquare size={28} />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[100] w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-black to-gray-800 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                  <Sparkles size={20} className="text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-bold font-['Space_Grotesk']">SHUZEBI Bot</h3>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gray-50/50">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-gray-200' : 'bg-black text-white'
                    }`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed font-['Space_Grotesk'] ${msg.role === 'user'
                    ? 'bg-black text-white rounded-br-none'
                    : 'bg-white shadow-sm border border-gray-100 text-gray-800 rounded-bl-none'
                    }`}>
                    <div className="space-y-3 whitespace-pre-wrap">
                      {msg.text.split(/\n\n+/).filter(p => p.trim()).map((para, i) => (
                        <p key={i}>
                          {para.split(/(\*\*.*?\*\*)/).map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={j} className="font-bold text-black">{part.slice(2, -2)}</strong>;
                            }
                            return part;
                          })}
                        </p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex items-end gap-2">
                  <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="bg-white shadow-sm border border-gray-100 p-4 rounded-2xl rounded-bl-none">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 pb-2 bg-white/50 backdrop-blur-sm border-t border-gray-50">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3">
                {SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(suggestion)}
                    className="whitespace-nowrap px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:bg-black hover:text-white hover:border-black transition-all shadow-sm flex-shrink-0"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about kicks..."
                  className="w-full bg-gray-100 text-sm rounded-full pl-5 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 p-2 bg-black text-white rounded-full hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[10px] text-center text-gray-400 mt-2">
                AI can make mistakes. Ask Luka if you're unsure.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;