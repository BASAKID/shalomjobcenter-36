
import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';
import { Toast } from '@/components/ui/toast';
import { CheckCircle } from "lucide-react";
import { useSettingsActions } from './hooks/useSettingsActions';

// Import tab components
import { SettingsTabs } from './SettingsTabs';
import { SettingsHeader } from './SettingsHeader';

export const AdminSettingsContainer = () => {
  const {
    settings,
    isSaving,
    showSuccessToast,
    handleSaveSettings
  } = useSettingsActions();
  
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr] overflow-x-hidden">
      <AdminSidebar />
      <div className="flex flex-col">
        <AdminTopbar />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 overflow-x-hidden">
          <SettingsHeader 
            isSaving={isSaving} 
            handleSaveSettings={handleSaveSettings} 
          />
          
          <div className="overflow-x-auto">
            <SettingsTabs settings={settings} />
          </div>
          
          {showSuccessToast && (
            <Toast>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Paramètres enregistrés avec succès
              </div>
            </Toast>
          )}
        </main>
      </div>
    </div>
  );
};
