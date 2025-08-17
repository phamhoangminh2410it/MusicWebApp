//import React from 'react'
import { useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./AI.scss"

import {
  MainContainer,
  ChatContainer,
  Message,
  MessageList,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";

const AI = () => {
    const [thinking, setThinking] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            message: "Xin chào! \nMình là trợ lý AI từ MinMusic.",
            sender: "Gemini",
        },
    ]);

    const handleSend = async (message) => {
        const newMessage = {
            message: message,
            sender: "user",
            direction: "outgoing",
        };

        const newMessages = [...messages, newMessage]; // all the old messages , + new message

        // update the messages useState
        setMessages(newMessages);

        // Setting a typing indicator (chatgpt is thinking)
        setThinking(true);

        // Process the message to CHATGPT (and wait for response )
        processMessageToChatGPT(newMessages);
    };

    async function processMessageToChatGPT(chatMessages) {
        const latestMessage = chatMessages[chatMessages.length - 1];
        
        // Context about the songs we know
        const context = `Thông tin về bài hát:
        Sơn Tùng MTP: Chạy Ngay Đi, Chúng ta của tương lai, Hãy Trao cho anh, Muộn rồi sao còn
        Wowy: Lên thiên đàng`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": "AIzaSyBUz9Ykz1TOuWj93isYNDawFS5qDdN4iyw"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `${context}\n\nVới vai trò là trợ lý AI của MinMusic, hãy trả lời câu hỏi sau:\n${latestMessage.message}`
                        }]
                    }]
                })
            });

            const data = await response.json();
            console.log("Gemini response:", data); // Debug log

            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
                setMessages([
                    ...chatMessages,
                    {
                        message: data.candidates[0].content.parts[0].text,
                        sender: "Gemini"
                    }
                ]);
            } else {
                console.error("Unexpected response structure:", data);
                setMessages([
                    ...chatMessages,
                    {
                        message: "Xin lỗi, có lỗi xử lý phản hồi từ AI. Vui lòng thử lại.",
                        sender: "Gemini"
                    }
                ]);
            }
        } catch (error) {
            console.error("Error details:", error);
            setMessages([
                ...chatMessages,
                {
                    message: "Xin lỗi, đã có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
                    sender: "Gemini"
                }
            ]);
        }
        setThinking(false);

    }

    return (
        <>
            <div className="chat-bubble" onClick={() => setIsOpen(!isOpen)}>
                <img src="/src/img/logo.svg" alt="Chat" />
            </div>
            
            <div className={`chat-container ${!isOpen ? 'hidden' : ''}`}>
                <div className="chat-header">
                    <div className="avatar">
                        🤖
                    </div>
                    <div className="header-text">
                        <h2>Chatbot MinMusic</h2>
                        <p>Trợ lý AI</p>
                    </div>
                </div>
                <MainContainer>
                    <ChatContainer>
                        <MessageList
                            typingIndicator={
                                thinking ? (
                                    <TypingIndicator content="wait a moment" />
                                ) : null
                            }
                        >
                            {messages.map((message, i) => {
                                return <Message key={i} model={message} />;
                            })}
                        </MessageList>
                        <MessageInput
                            placeholder="Nói chuyện với Chatbot MinMusic"
                            onSend={handleSend}
                        />
                    </ChatContainer>
                </MainContainer>
            </div>
        </>
    )
}

export default AI