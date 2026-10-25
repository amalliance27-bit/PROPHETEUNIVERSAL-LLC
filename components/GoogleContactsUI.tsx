import React, { useState, useEffect } from 'react';
import {
  initWorkspaceAuth,
  googleSignIn,
  logoutGoogle,
  fetchGoogleContacts,
  createGoogleContact,
  deleteGoogleContact,
  GoogleContactItem
} from '../utils/googleWorkspace';
import { User } from 'firebase/auth';
import { Users, UserPlus, Trash2, Search, RefreshCw, CheckCircle2, AlertCircle, LogOut, Mail, Phone } from 'lucide-react';
import { COMPANY_INFO } from '../constants';
import { VideoPanel } from './VideoPanel';

interface GoogleContactsUIProps {
  LOGO_URL?: string;
}

export const GoogleContactsUI: React.FC<GoogleContactsUIProps> = ({ LOGO_URL }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [contacts, setContacts] = useState<GoogleContactItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // New Contact Form State
  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = initWorkspaceAuth(
      (u) => {
        setUser(u);
        setIsAuthenticated(true);
        loadContacts();
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
        loadContacts();
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
      setContacts([]);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const fetched = await fetchGoogleContacts();
      setContacts(fetched);
    } catch (err: any) {
      console.error('Error fetching Google Contacts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      alert('Contact name is required.');
      return;
    }

    const confirmMsg = `Confirm adding new contact to your Google Contacts:\n\nName: ${newName}\nEmail: ${newEmail || 'N/A'}\nPhone: ${newPhone || 'N/A'}\n\nProceed with adding contact?`;
    if (!window.confirm(confirmMsg)) {
      return;
    }

    setIsAdding(true);
    setAddSuccess(null);

    try {
      await createGoogleContact({
        displayName: newName.trim(),
        email: newEmail.trim() || undefined,
        phone: newPhone.trim() || undefined,
      });

      setAddSuccess(`Successfully added "${newName}" to your Google Contacts!`);
      setNewName('');
      setNewEmail('');
      setNewPhone('');
      await loadContacts();
    } catch (err: any) {
      console.error('Add contact failed:', err);
      alert(`Failed to create contact: ${err?.message || 'Error saving to Google Contacts'}`);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteContact = async (resourceName: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from your Google Contacts?`)) {
      return;
    }

    try {
      await deleteGoogleContact(resourceName);
      await loadContacts();
    } catch (err: any) {
      alert(`Failed to delete contact: ${err?.message || 'Error deleting Google Contact'}`);
    }
  };

  const filteredContacts = contacts.filter(c =>
    (c.displayName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.phone || '').includes(searchQuery)
  );

  return (
    <div className="bg-sky-50/90 rounded-2xl shadow-xl border border-sky-200 p-4 sm:p-6 md:p-8 max-w-5xl mx-auto my-6 animate-fade-in text-slate-800">
      
      {/* Header Banner */}
      <div className="text-center mb-6 pb-6 border-b border-sky-200/80">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-3 bg-teal-600 text-white rounded-2xl shadow-md">
            <Users className="w-7 h-7" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-wide">Google Contacts Client Directory</h2>
        </div>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto font-medium">
          Manage your client database, save tax preparation leads, and sync contact information with Google Contacts API.
        </p>
      </div>

      {/* Video Guide Panel */}
      <div className="mb-6 p-4 bg-white border border-sky-200 rounded-2xl shadow-sm">
        <div className="text-center mb-3">
          <h3 className="text-xl font-bold text-slate-900">How to Manage Client Contacts with Google Contacts</h3>
          <p className="text-xs text-slate-600 font-medium">Sync and view your tax clients, phone records, and email addresses directly in Google Contacts.</p>
        </div>
        <VideoPanel 
          src="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/d04a92583f86a984236969b82300e6bccd548b9a/solid%20logo%20spin.mp4" 
          subtitle="Prophete Universal • Google Contacts Portal" 
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
              <span className="font-bold text-teal-950 block sm:inline">Google Contacts Sync: </span>
              <span>Sign in with Google to view and add contacts directly to your Google account.</span>
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
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Connected to Google Contacts
                </p>
                <p className="text-xs text-slate-500 truncate max-w-[220px]">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadContacts}
                disabled={isLoading}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                title="Refresh Contacts"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-600' : ''}`} />
                Refresh
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                title="Disconnect Google Contacts"
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

      {/* Main Contacts Area */}
      {isAuthenticated && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
          
          {/* Add Contact Form */}
          <div className="lg:col-span-5 p-5 bg-white rounded-2xl border border-sky-200 shadow-sm">
            <h3 className="font-extrabold text-slate-900 text-base mb-3 flex items-center gap-2 border-b border-sky-100 pb-2">
              <UserPlus className="w-5 h-5 text-teal-600" /> Save New Client Contact
            </h3>

            <form onSubmit={handleAddContact} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-xs">Full Name *</label>
                <input 
                  type="text" 
                  required 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="E.g., Jane Smith"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold outline-none focus:border-teal-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-xs">Email Address</label>
                <input 
                  type="email" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold outline-none focus:border-teal-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-xs">Phone Number</label>
                <input 
                  type="tel" 
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-semibold outline-none focus:border-teal-500 bg-slate-50"
                />
              </div>

              {addSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{addSuccess}</span>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isAdding}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-2.5 rounded-xl shadow-sm transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAdding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}
                <span>Save to Google Contacts</span>
              </button>
            </form>
          </div>

          {/* Contacts List & Search */}
          <div className="lg:col-span-7 p-5 bg-white rounded-2xl border border-sky-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 border-b border-sky-100 pb-2">
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-600" /> Google Contacts Directory ({filteredContacts.length})
                </h3>

                {/* Search Bar */}
                <div className="relative w-full sm:w-56">
                  <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search contacts..."
                    className="w-full pl-8 pr-2.5 py-1 border border-slate-300 rounded-lg text-xs font-medium outline-none focus:border-teal-500 bg-slate-50"
                  />
                </div>
              </div>

              {isLoading ? (
                <div className="py-12 text-center text-slate-500 text-xs font-semibold flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
                  <span>Fetching Google Contacts...</span>
                </div>
              ) : filteredContacts.length === 0 ? (
                <p className="py-12 text-center text-slate-500 text-xs italic">
                  {searchQuery ? 'No contacts match your search.' : 'No Google Contacts found. Save a new client contact on the left!'}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                  {filteredContacts.map(c => (
                    <div key={c.resourceName} className="p-3 bg-sky-50/50 hover:bg-sky-100/60 border border-sky-100 rounded-xl transition-all flex flex-col justify-between text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          {c.photoUrl ? (
                            <img src={c.photoUrl} alt={c.displayName} className="w-8 h-8 rounded-full border border-teal-300 object-cover shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-extrabold flex items-center justify-center shrink-0">
                              {c.displayName?.[0] || 'C'}
                            </div>
                          )}
                          <span className="font-extrabold text-slate-900 truncate" title={c.displayName}>{c.displayName}</span>
                        </div>

                        <button 
                          type="button"
                          onClick={() => handleDeleteContact(c.resourceName, c.displayName || 'Contact')}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition-colors"
                          title="Delete Contact"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-600 pt-1 border-t border-sky-100">
                        {c.email && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Mail className="w-3 h-3 text-teal-600 shrink-0" />
                            <a href={`mailto:${c.email}`} className="hover:underline text-teal-800 font-medium truncate">{c.email}</a>
                          </div>
                        )}
                        {c.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-teal-600 shrink-0" />
                            <a href={`tel:${c.phone}`} className="hover:underline text-slate-800 font-medium">{c.phone}</a>
                          </div>
                        )}
                        {!c.email && !c.phone && (
                          <p className="text-[10px] text-slate-400 italic">No email or phone saved</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Google Contacts People API</span>
              <span className="font-bold text-teal-900">Official Integration</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
