import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Check, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useAvailableAgents } from '../../hooks/useAvailableAgents';
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

  // Fetch available agents
  const { agents, isLoading, error, refetch } = useAvailableAgents({ 
    apiUrl: formData.apiBaseUrl,
    enabled: isOpen && isValidUrl(formData.apiBaseUrl)
  });

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
            className="fixed right-0 top-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col border-l border-gray-100 rounded-l-2xl overflow-hidden adk-config"
          >
            <div className="relative px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white adk-config-header">
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

            <div className="flex-1 p-5 space-y-6 overflow-y-auto bg-gray-50/60 adk-config-body">
              {/* API Section */}
              <section className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">API</h3>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600 mb-2">API Base URL</label>
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
                      <p className="text-xs text-gray-500 mt-1">ADK API server endpoint</p>
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
                      'rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all text-left',
                      formData.responseMode === 'stream'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                    )}
                  >
                    <div className="font-semibold mb-1">Stream</div>
                    <p className="text-xs text-gray-500">Tokens appear live (SSE)</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, responseMode: 'standard' })}
                    className={clsx(
                      'rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all text-left',
                      formData.responseMode === 'standard'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                    )}
                  >
                    <div className="font-semibold mb-1">Standard</div>
                    <p className="text-xs text-gray-500">Full response after processing</p>
                  </button>
                </div>
              </section>

              {/* Identity Section */}
              <section className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Identity</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">App Name</label>
                    <div className="relative">
                      <select
                        value={
                          isLoading || !formData.appName 
                            ? formData.appName 
                            : agents.includes(formData.appName) 
                            ? formData.appName 
                            : '__custom__'
                        }
                        onChange={(e) => {
                          setFormData({ ...formData, appName: e.target.value });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 appearance-none pr-10"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <option value="">Loading agents...</option>
                        ) : agents.length === 0 ? (
                          <option value="__custom__">Enter custom agent name...</option>
                        ) : (
                          <>
                            <option value="">Select an agent...</option>
                            {agents.map((agent) => (
                              <option key={agent} value={agent}>
                                {agent}
                              </option>
                            ))}
                            <option value="__custom__">Enter custom agent name...</option>
                          </>
                        )}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        {isLoading ? (
                          <Loader2 size={16} className="text-gray-400 animate-spin" />
                        ) : (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </div>
                      {agents.length > 0 && !isLoading && (
                        <button
                          type="button"
                          onClick={refetch}
                          className="absolute inset-y-0 right-8 flex items-center pr-2 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Refresh agents"
                        >
                          <RefreshCw size={14} />
                        </button>
                      )}
                    </div>
                    
                    {/* Custom input for manual app name entry */}
                    {(agents.length === 0 || formData.appName === '__custom__' || (formData.appName && !agents.includes(formData.appName))) && (
                      <div className="mt-2">
                        <input
                          type="text"
                          value={formData.appName === '__custom__' ? '' : formData.appName}
                          onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                          placeholder="Enter custom agent name..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 min-h-[18px] mt-1">
                      {error ? (
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <AlertCircle size={14} /> {error}
                        </p>
                      ) : isLoading ? (
                        <p className="text-xs text-gray-500">Fetching available agents...</p>
                      ) : agents.length > 0 ? (
                        <p className="text-xs text-gray-500">
                          {agents.length} agent{agents.length === 1 ? '' : 's'} available
                        </p>
                      ) : (
                        <p className="text-xs text-gray-500">No agents found. Enter custom name or check API connection.</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">User ID</label>
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
                      <label className="block text-xs font-medium text-gray-600 mb-2">Session ID</label>
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

            <div className="p-4 border-t border-gray-100 bg-white adk-config-footer">
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
