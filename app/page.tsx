"use client";

import { currentUser } from "@/lib/current-user";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import MessageLog from "./MessageLog";
import NameForm from "./NameForm";
import UserProfileFooter from "./UserProfileFooter";
import ChannelList from "./components/ChannelList/ChannelList";
import SideBar from "./components/SideBar/SideBar/SideBar";
import UserList from "./components/dm-list/dm-list";
import DefaultDisplay from "./components/message-column/DefaultDisplay";
import Head from "next/head";

export default function Home() {
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<string>("");
  const [selectedChannelName, setSelectedChannelName] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [showDefaultDisplay, setShowDefaultDisplay] = useState(false); // State for DefaultDisplay

  useEffect(() => {
    const fetchUser = async () => {
      const user: User | null = await currentUser();
      if (user) setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!selectedServerId) {
      setShowDefaultDisplay(true);
    } else {
      setShowDefaultDisplay(false);
    }
  }, [selectedServerId]);

  if (!user) return null;

  return (
    <div className="relative h-screen overflow-hidden">
      {!user.name && <NameForm setUser={setUser} user={user} />}
      <div className="project-container h-full">
        <div className="main-rows bg-white h-full">
          {/* Side Channels Container */}
          <div className="side-channels-container">
            {/* <SideBar onSelectServer={setSelectedServerId} /> */}
            <SideBar 
              onSelectServer={(serverId) => {
                setSelectedServerId(serverId);
                setShowDefaultDisplay(false); // Hide DefaultDisplay when a server is selected
              }} 
            />
          </div>

          {/* Messages Bar */}
          <div className="messages-bar">
            <div className="absolute left-0 top-0 w-[360px] h-[74px] border-opacity-25"></div>
          </div>

          {/* Direct Messages Container */}
          <div className="relative direct-messages-container">
            {selectedServerId ? (
              <ChannelList
                serverId={selectedServerId}
                onChannelSelect={(channelId, channelName) => {
                  setSelectedChannelId(channelId);
                  setSelectedChannelName(channelName);
                }}
              />
            ) : (
              <UserList />
            )}
            <UserProfileFooter user={user} />
          </div>

          {/* Message Log Container */}
          <div className="message-log-container">
          {showDefaultDisplay ? (
              <DefaultDisplay /> // Show DefaultDisplay when the state is true
            ) : (
                <MessageLog
                  channelName={selectedChannelName}
                  channelId={selectedChannelId}
                />
            )}
            </div>
        </div>
      </div>
    </div>
  );
}
