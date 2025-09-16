import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Check, AlertCircle } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { clsx } from 'clsx';

interface ConfigPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ConfigPanel({ isOpen, onClose }: ConfigPanelProps) {
  const config = useChatStore((state) => state.config);
  const updateConfig = useChatStore((state) => state.updateConfig);
  const clearMessages = useChatStore((state) => state.clearMessages);
  
  const [formData, setFormData] = useState(config);
  const [saved, setSaved] = useState(false);

  const isValidUrl = (value: string) => {
    try {
      const u = new URL(value);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const apiUrlInvalid = useMemo(() => !isValidUrl(formData.apiBaseUrl), [formData.apiBaseUrl]);

  const handleSave = () => {
    updateConfig(formData);
    clearMessages(); // Clear messages when config changes
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setFormData(config);
  };

  const isModified = JSON.stringify(formData) !== JSON.stringify(config);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-100 rounded-l-2xl overflow-hidden"
          >
            <div className="relative px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center shadow">
                    <Settings size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold tracking-tight">Configuration</h2>
                    <p className="text-xs text-blue-100/90">Runtime settings for {formData.appName}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close settings"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="flex-1 p-5 space-y-6 overflow-y-auto bg-gray-50/60">
              {/* API Section */}
              <section className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">API</h3>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600">API Base URL</label>
                  <input
                    type="url"
                    value={formData.apiBaseUrl}
                    onChange={(e) => setFormData({ ...formData, apiBaseUrl: e.target.value })}
                    className={clsx(
                      'w-full px-3.5 py-2.5 rounded-xl border text-sm placeholder-gray-400',
                      'bg-gray-50 focus:bg-white transition-all focus:outline-none focus:ring-2',
                      apiUrlInvalid
                        ? 'border-red-300 focus:ring-red-200'
                        : 'border-gray-200 focus:ring-blue-200 focus:border-blue-500'
                    )}
                    placeholder="http://localhost:8000"
                  />
                  <div className="flex items-center gap-2 min-h-[18px]">
                    {apiUrlInvalid ? (
                      <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle size={14} /> Invalid URL</p>
                    ) : (
                      <p className="text-xs text-gray-500">ADK API server endpoint</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Response Mode Section */}
              <section className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Response Mode</h3>
                <p className="text-xs text-gray-500 mb-3">Choose how responses are delivered.</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, responseMode: 'stream' })}
                    className={clsx(
                      'rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all text-left',
                      formData.responseMode === 'stream'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>Stream</span>
                      <span className={clsx(
                        'ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                        formData.responseMode === 'stream' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                      )}>
                        S
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Tokens appear live (SSE).</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, responseMode: 'standard' })}
                    className={clsx(
                      'rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all text-left',
                      formData.responseMode === 'standard'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span>Standard</span>
                      <span className={clsx(
                        'ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                        formData.responseMode === 'standard' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                      )}>
                        F
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Full response after processing.</p>
                  </button>
                </div>
              </section>

              {/* Identity Section */}
              <section className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Identity</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600">App Name</label>
                    <input
                      type="text"
                      value={formData.appName}
                      onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                      placeholder="my_sample_agent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Your ADK agent application name</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600">User ID</label>
                      <input
                        type="text"
                        value={formData.userId}
                        onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        placeholder="user_123"
                      />
                      <p className="text-xs text-gray-500 mt-1">Unique identifier for the user session</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600">Session ID</label>
                      <input
                        type="text"
                        value={formData.sessionId}
                        onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        placeholder="session_123"
                      />
                      <p className="text-xs text-gray-500 mt-1">Unique identifier for this conversation session</p>
                    </div>
                  </div>
                </div>
              </section>

              {isModified && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 shadow-sm">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertCircle size={16} />
                    <span className="text-sm font-medium">Unsaved Changes</span>
                  </div>
                  <p className="text-xs text-amber-700 mt-1">
                    Configuration changes will clear the current conversation.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={!isModified || apiUrlInvalid}
                  className={clsx(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm',
                    !isModified || apiUrlInvalid
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow'
                  )}
                >
                  {saved ? <Check size={16} /> : <Settings size={16} />}
                  {saved ? 'Saved!' : 'Save Changes'}
                </button>
                <button
                  onClick={handleReset}
                  disabled={!isModified}
                  className={clsx(
                    'px-4 py-2.5 rounded-xl font-medium transition-colors border',
                    isModified
                      ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'border-gray-200 text-gray-400 cursor-not-allowed'
                  )}
                >
                  Reset
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
