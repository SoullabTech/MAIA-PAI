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
    <div className="min-h-screen bg-[#1a1410] relative overflow-hidden p-8">
      {/* DUNE desert atmosphere */}
      <div className="fixed inset-0">
        {/* Deep desert sand gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#3d2817] via-[#1a1410] to-[#0a0604]" />

        {/* Subtle sand texture */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' /%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px'
          }}
        />

        {/* Warm desert sun glow */}
        <div className="absolute inset-0 bg-gradient-radial from-orange-950/10 via-transparent to-transparent" />

        {/* Atmospheric haze */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header - Minimalist DUNE style */}
        <div className="mb-12">
          <h1 className="text-5xl font-light text-amber-200/95 mb-3 tracking-wider" style={{
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            letterSpacing: '0.05em'
          }}>
            LIBRARY OF ALEXANDRIA
          </h1>
          <div className="h-px w-96 bg-gradient-to-r from-amber-700/50 via-amber-600/30 to-transparent mb-4" />
          <p className="text-amber-300/60 text-sm tracking-wide uppercase" style={{ letterSpacing: '0.15em' }}>
            Archive of Sacred Knowledge
          </p>
        </div>

        {/* Quick Settings - DUNE minimalist panels */}
        <div
          className="rounded-lg p-8 mb-8"
          style={{
            background: 'linear-gradient(135deg, rgba(61, 40, 23, 0.4) 0%, rgba(26, 20, 16, 0.6) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(217, 119, 6, 0.15)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          }}
        >
          <h2 className="text-sm uppercase tracking-widest text-amber-400/80 mb-6" style={{ letterSpacing: '0.2em' }}>
            Archive Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-amber-300/60 mb-3" style={{ letterSpacing: '0.15em' }}>
                Classification
              </label>
              <select
                value={quickCategory}
                onChange={(e) => setQuickCategory(e.target.value)}
                className="w-full px-4 py-3 rounded bg-black/30 border border-amber-900/30 text-amber-200/90 focus:outline-none focus:border-amber-700/50 transition-all"
                style={{
                  backdropFilter: 'blur(10px)',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value} className="bg-[#1a1410]">
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-amber-300/60 mb-3" style={{ letterSpacing: '0.15em' }}>
                Archivist
              </label>
              <input
                type="text"
                value={quickAuthor}
                onChange={(e) => setQuickAuthor(e.target.value)}
                placeholder="Kelly, Jung, etc."
                className="w-full px-4 py-3 rounded bg-black/30 border border-amber-900/30 text-amber-200/90 placeholder-amber-900/40 focus:outline-none focus:border-amber-700/50 transition-all"
                style={{
                  backdropFilter: 'blur(10px)',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              />
            </div>

            {/* Topics */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-amber-300/60 mb-3" style={{ letterSpacing: '0.15em' }}>
                Keywords
              </label>
              <input
                type="text"
                value={quickTopics}
                onChange={(e) => setQuickTopics(e.target.value)}
                placeholder="shadow work, integration"
                className="w-full px-4 py-3 rounded bg-black/30 border border-amber-900/30 text-amber-200/90 placeholder-amber-900/40 focus:outline-none focus:border-amber-700/50 transition-all"
                style={{
                  backdropFilter: 'blur(10px)',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              />
            </div>
          </div>
        </div>

        {/* Drop Zone - DUNE desert landing pad */}
        <div
          {...getRootProps()}
          className="relative mb-8 text-center cursor-pointer transition-all duration-300"
          style={{
            border: isDragActive
              ? '2px solid rgba(217, 119, 6, 0.5)'
              : '2px dashed rgba(217, 119, 6, 0.2)',
            background: isDragActive
              ? 'linear-gradient(135deg, rgba(217, 119, 6, 0.1) 0%, rgba(180, 83, 9, 0.05) 100%)'
              : 'linear-gradient(135deg, rgba(26, 20, 16, 0.4) 0%, rgba(15, 10, 8, 0.6) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: '4px',
            padding: '4rem',
            boxShadow: isDragActive
              ? '0 0 40px rgba(217, 119, 6, 0.2), inset 0 0 60px rgba(217, 119, 6, 0.05)'
              : '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
            transform: isDragActive ? 'scale(1.02)' : 'scale(1)'
          }}
        >
          <input {...getInputProps()} />

          <div className="mb-6">
            <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto" style={{ opacity: 0.6 }}>
              <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(217, 119, 6, 0.3)" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M40 20 L40 60 M20 40 L60 40" stroke="rgba(217, 119, 6, 0.5)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <h3 className="text-2xl font-light text-amber-200/90 mb-3 tracking-wide" style={{
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
            letterSpacing: '0.05em'
          }}>
            {isDragActive ? 'RELEASE TO ARCHIVE' : 'TRANSFER PROTOCOLS'}
          </h3>

          <p className="text-amber-300/50 text-sm mb-6 tracking-wider uppercase" style={{ letterSpacing: '0.15em' }}>
            PDF • Markdown • Text • Word
          </p>

          <button
            className="px-8 py-3 rounded text-amber-200/90 text-sm tracking-widest uppercase transition-all hover:bg-amber-900/30"
            style={{
              background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.2) 0%, rgba(180, 83, 9, 0.15) 100%)',
              border: '1px solid rgba(217, 119, 6, 0.3)',
              letterSpacing: '0.2em',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
            }}
          >
            Select Files
          </button>
        </div>

        {/* Stats - DUNE minimalist data panels */}
        {files.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div
              className="rounded p-5 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(161, 98, 7, 0.15) 0%, rgba(120, 53, 15, 0.1) 100%)',
                border: '1px solid rgba(161, 98, 7, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="text-3xl font-light text-amber-400/90 mb-1">{pendingCount}</div>
              <div className="text-xs uppercase tracking-widest text-amber-300/50" style={{ letterSpacing: '0.15em' }}>Queued</div>
            </div>
            <div
              className="rounded p-5 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.1) 100%)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="text-3xl font-light text-blue-400/90 mb-1">{processingCount}</div>
              <div className="text-xs uppercase tracking-widest text-blue-300/50" style={{ letterSpacing: '0.15em' }}>Active</div>
            </div>
            <div
              className="rounded p-5 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.1) 100%)',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="text-3xl font-light text-green-400/90 mb-1">{completeCount}</div>
              <div className="text-xs uppercase tracking-widest text-green-300/50" style={{ letterSpacing: '0.15em' }}>Archived</div>
            </div>
            <div
              className="rounded p-5 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="text-3xl font-light text-red-400/90 mb-1">{errorCount}</div>
              <div className="text-xs uppercase tracking-widest text-red-300/50" style={{ letterSpacing: '0.15em' }}>Failed</div>
            </div>
          </div>
        )}

        {/* File List - DUNE data manifest */}
        {files.length > 0 && (
          <div
            className="rounded p-6 mb-8"
            style={{
              background: 'linear-gradient(135deg, rgba(26, 20, 16, 0.6) 0%, rgba(15, 10, 8, 0.8) 100%)',
              border: '1px solid rgba(217, 119, 6, 0.15)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm uppercase tracking-widest text-amber-400/80" style={{ letterSpacing: '0.2em' }}>
                Transfer Manifest ({files.length})
              </h2>
              <button
                onClick={clearCompleted}
                className="text-xs uppercase tracking-wider text-amber-300/50 hover:text-amber-300/80 transition-colors"
                style={{ letterSpacing: '0.15em' }}
              >
                Purge Archived
              </button>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {files.map((fileData, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded transition-all"
                  style={{
                    background: fileData.status === 'complete'
                      ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)'
                      : fileData.status === 'processing'
                      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)'
                      : fileData.status === 'error'
                      ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)'
                      : 'rgba(0, 0, 0, 0.2)',
                    border: `1px solid ${
                      fileData.status === 'complete' ? 'rgba(34, 197, 94, 0.2)' :
                      fileData.status === 'processing' ? 'rgba(59, 130, 246, 0.2)' :
                      fileData.status === 'error' ? 'rgba(239, 68, 68, 0.2)' :
                      'rgba(217, 119, 6, 0.1)'
                    }`
                  }}
                >
                  {/* Status Indicator */}
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full ${
                      fileData.status === 'pending' ? 'bg-amber-400/50 animate-pulse' :
                      fileData.status === 'processing' ? 'bg-blue-400/90 animate-pulse' :
                      fileData.status === 'complete' ? 'bg-green-400/90' :
                      'bg-red-400/90'
                    }`} />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-amber-200/90 text-sm truncate mb-1">{fileData.file.name}</div>
                    <div className="text-xs text-amber-300/50">
                      {categories.find(c => c.value === fileData.category)?.label}
                      {fileData.author && ` • ${fileData.author}`}
                    </div>
                    {fileData.error && (
                      <div className="text-xs text-red-400/80 mt-1">{fileData.error}</div>
                    )}
                  </div>

                  {/* File Size */}
                  <div className="text-xs text-amber-300/40 tracking-wider">
                    {(fileData.file.size / 1024 / 1024).toFixed(2)} MB
                  </div>

                  {/* Remove Button */}
                  {fileData.status === 'pending' && (
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-400/60 hover:text-red-400/90 p-2 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Button - DUNE command interface */}
        {pendingCount > 0 && (
          <div className="flex gap-4">
            <button
              onClick={uploadFiles}
              disabled={isUploading}
              className="flex-1 py-4 px-8 rounded text-amber-200/95 text-sm uppercase tracking-widest transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: isUploading
                  ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(217, 119, 6, 0.4) 0%, rgba(180, 83, 9, 0.3) 100%)',
                border: '1px solid rgba(217, 119, 6, 0.4)',
                letterSpacing: '0.2em',
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
              }}
            >
              {isUploading ? 'Processing Transfer' : `Initiate Archive • ${pendingCount} File${pendingCount > 1 ? 's' : ''}`}
            </button>

            <button
              onClick={() => setFiles([])}
              className="px-8 py-4 rounded text-amber-300/60 text-sm uppercase tracking-widest hover:bg-red-900/20 hover:text-red-400/80 transition-all"
              style={{
                border: '1px solid rgba(217, 119, 6, 0.2)',
                letterSpacing: '0.2em',
                backdropFilter: 'blur(10px)'
              }}
            >
              Abort
            </button>
          </div>
        )}

        {/* Help Text - DUNE protocol guide */}
        <div
          className="mt-8 rounded p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(61, 40, 23, 0.2) 0%, rgba(26, 20, 16, 0.3) 100%)',
            border: '1px solid rgba(217, 119, 6, 0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <h3 className="text-xs uppercase tracking-widest text-amber-400/70 mb-4" style={{ letterSpacing: '0.2em' }}>
            Transfer Protocols
          </h3>
          <ul className="space-y-2 text-sm text-amber-300/60 leading-relaxed">
            <li className="flex gap-3">
              <span className="text-amber-500/50">→</span>
              <span>Set classification parameters once, then transfer multiple files in sequence</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500/50">→</span>
              <span>Optimal batch size: 10-20 files per transfer operation</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500/50">→</span>
              <span>System will auto-extract metadata and keywords from content</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500/50">→</span>
              <span>Uncertain classification? Select "Other Wisdom" for later sorting</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-500/50">→</span>
              <span>Background processing enabled — session persistence maintained</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
}
