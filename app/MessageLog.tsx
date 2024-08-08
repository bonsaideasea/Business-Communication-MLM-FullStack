"use client";

import React, { useEffect, useState } from "react";
import MessageInput from "./components/message-column/MessageInput";
import MessageNav from "./components/message-column/MessageNav";
import ExistingUserMessages from "./components/message-column/Messages";
import avatar from "../public/avatar.png";
import axios from "axios";
import { StaticImageData } from "next/image";
import { currentUser } from "@/lib/current-user";
import DefaultDisplay from "./components/message-column/DefaultDisplay";
import "./MessageLog.css"


interface Message {
  time: string;
  date: string;
  text: string;
  id: string;
}

interface NEWUserMessage {
  name: string;
  img: StaticImageData | null;
  userID: string;
  messages: Message[];
}

interface MessageLogProps {
  channelName: string;
  channelId: string;
}

const MessageLog = ({ channelName, channelId }: MessageLogProps) => {
  const [userMessages, setUserMessages] = useState<NEWUserMessage[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [selectedChannelName, setSelectedChannelName] = useState<string>(channelName);
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

  const channelIDTemplate = `${channelId}`;
  const channelNameTemplate = `${channelName}`;

  useEffect(() => {
    const fetchChannelName = async () => {
      try {
        const response = await fetch(`/api/channels/${channelId}`);
        if (response.ok) {
          const channel = await response.json();
          setSelectedChannelName(channel.name);
          setSelectedChannelId(channelId);
          console.log(`you are now in Channel: "${channelNameTemplate}", ID: ${channelIDTemplate}`);
        } else {
          throw new Error("Failed to load channel name");
        }
      } catch (error) {
        console.error("Error loading channel:", error);
        setSelectedChannelName("Error loading channel");
      }
    };

    fetchChannelName();
  }, [channelId]);

  const createNewMessage = async (content: string, channelId: number, userId: string): Promise<string | null> => {
    const user = await currentUser();

    if (!user) {
      console.error("Unauthorized access");
      return null;
    }

    try {
      const response = await fetch('/api/directMessages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, channelId, userId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Message created:', data);
        return data.id;
      } else {
        const errorData = await response.json();
        console.error('Failed to create message:', errorData);
        return null;
      }
    } catch (error) {
      console.error("Failed to create message:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await currentUser();
      if (user) {
        setCurrentUserId(user.id);
        setUserMessages([
          {
            name: "Orchid",
            img: avatar,
            userID: user.id,
            messages: [],
          },
        ]);
      } else {
        console.error("User is not authenticated");
      }
    };

    fetchCurrentUser();
  }, []);

  const sendMessage = async (message: string): Promise<void> => {
    try {
      if (!selectedChannelId) {
        console.error("Channel ID is not set");
        return;
      } else {
        console.log(`Message sent in "${channelName}", ID: ${channelIDTemplate}`);
      }

      const userId = currentUserId;
      const channelId = parseInt(selectedChannelId);

      const messageId = await createNewMessage(message, channelId, userId);

      if (messageId != null) {
        const copyNewUserMessages = [...userMessages];
        if (copyNewUserMessages.length > 0 && copyNewUserMessages[copyNewUserMessages.length - 1].userID === userId) {
          copyNewUserMessages[copyNewUserMessages.length - 1].messages.push({
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: message,
            id: messageId
          });
        } else {
          copyNewUserMessages.push({
            name: 'Orchid',
            img: avatar,
            userID: userId,
            messages: [{
              time: new Date().toISOString(),
              date: new Date().toISOString(),
              text: message,
              id: messageId
            }],
          });
        }
        setUserMessages(copyNewUserMessages);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const convertToUserMessages = (messages: Array<any>): NEWUserMessage[] => {
    const convertedUserMessages: NEWUserMessage[] = [];
    let lastUserID: string = "";
    let currentUserMessage: NEWUserMessage = {
      name: "coffee",
      messages: [],
      img: null,
      userID: "3"
    };

    messages.forEach(message => {
      if (message.userId === lastUserID) {
        currentUserMessage.messages.push(convertMessageBody(message));
        return;
      }
      if (lastUserID !== "") {
        convertedUserMessages.push(currentUserMessage);
      }
      currentUserMessage = {
        name: "Orchid",
        userID: message.userId,
        messages: [convertMessageBody(message)],
        img: null
      };
      lastUserID = message.userId;
    });

    if (currentUserMessage.messages.length > 0) {
      convertedUserMessages.push(currentUserMessage);
    }
    return convertedUserMessages;
  };

  const convertMessageBody = (message: any): Message => {
    const date = new Date(message.createdAt);
     const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
     const formattedDate = date.toLocaleDateString(); 

    return {
      time: formattedTime,
      date: formattedDate,
      text: message.content,
      id: message.id
    };
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/api/directMessages');
        console.log(`Here are the fetched messages for "${channelNameTemplate}", ID: ${channelIDTemplate}`, response.data);
        setUserMessages(convertToUserMessages(response.data));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (selectedChannelId) {
      fetchMessages();
    }
  }, [selectedChannelId]);

  const organizeMessagesByDate = (userMessages: NEWUserMessage[]) => {
    const organizedMessages: (NEWUserMessage | { date: string })[] = [];
    let lastDate: string | null = null;
  
    userMessages.forEach(userMessage => {
      userMessage.messages.forEach(message => {
        const messageDate = message.date; // Use the date from message
  
        if (lastDate !== messageDate) {
          organizedMessages.push({ date: messageDate });
          lastDate = messageDate;
        }
  
        organizedMessages.push({
          ...userMessage,
          messages: [message]
        });
      });
    });
  
    return organizedMessages;
  };  

  const organizedMessages = organizeMessagesByDate(userMessages);

  return (
    <>
      {!selectedChannelId ? (
        <DefaultDisplay />
      ) : (
        <>
          <MessageNav channelName={selectedChannelName} channelId={selectedChannelId} />
          <div className="flex flex-col justify-between h-full">
            <div className="overflow-auto flex-grow h-[495px] max-h-screen">
             {organizedMessages.map((item, index) =>
                'date' in item ? (
                  <div key={index} className="time-container text-lime-500">
                    {item.date}
                  </div>
                ) : (
                  <ExistingUserMessages
                    key={index}
                    img={item.img || avatar}
                    name={item.name}
                    userID={item.userID}
                    messages={item.messages}
                  />
                )
              )}
            </div>
            <div className="px-2 border-t">
              <MessageInput onSendMessage={sendMessage} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MessageLog;
