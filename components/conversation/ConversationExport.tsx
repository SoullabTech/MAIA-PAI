"use client";

import React, { useState } from 'react';
import { Download, FileText, FileJson, File } from 'lucide-react';

interface ConversationExportProps {
  userId: string;
  sessionId?: string;
}

export function ConversationExport({ userId, sessionId }: ConversationExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const exportConversation = async (format: 'markdown' | 'json' | 'txt') => {
    setIsExporting(true);
    setShowOptions(false);

    try {
      const params = new URLSearchParams({
        userId,
        format,
        ...(sessionId && { sessionId })
      });

      const response = await fetch(`/api/conversations/export?${params}`);

      if (!response.ok) {
        throw new Error('Failed to export conversations');
      }

      // Get the filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `maia-conversations.${format}`;

      // Create a blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      console.log('✅ Conversation exported successfully');
    } catch (error) {
      console.error('❌ Failed to export conversation:', error);
      alert('Failed to export conversations. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowOptions(!showOptions)}
        disabled={isExporting}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                 hover:bg-gray-200 dark:hover:bg-gray-700
                 disabled:opacity-50 disabled:cursor-not-allowed
                 transition-all"
        aria-label="Export conversations"
      >
        <Download className="w-4 h-4" />
        <span>{isExporting ? 'Exporting...' : 'Export'}</span>
      </button>

      {/* Format selection dropdown */}
      {showOptions && (
        <div className="absolute top-full mt-2 right-0 z-50
                      bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700
                      min-w-[200px] overflow-hidden
                      animate-in slide-in-from-top-2">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
              Choose format:
            </div>
          </div>

          <div className="p-1">
            <button
              onClick={() => exportConversation('markdown')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md
                       text-sm text-left text-gray-700 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FileText className="w-4 h-4 text-blue-500" />
              <div className="flex-1">
                <div className="font-medium">Markdown</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Beautiful formatting</div>
              </div>
            </button>

            <button
              onClick={() => exportConversation('txt')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md
                       text-sm text-left text-gray-700 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <File className="w-4 h-4 text-green-500" />
              <div className="flex-1">
                <div className="font-medium">Plain Text</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Simple & readable</div>
              </div>
            </button>

            <button
              onClick={() => exportConversation('json')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md
                       text-sm text-left text-gray-700 dark:text-gray-300
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <FileJson className="w-4 h-4 text-purple-500" />
              <div className="flex-1">
                <div className="font-medium">JSON</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Full data export</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showOptions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  );
}
