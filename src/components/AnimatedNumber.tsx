import { useEffect, useRef, useState } from "react";
import { Animated, Text, type TextStyle } from "react-native";
import { formatCurrency } from "../utils/format";

type Props = {
  value: number;
  currency?: boolean;
  prefix?: string;
  suffix?: string;
  style?: TextStyle;
};

export function AnimatedNumber({ value, currency, prefix = "", suffix = "", style }: Props) {
  const animated = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const listener = animated.addListener(({ value: nextValue }) => {
      setDisplayValue(Math.round(nextValue));
    });

    animated.setValue(0);
    Animated.timing(animated, {
      toValue: value,
      duration: 850,
      useNativeDriver: false
    }).start();

    return () => animated.removeListener(listener);
  }, [animated, value]);

  const text = currency ? formatCurrency(displayValue) : `${prefix}${displayValue}${suffix}`;

  return <Text style={style}>{text}</Text>;
}
