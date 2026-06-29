import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, type DocumentData, type Firestore,
  setDoc, Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, type FirebaseStorage } from "firebase/storage";
import { db, storage, isFirebaseConfigured } from "@/lib/firebase";
import * as seed from "@/lib/data/seed";
import type {
  School, SocialAccount, ContentIdea, CalendarItem, ApprovalItem,
  MediaItem, Lead, AnalyticsSnapshot, WeeklyReport, Sponsor, AppUser,
} from "@/lib/types";

// ── Collection name constants (mirrors firestore.rules) ────────────────
const COLL = {
  users: "users",
  schools: "schools",
  socialAccounts: "socialAccounts",
  contentIdeas: "contentIdeas",
  contentCalendar: "contentCalendar",
  approvals: "approvals",
  mediaLibrary: "mediaLibrary",
  leads: "leads",
  analyticsMock: "analyticsMock",
  weeklyReports: "weeklyReports",
  sponsors: "sponsors",
} as const;

// ── Helpers ────────────────────────────────────────────────────────────

function col(name: string) {
  return collection(db as Firestore, name);
}

function docRef(name: string, id: string) {
  return doc(db as Firestore, name, id);
}

function mapDoc<T>(d: DocumentData): T {
  return { id: d.id, ...d.data() } as T;
}

function mapDocs<T>(snap: { docs: DocumentData[] }): T[] {
  return snap.docs.map((d) => mapDoc<T>(d));
}

// ── Schools ────────────────────────────────────────────────────────────

export async function getSchools(): Promise<School[]> {
  if (!isFirebaseConfigured) return seed.schools;
  const snap = await getDocs(col(COLL.schools));
  return mapDocs<School>(snap);
}

export async function updateSchool(id: string, data: Partial<School>): Promise<void> {
  if (!isFirebaseConfigured) return;
  await updateDoc(docRef(COLL.schools, id), { ...data, updatedAt: Timestamp.now().toDate().toISOString() });
}

// ── Social Accounts ────────────────────────────────────────────────────

export async function getSocialAccounts(): Promise<SocialAccount[]> {
  if (!isFirebaseConfigured) return seed.socialAccounts;
  const snap = await getDocs(col(COLL.socialAccounts));
  return mapDocs<SocialAccount>(snap);
}

export async function getSocialAccountsBySchool(schoolId: string): Promise<SocialAccount[]> {
  if (!isFirebaseConfigured) return seed.socialAccounts.filter((a) => a.schoolId === schoolId);
  const q = query(col(COLL.socialAccounts), where("schoolId", "==", schoolId));
  const snap = await getDocs(q);
  return mapDocs<SocialAccount>(snap);
}

export async function updateSocialAccount(id: string, data: Partial<SocialAccount>): Promise<void> {
  if (!isFirebaseConfigured) return;
  await updateDoc(docRef(COLL.socialAccounts, id), { ...data, updatedAt: Timestamp.now().toDate().toISOString() });
}

// ── Content Ideas ──────────────────────────────────────────────────────

export async function getContentIdeas(): Promise<ContentIdea[]> {
  if (!isFirebaseConfigured) return seed.contentIdeas;
  const snap = await getDocs(query(col(COLL.contentIdeas), orderBy("createdAt", "desc")));
  return mapDocs<ContentIdea>(snap);
}

export async function addContentIdea(data: Omit<ContentIdea, "id">): Promise<string | null> {
  if (!isFirebaseConfigured) return null;
  const ref = await addDoc(col(COLL.contentIdeas), { ...data, createdAt: Timestamp.now().toDate().toISOString(), updatedAt: Timestamp.now().toDate().toISOString() });
  return ref.id;
}

export async function updateContentIdea(id: string, data: Partial<ContentIdea>): Promise<void> {
  if (!isFirebaseConfigured) return;
  await updateDoc(docRef(COLL.contentIdeas, id), { ...data, updatedAt: Timestamp.now().toDate().toISOString() });
}

export async function deleteContentIdea(id: string): Promise<void> {
  if (!isFirebaseConfigured) return;
  await deleteDoc(docRef(COLL.contentIdeas, id));
}

// ── Calendar Items ─────────────────────────────────────────────────────

export async function getCalendarItems(): Promise<CalendarItem[]> {
  if (!isFirebaseConfigured) return seed.calendarItems;
  const snap = await getDocs(query(col(COLL.contentCalendar), orderBy("date", "asc")));
  return mapDocs<CalendarItem>(snap);
}

export async function addCalendarItem(data: Omit<CalendarItem, "id">): Promise<string | null> {
  if (!isFirebaseConfigured) return null;
  const ref = await addDoc(col(COLL.contentCalendar), { ...data, createdAt: Timestamp.now().toDate().toISOString(), updatedAt: Timestamp.now().toDate().toISOString() });
  return ref.id;
}

export async function updateCalendarItem(id: string, data: Partial<CalendarItem>): Promise<void> {
  if (!isFirebaseConfigured) return;
  await updateDoc(docRef(COLL.contentCalendar, id), { ...data, updatedAt: Timestamp.now().toDate().toISOString() });
}

export async function deleteCalendarItem(id: string): Promise<void> {
  if (!isFirebaseConfigured) return;
  await deleteDoc(docRef(COLL.contentCalendar, id));
}

// ── Approvals ──────────────────────────────────────────────────────────

export async function getApprovals(): Promise<ApprovalItem[]> {
  if (!isFirebaseConfigured) return seed.approvals;
  const snap = await getDocs(query(col(COLL.approvals), orderBy("createdAt", "desc")));
  return mapDocs<ApprovalItem>(snap);
}

export async function addApproval(data: Omit<ApprovalItem, "id">): Promise<string | null> {
  if (!isFirebaseConfigured) return null;
  const ref = await addDoc(col(COLL.approvals), { ...data, createdAt: Timestamp.now().toDate().toISOString(), updatedAt: Timestamp.now().toDate().toISOString() });
  return ref.id;
}

export async function updateApproval(id: string, data: Partial<ApprovalItem>): Promise<void> {
  if (!isFirebaseConfigured) return;
  await updateDoc(docRef(COLL.approvals, id), { ...data, updatedAt: Timestamp.now().toDate().toISOString() });
}

// ── Media Library ──────────────────────────────────────────────────────

export async function getMediaItems(): Promise<MediaItem[]> {
  if (!isFirebaseConfigured) return seed.mediaItems;
  const snap = await getDocs(query(col(COLL.mediaLibrary), orderBy("createdAt", "desc")));
  return mapDocs<MediaItem>(snap);
}

export async function addMediaItem(data: Omit<MediaItem, "id">): Promise<string | null> {
  if (!isFirebaseConfigured) return null;
  const ref = await addDoc(col(COLL.mediaLibrary), { ...data, createdAt: Timestamp.now().toDate().toISOString(), updatedAt: Timestamp.now().toDate().toISOString() });
  return ref.id;
}

export async function uploadMedia(file: File, path: string): Promise<string | null> {
  if (!isFirebaseConfigured || !storage) return null;
  const storageRef = ref(storage as FirebaseStorage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

// ── Leads ──────────────────────────────────────────────────────────────

export async function getLeads(): Promise<Lead[]> {
  if (!isFirebaseConfigured) return seed.leads;
  const snap = await getDocs(query(col(COLL.leads), orderBy("createdAt", "desc")));
  return mapDocs<Lead>(snap);
}

export async function addLead(data: Omit<Lead, "id">): Promise<string | null> {
  if (!isFirebaseConfigured) return null;
  const ref = await addDoc(col(COLL.leads), { ...data, createdAt: Timestamp.now().toDate().toISOString(), updatedAt: Timestamp.now().toDate().toISOString() });
  return ref.id;
}

export async function updateLead(id: string, data: Partial<Lead>): Promise<void> {
  if (!isFirebaseConfigured) return;
  await updateDoc(docRef(COLL.leads, id), { ...data, updatedAt: Timestamp.now().toDate().toISOString() });
}

export async function deleteLead(id: string): Promise<void> {
  if (!isFirebaseConfigured) return;
  await deleteDoc(docRef(COLL.leads, id));
}

// ── Analytics ──────────────────────────────────────────────────────────

export async function getAnalytics(): Promise<AnalyticsSnapshot[]> {
  if (!isFirebaseConfigured) return seed.analytics;
  const snap = await getDocs(col(COLL.analyticsMock));
  return mapDocs<AnalyticsSnapshot>(snap);
}

export async function updateAnalytics(id: string, data: Partial<AnalyticsSnapshot>): Promise<void> {
  if (!isFirebaseConfigured) return;
  await updateDoc(docRef(COLL.analyticsMock, id), { ...data, updatedAt: Timestamp.now().toDate().toISOString() });
}

// ── Weekly Reports ─────────────────────────────────────────────────────

export async function getWeeklyReports(): Promise<WeeklyReport[]> {
  if (!isFirebaseConfigured) return seed.weeklyReports;
  const snap = await getDocs(query(col(COLL.weeklyReports), orderBy("weekOf", "desc")));
  return mapDocs<WeeklyReport>(snap);
}

// ── Sponsors ───────────────────────────────────────────────────────────

export async function getSponsors(): Promise<Sponsor[]> {
  if (!isFirebaseConfigured) return seed.sponsors;
  const snap = await getDocs(query(col(COLL.sponsors), orderBy("createdAt", "desc")));
  return mapDocs<Sponsor>(snap);
}

export async function addSponsor(data: Omit<Sponsor, "id">): Promise<string | null> {
  if (!isFirebaseConfigured) return null;
  const ref = await addDoc(col(COLL.sponsors), { ...data, createdAt: Timestamp.now().toDate().toISOString(), updatedAt: Timestamp.now().toDate().toISOString() });
  return ref.id;
}

export async function updateSponsor(id: string, data: Partial<Sponsor>): Promise<void> {
  if (!isFirebaseConfigured) return;
  await updateDoc(docRef(COLL.sponsors, id), { ...data, updatedAt: Timestamp.now().toDate().toISOString() });
}

// ── Users ──────────────────────────────────────────────────────────────

export async function getUsers(): Promise<AppUser[]> {
  if (!isFirebaseConfigured) return seed.users;
  const snap = await getDocs(col(COLL.users));
  return mapDocs<AppUser>(snap);
}

export async function updateUser(id: string, data: Partial<AppUser>): Promise<void> {
  if (!isFirebaseConfigured) return;
  await updateDoc(docRef(COLL.users, id), { ...data, updatedAt: Timestamp.now().toDate().toISOString() });
}

// ── Seed data helper: populate Firestore with initial seed data ────────

export async function seedFirestore(): Promise<{ ok: boolean; message: string }> {
  if (!isFirebaseConfigured) {
    return { ok: false, message: "Firebase is not configured. Add your credentials in Settings first." };
  }

  try {
    const batches: Promise<unknown>[] = [];

    // Write schools
    for (const s of seed.schools) {
      batches.push(setDoc(docRef(COLL.schools, s.id), s));
    }

    // Write social accounts
    for (const a of seed.socialAccounts) {
      batches.push(setDoc(docRef(COLL.socialAccounts, a.id), a));
    }

    // Write content ideas
    for (const c of seed.contentIdeas) {
      batches.push(setDoc(docRef(COLL.contentIdeas, c.id), c));
    }

    // Write calendar items
    for (const c of seed.calendarItems) {
      batches.push(setDoc(docRef(COLL.contentCalendar, c.id), c));
    }

    // Write approvals
    for (const a of seed.approvals) {
      batches.push(setDoc(docRef(COLL.approvals, a.id), a));
    }

    // Write media items
    for (const m of seed.mediaItems) {
      batches.push(setDoc(docRef(COLL.mediaLibrary, m.id), m));
    }

    // Write leads
    for (const l of seed.leads) {
      batches.push(setDoc(docRef(COLL.leads, l.id), l));
    }

    // Write analytics
    for (const a of seed.analytics) {
      batches.push(setDoc(docRef(COLL.analyticsMock, `${a.schoolId}_${a.platform}`), a));
    }

    // Write reports
    for (const r of seed.weeklyReports) {
      batches.push(setDoc(docRef(COLL.weeklyReports, r.id), r));
    }

    // Write sponsors
    for (const s of seed.sponsors) {
      batches.push(setDoc(docRef(COLL.sponsors, s.id), s));
    }

    // Write users
    for (const u of seed.users) {
      batches.push(setDoc(docRef(COLL.users, u.id), u));
    }

    await Promise.all(batches);
    return { ok: true, message: "All seed data written to Firestore successfully!" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return { ok: false, message: `Failed to seed Firestore: ${msg}` };
  }
}
