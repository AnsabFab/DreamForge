import { WandSparkles, ImageIcon, CompassIcon } from "lucide-react";

interface FooterProps {
  activeTab: "create" | "personal" | "explore";
  setActiveTab: (tab: "create" | "personal" | "explore") => void;
}

export function Footer({ activeTab, setActiveTab }: FooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg transition-colors z-40 md:hidden">
      <nav className="flex justify-around items-center h-16">
        <button
          className={`flex flex-col items-center justify-center w-1/3 h-full ${
            activeTab === "create" ? "text-indigo-500" : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("create")}
        >
          <WandSparkles className="h-5 w-5" />
          <span className="text-xs mt-1">Create</span>
        </button>
        <button
          className={`flex flex-col items-center justify-center w-1/3 h-full ${
            activeTab === "personal" ? "text-indigo-500" : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("personal")}
        >
          <ImageIcon className="h-5 w-5" />
          <span className="text-xs mt-1">My Gallery</span>
        </button>
        <button
          className={`flex flex-col items-center justify-center w-1/3 h-full ${
            activeTab === "explore" ? "text-indigo-500" : "text-gray-500 dark:text-gray-400"
          }`}
          onClick={() => setActiveTab("explore")}
        >
          <CompassIcon className="h-5 w-5" />
          <span className="text-xs mt-1">Explore</span>
        </button>
      </nav>
    </footer>
  );
}
