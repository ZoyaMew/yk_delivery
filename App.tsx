import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigation from "./src/layouts/navigation/AppNavigation";
import {LogBox} from 'react-native';
import { Provider } from 'react-redux';
import store from './src/redux/store';

export default function App() {
    return (
        <Provider store={store}>
        <PaperProvider>
            <NavigationContainer>
                <AppNavigation />
            </NavigationContainer>
        </PaperProvider>
        </Provider>
    );
}
LogBox.ignoreAllLogs()
