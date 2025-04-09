import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ImageGenerator } from "@/components/create/image-generator";
import { RecentCreations } from "@/components/create/recent-creations";
import { PersonalGallery } from "@/components/gallery/personal-gallery";
import { CategoryGrid } from "@/components/gallery/category-grid";
import { BuyCreditsModal } from "@/components/modals/buy-credits-modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

type Tab = "create" | "personal" | "explore";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("explore");
  const [creditsModalOpen, setCreditsModalOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-[#0c0c10] dark:bg-[#0c0c10] text-gray-200 transition-colors">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar Navigation (hidden on mobile) */}
        {!isMobile && (
          <div className="w-14 bg-black flex flex-col items-center py-6 border-r border-gray-800">
            <button 
              className={`p-2.5 rounded-xl mb-6 ${activeTab === "create" ? "bg-indigo-500" : "bg-gray-800 hover:bg-gray-700"}`}
              onClick={() => setActiveTab("create")}
              title="Create"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>
            <button 
              className={`p-2.5 rounded-xl mb-6 ${activeTab === "personal" ? "bg-indigo-500" : "bg-gray-800 hover:bg-gray-700"}`}
              onClick={() => setActiveTab("personal")}
              title="My Gallery"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button 
              className={`p-2.5 rounded-xl ${activeTab === "explore" ? "bg-indigo-500" : "bg-gray-800 hover:bg-gray-700"}`}
              onClick={() => setActiveTab("explore")}
              title="Explore"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <Header onOpenCreditsModal={() => setCreditsModalOpen(true)} />
          
          <ScrollArea className="flex-1 overflow-auto">
            <main className="p-6 pb-24">
              {activeTab === "create" && (
                <div className="animate-fade-in">
                  <div className="max-w-xl mx-auto">
                    <ImageGenerator />
                    <RecentCreations />
                  </div>
                </div>
              )}
              
              {activeTab === "personal" && (
                <div className="max-w-7xl mx-auto">
                  <PersonalGallery />
                </div>
              )}
              
              {activeTab === "explore" && (
                <div className="max-w-7xl mx-auto">
                  <CategoryGrid />
                </div>
              )}
            </main>
          </ScrollArea>
        </div>
      </div>
      
      {/* Mobile Footer Navigation */}
      {isMobile && (
        <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
      
      {/* Modals */}
      <BuyCreditsModal open={creditsModalOpen} onClose={() => setCreditsModalOpen(false)} />
    </div>
  );
}
