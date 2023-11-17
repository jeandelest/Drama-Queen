import { CreateEvt } from "core/setup";
import { Evt } from "evt";
import { name } from "./state";

export const createEvt = (({ evtAction }) => {
  const evt = Evt.create<{
    action: "redirect";
  }>();

  evtAction
    .pipe((action) =>
      action.sliceName === name && action.actionName === "completed"
        ? [action]
        : null
    )
    .attach(() => {
      evt.post({
        action: "redirect",
      });
    });

  return evt;
}) satisfies CreateEvt;
