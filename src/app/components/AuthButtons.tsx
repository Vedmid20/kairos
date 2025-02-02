import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function AuthButtons() {
  return (
    <div className="flex flex-col gap-2">
      <a style={{cursor:"pointer"}}
        onClick={() => signIn("google")}
        className="flex items-center justify-center w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
      >
        <FcGoogle size={24} className="mr-2" />
        Enter via Google
      </a>

      <a style={{cursor:"pointer"}}
        onClick={() => signIn("github")}
        className="flex items-center justify-center w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
      >
        <FaGithub size={24} className="mr-2" />
        Enter via GitHub
      </a>
    </div>
  );
}
