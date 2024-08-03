import { User } from "@prisma/client";
import Image from "next/image";

interface UserProfileFooterProps {
  user: User;
}

export default function UserProfileFooter({ user }: UserProfileFooterProps) {
  const capitalizeFirstLetter = (string: string | null) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="absolute bottom-0 w-full flex items-center border-t-2 border-gray-400/opacity-25 space-x-2 p-1">
      <Image
        src={
          user.image ||
          "https://cdn4.iconfinder.com/data/icons/office-thick-outline/36/office-14-256.png"
        }
        alt="User Image"
        width={45}
        height={45}
        className="w-[45px] h-[45px] rounded-full object-cover ml-2"
      />
      <p className="text-2xl font-semibold">
        {capitalizeFirstLetter(user.name)}
      </p>
    </div>
  );
}
