import type { ProjectSelect } from "@/lib/types";
import { atomWithReducer } from "jotai/utils";

type State = {
  isOpen: boolean;
  project: ProjectSelect | undefined;
};

const initialState: State = { isOpen: false, project: undefined };

type Actions = { type: "open"; project?: ProjectSelect } | { type: "close" };

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case "open":
      return { isOpen: true, project: action.project };
    case "close":
      return { isOpen: false, project: undefined };
    default:
      return state;
  }
};

export const projectEditorAtom = atomWithReducer<State, Actions>(
  initialState,
  reducer,
);
