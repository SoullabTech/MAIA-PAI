'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

/**
 * Library of Alexandria - File Upload Interface
 *
 * ADHD-friendly drag-and-drop for adding wisdom files
 */

interface UploadedFile {
  file: File;
  category: string;
  topics: string[];
  author?: string;
  status: 'pending' | 'processing' | 'complete' | 'error';
  progress?: number;
  error?: string;
}

const categories = [
  { value: 'spiralogic', label: 'Spiralogic', emoji: '🌀' },
  { value: 'sacred_witness', label: 'Sacred Witness', emoji: '👁️' },
  { value: 'elemental_alchemy', label: 'Elemental Alchemy', emoji: '🔥💧🌍💨' },
  { value: 'ain_conversations', label: 'AIN Conversations', emoji: '🤖💬' },
  { value: 'jung', label: 'Jung / Depth Psychology', emoji: '🌑' },
  { value: 'buddhism', label: 'Buddhist Teachings', emoji: '☸️' },
  { value: 'integral', label: 'Integral Theory', emoji: '🔶' },
  { value: 'somatic', label: 'Somatic Practices', emoji: '🧘' },
  { value: 'shadow_work', label: 'Shadow Work', emoji: '🌓' },
  { value: 'other', label: 'Other Wisdom', emoji: '📚' },
];

export default function LibraryUploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [quickCategory, setQuickCategory] = useState('spiralogic');
  const [quickTopics, setQuickTopics] = useState('');
  const [quickAuthor, setQuickAuthor] = useState('Kelly');
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      file,
      category: quickCategory,
      topics: quickTopics.split(',').map(t => t.trim()).filter(Boolean),
      author: quickAuthor || undefined,
      status: 'pending',
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, [quickCategory, quickTopics, quickAuthor]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/markdown': ['.md'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
  });

  const uploadFiles = async () => {
    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const fileData = files[i];
      if (fileData.status !== 'pending') continue;

      // Update status to processing
      setFiles(prev => prev.map((f, idx) =>
        idx === i ? { ...f, status: 'processing' as const, progress: 0 } : f
      ));

      try {
        // Create form data
        const formData = new FormData();
        formData.append('file', fileData.file);
        formData.append('category', fileData.category);
        formData.append('topics', JSON.stringify(fileData.topics));
        if (fileData.author) formData.append('author', fileData.author);

        // Upload
        const response = await fetch('/api/library/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        const result = await response.json();

        // Update status to complete
        setFiles(prev => prev.map((f, idx) =>
          idx === i ? { ...f, status: 'complete' as const, progress: 100 } : f
        ));

      } catch (error) {
        console.error('Upload error:', error);
        setFiles(prev => prev.map((f, idx) =>
          idx === i ? {
            ...f,
            status: 'error' as const,
            error: error instanceof Error ? error.message : 'Upload failed'
          } : f
        ));
      }
    }

    setIsUploading(false);
  };

  const clearCompleted = () => {
    setFiles(prev => prev.filter(f => f.status !== 'complete'));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const pendingCount = files.filter(f => f.status === 'pending').length;
  const processingCount = files.filter(f => f.status === 'processing').length;
  const completeCount = files.filter(f => f.status === 'complete').length;
  const errorCount = files.filter(f => f.status === 'error').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-indigo-900/20 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            📚 Library of Alexandria
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload wisdom files - PDFs, Markdown, Text. Just drag, drop, and go! 🔥
          </p>
        </div>

        {/* Quick Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            ⚡ Quick Settings
            <span className="text-sm font-normal text-gray-500">(applied to all uploads)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={quickCategory}
                onChange={(e) => setQuickCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-violet-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium mb-2">Author</label>
              <input
                type="text"
                value={quickAuthor}
                onChange={(e) => setQuickAuthor(e.target.value)}
                placeholder="Kelly, Jung, etc."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-violet-500"
              />
            </div>

            {/* Topics */}
            <div>
              <label className="block text-sm font-medium mb-2">Topics (comma-separated)</label>
              <input
                type="text"
                value={quickTopics}
                onChange={(e) => setQuickTopics(e.target.value)}
                placeholder="shadow work, integration"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
        </div>

        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`
            relative border-4 border-dashed rounded-2xl p-12 mb-6 text-center cursor-pointer
            transition-all duration-200
            ${isDragActive
              ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20 scale-105'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-violet-400'
            }
          `}
        >
          <input {...getInputProps()} />

          <div className="text-6xl mb-4">
            {isDragActive ? '🎯' : '📚'}
          </div>

          <h3 className="text-2xl font-semibold mb-2">
            {isDragActive ? 'Drop files here!' : 'Drag & Drop Wisdom Files'}
          </h3>

          <p className="text-gray-600 dark:text-gray-400 mb-4">
            PDFs, Markdown (.md), Text (.txt), Word (.docx)
          </p>

          <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
            Or Click to Browse Files
          </button>
        </div>

        {/* Stats */}
        {files.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600">⏳ {pendingCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">🔄 {processingCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Processing</div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600">✅ {completeCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Complete</div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-600">❌ {errorCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Errors</div>
            </div>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Files ({files.length})</h2>
              <button
                onClick={clearCompleted}
                className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear Completed
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {files.map((fileData, index) => (
                <div
                  key={index}
                  className={`
                    flex items-center gap-4 p-4 rounded-lg border-2
                    ${fileData.status === 'complete' ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : ''}
                    ${fileData.status === 'processing' ? 'border-blue-200 bg-blue-50 dark:bg-blue-900/10' : ''}
                    ${fileData.status === 'error' ? 'border-red-200 bg-red-50 dark:bg-red-900/10' : ''}
                    ${fileData.status === 'pending' ? 'border-gray-200 dark:border-gray-700' : ''}
                  `}
                >
                  {/* Status Icon */}
                  <div className="text-2xl">
                    {fileData.status === 'pending' && '⏳'}
                    {fileData.status === 'processing' && '🔄'}
                    {fileData.status === 'complete' && '✅'}
                    {fileData.status === 'error' && '❌'}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{fileData.file.name}</div>
                    <div className="text-sm text-gray-500">
                      {categories.find(c => c.value === fileData.category)?.emoji}{' '}
                      {categories.find(c => c.value === fileData.category)?.label}
                      {fileData.author && ` • ${fileData.author}`}
                    </div>
                    {fileData.error && (
                      <div className="text-sm text-red-600 mt-1">{fileData.error}</div>
                    )}
                  </div>

                  {/* File Size */}
                  <div className="text-sm text-gray-500">
                    {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                  </div>

                  {/* Remove Button */}
                  {fileData.status === 'pending' && (
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button */}
        {pendingCount > 0 && (
          <div className="flex gap-4">
            <button
              onClick={uploadFiles}
              disabled={isUploading}
              className="flex-1 py-4 px-8 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? '🔄 Processing...' : `🚀 Upload & Process ${pendingCount} File${pendingCount > 1 ? 's' : ''}`}
            </button>

            <button
              onClick={() => setFiles([])}
              className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 bg-violet-50 dark:bg-violet-900/20 rounded-xl p-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            💡 Tips for ADHD-Friendly Uploading
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>• <strong>Just drop and go!</strong> Set category once, drag multiple files</li>
            <li>• <strong>Batch upload</strong> - Add 10-20 files, then hit upload</li>
            <li>• <strong>Don't overthink topics</strong> - System auto-extracts keywords too</li>
            <li>• <strong>Can't decide category?</strong> Pick "Other Wisdom" and we'll sort it later</li>
            <li>• <strong>Files process in background</strong> - You can close and come back</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
