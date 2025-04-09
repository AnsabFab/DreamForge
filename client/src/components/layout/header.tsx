import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { Moon, Sun, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthModal } from "@/components/modals/auth-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  onOpenCreditsModal: () => void;
}

export function Header({ onOpenCreditsModal }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logoutMutation } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Get user's initials for avatar fallback
  const getInitials = () => {
    if (!user?.username) return "U";
    return user.username.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm transition-colors">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
            DreamForge
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1">
              <span className="text-yellow-500 mr-2">💰</span>
              <span className="text-sm font-medium">{user.credits}</span>
            </div>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 cursor-pointer">
                  <AvatarImage src={user.profileImage || ""} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onOpenCreditsModal}>
                  Buy Credits
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setAuthModalOpen(true)}
              className="rounded-full"
            >
              <User className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
}
