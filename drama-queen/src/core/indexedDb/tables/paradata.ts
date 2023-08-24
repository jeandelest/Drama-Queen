import { Paradata } from "core/model/paradata";
import type { Table } from "dexie";

export type ParadataTable = {
  paradata: Table<Paradata>;
};

export const paradataSchema = { paradata: "++id,idSU,events" };
