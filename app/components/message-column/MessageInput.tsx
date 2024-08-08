import React, { useState, FormEvent, ChangeEvent, useEffect, useRef } from "react";
import { FiPaperclip } from "react-icons/fi";
import { LuSend } from "react-icons/lu";
import { TbMoodSmile } from "react-icons/tb";
import "./MessageInput.css";
import EmojiMenu from "./Emojis";

interface Props {
  onSendMessage: (message: string) => void;
}

const MessageInput = ({ onSendMessage }: Props) => {
  const [typedMessage, setTypedMessage] = useState<string>("");
  const [emojiMenuOpen, setEmojiMenuOpen] = useState<boolean>(false);

  const emojiMenuRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (typedMessage.trim() !== "") {
      onSendMessage(typedMessage);
      setTypedMessage("");
      console.log("Message sent: ", typedMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
    } else if (e.key === "Escape" && emojiMenuOpen) {
      setEmojiMenuOpen(false);
    }
  };

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

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTypedMessage(e.target.value);
  };

  const openEmojiMenu = () => {
    setEmojiMenuOpen(!emojiMenuOpen);
  };

  const handleSelectEmoji = (emoji: string) => {
    setTypedMessage((prevMessage) => prevMessage + emoji);
    setEmojiMenuOpen(false);
  };

  return (
    <div className="input-container">
      <form className="entry-and-submit ml-2" onSubmit={handleSubmit}>
        <textarea
          id="typed-message"
          placeholder="Type Message..."
          value={typedMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}  // Attach keyDown event here
        />
        <div className="submit-button">
          <button type="submit">
            <LuSend
              style={{ width: "21px", height: "21px" }}
              className="send-icon"
            />
          </button>
        </div>
      </form>
      <div className="message-features w-100">
        <ul className="input-icons-container">
          <li>
            <FiPaperclip className="input-icon" />
          </li>
          <li id="react-smile" onClick={openEmojiMenu}>
            <TbMoodSmile className="input-icon" id="emoji-icon" />
          </li>
        </ul>
      </div>
      {emojiMenuOpen && (
        <div className="emoji-menu" ref={emojiMenuRef}>
          <EmojiMenu onSelectEmoji={handleSelectEmoji} />
        </div>
      )}
    </div>
  );
};

export default MessageInput;
