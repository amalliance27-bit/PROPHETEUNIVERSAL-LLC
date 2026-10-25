import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Google Calendar Scopes
provider.addScope('https://www.googleapis.com/auth/calendar');
provider.addScope('https://www.googleapis.com/auth/calendar.events');

// Google Drive Scopes
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/drive.file');

// Gmail Scopes
provider.addScope('https://mail.google.com/');
provider.addScope('https://www.googleapis.com/auth/gmail.send');
provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
provider.addScope('https://www.googleapis.com/auth/gmail.compose');

// Google Contacts Scopes
provider.addScope('https://www.googleapis.com/auth/contacts');
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

// Google Chat Scopes
provider.addScope('https://www.googleapis.com/auth/chat.spaces');
provider.addScope('https://www.googleapis.com/auth/chat.spaces.readonly');
provider.addScope('https://www.googleapis.com/auth/chat.messages');
provider.addScope('https://www.googleapis.com/auth/chat.messages.create');

let isSigningIn = false;
let cachedAccessToken: string | null = null;
let currentUser: User | null = null;

export const initWorkspaceAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    currentUser = user;
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Google Auth');
    }

    cachedAccessToken = credential.accessToken;
    currentUser = result.user;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

export const logoutGoogle = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  currentUser = null;
};

// ================= CALENDAR TYPES & FUNCTIONS =================
export interface CalendarEventItem {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink?: string;
}

export const fetchCalendarEvents = async (timeMin?: string, timeMax?: string): Promise<CalendarEventItem[]> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('User is not authenticated with Google');
  }

  const params = new URLSearchParams({
    singleEvents: 'true',
    orderBy: 'startTime',
    timeMin: timeMin || new Date().toISOString(),
  });

  if (timeMax) {
    params.append('timeMax', timeMax);
  }

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to fetch Google Calendar events');
  }

  const data = await response.json();
  return data.items || [];
};

export const createGoogleCalendarEvent = async (event: {
  summary: string;
  description?: string;
  location?: string;
  startIso: string;
  endIso: string;
}): Promise<CalendarEventItem> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('User is not authenticated with Google');
  }

  const payload = {
    summary: event.summary,
    description: event.description,
    location: event.location,
    start: {
      dateTime: event.startIso,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
    },
    end: {
      dateTime: event.endIso,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
    },
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to create Google Calendar event');
  }

  return await response.json();
};

export const deleteGoogleCalendarEvent = async (eventId: string): Promise<void> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('User is not authenticated with Google');
  }

  const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok && response.status !== 204) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to delete Google Calendar event');
  }
};

// ================= DRIVE TYPES & FUNCTIONS =================
export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  createdTime?: string;
  size?: string;
}

export const fetchDriveFiles = async (folderId?: string): Promise<DriveFileItem[]> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('User is not authenticated with Google');
  }

  let query = "trashed = false";
  if (folderId) {
    query += ` and '${folderId}' in parents`;
  }

  const params = new URLSearchParams({
    q: query,
    fields: 'files(id, name, mimeType, webViewLink, iconLink, thumbnailLink, createdTime, size)',
    orderBy: 'createdTime desc',
    pageSize: '50',
  });

  const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to fetch Google Drive files');
  }

  const data = await response.json();
  return data.files || [];
};

export const uploadFileToDrive = async (file: File, folderId?: string): Promise<DriveFileItem> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('User is not authenticated with Google');
  }

  const metadata: any = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,iconLink,thumbnailLink,createdTime,size', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to upload file to Google Drive');
  }

  return await response.json();
};

export const deleteDriveFile = async (fileId: string): Promise<void> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('User is not authenticated with Google');
  }

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok && response.status !== 204) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to delete Google Drive file');
  }
};

export const createDriveFolder = async (folderName: string, parentFolderId?: string): Promise<DriveFileItem> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('User is not authenticated with Google');
  }

  const metadata: any = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const response = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,mimeType,webViewLink,createdTime', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to create Google Drive folder');
  }

  return await response.json();
};

// ================= GMAIL TYPES & FUNCTIONS =================
export interface GmailMessageItem {
  id: string;
  threadId: string;
  snippet?: string;
  internalDate?: string;
  payload?: any;
  from?: string;
  to?: string;
  subject?: string;
  date?: string;
  bodyText?: string;
}

export interface GmailProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
}

export const fetchGmailProfile = async (): Promise<GmailProfile> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('User is not authenticated with Google');
  }

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to fetch Gmail profile');
  }

  return await response.json();
};

export const sendGmailMessage = async ({
  to,
  subject,
  bodyText,
}: {
  to: string;
  subject: string;
  bodyText: string;
}): Promise<any> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('User is not authenticated with Google');
  }

  // Construct standard RFC 2822 email format
  const emailLines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    bodyText.replace(/\n/g, '<br/>'),
  ];

  const rawEmail = emailLines.join('\r\n');

  // Base64URL encoding (RFC 4648)
  const encodedEmail = btoa(unescape(encodeURIComponent(rawEmail)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: encodedEmail }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to send email via Gmail API');
  }

  return await response.json();
};

export const fetchGmailMessages = async (maxResults: number = 10): Promise<GmailMessageItem[]> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('User is not authenticated with Google');
  }

  const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to list Gmail messages');
  }

  const data = await response.json();
  const messagesList = data.messages || [];

  // Fetch full details for each message
  const detailedMessages: GmailMessageItem[] = await Promise.all(
    messagesList.map(async (msg: { id: string; threadId: string }) => {
      try {
        const detailRes = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!detailRes.ok) return { id: msg.id, threadId: msg.threadId };
        const detail = await detailRes.json();

        const headers = detail.payload?.headers || [];
        const fromHeader = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || '';
        const toHeader = headers.find((h: any) => h.name.toLowerCase() === 'to')?.value || '';
        const subjectHeader = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
        const dateHeader = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';

        return {
          id: detail.id,
          threadId: detail.threadId,
          snippet: detail.snippet,
          internalDate: detail.internalDate,
          from: fromHeader,
          to: toHeader,
          subject: subjectHeader,
          date: dateHeader,
        };
      } catch (e) {
        return { id: msg.id, threadId: msg.threadId };
      }
    })
  );

  return detailedMessages;
};

// ================= GOOGLE CONTACTS (PEOPLE API) TYPES & FUNCTIONS =================
export interface GoogleContactItem {
  resourceName: string;
  etag?: string;
  displayName?: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
}

export const fetchGoogleContacts = async (): Promise<GoogleContactItem[]> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('User is not authenticated with Google');
  }

  const response = await fetch(
    'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,photos&pageSize=100',
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to fetch Google Contacts');
  }

  const data = await response.json();
  const connections = data.connections || [];

  return connections.map((person: any) => {
    const nameObj = person.names?.[0];
    const emailObj = person.emailAddresses?.[0];
    const phoneObj = person.phoneNumbers?.[0];
    const photoObj = person.photos?.[0];

    return {
      resourceName: person.resourceName,
      etag: person.etag,
      displayName: nameObj?.displayName || nameObj?.givenName || 'Unnamed Contact',
      email: emailObj?.value || '',
      phone: phoneObj?.value || '',
      photoUrl: photoObj?.url || '',
    };
  });
};

export const createGoogleContact = async (contact: {
  displayName: string;
  email?: string;
  phone?: string;
}): Promise<GoogleContactItem> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('User is not authenticated with Google');
  }

  const payload = {
    names: [{ givenName: contact.displayName }],
    emailAddresses: contact.email ? [{ value: contact.email }] : [],
    phoneNumbers: contact.phone ? [{ value: contact.phone }] : [],
  };

  const response = await fetch('https://people.googleapis.com/v1/people:createContact', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to create Google Contact');
  }

  const person = await response.json();
  const nameObj = person.names?.[0];
  const emailObj = person.emailAddresses?.[0];
  const phoneObj = person.phoneNumbers?.[0];

  return {
    resourceName: person.resourceName,
    etag: person.etag,
    displayName: nameObj?.displayName || contact.displayName,
    email: emailObj?.value || contact.email || '',
    phone: phoneObj?.value || contact.phone || '',
  };
};

export const deleteGoogleContact = async (resourceName: string): Promise<void> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('User is not authenticated with Google');
  }

  const response = await fetch(`https://people.googleapis.com/v1/${resourceName}:deleteContact`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok && response.status !== 204) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to delete Google Contact');
  }
};

// ================= GOOGLE CHAT TYPES & FUNCTIONS =================
export interface GoogleChatSpaceItem {
  name: string; // e.g. "spaces/AAAA..."
  displayName?: string;
  type?: string;
}

export interface GoogleChatMessageItem {
  name?: string;
  sender?: { displayName?: string; avatarUrl?: string };
  text?: string;
  createTime?: string;
}

export const fetchGoogleChatSpaces = async (): Promise<GoogleChatSpaceItem[]> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('User is not authenticated with Google');
  }

  const response = await fetch('https://chat.googleapis.com/v1/spaces', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to fetch Google Chat spaces');
  }

  const data = await response.json();
  return data.spaces || [];
};

export const fetchGoogleChatMessages = async (spaceName: string): Promise<GoogleChatMessageItem[]> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('User is not authenticated with Google');
  }

  const response = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages?pageSize=25`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to fetch messages for Chat space');
  }

  const data = await response.json();
  return data.messages || [];
};

export const sendGoogleChatMessage = async (spaceName: string, text: string): Promise<GoogleChatMessageItem> => {
  const token = getAccessToken();
  if (!token) {
    throw new Error('User is not authenticated with Google');
  }

  const response = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || 'Failed to send Google Chat message');
  }

  return await response.json();
};
