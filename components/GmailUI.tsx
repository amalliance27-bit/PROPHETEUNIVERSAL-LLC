import React, { useState, useEffect } from 'react';
import {
  initWorkspaceAuth,
  googleSignIn,
  logoutGoogle,
  sendGmailMessage,
  fetchGmailMessages,
  fetchGmailProfile,
  GmailMessageItem,
  GmailProfile
} from '../utils/googleWorkspace';
import { User } from 'firebase/auth';
import { Mail, Send, Inbox, RefreshCw, CheckCircle2, AlertCircle, LogOut, User as UserIcon, FileText, Sparkles } from 'lucide-react';
import { COMPANY_INFO } from '../constants';
import { VideoPanel } from './VideoPanel';

interface GmailUIProps {
  LOGO_URL?: string;
}

export const GmailUI: React.FC<GmailUIProps> = ({ LOGO_URL }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Profile & Messages
  const [profile, setProfile] = useState<GmailProfile | null>(null);
  const [messages, setMessages] = useState<GmailMessageItem[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);

  // Composer Form
  const [recipient, setRecipient] = useState<string>(COMPANY_INFO.email);
  const [subject, setSubject] = useState<string>('Inquiry for Prophete Universal');
  const [bodyText, setBodyText] = useState<string>('Hello Prophete Universal,\n\nI would like to request assistance regarding tax preparation and life insurance options.\n\nBest regards,');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initWorkspaceAuth(
      (u) => {
        setUser(u);
        setIsAuthenticated(true);
        loadGmailData();
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
        loadGmailData();
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
      setMessages([]);
      setProfile(null);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const loadGmailData = async () => {
    setIsLoadingMessages(true);
    try {
      const [profData, msgData] = await Promise.all([
        fetchGmailProfile().catch(() => null),
        fetchGmailMessages(8).catch(() => []),
      ]);
      if (profData) setProfile(profData);
      setMessages(msgData);
    } catch (err: any) {
      console.error('Error loading Gmail data:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const applyTemplate = (type: 'tax' | 'insurance' | 'callback') => {
    if (type === 'tax') {
      setSubject('Tax Preparation Intake Question');
      setBodyText(`Dear Prophete Universal Team,\n\nI have submitted my tax intake information and would like to follow up on the required documentation for my W-2s and 1099 forms.\n\nPlease let me know the next steps.\n\nBest regards,\n${user?.displayName || ''}`);
    } else if (type === 'insurance') {
      setSubject('Life & Disability Insurance Quote Request');
      setBodyText(`Dear Prophete Universal Team,\n\nI am interested in receiving a customized life insurance / living benefits policy quote.\n\nBest regards,\n${user?.displayName || ''}`);
    } else {
      setSubject('Consultation & Phone Callback Request');
      setBodyText(`Dear Prophete Universal Team,\n\nI would like to request a callback regarding your financial planning and tax services.\n\nPhone: (786) 877-7635\nBest regards,\n${user?.displayName || ''}`);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !subject || !bodyText) {
      alert('Please complete all recipient, subject, and message fields.');
      return;
    }

    // Explicit User Confirmation prompt as per guidelines
    const confirmMsg = `Confirm sending email via Gmail API:\n\nTo: ${recipient}\nSubject: ${subject}\n\nSend message now?`;
    if (!window.confirm(confirmMsg)) {
      return;
    }

    setIsSending(true);
    setSendSuccess(null);

    try {
      await sendGmailMessage({
        to: recipient,
        subject,
        bodyText,
      });

      setSendSuccess(`Your message to ${recipient} was successfully sent via Gmail!`);
      await loadGmailData();
    } catch (err: any) {
      console.error('Failed to send Gmail message:', err);
      alert(`Email sending failed: ${err?.message || 'Error sending message via Gmail API'}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-sky-50/90 rounded-2xl shadow-xl border border-sky-200 p-4 sm:p-6 md:p-8 max-w-5xl mx-auto my-6 animate-fade-in text-slate-800">
      
      {/* Header Banner */}
      <div className="text-center mb-6 pb-6 border-b border-sky-200/80">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-md">
            <Mail className="w-7 h-7" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-wide">Gmail Direct Communications</h2>
        </div>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto font-medium">
          Send direct inquiries, receive appointment updates, and communicate with Prophete Universal via Google Gmail API.
        </p>
      </div>

      {/* Video Guide Panel */}
      <div className="mb-6 p-4 bg-white border border-sky-200 rounded-2xl shadow-sm">
        <div className="text-center mb-3">
          <h3 className="text-xl font-bold text-slate-900">How to Contact Prophete Universal via Gmail</h3>
          <p className="text-xs text-slate-600 font-medium">Send secure email messages directly to our team at askmorpheus247@gmail.com.</p>
        </div>
        <VideoPanel 
          src="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/d04a92583f86a984236969b82300e6bccd548b9a/solid%20logo%20spin.mp4" 
          subtitle="Prophete Universal • Gmail Direct Portal" 
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
              <span className="font-bold text-teal-950 block sm:inline">Gmail Integration: </span>
              <span>Sign in with Google to compose and receive emails via Gmail API.</span>
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
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Connected to Gmail
                </p>
                <p className="text-xs text-slate-500 truncate max-w-[220px]">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadGmailData}
                disabled={isLoadingMessages}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                title="Sync Gmail"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin text-teal-600' : ''}`} />
                Sync
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                title="Disconnect Gmail"
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

      {/* Main Gmail Layout */}
      {isAuthenticated && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
          
          {/* Left / Top: Email Composer */}
          <div className="lg:col-span-7 p-6 bg-white rounded-2xl border border-sky-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-sky-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Send className="w-5 h-5 text-rose-600" /> Compose Gmail Message
              </h3>
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Official Gmail API
              </span>
            </div>

            {/* Quick Templates */}
            <div className="mb-4">
              <label className="block text-slate-700 font-bold mb-1.5 text-xs uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Email Templates:
              </label>
              <div className="flex flex-wrap gap-2">
                <button 
                  type="button"
                  onClick={() => applyTemplate('tax')}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg text-xs font-bold transition-colors"
                >
                  Tax Intake Inquiry
                </button>
                <button 
                  type="button"
                  onClick={() => applyTemplate('insurance')}
                  className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 rounded-lg text-xs font-bold transition-colors"
                >
                  Insurance Quote
                </button>
                <button 
                  type="button"
                  onClick={() => applyTemplate('callback')}
                  className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-200 rounded-lg text-xs font-bold transition-colors"
                >
                  Callback Request
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-xs uppercase tracking-wide">To *</label>
                <input 
                  type="email" 
                  required 
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="askmorpheus247@gmail.com"
                  className="w-full border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 rounded-xl p-2.5 font-medium text-sm outline-none bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-xs uppercase tracking-wide">Subject *</label>
                <input 
                  type="text" 
                  required 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject of your message"
                  className="w-full border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 rounded-xl p-2.5 font-medium text-sm outline-none bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-xs uppercase tracking-wide">Message Content *</label>
                <textarea 
                  required 
                  rows={5}
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder="Write your email content here..."
                  className="w-full border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 rounded-xl p-2.5 font-medium text-sm outline-none bg-slate-50"
                />
              </div>

              {sendSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{sendSuccess}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSending}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3 rounded-xl shadow-md transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending via Gmail API...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message via Gmail</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Inbox Preview */}
          <div className="lg:col-span-5 p-6 bg-white rounded-2xl border border-sky-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-sky-100 pb-3">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-teal-600" /> Recent Gmail Messages
                </h3>
                {profile && (
                  <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                    {profile.messagesTotal} Total
                  </span>
                )}
              </div>

              {isLoadingMessages ? (
                <div className="py-12 text-center text-slate-500 text-xs font-semibold flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
                  <span>Fetching Gmail inbox...</span>
                </div>
              ) : messages.length === 0 ? (
                <p className="py-12 text-center text-slate-500 text-xs italic">
                  No recent Gmail messages found.
                </p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {messages.map(msg => (
                    <div key={msg.id} className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate max-w-[180px]">{msg.from || 'Unknown Sender'}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {msg.date ? new Date(msg.date).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800 truncate">{msg.subject}</p>
                      {msg.snippet && (
                        <p className="text-[11px] text-slate-500 line-clamp-2">{msg.snippet}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Primary Office Contact:</span>
              <span className="font-bold text-teal-900">{COMPANY_INFO.email}</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
