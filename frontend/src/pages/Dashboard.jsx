import React, { useState } from 'react';
import { WelcomeHeader } from '../features/dashboard/components/WelcomeHeader';
import { QuickActions } from '../features/dashboard/components/QuickAction';
import { RecentProjects } from '../features/dashboard/components/RecentProjects';
import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import { usePresentations } from '../contexts/PresentationContext';

const Dashboard = () => {
  const { user } = useAuth();

  const {
    presentations,
    loading,
    createPresentation,
    deletePresentation
  } = usePresentations();

  const handleDelete = async (id) => {
    try {
      await deletePresentation(id);
    } catch (error) {
      alert('Unable to delete presentation. Please try again.');
    }
  };

  // Logic handling (Add API call here later)
  const handleAiGenerate = () => console.log("Opening AI modal...");

  // Transform presentations to slides format for UI
  const slides = presentations.map((presentation, index) => ({
    id: presentation._id,
    title: presentation.title,
    date: new Date(presentation.updatedAt).toLocaleDateString('en-US'),
    author: 'User',
    status: 'Published',
    thumbnailColor:'bg-orange-100'
  }));

  return (
    <MainLayout>
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <WelcomeHeader userName={user.name} />

        <QuickActions
          onCreateNew={() => createPresentation({})}
          onAiGenerate={handleAiGenerate}
        />

        <RecentProjects
          slides={slides}
          onDelete={handleDelete}
          onDownload={(id) => console.log("Download", id)}
        />
      </div>
    </MainLayout>
  );
};

export default Dashboard;