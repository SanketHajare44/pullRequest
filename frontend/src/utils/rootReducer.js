import { combineReducers, configureStore } from "@reduxjs/toolkit";

const appReducer = combineReducers({
    user: userReducer,
    feed: feedReducer,
    connection: connectionReducer,
    request: requestReducer,
});

const rootReducer = (state, action) => {

    if (action.type === "logout") {
        state = undefined;
    }

    return appReducer(state, action);
};

const appStore = configureStore({
    reducer: rootReducer,
});

export default appStore;