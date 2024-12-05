import * as dotenv from "dotenv";

dotenv.config();


export default {
    "expo": {
        "name": "CommandCenter",
        "slug": "CommandCenter",
        "version": "1.0.0",
        "orientation": "portrait",
        "icon": "./assets/icon.png",
        "userInterfaceStyle": "light",
        "newArchEnabled": true,
        "splash": {
            "image": "./assets/splash-icon.png",
            "resizeMode": "contain",
            "backgroundColor": "#ffffff"
        },
        "ios": {
            "supportsTablet": true
        },
        "android": {
            "adaptiveIcon": {
                "foregroundImage": "./assets/adaptive-icon.png",
                "backgroundColor": "#ffffff"
            },
            "package": "com.youtipie.CommandCenter"
        },
        "web": {
            "favicon": "./assets/favicon.png"
        },
        "packagerOpts": {
            "config": "metro.config.js"
        },
        "plugins": [
            [
                "expo-screen-orientation",
                {
                    "initialOrientation": "PORTRAIT"
                }
            ],
            [
                "@rnmapbox/maps",
                {
                    "RNMapboxMapsImpl": "mapbox",
                    "RNMapboxMapsDownloadToken": process.env.MAPBOX_APIKEY
                }
            ]
        ],
        "extra": {
            "eas": {
                "projectId": "35633b6e-5c2f-4145-9cec-b54cef95ea99"
            }
        }
    }
}
