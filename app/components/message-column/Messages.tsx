import Image, { StaticImageData } from "next/image";
import { BiTrashAlt } from "react-icons/bi";
import { TbMoodSmile, TbPencil } from "react-icons/tb";
import React, { useState, useEffect, useRef } from "react";
import "./Messages.css";
import EmojiMenu from "./Emojis";

interface Message {
  id: string;
  time: string;
  text: string;
}

interface Props {
  img: StaticImageData | string;
  name: string;
  userID: string;
  messages: Message[];
}

const ExistingUserMessages = ({ img, name, messages }: Props) => {
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState('');
  const [messageList, setMessageList] = useState<Message[]>(messages);
  const [emojiMenuOpen, setEmojiMenuOpen] = useState<boolean>(false);

  const emojiMenuRef = useRef<HTMLDivElement | null>(null);


  const deleteMessage = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, messageId: string )  => { 
    const deleteThisMessage = event.currentTarget.closest('.text-message') 
    const deleteUserData = event.currentTarget.closest('.userinfo-message-container')
  
    if (deleteThisMessage) {
      const messageId = deleteThisMessage.getAttribute('data-id'); 
      try {
        const response = await fetch('/api/directMessages', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: messageId }),
        });
      
        if (response.ok) {
          deleteThisMessage.remove(); 
          if (messageList.length === 1) {
            deleteUserData?.remove();
          } 
          console.log(`Successfully deleted message with ID: ${messageId}`);
        } else {
          const errorData = await response.json();
          console.error(`Failed to delete message with ID: ${messageId}`, errorData);
        }
      } catch (error) {
        console.error(`Can't delete message with ID: ${messageId}`, error);
      }         
    } else {
      console.error('Failed to find the message element for deletion');
    } 
  };

  useEffect(() => {
    setMessageList(messages);
  }, [messages]);

  const editMessage = async () => {
    if (!selectedMessageId || !updatedMessage) return;

    try {
      const response = await fetch('/api/directMessages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedMessageId, text: updatedMessage }),
      });

      if (response.ok) {
        setMessageList((prevMessages) => prevMessages.map(message =>
          message.id === selectedMessageId ? { ...message, text: updatedMessage } : message
        ));
        setIsEditing(false);
        setUpdatedMessage('');
        setSelectedMessageId(null);
      } else {
        const errorData = await response.json();
        console.error('Failed to edit message:', errorData);
      }
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };
  
  const enterKeyToSave = (e: React.KeyboardEvent ) => {
    if (e.key === 'Enter') {
      editMessage();
    }
  }

  const handleEditClick = (messageId: string, currentText: string) => {
    setSelectedMessageId(messageId);
    setUpdatedMessage(currentText);
    setIsEditing(true);
  };

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && emojiMenuOpen) {
        setEmojiMenuOpen(false);
      }
    };
  
    document.addEventListener("keydown", handleEscapeKey);
  
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [emojiMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiMenuRef.current && !emojiMenuRef.current.contains(event.target as Node)) {
        setEmojiMenuOpen(false);
      }
    };

    if (emojiMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiMenuOpen]);

  const openEmojiMenu = () => {
    setEmojiMenuOpen(!emojiMenuOpen)
  }

  const handleSelectEmoji = (emoji: string) => {
    setUpdatedMessage((prev) => prev + emoji);
    setEmojiMenuOpen(false); 
  };


  return (
    <div className='message-entry-container'>
      {messageList.length > 0 && (
        <div className="userinfo-message-container">
          <div className="userinfo-container">
            {img && (
              <Image
                src={img}
                quality={100}
                style={{
                  maxWidth: "43px",
                  maxHeight: "43px",
                  borderRadius: "50%",
                }}
                alt="prof-pic"
              />
            )}
            <div className="username">{name}</div>
            {messages[0] && (
              <div className="time-entry">{messages[0].time}</div>
            )}
          </div>
          <div className="message-container">
            {messageList.map((message, index) => (
              <div key={index} className="text-message" data-id={message.id}>
                {index !== 0 && (
                  <div className="time-entry time-entry-side">{message.time}</div>
                )}
                {isEditing && selectedMessageId === message.id ? (
                  <input
                    type="text"
                    value={updatedMessage}
                    onChange={(e) => setUpdatedMessage(e.target.value)}
                    onKeyDown={enterKeyToSave}
                    className="edit-input-form"
                    autoFocus
                  />
                ) : (
                  <div>{message.text}</div>
                )}
                  <div className="edit-box">
                    <button
                      id="edit-pencil" onClick={() => handleEditClick(message.id, message.text)}
                    >
                        <TbPencil className="edit-icon" />
                    </button>
                    <button id="react-smile" onClick={openEmojiMenu}>
                        <TbMoodSmile className="edit-icon" id="emoji-icon"/>
                    </button>
                    <button id="delete-trash" onClick={(event) => deleteMessage(event, message.id)}>
                        <BiTrashAlt className="edit-icon" style={{ color: "red" }} />
                    </button>
                  </div>
                  {emojiMenuOpen && (
                      <div className="emoji-menu" ref={emojiMenuRef}>
                         <EmojiMenu onSelectEmoji={handleSelectEmoji}/>
                      </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExistingUserMessages;
