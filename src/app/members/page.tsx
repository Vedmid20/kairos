'use client';

import { LoginRequired } from "@/app/lib/auth";
import React, { useState } from "react";
import { Search } from "lucide-react";
import '@/app/styles/globals.scss';
import '@/app/styles/mixins.scss';
import InviteMembersModal from "@/app/components/InviteMembers";

export default function MembersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className='p-5'>
            <title>Members</title>
            <LoginRequired />
            <h1 className="text-1xl mb-4">Members</h1>
            <div className="flex justify-between">
                <div className="relative">
                    <input
                        type="search"
                        className="mb-4 pl-10 pr-4 py-2 border rounded-lg"
                        placeholder="Search member"
                    />
                    <div className="absolute inset-y-1 left-0 pl-3 -top-3 flex items-center pointer-events-none">
                        <Search className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
                <div className="ml-10">
                    <div>
                        <button onClick={() => setIsModalOpen(true)}>Invite Users</button>
                    </div>
                </div>
            </div>

            <InviteMembersModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
