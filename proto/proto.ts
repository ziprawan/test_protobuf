import { Root } from "protobufjs";
import { json } from "./proto.json";

const root = Root.fromJSON(json);

const NoteResponse = root.lookupType("webroot.NoteResponse");
const NoteMessage = root.lookupType("webroot.NoteMessage");
const NoteRequest = root.lookupType("webroot.NoteRequest");

export { NoteMessage, NoteResponse, NoteRequest };
