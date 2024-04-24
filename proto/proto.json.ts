import { INamespace } from "protobufjs";

const json: INamespace = {
  nested: {
    webroot: {
      nested: {
        NoteRequest: {
          fields: {
            offset: { id: 1, type: "uint32" },
            limit: { id: 2, type: "uint32" },
            isPrivate: { id: 3, type: "bool" },
          },
        },
        NoteMessage: {
          fields: {
            id: { type: "uint32", id: 1 },
            createdAt: { type: "uint32", id: 2 },
            title: { type: "string", id: 3 },
            content: { type: "string", id: 4 },
            creatorName: { type: "string", id: 5 },
          },
        },
        NoteResponse: {
          fields: {
            totalNote: { type: "uint32", id: 1 },
            noteList: { id: 2, type: "NoteMessage", rule: "repeated" },
          },
        },
      },
    },
  },
};

export { json };
