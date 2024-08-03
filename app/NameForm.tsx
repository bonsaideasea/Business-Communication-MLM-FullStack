import { User } from "@prisma/client";
import React from "react";

interface NameFormProps {
  user: User;
  setUser: (user: User) => void;
}
export default function NameForm({ user, setUser }: NameFormProps) {
  const handleNameSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const nameInput = formData.get("name-input") as string;

    if (nameInput.length < 3 || nameInput.length > 15 || !user || !user.id) {
      return alert("Name must be between 3 to 15 characters long!");
    }

    const trimmedName = nameInput.trim();
    setUser({ ...user, name: trimmedName });
    const response = await fetch(`/api/user/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: user.id, name: trimmedName }),
    });

    if (!response.ok) {
      console.error("Failed to update user name");
    }
  };

  return (
    <form
      onSubmit={handleNameSubmit}
      className="absolute inset-0 bg-white bg-opacity-75 flex flex-col justify-center items-center z-50"
    >
      <label htmlFor="name-input" className="mb-2">
        <p className="text-2xl">Please enter your desired name</p>
      </label>
      <input
        id="name-input"
        name="name-input"
        type="text"
        placeholder="Type Here..."
        className="p-2 border rounded w-72 focus:outline-none focus:border-emerald-500"
        minLength={3}
        maxLength={15}
        required
      />
      <button
        type="submit"
        className="mt-2 p-1 px-3 bg-emerald-500 text-white rounded text-lg hover:bg-emerald-600 transition duration-100"
      >
        Submit
      </button>
    </form>
  );
}
