"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Document } from '@/types/document';

type DocumentStore = {
  documents: Document[];
  activeDocumentId: string | null;
  setActiveDocumentId: (id: string | null) => void;
  addDocument: (document: Document) => void;
  updateDocument: (id: string, content: string, title?: string) => void;
  deleteDocument: (id: string) => void;
  updateDocumentsOrder: (newOrder: Document[]) => void;
  createDocument: () => void;
  renameDocument: (id: string, newTitle: string) => void;
  exportMarkdown: (id: string, filename?: string) => void;
  hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

const initialState = {
  documents: [],
  activeDocumentId: null,
  hasHydrated: false,
};

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setHasHydrated: (state) => set({ hasHydrated: state }),
      setActiveDocumentId: (id) => set({ activeDocumentId: id }),
      addDocument: (document) => set((state) => ({ 
        documents: [...state.documents, document] 
      })),
      updateDocument: (id, content, title) => set((state) => ({
        documents: state.documents.map((doc) =>
          doc.id === id 
            ? { 
                ...doc, 
                content,
                title: title || doc.title,
                updatedAt: new Date()
              } 
            : doc
        ),
      })),
      deleteDocument: (id) => {
        const { documents, activeDocumentId } = get();
        const newDocuments = documents.filter((doc) => doc.id !== id);
        set({ documents: newDocuments, activeDocumentId: activeDocumentId === id ? null : activeDocumentId });
      },
      updateDocumentsOrder: (newOrder) => set({ documents: newOrder }),
      createDocument: () => {
        const newDocument: Document = {
          id: crypto.randomUUID(),
          title: "Untitled Document",
          content: "",
          createdAt: new Date(),
          updatedAt: new Date()
        };
        set((state) => ({ 
          documents: [...state.documents, newDocument],
          activeDocumentId: newDocument.id
        }));
      },
      renameDocument: (id, newTitle) => {
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.id === id 
              ? { 
                  ...doc, 
                  title: newTitle,
                  updatedAt: new Date()
                } 
              : doc
          ),
        }));
      },
      exportMarkdown: (id, filename = "README.md") => {
        const { documents } = get();
        const doc = documents.find(doc => doc.id === id);
        
        if (doc) {
          const content = doc.content;
          const blob = new Blob([content], { type: 'text/markdown' });
          const url = URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = url;
          a.download = filename || `${doc.title.replace(/\s+/g, '-')}.md`;
          document.body.appendChild(a);
          a.click();
          
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
      }
    }),
    {
      name: "md-preview-documents",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
); 