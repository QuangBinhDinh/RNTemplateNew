import { TextNormal } from '@components/text';
import { SCREEN_WIDTH } from '@util/index';
import React, { memo, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import EventEmitter from '../../EventEmitter';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const EVENT_NAME = 'open_message';

const DURATION = 1500;

const BottomMessage = () => {
    const [message, setMessage] = useState('Sample message');
    // const [visible, setVisible] = useState(false);

    const opacity = useSharedValue(0);
    const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    const open = (msg: string) => {
        setMessage(msg);
        opacity.value = withSequence(withTiming(1), withDelay(DURATION, withTiming(0)));
    };

    useEffect(() => {
        EventEmitter.addListener(EVENT_NAME, open);
        return () => {
            EventEmitter.removeListener(EVENT_NAME, open);
        };
    }, []);

    // if (!visible) return null;
    return (
        <Animated.View style={[styles.container, animStyle]} pointerEvents="none">
            <TextNormal style={{ lineHeight: 21, color: 'white', textAlign: 'center' }}>{message}</TextNormal>
        </Animated.View>
    );
};

export default memo(BottomMessage);

/**
 * Show 1 message thông báo ở phía dưới màn hình
 * @param content
 */
export const showMessage = (content: string) => {
    EventEmitter.dispatch(EVENT_NAME, content);
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 90,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dcdcdc',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 30,
        maxWidth: SCREEN_WIDTH * 0.7,
        zIndex: 2000,
        elevation: 5,
    },
});
