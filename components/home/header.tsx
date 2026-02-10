import { LogOut } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useLogout } from "@/lib/query/auth";
import { useRouter } from "next/navigation";

type HomeHeaderProps = {
  user?: {
    name?: string;
    avatarUrl?: string;
    image?: string;
  } | null;
};

const getInitials = (name?: string) => {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return `${first}${last}`.toUpperCase() || "U";
};

export const Header = ({ user }: HomeHeaderProps) => {
  const router = useRouter();
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const displayName = user?.name || "User";
  const initials = getInitials(displayName);
  const fallbackAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 72 72">
      <rect width="72" height="72" fill="#0D8ABC" />
      <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" font-size="28" font-family="Arial, sans-serif" fill="white">${initials}</text>
    </svg>`,
  )}`;
  const avatarSrc = user?.avatarUrl || user?.image || fallbackAvatar;

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200/80 bg-muted ">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2  justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Cost Book</h1>
        </div>
        <div className="flex items-center gap-3 rounded-full border px-3 py-2 shadow-sm">
          <div className="relative h-9 w-9 overflow-hidden rounded-full border">
            <Image
              src={avatarSrc}
              alt={`${displayName} avatar`}
              fill
              sizes="36px"
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="">
            <p className="text-sm font-medium">{displayName}</p>
          </div>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={handleLogout}
            disabled={isPending}
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
