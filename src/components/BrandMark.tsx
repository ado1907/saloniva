import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

type Props = {
  size?: "sm" | "md" | "lg";
  dark?: boolean;
};

const sizes = {
  sm: 38,
  md: 46,
  lg: 58
};

export function BrandMark({ size = "md", dark }: Props) {
  const dimension = sizes[size];

  return (
    <View
      style={[
        styles.mark,
        {
          width: dimension,
          height: dimension,
          backgroundColor: dark ? colors.gold : colors.accent
        }
      ]}
    >
      <Text style={[styles.letter, { color: dark ? colors.ink : colors.white, fontSize: dimension * 0.48 }]}>S</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    borderRadius: radius.sm,
    alignItems: "center",
    justifyContent: "center"
  },
  letter: {
    fontWeight: "800"
  }
});
