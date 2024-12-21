import {Text} from "react-native";
import {colors, fonts} from "../constants/styles";
import {moderateScale} from "../utils/metrics";

const ScalableText = ({style, children, testID = "ScalableText"}) => {
    return (
        <Text
            testID={testID}
            adjustsFontSizeToFit={true}
            numberOfLines={1}
            style={[{
                fontSize: moderateScale(32),
                fontFamily: fonts.primaryBold,
                color: colors.primaryText200
            }, style]}
        >
            {children}
        </Text>
    );
};

export default ScalableText;