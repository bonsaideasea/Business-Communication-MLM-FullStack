import Image from "next/image";
import { useState, useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import "./dm-list.css";
import DefaultDisplay from "./components/message-column/DefaultDisplay";

type User = {
  id: string;
  username: string;
  image: string;
  about: string;
  activeState: "active" | "away" | "offline";
};

const getColorFromState = (state: "active" | "away" | "offline"): string => {
  switch (state) {
    case "active":
      return "green";
    case "away":
      return "yellow";
    case "offline":
      return "gray";
    default:
      return "";
  }
};

const UserList: React.FC = () => {
  const [userList, setUserList] = useState<User[]>([]);
  const [selected, onSelected] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch("/api/friendActions");
        const data = await response.json();
        const formattedData = data.map((friend: User) => ({
          ...friend,
          activeState: "active", // Set default state, update as needed
        }));
        setUserList(formattedData);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  return (
    <div className="list-container">
      <div className="flex items-center h-[63px] border-b border-gray-400/opacity-25 hover:bg-gray-100">
        <h4 className="font-semibold text-3xl pr-[10px] pl-[16px] select-none">
          Direct Messages
        </h4>
      </div>
      {/* If there are no friends, display following div */}
      {userList.length === 0? (
        <div className="no-friends">
          <h4 className="font-semibold text-2xl pr-[10px] pl-[18px] mt-4 text-gray-500 select-none">No friends yet</h4>
        </div>
        ) : (
          // User List based on the Current User's friends
          <ul className="user-list">
            {userList.map((user) => (
              <li
                key={user.id}
                className={`user-item transition-colors duration-200 cursor-pointer ${
                  selected === user.id
                    ? "group bg-gray-200 "
                    : "group hover:bg-gray-200"
                }`}
                style={{ maxWidth: "360px" }}
                onClick={() => onSelected(user.id === selected ? null : user.id)}
              >
                {/* User icon/picture */}
                <div className="user-icon"> 
                  <Image
                    src={user.image}
                    alt={user.username}
                    fill={true}
                    className="object-contain"
                  />
                </div>
                {/* Displays friend's name and their "About" information with a basically default of "No username" or "No information" if there's nothing */}
                <div className="flex flex-col w-full pl-3 max-w-[272px]">
                  <span className="user-name">{user.username || "No username"}</span>
                  <p className="truncate text-sm">{user.about || "No Information"}</p>
                </div>
                {/* State color, maybe keep it for looks, maybe functional with websockets */}
                <div
                  className="user-state absolute bottom-3 left-12"
                  style={{
                    backgroundColor: `${getColorFromState(user.activeState)}`,
                  }}
                />
                {/* Cross Button to Remove Friend */}
                <button
                  className="absolute top-2 right-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={() => console.log("clicked")}
                >
                  {/* TODO: Remove friend when the cross is clicked */}
                  <RxCross2
                    className="hover:text-red-500"
                    style={{ width: "18px", height: "18px" }}
                  />
                </button>
              </li>
            ))}
          </ul>
        )
      }
    </div>
  );
};

export default UserList;
