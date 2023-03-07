import { configureStore } from '@reduxjs/toolkit';
import {
    authSlice,
    languageSlice,
    themeSlice,
    usersOnlineSlice,
    componentSlice,
} from './slices';
const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        languages: languageSlice.reducer,
        themes: themeSlice.reducer,
        usersOnline: usersOnlineSlice.reducer,
        components: componentSlice.reducer,
    },
});

export default store;
