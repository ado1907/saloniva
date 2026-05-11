import { useEffect, useRef } from "react";
import { Animated, type TextProps } from "react-native";

type Props = TextProps & {
  delay?: number;
  children: string;
};

export function AnimatedText({ delay = 0, children, style, ...props }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 520,
        delay,
        useNativeDriver: true
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 520,
        delay,
        useNativeDriver: true
      })
    ]).start();
  }, [delay, opacity, translateY]);

  return (
    <Animated.Text {...props} style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.Text>
  );
}
