import note from "./notes.json";

export type Note = {
  id: number;
  createdAt: number;
  title: string;
  content: string;
  creatorName: string;
  isPrivate: boolean;
};

const data: Note[] = note;

export { data };
