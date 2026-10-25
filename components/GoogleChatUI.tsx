import React, { useState, useEffect } from 'react';
import {
  initWorkspaceAuth,
  googleSignIn,
  logoutGoogle,
  fetchGoogleChatSpaces,
  fetchGoogleChatMessages,
  sendGoogleChatMessage,
  GoogleChatSpaceItem,
  GoogleChatMessageItem
} from '../utils/googleWorkspace';
import { User } from 'firebase/auth';
import { MessageSquare, Send, RefreshCw, CheckCircle2, AlertCircle, LogOut, Users, Hash } from 'lucide-react';
import { VideoPanel } from './VideoPanel';

interface GoogleChatUIProps {
  LOGO_URL?: string;
}

export const GoogleChatUI: React.FC<GoogleChatUIProps> = ({ LOGO_URL }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [spaces, setSpaces] = useState<GoogleChatSpaceItem[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<GoogleChatSpaceItem | null>(null);
  const [messages, setMessages] = useState<GoogleChatMessageItem[]>([]);
  const [isLoadingSpaces, setIsLoadingSpaces] = useState<boolean>(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);

  const [messageText, setMessageText] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initWorkspaceAuth(
      (u) => {
        setUser(u);
        setIsAuthenticated(true);
        loadSpaces();
      },
      () => {
        setUser(null);
        setIsAuthenticated(false);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setIsAuthenticated(true);
        loadSpaces();
      }
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      setAuthError(err?.message || 'Failed to sign in with Google');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutGoogle();
      setUser(null);
      setIsAuthenticated(false);
      setSpaces([]);
      setSelectedSpace(null);
      setMessages([]);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const loadSpaces = async () => {
    setIsLoadingSpaces(true);
    try {
      const chatSpaces = await fetchGoogleChatSpaces();
      setSpaces(chatSpaces);
      if (chatSpaces.length > 0) {
        setSelectedSpace(chatSpaces[0]);
        loadSpaceMessages(chatSpaces[0].name);
      }
    } catch (err: any) {
      console.error('Error fetching Google Chat spaces:', err);
    } finally {
      setIsLoadingSpaces(false);
    }
  };

  const loadSpaceMessages = async (spaceName: string) => {
    setIsLoadingMessages(true);
    try {
      const msgs = await fetchGoogleChatMessages(spaceName);
      setMessages(msgs);
    } catch (err: any) {
      console.error('Error fetching space messages:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSelectSpace = (space: GoogleChatSpaceItem) => {
    setSelectedSpace(space);
    loadSpaceMessages(space.name);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpace || !messageText.trim()) return;

    const confirmMsg = `Confirm sending message to Google Chat space "${selectedSpace.displayName || selectedSpace.name}":\n\n"${messageText.trim()}"\n\nSend message now?`;
    if (!window.confirm(confirmMsg)) {
      return;
    }

    setIsSending(true);
    setSendSuccess(null);

    try {
      await sendGoogleChatMessage(selectedSpace.name, messageText.trim());
      setSendSuccess('Message sent successfully!');
      setMessageText('');
      await loadSpaceMessages(selectedSpace.name);
    } catch (err: any) {
      console.error('Failed to send Chat message:', err);
      alert(`Message sending failed: ${err?.message || 'Error sending message via Google Chat API'}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-sky-50/90 rounded-2xl shadow-xl border border-sky-200 p-4 sm:p-6 md:p-8 max-w-5xl mx-auto my-6 animate-fade-in text-slate-800">
      
      {/* Header Banner */}
      <div className="text-center mb-6 pb-6 border-b border-sky-200/80">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-md">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-wide">Google Chat Messaging Hub</h2>
        </div>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto font-medium">
          Collaborate with the Prophete Universal team, receive tax filing status alerts, and send real-time team messages in Google Chat.
        </p>
      </div>

      {/* Video Guide Panel */}
      <div className="mb-6 p-4 bg-white border border-sky-200 rounded-2xl shadow-sm">
        <div className="text-center mb-3">
          <h3 className="text-xl font-bold text-slate-900">How to Use Google Chat with Prophete Universal</h3>
          <p className="text-xs text-slate-600 font-medium">Join client spaces and receive real-time updates directly in Google Chat.</p>
        </div>
        <VideoPanel 
          src="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/d04a92583f86a984236969b82300e6bccd548b9a/solid%20logo%20spin.mp4" 
          subtitle="Prophete Universal • Google Chat Hub" 
          controls={true} 
          className="w-full max-w-md mx-auto shadow-md rounded-xl overflow-hidden" 
          videoHeightClass="h-40 sm:h-48" 
        />
      </div>

      {/* Auth Control Bar */}
      <div className="mb-6 p-4 bg-white rounded-2xl border border-teal-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {!isAuthenticated ? (
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3">
            <div className="text-left text-xs sm:text-sm text-slate-600">
              <span className="font-bold text-teal-950 block sm:inline">Google Chat Integration: </span>
              <span>Sign in with Google to view chat spaces and post team messages.</span>
            </div>
            <button 
              type="button" 
              onClick={handleSignIn}
              disabled={isAuthenticating}
              className="gsi-material-button min-w-[200px] flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg px-4 py-2 shadow-sm font-medium text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <div className="gsi-material-button-content-wrapper flex items-center gap-3">
                <div className="gsi-material-button-icon">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 block">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="gsi-material-button-contents font-bold text-xs sm:text-sm">
                  {isAuthenticating ? 'Connecting...' : 'Sign in with Google'}
                </span>
              </div>
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3">
            <div className="flex items-center gap-3 text-left">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="User avatar" className="w-10 h-10 rounded-full border border-teal-400" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center">
                  {user?.displayName?.[0] || 'G'}
                </div>
              )}
              <div>
                <p className="font-bold text-teal-950 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Connected to Google Chat
                </p>
                <p className="text-xs text-slate-500 truncate max-w-[220px]">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadSpaces}
                disabled={isLoadingSpaces}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                title="Refresh Chat Spaces"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingSpaces ? 'animate-spin text-teal-600' : ''}`} />
                Refresh
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                title="Disconnect Google Chat"
              >
                <LogOut className="w-3.5 h-3.5" />
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>

      {authError && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{authError}</span>
        </div>
      )}

      {/* Main Chat Interface */}
      {isAuthenticated && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
          
          {/* Left Column: Chat Spaces */}
          <div className="lg:col-span-4 p-5 bg-white rounded-2xl border border-sky-200 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base mb-3 flex items-center gap-2 border-b border-sky-100 pb-2">
              <Users className="w-5 h-5 text-emerald-600" /> Chat Spaces ({spaces.length})
            </h3>

            {isLoadingSpaces ? (
              <div className="py-8 text-center text-slate-500 text-xs font-semibold flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                <span>Loading Google Chat spaces...</span>
              </div>
            ) : spaces.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs">
                <p className="font-bold mb-1">No Chat Spaces Found</p>
                <p className="text-[11px] text-amber-800">You are not currently enrolled in any active Google Chat space. Please contact Prophete Universal to join our client workspace space.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {spaces.map(space => {
                  const isSelected = selectedSpace?.name === space.name;
                  return (
                    <button
                      key={space.name}
                      onClick={() => handleSelectSpace(space)}
                      className={`w-full p-3 rounded-xl text-left border transition-all flex items-center gap-2 text-xs font-bold ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-sky-50/50 hover:bg-sky-100 text-slate-800 border-sky-100'
                      }`}
                    >
                      <Hash className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />
                      <span className="truncate">{space.displayName || space.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Chat Messages & Input */}
          <div className="lg:col-span-8 p-5 bg-white rounded-2xl border border-sky-200 shadow-sm flex flex-col justify-between min-h-[380px]">
            
            {/* Space Header */}
            <div className="border-b border-sky-100 pb-3 mb-3 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  {selectedSpace ? (selectedSpace.displayName || selectedSpace.name) : 'Select a Chat Space'}
                </h3>
                {selectedSpace && (
                  <p className="text-[11px] text-slate-500">Google Chat API • Live Connection</p>
                )}
              </div>

              {selectedSpace && (
                <button
                  type="button"
                  onClick={() => loadSpaceMessages(selectedSpace.name)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1"
                  title="Reload Messages"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin text-emerald-600' : ''}`} />
                </button>
              )}
            </div>

            {/* Messages Feed */}
            <div className="flex-grow space-y-3 max-h-64 overflow-y-auto pr-1 mb-4">
              {!selectedSpace ? (
                <p className="py-12 text-center text-slate-400 text-xs italic">Select a space on the left to view conversation messages.</p>
              ) : isLoadingMessages ? (
                <div className="py-12 text-center text-slate-500 text-xs font-semibold flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>Loading space messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <p className="py-12 text-center text-slate-400 text-xs italic">No messages found in this space. Be the first to send a message!</p>
              ) : (
                messages.map((msg, idx) => (
                  <div key={msg.name || idx} className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-950">{msg.sender?.displayName || 'Chat Participant'}</span>
                      <span className="text-[10px] text-slate-400">
                        {msg.createTime ? new Date(msg.createTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-slate-800 font-medium whitespace-pre-wrap">{msg.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Send Message Form */}
            {selectedSpace && (
              <form onSubmit={handleSendMessage} className="space-y-2 border-t border-sky-100 pt-3">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    required 
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder={`Message #${selectedSpace.displayName || 'space'}...`}
                    className="flex-1 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold outline-none focus:border-emerald-500 bg-slate-50"
                  />
                  <button 
                    type="submit" 
                    disabled={isSending || !messageText.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5 text-xs uppercase tracking-wider"
                  >
                    {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    <span>Send</span>
                  </button>
                </div>

                {sendSuccess && (
                  <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {sendSuccess}
                  </p>
                )}
              </form>
            )}

          </div>

        </div>
      )}
    </div>
  );
};
