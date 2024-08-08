import React, {useState} from 'react';
import {AiOutlineSearch} from 'react-icons/ai';


interface SearchBarProps {
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ onSearchChange }: SearchBarProps) => {

    return (
        <form className="w-full relative">
            <div className="relative">
                <input
                    type="search"
                    placeholder="Find an Emoji"
                    className="w-full p-2 rounded-full bg-zinc-800 text-white placeholder:text-white ring-2 ring-green-500 outline-none"
                    onChange={onSearchChange}
               />
                <button
                    type="submit"
                    className="absolute right-1 top-1/2 -translate-y-1/2 p-2 bg-lime-600 ring-2 ring-green-500 rounded-full"
                >
                    <AiOutlineSearch />
                </button>
            </div>
        </form>
    )
}

export default SearchBar

