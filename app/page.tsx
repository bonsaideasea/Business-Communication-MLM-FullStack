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

export default function Home() {
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [selectedChannelName, setSelectedChannelName] = useState<string>("");
  const [selectedChannelId, setSelectedChannelId] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user: User | null = await currentUser();
      if (user) setUser(user);
    };

    fetchUser();
  }, []);

  if (!user) return null;

  return (
    <div className="relative h-screen overflow-hidden">
      {!user.name && <NameForm setUser={setUser} user={user} />}
      <div className="project-container h-full">
        <div className="main-rows bg-white h-full">
          {/* Side Channels Container */}
          <div className="side-channels-container">
            <SideBar onSelectServer={setSelectedServerId} />
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
            <MessageLog
              channelName={selectedChannelName}
              channelId={selectedChannelId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
