import type { Paradata } from "core/model/paradata";
import type { Table } from "dexie";

export type ParadataTable = {
  paradata: Table<Paradata>;
};

export const paradataSchema = { paradata: "++id,idSU,events" };

//TODO : replace schema (There are impact on legacy queens)
const newParadataSchema = { paradata: "idSu" }; //We just should need to index idSu only
