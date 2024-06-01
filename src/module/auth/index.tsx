import { TextSemiBold } from '@components/text';
import { useAppDispatch, useAppSelector } from '@store/hook';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { getProductsFilterBy, userLogin } from './service';
import auth from './reducer';
import { Icon } from '@rneui/base';
import { goBack } from '@navigation/service';
import { showMessage } from '@components/popup/BottomMessage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAbortController } from '@api/axios/abort';

const LoginScreen = () => {
    const insets = useSafeAreaInsets();
    const { userInfo, logged, error_msg } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    let promiseDispatch: any;

    const loginAction = async () => {
        const loginArgs = {
            email: 'test@printerval.com',
            password: '123456',
            deviceId: '8585f2885fc92dd2',
            fcm_token:
                'fHWndeQBTmeYrolB9H9HHy:APA91bF0iUckgXQTZSO9BTT2eGCDDyZLpK21HPPrfp2qub_NXeviCUiSvuVcb0An80rrx-jQC2shZpoun1IamICbc14fDY2JGP6aGuxV40BPpCX-sW5yIsfMBUb6Eclk_JVaUK0MbGiw',
        };
        try {
            const res = await dispatch(userLogin({ body: loginArgs })).unwrap();
            showMessage('Login success');
        } catch (e) {
            console.log(e);
            // Alert.alert('Login failed');
        }
    };

    const logoutAction = () => {
        dispatch(auth.actions.logout());
    };

    const handleLogin = !logged ? loginAction : logoutAction;

    const testGetProduct = async () => {
        const productFilterArgs = {
            event_id: 43,
            page_size: 40,
            page_type: 'category',
        };
        try {
            const res = await dispatch(getProductsFilterBy(productFilterArgs)).unwrap();
            console.log(res);
            showMessage('Get products success');
        } catch (e) {
            console.log(e);
        }
    };
    useAbortController();

    return (
        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', paddingTop: insets.top / 1.5 }}>
            {/* <LoadingSpinner /> */}
            <View style={styles.headerTitle}>
                <Pressable style={styles.backButton} hitSlop={10} onPress={goBack}>
                    <Icon type="ant-design" name="back" size={24} />
                </Pressable>
                <TextSemiBold style={{ fontSize: 20, width: '82%' }} numberOfLines={1}>
                    {'Login title'}
                </TextSemiBold>
            </View>
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Pressable style={styles.buttonLogin} onPress={handleLogin}>
                    <TextSemiBold style={{ fontSize: 20, color: 'white' }}>{logged ? 'Logout' : 'Login'}</TextSemiBold>
                </Pressable>

                {!!error_msg && <TextSemiBold style={styles.errorText}>{error_msg}</TextSemiBold>}
                {userInfo && <TextSemiBold style={styles.userText}>{userInfo?.full_name}</TextSemiBold>}

                <Pressable style={styles.buttonLogin} onPress={testGetProduct}>
                    <TextSemiBold style={{ fontSize: 20, color: 'white' }}>{'Fetch products'}</TextSemiBold>
                </Pressable>
            </View>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    headerTitle: {
        height: 64,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingLeft: 14,
    },
    backButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    buttonLogin: {
        width: 160,
        height: 60,
        borderRadius: 8,
        marginTop: 60,
        backgroundColor: '#2792ce',
        justifyContent: 'center',
        alignItems: 'center',
    },

    errorText: {
        marginTop: 24,
        color: 'red',
        fontSize: 16,
    },

    userText: { fontSize: 20, marginTop: 20 },
});
