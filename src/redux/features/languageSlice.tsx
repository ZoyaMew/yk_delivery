import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import translations_en from '../../../i18n/translations_en.json';
import translations_zh from '../../../i18n/translations_zh.json';

type LanguageState = {
  currentLanguage: string;
  translations: Record<string, string>;
};

const initialState: LanguageState = {
  currentLanguage: 'english',
  translations: translations_en,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    changeLanguage: (state, action: PayloadAction<string>) => {
      state.currentLanguage = action.payload;
      state.translations = action.payload === 'english' ? translations_en : translations_zh;
    },
  },
});

export const { changeLanguage } = languageSlice.actions;

export default languageSlice.reducer;
