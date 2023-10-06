import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { memo } from 'react';
import BottomTabs from './AppNavigator';
import { navigationRef } from './service';

const Stack = createStackNavigator();

const Router = () => {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="App" component={BottomTabs} options={{ animationEnabled: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default Router;
