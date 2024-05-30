import React, { useEffect } from 'react';
import { Text, View, NativeEventEmitter, NativeModules } from 'react-native';

const { NetworkStatus } = NativeModules;
const networkEmitter = new NativeEventEmitter(NetworkStatus);

const EmptyScreen = () => {
    useEffect(() => {
        if (!!NetworkStatus) {
            networkEmitter.addListener('networkStatusChanged', ({ status }) => {
                console.log(`Network changed ${status}`);
            });

            NetworkStatus.startMonitoring();

            return () => {
                networkEmitter.removeAllListeners('networkStatusChanged');
                NetworkStatus.stopMonitoring();
            };
        }
    }, []);
    return (
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, color: '#333' }}>This is a screen</Text>
        </View>
    );
};

export default EmptyScreen;
