import { faker } from "@faker-js/faker";
import { writeFileSync } from "fs";

type Note = {
  id: number;
  createdAt: number;
  title: string;
  content: string;
  creatorName: string;
  isPrivate: boolean;
};

const note: Note[] = [];

for (let i = 0; i < 50; i++) {
  const oh: Note = {
    id: i + 1,
    createdAt: faker.date.anytime().getTime(),
    title: faker.word.words(5),
    content: faker.word.words(100),
    creatorName: faker.internet.userName(),
    isPrivate: [true, false][Math.floor(Math.random() * 2)],
  };
  note.push(oh);
}

writeFileSync("notes.json", JSON.stringify(note, null, 2));
