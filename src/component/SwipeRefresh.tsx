import React, { useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';

interface SwipeRefreshProps {
    onRefresh: () => void;
    refreshing: boolean;
    children: React.ReactNode;
}

const SwipeRefresh: React.FC<SwipeRefreshProps> = ({ onRefresh, refreshing, children }) => {
    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {children}
        </ScrollView>
    );
};

export default SwipeRefresh;
