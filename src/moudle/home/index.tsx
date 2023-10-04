import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useFetchHomeBannerQuery, useFetchPopularDesignQuery } from './service';
const HomeScreen = () => {
    const banner = useFetchHomeBannerQuery();
    const design = useFetchPopularDesignQuery();
    const firstLoad = banner.isLoading || design.isLoading;

    const reload = () => {
        banner.refetch();
        design.refetch();
    };
    return (
        <View style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}>
            <Text style={{ color: 'black', fontSize: 20, marginTop: 100 }}>Home Content</Text>
            {firstLoad && <ActivityIndicator style={{ marginTop: 25 }} color={'#2792ce'} size={'large'} />}

            <TouchableOpacity
                style={{
                    backgroundColor: '#ff7300',
                    width: 240,
                    height: 80,
                    borderRadius: 8,
                    marginTop: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={reload}
            >
                <Text style={{ color: 'white', fontSize: 18 }}>Refetch</Text>
            </TouchableOpacity>
        </View>
    );
};

export default HomeScreen;
