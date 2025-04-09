import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ImageGenerator } from "@/components/create/image-generator";
import { RecentCreations } from "@/components/create/recent-creations";
import { PersonalGallery } from "@/components/gallery/personal-gallery";
import { PublicGallery } from "@/components/gallery/public-gallery";
import { BuyCreditsModal } from "@/components/modals/buy-credits-modal";

type Tab = "create" | "personal" | "explore";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("create");
  const [creditsModalOpen, setCreditsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-light dark:bg-dark text-gray-800 dark:text-gray-200 transition-colors">
      <Header onOpenCreditsModal={() => setCreditsModalOpen(true)} />
      
      <main className="container mx-auto px-4 pb-20 pt-4">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <nav className="flex space-x-10 border-b border-gray-200 dark:border-gray-700 px-4 pb-2">
            <button
              className={`pb-2 relative font-medium ${
                activeTab === "create"
                  ? "text-primary"
                  : "text-gray-500 dark:text-gray-400"
              } text-center`}
              onClick={() => setActiveTab("create")}
            >
              Create
              {activeTab === "create" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
              )}
            </button>
            <button
              className={`pb-2 relative font-medium ${
                activeTab === "personal"
                  ? "text-primary"
                  : "text-gray-500 dark:text-gray-400"
              } text-center`}
              onClick={() => setActiveTab("personal")}
            >
              My Gallery
              {activeTab === "personal" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
              )}
            </button>
            <button
              className={`pb-2 relative font-medium ${
                activeTab === "explore"
                  ? "text-primary"
                  : "text-gray-500 dark:text-gray-400"
              } text-center`}
              onClick={() => setActiveTab("explore")}
            >
              Explore
              {activeTab === "explore" && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
              )}
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "create" && (
          <div className="animate-fade-in">
            <div className="max-w-xl mx-auto">
              <ImageGenerator />
              <RecentCreations />
            </div>
          </div>
        )}

        {activeTab === "personal" && <PersonalGallery />}
        
        {activeTab === "explore" && <PublicGallery />}
      </main>
      
      <Footer activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Modals */}
      <BuyCreditsModal open={creditsModalOpen} onClose={() => setCreditsModalOpen(false)} />
    </div>
  );
}
