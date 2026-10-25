import React, { useState, useEffect } from 'react';
import {
  initWorkspaceAuth,
  googleSignIn,
  logoutGoogle,
  fetchDriveFiles,
  uploadFileToDrive,
  deleteDriveFile,
  createDriveFolder,
  DriveFileItem
} from '../utils/googleWorkspace';
import { User } from 'firebase/auth';
import { HardDrive, Upload, FolderPlus, Trash2, ExternalLink, RefreshCw, CheckCircle2, AlertCircle, FileText, Image, File, Search, LogOut } from 'lucide-react';
import { COMPANY_INFO } from '../constants';
import { VideoPanel } from './VideoPanel';

interface GoogleDriveUIProps {
  LOGO_URL?: string;
}

export const GoogleDriveUI: React.FC<GoogleDriveUIProps> = ({ LOGO_URL }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = initWorkspaceAuth(
      (u) => {
        setUser(u);
        setIsAuthenticated(true);
        loadFiles();
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
        loadFiles();
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
      setFiles([]);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const loadFiles = async () => {
    setIsLoading(true);
    try {
      const driveFiles = await fetchDriveFiles();
      setFiles(driveFiles);
    } catch (err: any) {
      console.error('Error fetching Google Drive files:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFiles: File[] = Array.from(e.target.files);

    // Explicit User Confirmation prompt as per guidelines
    const fileNames = selectedFiles.map(f => f.name).join(', ');
    if (!window.confirm(`Confirm uploading document(s) directly to your Google Drive:\n\n${fileNames}\n\nProceed with upload?`)) {
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      for (const file of selectedFiles) {
        await uploadFileToDrive(file);
      }
      setUploadStatus(`Successfully uploaded ${selectedFiles.length} document(s) to Google Drive!`);
      await loadFiles();
    } catch (err: any) {
      console.error('Upload failed:', err);
      alert(`Upload failed: ${err?.message || 'Error uploading to Google Drive'}`);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    if (!window.confirm(`Create new folder "${newFolderName}" in Google Drive?`)) {
      return;
    }

    setIsCreatingFolder(true);
    try {
      await createDriveFolder(newFolderName.trim());
      setNewFolderName('');
      await loadFiles();
    } catch (err: any) {
      alert(`Failed to create folder: ${err?.message || 'Error creating folder'}`);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleDelete = async (fileId: string, fileName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${fileName}" from your Google Drive?`)) {
      return;
    }

    try {
      await deleteDriveFile(fileId);
      await loadFiles();
    } catch (err: any) {
      alert(`Failed to delete file: ${err?.message || 'Error deleting file'}`);
    }
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('folder')) return <FolderPlus className="w-5 h-5 text-amber-500" />;
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-rose-500" />;
    if (mimeType.includes('image')) return <Image className="w-5 h-5 text-blue-500" />;
    return <File className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="bg-sky-50/90 rounded-2xl shadow-xl border border-sky-200 p-4 sm:p-6 md:p-8 max-w-5xl mx-auto my-6 animate-fade-in text-slate-800">
      
      {/* Header Banner */}
      <div className="text-center mb-6 pb-6 border-b border-sky-200/80">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-md">
            <HardDrive className="w-7 h-7" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase tracking-wide">Google Drive Document Portal</h2>
        </div>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto font-medium">
          Access, upload, and organize your tax intake files, W-2s, 1099s, and insurance policy records directly in Google Drive.
        </p>
      </div>

      {/* Video Guide Panel */}
      <div className="mb-6 p-4 bg-white border border-sky-200 rounded-2xl shadow-sm">
        <div className="text-center mb-3">
          <h3 className="text-xl font-bold text-slate-900">How to Manage Your Google Drive Documents</h3>
          <p className="text-xs text-slate-600 font-medium">Upload tax forms, IDs, and financial files directly into your Google Drive storage.</p>
        </div>
        <VideoPanel 
          src="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/d04a92583f86a984236969b82300e6bccd548b9a/solid%20logo%20spin.mp4" 
          subtitle="Prophete Universal • Google Drive Cloud Portal" 
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
              <span className="font-bold text-teal-950 block sm:inline">Google Drive Connection: </span>
              <span>Connect with Google to upload and view your files in real time.</span>
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
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Connected to Google Drive
                </p>
                <p className="text-xs text-slate-500 truncate max-w-[220px]">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadFiles}
                disabled={isLoading}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                title="Refresh Drive Files"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-teal-600' : ''}`} />
                Refresh
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                title="Disconnect Google Drive"
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

      {/* Main Drive Action Area */}
      {isAuthenticated && (
        <div className="space-y-6">
          {/* Action Row: File Upload & Folder Creation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Upload Box */}
            <div className="p-5 bg-white rounded-2xl border border-sky-200 shadow-sm text-left">
              <h4 className="font-extrabold text-slate-900 text-sm mb-1 flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" /> Upload Documents to Google Drive
              </h4>
              <p className="text-xs text-slate-500 mb-3">Attach W-2, 1099, Driver's License, or Tax Returns.</p>
              
              <label className={`block border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                isUploading ? 'bg-sky-100 border-sky-400' : 'bg-sky-50/50 hover:bg-sky-100/60 border-sky-300'
              }`}>
                <input 
                  type="file" 
                  multiple 
                  onChange={handleFileUpload} 
                  disabled={isUploading}
                  className="hidden" 
                />
                <div className="flex flex-col items-center justify-center">
                  <Upload className={`w-6 h-6 text-blue-600 mb-1 ${isUploading ? 'animate-bounce' : ''}`} />
                  <span className="text-xs font-bold text-slate-800">
                    {isUploading ? 'Uploading to Google Drive...' : 'Click to Select & Upload Files'}
                  </span>
                </div>
              </label>

              {uploadStatus && (
                <div className="mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{uploadStatus}</span>
                </div>
              )}
            </div>

            {/* Folder Creation Box */}
            <div className="p-5 bg-white rounded-2xl border border-sky-200 shadow-sm text-left">
              <h4 className="font-extrabold text-slate-900 text-sm mb-1 flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-amber-500" /> Create Client Folder in Drive
              </h4>
              <p className="text-xs text-slate-500 mb-3">Organize client tax files into dedicated year/client folders.</p>

              <form onSubmit={handleCreateFolder} className="flex gap-2">
                <input 
                  type="text" 
                  value={newFolderName} 
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="E.g., Tax Filing 2026 - John Doe"
                  className="flex-1 border border-slate-300 rounded-lg p-2 text-xs font-semibold outline-none focus:border-blue-500"
                />
                <button 
                  type="submit" 
                  disabled={isCreatingFolder || !newFolderName.trim()}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  {isCreatingFolder ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FolderPlus className="w-3.5 h-3.5" />}
                  Create
                </button>
              </form>
            </div>

          </div>

          {/* Files List & Search */}
          <div className="p-5 bg-white rounded-2xl border border-sky-200 shadow-sm text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
              <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-blue-600" /> Drive Files & Folders ({filteredFiles.length})
              </h4>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files in Drive..."
                  className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs font-medium outline-none focus:border-blue-500 bg-slate-50"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="py-8 text-center text-slate-500 text-xs font-semibold flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                <span>Loading Google Drive items...</span>
              </div>
            ) : filteredFiles.length === 0 ? (
              <p className="py-8 text-center text-slate-500 text-xs italic">
                {searchQuery ? 'No Google Drive files matching your search.' : 'No files found in Google Drive. Upload your first document above!'}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
                {filteredFiles.map(file => (
                  <div key={file.id} className="p-3 bg-sky-50/50 hover:bg-sky-100/60 border border-sky-100 rounded-xl transition-all flex flex-col justify-between text-xs">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="p-2 bg-white rounded-lg shadow-xs shrink-0">
                        {getFileIcon(file.mimeType)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-900 truncate" title={file.name}>{file.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {file.createdTime ? new Date(file.createdTime).toLocaleDateString() : 'Drive Item'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-sky-100/80 pt-2 mt-1">
                      {file.webViewLink ? (
                        <a 
                          href={file.webViewLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 text-[11px]"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Open in Drive
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400">Drive Item</span>
                      )}

                      <button 
                        onClick={() => handleDelete(file.id, file.name)}
                        className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition-colors"
                        title="Delete file"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
