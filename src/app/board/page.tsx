import {LoginRequired} from "@/app/lib/auth";
import React from "react";

export default function BoardPage(){
    return (
        <div className='p-5'>
            <title>Board</title>
            <LoginRequired/>
            <h1 className="text-1xl mb-4">Board</h1>
        </div>
    )
}