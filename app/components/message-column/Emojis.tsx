"use client"

import SearchBar from "./SearchBar";
import React, { useState, useEffect } from 'react';

interface Emoji {
    slug: string;
    character: string;
    unicodeName: string;
}

const EmojiMenu = () => {
    const [emojis, setEmojis] = useState<Emoji[]>([]);
    const [searchUnicode, setSearchUnicode] = useState<string>("");

    useEffect(() => {
        fetch('https://emoji-api.com/emojis?access_key=60bbfb1eca8ace57f818c9c5b1cebae0630c636c')
            .then((res) => res.json())
            .then((data) => {
                setEmojis(data);
            });
    }, []);

    const handleSearchBar = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchUnicode(e.target.value.toLowerCase());
    };

    // Filter emojis based on the search term
    const filteredEmojis = emojis.filter(emoji =>
        emoji.unicodeName.toLowerCase().includes(searchUnicode)
    );

    return (
        <div className="flex flex-col items-center w-80">
            <SearchBar onSearchChange={handleSearchBar} />
            <ul className="emoji-list mt-2 p-4 bg-zinc-800 text-white h-80 rounded-xl w-full grid grid-cols-[repeat(auto-fill,minmax(1.5rem,1fr))] gap-2 overflow-y-auto ring-2 ring-green-500">
                {filteredEmojis.map((emoji, index) => (
                    <li key={index} title={emoji.unicodeName} className="text-2xl">
                        {emoji.character}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EmojiMenu;
