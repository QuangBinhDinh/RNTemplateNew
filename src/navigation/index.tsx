import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { memo } from 'react';
import BottomTabs from './AppNavigator';
import { navigationRef } from './service';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import DetailScreen from '../moudle/home/DetailScreen';
const Stack = createSharedElementStackNavigator();

const Router = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    cardStyleInterpolator: ({ current: { progress } }) => {
                        return { cardStyle: { opacity: progress } };
                    },
                }}
            >
                <Stack.Screen name="App" component={BottomTabs} options={{ animationEnabled: false }} />
                <Stack.Screen
                    name="Detail"
                    component={DetailScreen}
                    sharedElements={route => {
                        const { url } = route.params;
                        return [url];
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Router;
