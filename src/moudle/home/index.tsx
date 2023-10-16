import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View, Modal, Pressable } from 'react-native';
import { useFetchCategoryBannerQuery, useFetchHomeBannerQuery, useFetchPopularDesignQuery } from './service';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Icon } from '@rneui/base';
const HomeScreen = () => {
    const banner = useFetchHomeBannerQuery();
    const category = useFetchCategoryBannerQuery();

    const image_list = category.data?.result?.map((i: any) => ({ url: i.image_url }));
    const firstLoad = banner.isLoading || category.isLoading;

    const [visible, setVisible] = useState(false);
    const reload = () => {
        banner.refetch();
        category.refetch();
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
                onPress={() => setVisible(true)}
            >
                <Text style={{ color: 'white', fontSize: 18 }}>Open image</Text>
            </TouchableOpacity>

            <Modal visible={visible} transparent>
                <ImageViewer imageUrls={image_list} />
                <Pressable
                    style={{ position: 'absolute', top: 40, right: 15 }}
                    hitSlop={12}
                    onPress={() => setVisible(false)}
                >
                    <Icon type="antdesign" name="close" color={'white'} size={26} />
                </Pressable>
            </Modal>
        </View>
    );
};

export default HomeScreen;
