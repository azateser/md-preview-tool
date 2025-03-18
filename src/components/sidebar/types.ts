export type Folder = {
  id: string;
  name: string;
  documents: string[];
  isOpen?: boolean;
};

export type Document = {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
};

export type ViewMode = 'grid' | 'list'; 