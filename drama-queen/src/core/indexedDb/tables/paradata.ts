import { Paradata } from "core/model/paradata";
import type { Table } from "dexie";

export type ParadataOld = { id?: number; idSu: string; events: object };

export type ParadataTable = {
  paradata: Table<Paradata>;
};

export const paradataSchema = { paradata: "++id,idSU,events" };
