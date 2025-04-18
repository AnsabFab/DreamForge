import { useState } from "react";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import { Moon, Sun, User, CreditCard, Coins, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthModal } from "@/components/modals/auth-modal";
import { Button } from "@/components/ui/button";
import { BuyCreditsModal } from "@/components/modals/buy-credits-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  onOpenCreditsModal: () => void;
}

export function Header({ onOpenCreditsModal }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logoutMutation } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [buyCreditsModalOpen, setBuyCreditsModalOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Get user's initials for avatar fallback
  const getInitials = () => {
    if (!user?.username) return "U";
    return user.username.substring(0, 2).toUpperCase();
  };
  
  const handleOpenCreditsModal = () => {
    setBuyCreditsModalOpen(true);
    // Also call the parent's onOpenCreditsModal for backward compatibility
    onOpenCreditsModal();
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-black/90 border-b border-gray-800 backdrop-blur-md transition-colors">
        <div className="px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              DreamForge
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className="flex items-center bg-gray-800 rounded-full px-3 py-1.5 border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                      onClick={handleOpenCreditsModal}
                    >
                      <span className="text-yellow-500 mr-2">💎</span>
                      <span className="text-sm font-medium text-gray-200">{user.credits}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-2 px-2 py-0 h-6 text-xs text-indigo-400 hover:text-indigo-300 hover:bg-transparent"
                      >
                        + Add
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to buy more credits</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* Subscription Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenCreditsModal}
              className="hidden md:flex items-center space-x-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 px-4"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              <span>Upgrade</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="h-9 w-9 cursor-pointer border-2 border-indigo-500">
                    <AvatarImage src={user.profileImage || ""} />
                    <AvatarFallback className="bg-indigo-600 text-white">{getInitials()}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-gray-200">
                  <DropdownMenuItem 
                    onClick={handleOpenCreditsModal}
                    className="hover:bg-gray-700 hover:text-gray-100 focus:bg-gray-700"
                  >
                    <Coins className="h-4 w-4 mr-2" />
                    Buy Credits
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleOpenCreditsModal}
                    className="hover:bg-gray-700 hover:text-gray-100 focus:bg-gray-700"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Subscription Plans
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="hover:bg-gray-700 hover:text-gray-100 focus:bg-gray-700"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setAuthModalOpen(true)}
                className="rounded-full bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
              >
                <User className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <BuyCreditsModal open={buyCreditsModalOpen} onClose={() => setBuyCreditsModalOpen(false)} />
    </>
  );
}
