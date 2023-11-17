import { Nomenclature } from "core/model";
import { assert } from "tsafe/assert";
import type { Equals } from "tsafe/Equals";
import { z } from "zod";

export const NomenclatureSchema = z.array(
  z
    .object({
      id: z.string(),
      label: z.string(),
    })
    .catchall(z.string())
);

export const RequiredNomenclaturesSchema = z.string().array();
