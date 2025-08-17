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
            sender: "ChatGPT",
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
        // chat Messages { sender :"user" or "ChatGPT", message : "the message content here"}
        // api Messages { role: "user" or "assistant" content :"the message content here"}

        let apiMessages = chatMessages.map((messageObject) => {
            let role = '';
            if (messageObject.sender === "ChatGPT") {
                role = "assistant";
            } else {
                role = 'user';
            }
            return { role: role, content: messageObject.message };
        });

        // role : "user" -> a message from the user , "assistent" -> a response from chatGPT
        // system -> generally one initial message defining how we want chatGPT to talk

        const systemMessage = {
            role: "system",
            // content: "Explain all concepts like I am 10 years old."
            content: "Bạn là một chatbot tài năng bạn có thể trả lời hết mọi câu hỏi của tôi bằng những thông tin mà tôi đã cung cấp cho bạn và trước khi trả lời câu hỏi sẽ kiểm tra lại thật đầy đủ thông tin mà tôi đã cung cấp cho bạn"
             + " và giờ tôi có 1 số thông tin về tên bài hát của sơn tùng: Chạy Ngay Đi,"
             + " Chúng ta của sau này, Hãy Trao cho anh, Muộn rồi sao còn. Và bài hát của wowy: Lên thiên đàng. Bạn chỉ cần trả lời khi có ai hỏi bạn về những" 
             + " thông tin này bạn hãy trả lời còn lại hãy viết là tôi không có thông tin"
            // content:"Explain like a pirate."
        }

        const apiRequestBody = {
            "model": "gpt-3.5-turbo-16k",
            "messages": [
                systemMessage,
                ...apiMessages
            ]
        }

        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + "sk-proj-TmZyYudWFxmtm5HknHC4T3BlbkFJ8aGbrnoAfGeXUKaVriNE",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }
        ).then((data) => {
            return data.json();
        }).then((data) => {
            console.log(data);
            console.log(data.choices[0].message.content);
            setMessages([
                ...chatMessages, {
                    message: data.choices[0].message.content,
                    sender: "ChatGPT"
                }
            ]);
            setThinking(false);
        });

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