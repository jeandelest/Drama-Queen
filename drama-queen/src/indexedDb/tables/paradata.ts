import type { Table } from "dexie";

export type Paradata = { id?: number; idSu: string; events: object };

export type ParadataTable = {
  paradata: Table<Paradata>;
};

export const paradataSchema = { paradata: "++id,idSU,events" };
