import { trpc } from "@/constants/trpc";
import { StyleSheet, Text } from "react-native";

export function Hello() {
  const [hello] = trpc.sample.hello.useSuspenseQuery({ text: "World" });

  return <Text style={styles.title}>{hello.greeting}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
