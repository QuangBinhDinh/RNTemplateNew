import React, { useEffect } from 'react';
import { ScrollView, View, NativeEventEmitter, NativeModules, Pressable } from 'react-native';
import { StyleSheet } from 'react-native';
import TrendExplore from './component/TrendExplore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MainCategory from './component/MainCategory';

import { useFetchCategoryBannerQuery, useFetchExploreProdQuery } from './service';
import { TextSemiBold } from '@components/text';
import { navigate } from '@navigation/service';

const HomeScreen = () => {
    const insets = useSafeAreaInsets();

    const { data: banner } = useFetchCategoryBannerQuery();
    const { data: explore } = useFetchExploreProdQuery();

    const toLogin = () => {
        navigate('LoginScreen');
    };

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} removeClippedSubviews>
                <View style={{ height: 10 + insets.top / 1.5 }} />
                <TrendExplore />
                <Pressable style={styles.someButton} onPress={toLogin}>
                    <TextSemiBold style={{ color: 'black' }}>Login Screen</TextSemiBold>
                </Pressable>
                <MainCategory data={banner?.result} />
            </ScrollView>
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    someButton: {
        width: 160,
        height: 60,
        backgroundColor: '#ff7300',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: 24,
    },
});
