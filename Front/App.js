import * as SplashScreen from "expo-splash-screen";
import {useCallback} from "react";
import {StatusBar} from 'expo-status-bar';
import {View} from 'react-native';
import Navigation from "./src/components/navigation/Navigation";
import {useFonts} from "expo-font";
import {fonts} from "./src/constants/styles"

SplashScreen.preventAutoHideAsync();


export default function App() {
    const [loaded, error] = useFonts({
        [fonts.primaryRegular]: require('./assets/fonts/Montserrat-Regular.ttf'),
        [fonts.primaryBold]: require('./assets/fonts/Montserrat-Bold.ttf'),
    });

    const onLayoutRootView = useCallback(async () => {
        if (loaded) {
            await SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <View style={{flex: 1}} onLayout={onLayoutRootView}>
            <StatusBar style="light"/>
            <Navigation/>
        </View>
    );
}
