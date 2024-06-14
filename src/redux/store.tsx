import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './features/languageSlice'; // Import your languageSlice reducer

const store = configureStore({
  reducer: {
    language: languageReducer, // Include the languageReducer in your store configuration
    // Add other reducers if you have them
  },
});

export default store;
