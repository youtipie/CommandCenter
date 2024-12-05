import {Text} from "react-native";
import {colors, fonts} from "../constants/styles";
import {moderateScale} from "../utils/metrics";

const ScalableText = ({style, children}) => {
    return (
        <Text
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