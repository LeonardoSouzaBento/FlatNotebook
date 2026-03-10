export interface Block {
  id: string;
  level: number;
  title: string;
  content: string;
  collapsed: boolean;
  children: Block[];
}

export interface Document {
  id: string;
  title: string;
  subtitle?: string;
  createdAt: string;
  updatedAt: string;
  blocks: Block[];
}
