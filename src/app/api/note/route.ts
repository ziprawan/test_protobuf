import { NoteRequest, NoteResponse } from "@/../proto/proto";
import { NextRequest, NextResponse } from "next/server";
import { Note, data } from "./notes";

type NoteOption = {
  offset?: number;
  limit?: number;
  isPrivate?: boolean;
};

function send(data: { [k: string]: any }) {
  const msg = NoteResponse.create(data);
  const enc = NoteResponse.encode(msg).finish();
  const buff = Buffer.from(enc);

  return new NextResponse(buff, { headers: { "Content-Type": "text/plain" } });
}

async function getNote(opt?: NoteOption) {
  const result: Note[] = [];

  if (!opt) {
    result.push(...data);
    return send({ totalNote: result.length, noteList: result });
  } else {
    const offset = opt.offset ?? 0;
    const limit = opt.limit ?? data.length;
    const isPrivate = opt.isPrivate ?? false;

    let i = offset;
    let j = limit === 0 ? data.length : limit;

    while (j > 0) {
      i++;
      const currNote = data[i];

      // Reached end of all notes data
      if (!currNote) break;

      // Tidak mengikuti permintaan client
      if (currNote.isPrivate !== isPrivate) continue;

      result.push(currNote);

      j--;
    }

    return send({ totalNote: result.length, noteList: result });
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const params = url.searchParams;

  const offset = params.get("offset");
  const limit = params.get("limit");
  const isPrivate = params.get("private") !== null;

  console.log(offset, limit, isPrivate);

  if (offset && isNaN(parseInt(offset))) {
    return NextResponse.json(
      { ok: false, message: 'Invalid "offset" value' },
      { status: 400 },
    );
  }

  if (limit && isNaN(parseInt(limit))) {
    return NextResponse.json(
      { ok: false, message: 'Invalid "limit" value' },
      { status: 400 },
    );
  }

  return await getNote({
    offset: offset ? parseInt(offset) : undefined,
    limit: limit ? parseInt(limit) : undefined,
    isPrivate,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();

  const buff = Buffer.from(body);
  const jsonRequest: NoteOption = NoteRequest.decode(buff).toJSON();
  console.log(jsonRequest);

  return await getNote(jsonRequest);
}
