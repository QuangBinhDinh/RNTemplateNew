import React, { memo, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import EventEmitter from '../../EventEmitter';

const EVENT_NAME = 'SHOW_LOADING';

const LoadingSpinner = () => {
    const [visible, setVisible] = useState(false);
    const registered = (x: boolean) => {
        setVisible(x);
    };

    useEffect(() => {
        EventEmitter.addListener(EVENT_NAME, registered);
        return () => {
            EventEmitter.removeListener(EVENT_NAME, registered);
        };
    }, []);

    if (!visible) return null;
    return (
        <View style={[StyleSheet.absoluteFill, styles.container]}>
            <View style={styles.spinner}>
                <ActivityIndicator size={'large'} color={'#2792ce'} />
            </View>
        </View>
    );
};

export default memo(LoadingSpinner);

/**
 * Show loading overlay the current screen
 */
export const showLoading = (show: boolean) => {
    EventEmitter.dispatch(EVENT_NAME, show);
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 1000,
        position: 'absolute',
        elevation: 1,
    },
    spinner: {
        width: 100,
        height: 100,
        backgroundColor: 'white',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
