import { getInitialsFallback } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

interface ProfileProps {
  profileName: string;
  profileSrc: string | undefined;
  isProjectManager?: boolean;
  isViceManager?: boolean;
  variant: "base" | "sm";
}

export default function Profile({
  profileName,
  profileSrc,
  isProjectManager,
  isViceManager,
  variant = "sm",
}: ProfileProps) {
  // const isManager = isProjectManager || isViceManager;

  return (
    <div className="relative">
      <Avatar
        className={`${variant === "sm" ? "h-8 w-8 " : "h-10 w-10"}  ${
          isProjectManager && "border-[2px] border-orange-300"
        } ${isViceManager && "border-[2px] border-gray-500"} rounded-full`}
      >
        <AvatarImage src={profileSrc} />
        <AvatarFallback>{getInitialsFallback(profileName)}</AvatarFallback>
      </Avatar>
      {/* {isManager && (
        <FaCrown
          className={`absolute top-[-20px] left-1/2 -translate-x-1/2 text-2xl drop-shadow-sm ${
            isProjectManager ? "text-orange-300" : "text-gray-500"
          }`}
        />
      )} */}
    </div>
  );
}
