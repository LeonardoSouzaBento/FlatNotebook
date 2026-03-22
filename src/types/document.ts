export interface ImageEdit {
  crop?: { x: number; y: number; width: number; height: number };
  resize?: { width: number; height: number };
}

export interface BlockImage {
  id: string;
  src: string;
  alt?: string;
  edits: ImageEdit;
}

export interface Block {
  id: string;
  level: number;
  title: string;
  content: string;
  collapsed: boolean;
  children: Block[];
  images?: BlockImage[];
  order?: number;
}

export interface Document {
  id: string;
  title: string;
  subtitle?: string;
  createdAt: string;
  updatedAt: string;
  blocks: Block[];
}
