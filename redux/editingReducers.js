import { EDIT_DRIVER_LOG_EVENT } from "./actions";

const initialState = {
  eventToEdit: {},
};

function editingReducers(state = initialState, action) {
  switch (action.type) {
    case EDIT_DRIVER_LOG_EVENT:
      return { ...state, eventToEdit: action.value };

    default:
      return state;
  }
}

export default editingReducers;
