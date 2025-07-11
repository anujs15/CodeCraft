import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send, Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';

function ChatAi({problem}) {
    const [messages, setMessages] = useState([
        { role: 'model', parts:[{text: "Hi! I'm here to help you with this coding problem. How can I assist you?"}]},
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const { register, handleSubmit, reset, formState: {errors} } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const onSubmit = async (data) => {
        const userMessage = { role: 'user', parts:[{text: data.message}] };
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);
        reset();

        try {
            const response = await axiosClient.post("/ai/chat", {
                messages: [...messages, userMessage],
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode
            });

            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: response.data.message}] 
            }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, { 
                role: 'model', 
                parts:[{text: "Sorry, I'm having trouble connecting right now. Please try again later."}]
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-[60vh] sm:h-screen sm:max-h-[80vh] min-h-[400px] glass-effect rounded-lg border border-purple-500/20"
        >
            {/* Chat Header */}
            <div className="p-3 sm:p-4 border-b border-purple-500/20 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-1 sm:p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                        <Bot size={16} className="sm:hidden text-white" />
                        <Bot size={20} className="hidden sm:block text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm sm:text-base text-white">AI Assistant</h3>
                        <p className="text-xs sm:text-sm text-gray-400">Ready to help with your coding problem</p>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => (
                    <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                    >
                        <div className="chat-image avatar">
                            <div className="w-6 sm:w-8 rounded-full">
                                {msg.role === "user" ? (
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center">
                                        <User size={12} className="sm:hidden text-white" />
                                        <User size={16} className="hidden sm:block text-white" />
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <Bot size={12} className="sm:hidden text-white" />
                                        <Bot size={16} className="hidden sm:block text-white" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={`chat-bubble text-xs sm:text-sm ${msg.role === "user" 
                            ? "bg-gradient-to-r from-green-500/20 to-cyan-500/20 border border-green-500/30" 
                            : "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30"} text-white`}
                        >
                            {msg.parts[0].text}
                        </div>
                    </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="chat chat-start"
                    >
                        <div className="chat-image avatar">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-glow-purple">
                                <Bot size={16} className="text-white" />
                            </div>
                        </div>
                        <div className="chat-bubble bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                            <motion.div 
                                className="flex space-x-1"
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <motion.form 
                onSubmit={handleSubmit(onSubmit)} 
                className="sticky bottom-0 p-2 sm:p-4 border-t border-purple-500/20 bg-gradient-to-r from-blue-500/5 to-purple-500/5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <div className="flex items-center gap-2">
                    <input 
                        placeholder="Ask me anything..." 
                        className="input input-sm sm:input-md input-bordered flex-1 bg-white/5 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500/50 text-xs sm:text-sm" 
                        {...register("message", { required: true, minLength: 2 })}
                        disabled={isTyping}
                    />
                    <motion.button 
                        type="submit" 
                        className="btn btn-sm sm:btn-md btn-primary bg-gradient-to-r from-blue-500 to-purple-500 border-0"
                        disabled={errors.message || isTyping}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Send size={16} className="sm:hidden" />
                        <Send size={20} className="hidden sm:block" />
                    </motion.button>
                </div>
            </motion.form>
        </motion.div>
    );
}

export default ChatAi;