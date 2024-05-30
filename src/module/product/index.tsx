import { TextSemiBold } from '@components/text';
import { Icon } from '@rneui/base';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useFetchProductInfoQuery } from './service';
import { goBack } from '@navigation/service';

const ProductDetailScreen = ({ route }: { route: any }) => {
    const { product_id, product_title } = route.params;

    const { data, isLoading } = useFetchProductInfoQuery(9999999999);

    useEffect(() => {}, []);
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={styles.containerTitle}>
                <Pressable style={styles.backButton} hitSlop={10} onPress={goBack}>
                    <Icon type="ant-design" name="back" size={24} />
                </Pressable>
                <TextSemiBold style={{ fontSize: 20, width: '82%' }} numberOfLines={1}>
                    {product_title}
                </TextSemiBold>
            </View>
            <View style={{ flex: 1 }}></View>
        </View>
    );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
    containerTitle: {
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
});
