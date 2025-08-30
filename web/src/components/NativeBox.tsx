import { View, Text, StyleSheet } from "react-native";

export default function NativeBox() {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>Built with React Native components on the web</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 14,
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  text: { fontSize: 16, fontWeight: "600", color: "#111827" },
});
