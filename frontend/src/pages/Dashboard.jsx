import React, { useState } from 'react';
import { WelcomeHeader } from '../features/dashboard/components/WelcomeHeader';
import { QuickActions } from '../features/dashboard/components/QuickAction';
import { RecentProjects } from '../features/dashboard/components/RecentProjects';
import CreatePresentationModal from '../features/dashboard/components/CreatePresentationModal';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { usePresentations } from '../contexts/PresentationContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    presentations,
    loading,
    createPresentation,
    deletePresentation
  } = usePresentations();

  const handleEdit = (id) => {
    // Logic to fetch/prepare data before opening editor can be added here
    window.open(`/design/${id}`, '_blank');
  };

  const handleDelete = async (id) => {
    try {
      await deletePresentation(id);
    } catch (error) {
      alert('Unable to delete presentation. Please try again.');
    }
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = async (title) => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write("Đang tải...");
    }

    try {
      const newPresentation = await createPresentation({ title });

      setIsCreateModalOpen(false);

      if (newWindow) {
        newWindow.location.href = `/design/${newPresentation._id}`
      } else {
        window.location.href = `/design/${newPresentation._id}`
      }
    } catch (error) {
      console.error("Failed to create presentation:", error);
      if (newWindow) newWindow.close();
      alert("Failed to create presentation");
    }
  };

  // Navigate to AI Slide page
  const handleAiGenerate = () => navigate('/ai-slide');

  // Transform presentations to slides format for UI
  const slides = presentations.map((presentation, index) => ({
    id: presentation._id,
    title: presentation.title,
    date: new Date(presentation.updatedAt).toLocaleDateString('en-US'),
    author: 'User',
    status: 'Published',
    thumbnailUrl: presentation.thumbnailUrl,
    thumbnailColor: 'bg-orange-600/40'
  }));

  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <WelcomeHeader userName={user.name} />

        <QuickActions
          onCreateClick={handleCreateClick}
          onAiGenerate={handleAiGenerate}
        />

        <CreatePresentationModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateSubmit}
          isLoading={loading} // Assuming 'loading' from usePresentations reflects the creation process
        />

        <RecentProjects
          slides={slides.slice(0, 8)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDownload={(id) => console.log("Download", id)}
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;