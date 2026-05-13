import { Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { colors } from "../theme/colors";
import { radius } from "../theme/spacing";

type Props = {
  visible: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export function ModalShell({ visible, title, children, onClose }: Props) {
  const { width } = useWindowDimensions();
  const isCompact = width < 420;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.backdrop, isCompact ? styles.backdropCompact : null]}>
        <View style={[styles.sheet, isCompact ? styles.sheetCompact : null]}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close-outline" size={24} color={colors.text} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(42, 36, 33, 0.38)",
    justifyContent: "center",
    padding: 16
  },
  backdropCompact: {
    padding: 8
  },
  sheet: {
    width: "100%",
    maxWidth: 620,
    maxHeight: "88%",
    alignSelf: "center",
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 14
  },
  sheetCompact: {
    maxHeight: "94%",
    padding: 12
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800"
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.mutedSurface,
    alignItems: "center",
    justifyContent: "center"
  },
  body: {
    gap: 14
  }
});
