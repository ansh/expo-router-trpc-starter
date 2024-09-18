import { trpc } from "@/constants/trpc";
import { ThemedText } from "./ThemedText";

export function Hello() {
  const [hello] = trpc.sample.hello.useSuspenseQuery({ text: "World" });

  return <ThemedText type="title">{hello.greeting}</ThemedText>;
}
