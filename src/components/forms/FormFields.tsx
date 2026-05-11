import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../../theme/colors";
import { radius } from "../../theme/spacing";

type InputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  secureTextEntry?: boolean;
};

export function LabeledInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry
}: InputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8f8a86"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
    </View>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.errorBox}>
      <Text style={styles.errorText}>{message}</Text>
    </View>
  );
}

export const formStyles = StyleSheet.create({
  form: {
    gap: 12
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  grow: {
    flex: 1,
    minWidth: 160
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 4
  },
  helperText: {
    color: colors.muted,
    lineHeight: 19,
    fontWeight: "700"
  }
});

const styles = StyleSheet.create({
  field: {
    gap: 6
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  },
  input: {
    minHeight: 44,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    color: colors.text
  },
  errorBox: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.red,
    backgroundColor: "#fbefec",
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  errorText: {
    color: colors.danger,
    fontWeight: "800",
    lineHeight: 19
  }
});
