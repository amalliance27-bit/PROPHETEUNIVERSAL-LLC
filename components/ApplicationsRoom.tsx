import React, { useState, useEffect } from 'react';
import { VideoPanel } from './VideoPanel';
import { FileText, Shield, Phone, Upload, CheckCircle2, Trash2, FileCheck, HardDrive, Mail, Users, MessageSquare } from 'lucide-react';
import { GoogleDriveUI } from './GoogleDriveUI';
import { GmailUI } from './GmailUI';
import { GoogleContactsUI } from './GoogleContactsUI';
import { GoogleChatUI } from './GoogleChatUI';

export interface UploadedFileItem {
  id: string;
  name: string;
  category: string;
  size: string;
  type: string;
  dataUrl?: string;
}

const DOCUMENT_CATEGORIES = [
  { id: 'W2', label: 'W-2 Form' },
  { id: '1099', label: '1099 (NEC/MISC)' },
  { id: 'ID', label: 'Driver License / ID' },
  { id: 'TAX_RETURN', label: 'Prior Tax Return (1040)' },
  { id: 'INSURANCE', label: 'Policy / Records' },
  { id: 'OTHER', label: 'Other Document' },
];

const FormField = ({ label, type = "text", name, required = true }: { label: string, type?: string, name: string, required?: boolean }) => (
  <div className="mb-4 text-left">
    <label className="block text-slate-700 font-bold mb-2 uppercase text-xs sm:text-sm tracking-wide">{label} {required && <span className="text-red-500">*</span>}</label>
    {type === 'textarea' ? (
      <textarea name={name} required={required} className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none transition-colors text-slate-800 font-medium" rows={3}></textarea>
    ) : (
      <input type={type} name={name} required={required} className="w-full p-3 bg-white border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none transition-colors text-slate-800 font-medium" />
    )}
  </div>
);

const DocumentUploadSection = ({ 
  files, 
  setFiles, 
  defaultCategory = 'W2',
  title = "Upload Supporting Documents (W-2, 1099, ID, etc.)" 
}: { 
  files: UploadedFileItem[], 
  setFiles: React.Dispatch<React.SetStateAction<UploadedFileItem[]>>,
  defaultCategory?: string,
  title?: string 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [isDragging, setIsDragging] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    processFiles(Array.from(e.target.files));
  };

  const processFiles = (fileList: File[]) => {
    fileList.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const newItem: UploadedFileItem = {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          category: selectedCategory,
          size: formatFileSize(file.size),
          type: file.type,
          dataUrl: typeof reader.result === 'string' ? reader.result : undefined
        };
        setFiles(prev => [...prev, newItem]);
      };
      // Read as Data URL so we can transmit if needed, or get file contents
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="mt-6 mb-6 p-5 sm:p-6 bg-sky-50/80 rounded-2xl border-2 border-sky-200 shadow-sm text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {title}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">Attach W-2s, 1099s, Driver's License, 1040s or policy documents securely.</p>
        </div>
        {files.length > 0 && (
          <span className="self-start sm:self-auto px-3 py-1 bg-sky-600 text-white font-bold text-xs rounded-full shadow">
            {files.length} {files.length === 1 ? 'File Attached' : 'Files Attached'}
          </span>
        )}
      </div>

      {/* Category selector chips */}
      <div className="mb-4">
        <label className="block text-slate-700 font-bold mb-2 text-xs uppercase tracking-wider">Step 1: Tag Document Type</label>
        <div className="flex flex-wrap gap-2">
          {DOCUMENT_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-sky-700 text-white shadow-md ring-2 ring-sky-400' 
                  : 'bg-white text-slate-700 border border-sky-200 hover:bg-sky-100/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Drag & drop upload target */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer bg-white ${
          isDragging ? 'border-sky-600 bg-sky-100/60 scale-[1.01]' : 'border-sky-300 hover:border-sky-500 hover:bg-sky-50/50'
        }`}
      >
        <input 
          type="file" 
          multiple 
          accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          title="Click or drag files here to upload"
        />
        <div className="flex flex-col items-center justify-center pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-700 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <p className="text-sm font-bold text-slate-800">
            Click to Browse or Drag & Drop Documents Here
          </p>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Accepts PDF, PNG, JPG, WEBP, DOCX (Up to 15MB each)
          </p>
        </div>
      </div>

      {/* Attached files preview list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Attached Documents:</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {files.map(file => {
              const categoryObj = DOCUMENT_CATEGORIES.find(c => c.id === file.category);
              return (
                <div key={file.id} className="flex items-center justify-between p-3 bg-white border border-sky-200 rounded-xl shadow-sm text-xs">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className="p-2 bg-sky-100 text-sky-800 rounded-lg font-bold shrink-0">
                      <FileText className="w-4 h-4 text-sky-800" />
                    </span>
                    <div className="truncate">
                      <p className="font-bold text-slate-900 truncate" title={file.name}>{file.name}</p>
                      <div className="flex items-center gap-2 text-slate-500 font-medium mt-0.5">
                        <span className="bg-sky-100 text-sky-900 px-1.5 py-0.5 rounded font-bold">{categoryObj?.label || file.category}</span>
                        <span>{file.size}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeFile(file.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ml-2 shrink-0"
                    title="Remove File"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white/80 p-2.5 rounded-lg border border-sky-100">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Encrypted Submission: Your sensitive tax documents and IDs are sent directly to Prophete Universal.</span>
      </div>
    </div>
  );
};

export const TaxForm = () => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [status, setStatus] = useState<{ loading: boolean, message: string | null, type: 'success' | 'error' | null }>({ loading: false, message: null, type: null });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ loading: true, message: null, type: null });

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          formType: 'New Client Tax Intake', 
          formData: data,
          files: files.map(f => ({ name: f.name, category: f.category, size: f.size }))
        })
      });

      if (response.ok) {
        setStatus({ loading: false, message: `Your tax application and ${files.length} document(s) have been submitted successfully. We will contact you shortly!`, type: 'success' });
        (e.target as HTMLFormElement).reset();
        setFiles([]);
      } else {
        setStatus({ loading: false, message: 'Something went wrong. Please try again.', type: 'error' });
      }
    } catch (error) {
      setStatus({ loading: false, message: 'Network error. Please try again later.', type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in bg-white p-6 md:p-8 rounded-2xl border border-sky-200 shadow-md">
      {status.message && (
        <div className={`p-4 mb-6 rounded-xl font-bold text-center text-sm md:text-base ${status.type === 'success' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-red-100 text-red-900 border border-red-300'}`}>
          {status.message}
        </div>
      )}
      <div className="mb-6 border-b border-sky-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900">New Client Tax Intake</h3>
          <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">Fill out your personal details and upload W-2s, 1099s & IDs below.</p>
        </div>
        <span className="hidden sm:inline-block px-3 py-1 bg-yellow-100 text-yellow-900 font-black text-xs uppercase tracking-wider rounded-full border border-yellow-300">
          2026-2027 Filing
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-x-4">
        <FormField label="Full Name" name="fullName" />
        <FormField label="Email Address" type="email" name="email" />
        <FormField label="Phone Number" type="tel" name="phone" />
        <FormField label="Date of Birth" type="date" name="dob" />
        <FormField label="SSN or ITIN (Last 4 digits)" name="ssn_last4" />
        <FormField label="Filing Status" name="filingStatus" required={false} />
      </div>
      <FormField label="Full Mailing Address" name="address" />
      <FormField label="Additional Notes or Specific Deductions" type="textarea" name="notes" required={false} />

      {/* W-2, 1099, ID Upload Component */}
      <DocumentUploadSection 
        files={files} 
        setFiles={setFiles} 
        defaultCategory="W2"
        title="Upload Tax Documents (W-2, 1099, Driver's License)"
      />

      <button disabled={status.loading} type="submit" className="w-full mt-4 py-4 bg-gradient-to-r from-yellow-400 to-amber-400 text-teal-950 font-extrabold rounded-xl shadow-lg hover:from-yellow-300 hover:to-amber-300 uppercase tracking-wide text-base sm:text-lg transition-transform hover:scale-[1.01] disabled:opacity-50">
        {status.loading ? 'Submitting Application & Documents...' : `Submit Tax Intake ${files.length > 0 ? `(${files.length} Docs Attached)` : ''}`}
      </button>
    </form>
  );
};

export const InsuranceForm = () => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [status, setStatus] = useState<{ loading: boolean, message: string | null, type: 'success' | 'error' | null }>({ loading: false, message: null, type: null });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ loading: true, message: null, type: null });

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          formType: 'Insurance Application', 
          formData: data,
          files: files.map(f => ({ name: f.name, category: f.category, size: f.size }))
        })
      });

      if (response.ok) {
        setStatus({ loading: false, message: `Your insurance application and ${files.length} attached document(s) have been submitted successfully.`, type: 'success' });
        (e.target as HTMLFormElement).reset();
        setFiles([]);
      } else {
        setStatus({ loading: false, message: 'Something went wrong. Please try again.', type: 'error' });
      }
    } catch (error) {
      setStatus({ loading: false, message: 'Network error. Please try again later.', type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in bg-white p-6 md:p-8 rounded-2xl border border-sky-200 shadow-md">
      {status.message && (
        <div className={`p-4 mb-6 rounded-xl font-bold text-center text-sm md:text-base ${status.type === 'success' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-red-100 text-red-900 border border-red-300'}`}>
          {status.message}
        </div>
      )}
      <div className="mb-6 border-b border-sky-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900">Insurance Application</h3>
          <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">Life, Living Benefits, Home & Auto Protection Intake.</p>
        </div>
        <span className="hidden sm:inline-block px-3 py-1 bg-teal-100 text-teal-900 font-black text-xs uppercase tracking-wider rounded-full border border-teal-300">
          Protection Policy
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-x-4">
        <FormField label="Full Name" name="fullName" />
        <FormField label="Date of Birth" type="date" name="dob" />
        <FormField label="Email Address" type="email" name="email" />
        <FormField label="Phone Number" type="tel" name="phone" />
        <FormField label="Desired Coverage Amount" type="text" name="coverageAmount" />
        <FormField label="Insurance Type (Life / Home / Auto / IUL)" name="insuranceType" />
      </div>
      <FormField label="Health History Summary" type="textarea" name="healthHistory" />
      <FormField label="Beneficiary Details" type="textarea" name="beneficiary" />

      {/* Insurance Document Upload Component */}
      <DocumentUploadSection 
        files={files} 
        setFiles={setFiles} 
        defaultCategory="ID"
        title="Upload Driver's License & Existing Policy Documents"
      />

      <button disabled={status.loading} type="submit" className="w-full mt-4 py-4 bg-teal-800 text-white font-extrabold rounded-xl shadow-lg hover:bg-teal-700 uppercase tracking-wide text-base sm:text-lg transition-transform hover:scale-[1.01] disabled:opacity-50">
        {status.loading ? 'Submitting Application & Documents...' : `Submit Insurance Application ${files.length > 0 ? `(${files.length} Docs Attached)` : ''}`}
      </button>
    </form>
  );
};

export const CallbackForm = () => {
  const [files, setFiles] = useState<UploadedFileItem[]>([]);
  const [status, setStatus] = useState<{ loading: boolean, message: string | null, type: 'success' | 'error' | null }>({ loading: false, message: null, type: null });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ loading: true, message: null, type: null });

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          formType: 'Schedule / Call Back Request', 
          formData: data,
          files: files.map(f => ({ name: f.name, category: f.category, size: f.size }))
        })
      });

      if (response.ok) {
        setStatus({ loading: false, message: 'Your request and documents have been received successfully. We will call you soon!', type: 'success' });
        (e.target as HTMLFormElement).reset();
        setFiles([]);
      } else {
        setStatus({ loading: false, message: 'Something went wrong. Please try again.', type: 'error' });
      }
    } catch (error) {
      setStatus({ loading: false, message: 'Network error. Please try again later.', type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-fade-in bg-white p-6 md:p-8 rounded-2xl border border-sky-200 shadow-md">
      {status.message && (
        <div className={`p-4 mb-6 rounded-xl font-bold text-center text-sm md:text-base ${status.type === 'success' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-red-100 text-red-900 border border-red-300'}`}>
          {status.message}
        </div>
      )}
      <div className="mb-6 border-b border-sky-100 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900">Schedule Meeting / Request Call Back</h3>
          <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">Let us know your preferred time and optional documents to review.</p>
        </div>
        <span className="hidden sm:inline-block px-3 py-1 bg-sky-100 text-sky-900 font-black text-xs uppercase tracking-wider rounded-full border border-sky-300">
          Direct Callback
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-x-4">
        <FormField label="Full Name" name="fullName" />
        <FormField label="Phone Number" type="tel" name="phone" />
        <FormField label="Preferred Date" type="date" name="preferredDate" required={false} />
        <FormField label="Preferred Time" type="time" name="preferredTime" required={false} />
      </div>
      <FormField label="Reason for Call or Questions" type="textarea" name="reason" />

      {/* General Document Upload Component */}
      <DocumentUploadSection 
        files={files} 
        setFiles={setFiles} 
        defaultCategory="OTHER"
        title="Upload Any Supporting Documents or Questions"
      />

      <button disabled={status.loading} type="submit" className="w-full mt-4 py-4 bg-blue-600 text-white font-extrabold rounded-xl shadow-lg hover:bg-blue-500 uppercase tracking-wide text-base sm:text-lg transition-transform hover:scale-[1.01] disabled:opacity-50">
        {status.loading ? 'Requesting Call Back...' : `Request Call Back ${files.length > 0 ? `(${files.length} Docs Attached)` : ''}`}
      </button>
    </form>
  );
};

interface ApplicationsRoomProps {
  initialTab?: 'tax' | 'insurance' | 'callback' | 'drive' | 'gmail' | 'contacts' | 'chat';
}

export const ApplicationsRoom: React.FC<ApplicationsRoomProps> = ({ initialTab = 'tax' }) => {
  const [activeTab, setActiveTab] = useState<'tax' | 'insurance' | 'callback' | 'drive' | 'gmail' | 'contacts' | 'chat'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      {/* Light Blue / Sky Container matching Calendar Schedule styling */}
      <div className="bg-sky-50/90 rounded-2xl shadow-xl border border-sky-200 overflow-hidden">
        {/* Header Banner */}
        <div className="p-8 sm:p-10 bg-slate-900 text-white text-center relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
            Application Forms & Workspace Portal
          </h2>
          <p className="text-sky-200 text-base sm:text-lg max-w-2xl mx-auto font-medium mb-6">
            Submit tax intake forms, upload W-2s & 1099s to Drive, manage Contacts, and chat with team members in Google Chat.
          </p>

          {/* Video Panel explaining uploading process */}
          <div className="mt-4 flex justify-center">
            <VideoPanel 
              title="How to Upload Your Documents"
              subtitle="Watch this quick guide on attaching your W-2s, 1099s, ID, or policy files securely."
              subtitleColor="text-sky-300"
              className="max-w-md sm:max-w-lg"
              videoHeightClass="h-44 sm:h-52 md:h-60"
            />
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="p-3 bg-sky-100/60 border-b border-sky-200 flex flex-wrap gap-2 justify-center">
          <button 
            className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl font-extrabold uppercase tracking-wider text-xs sm:text-sm transition-all shadow-sm ${
              activeTab === 'tax' 
                ? 'bg-white text-teal-900 ring-2 ring-sky-400 shadow-md' 
                : 'bg-white/60 text-slate-700 hover:bg-white hover:text-teal-900'
            }`}
            onClick={() => setActiveTab('tax')}
          >
            <span className="flex items-center justify-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Tax & W2</span>
            </span>
          </button>
          <button 
            className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl font-extrabold uppercase tracking-wider text-xs sm:text-sm transition-all shadow-sm ${
              activeTab === 'insurance' 
                ? 'bg-white text-teal-900 ring-2 ring-sky-400 shadow-md' 
                : 'bg-white/60 text-slate-700 hover:bg-white hover:text-teal-900'
            }`}
            onClick={() => setActiveTab('insurance')}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Shield className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Insurance</span>
            </span>
          </button>
          <button 
            className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl font-extrabold uppercase tracking-wider text-xs sm:text-sm transition-all shadow-sm ${
              activeTab === 'callback' 
                ? 'bg-white text-teal-900 ring-2 ring-sky-400 shadow-md' 
                : 'bg-white/60 text-slate-700 hover:bg-white hover:text-teal-900'
            }`}
            onClick={() => setActiveTab('callback')}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Phone className="w-4 h-4 text-teal-700 shrink-0" />
              <span>Call Back</span>
            </span>
          </button>
          <button 
            className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl font-extrabold uppercase tracking-wider text-xs sm:text-sm transition-all shadow-sm ${
              activeTab === 'drive' 
                ? 'bg-blue-600 text-white ring-2 ring-blue-400 shadow-md' 
                : 'bg-white/60 text-slate-700 hover:bg-white hover:text-blue-900'
            }`}
            onClick={() => setActiveTab('drive')}
          >
            <span className="flex items-center justify-center gap-1.5">
              <HardDrive className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Drive</span>
            </span>
          </button>
          <button 
            className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl font-extrabold uppercase tracking-wider text-xs sm:text-sm transition-all shadow-sm ${
              activeTab === 'gmail' 
                ? 'bg-rose-600 text-white ring-2 ring-rose-400 shadow-md' 
                : 'bg-white/60 text-slate-700 hover:bg-white hover:text-rose-900'
            }`}
            onClick={() => setActiveTab('gmail')}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Mail className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Gmail</span>
            </span>
          </button>
          <button 
            className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl font-extrabold uppercase tracking-wider text-xs sm:text-sm transition-all shadow-sm ${
              activeTab === 'contacts' 
                ? 'bg-teal-600 text-white ring-2 ring-teal-400 shadow-md' 
                : 'bg-white/60 text-slate-700 hover:bg-white hover:text-teal-900'
            }`}
            onClick={() => setActiveTab('contacts')}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Users className="w-4 h-4 text-teal-500 shrink-0" />
              <span>Contacts</span>
            </span>
          </button>
          <button 
            className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl font-extrabold uppercase tracking-wider text-xs sm:text-sm transition-all shadow-sm ${
              activeTab === 'chat' 
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-400 shadow-md' 
                : 'bg-white/60 text-slate-700 hover:bg-white hover:text-emerald-900'
            }`}
            onClick={() => setActiveTab('chat')}
          >
            <span className="flex items-center justify-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Google Chat</span>
            </span>
          </button>
        </div>

        {/* Tab Content Form Container */}
        <div className="p-4 sm:p-6 md:p-8">
          {activeTab === 'tax' && <TaxForm />}
          {activeTab === 'insurance' && <InsuranceForm />}
          {activeTab === 'callback' && <CallbackForm />}
          {activeTab === 'drive' && <GoogleDriveUI />}
          {activeTab === 'gmail' && <GmailUI />}
          {activeTab === 'contacts' && <GoogleContactsUI />}
          {activeTab === 'chat' && <GoogleChatUI />}
        </div>
      </div>
    </div>
  );
};
