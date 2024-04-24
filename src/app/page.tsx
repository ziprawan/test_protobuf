"use client";

import { NoteRequest, NoteResponse } from "@/../proto/proto";
import { util } from "protobufjs";
import { FormEvent, useState } from "react";
import { Note } from "./api/note/notes";

function NoteError() {
  return <div>Something went wrong. Try checking dev tools!</div>;
}

function NoteLoading({ className }: { className: string | undefined }) {
  return <div className={className}>Just wait ya!</div>;
}

function NoteNoResult() {
  return <div>No result!</div>;
}

function NoteView({ note }: { note: Note }) {
  return (
    <div
      className={`mb-2 mr-2 rounded-sm p-2 border border-slate-200 max-w-fit`}
    >
      <div>
        Note &#35;{note.id} by {note.creatorName}
      </div>
      <div className="text-gray-400 text-sm">
        Created At: {new Date(note.createdAt * 1000).toUTCString()}
      </div>
      <div className="my-2 font-bold text-xl">{note.title}</div>
      <div>{note.content}</div>
    </div>
  );
}

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [called, setCalled] = useState<boolean>(false);

  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(0);

  async function formSubmit(event: FormEvent<HTMLFormElement>) {
    setLoading(true);
    event.preventDefault();

    const msg = NoteRequest.create({ offset, limit, isPrivate });
    const enc = NoteRequest.encode(msg).finish();

    const fetched = await fetch("/api/note", {
      method: "POST",
      body: enc,
      headers: { "Content-Type": "text/plain" },
    });

    if (fetched.status !== 200) {
      setError(true);
    }

    const blob = await fetched.blob();
    const resBuff = Buffer.from(await blob.arrayBuffer());
    util.toJSONOptions.arrays = true;
    const dec = NoteResponse.decode(resBuff).toJSON();

    setNotes([...dec.noteList]);

    setLoading(false);
    setCalled(true);
  }

  return (
    <>
      <div className="m-2 font-bold text-xl">
        NOTES WITH PROTOBUF IMPLEMENTATION :D
      </div>
      <form className="m-2 flex flex-col gap-2" onSubmit={formSubmit}>
        <div className="flex gap-2">
          Offset:
          <input
            type={"number"}
            style={{
              MozAppearance: "textfield",
            }}
            onChange={(e) => setOffset(parseInt(e.target.value))}
            value={offset}
            className="bg-black text-slate-200 border border-white focus:outline-none pl-1 rounded-md"
          />
        </div>
        <div className="flex gap-2">
          Limit:
          <input
            type={"number"}
            style={{
              MozAppearance: "textfield",
            }}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            value={limit}
            className="bg-black text-slate-200 border border-white focus:outline-none pl-1 rounded-md"
          />
        </div>
        <div className="flex gap-2">
          <div>Is private?</div>
          <select
            onChange={(e) => {
              const value = e.target.value;

              if (value === "1") setIsPrivate(true);
              else if (value === "0") setIsPrivate(false);
            }}
            value={isPrivate ? "1" : "0"}
            className="bg-black text-slate-200 border border-white rounded-md p-1"
          >
            <option value={1}>true</option>
            <option value={0}>false</option>
          </select>
        </div>
        <div>
          <button type={"submit"} className="bg-red-100 text-black py-1 px-2">
            Fetch!
          </button>
        </div>
      </form>
      <div className="ml-2 mt-6">
        <div className="text-red-500">{error ? <NoteError /> : <></>}</div>
        <div>
          {loading ? (
            <NoteLoading className="text-green-400" />
          ) : (
            <>
              {notes.length === 0 && called ? (
                <NoteNoResult />
              ) : (
                notes.map((note, idx) => (
                  <NoteView key={`note_${idx}`} note={note} />
                ))
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
