"use client";

import CustomButton from "@/components/atoms/CustomButton";
import Chat from "@/components/organisms/Chat";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-between p-24">
      <Chat />
      <CustomButton cta="Read our docs" href="https://prism.sh/docs" />
    </main>
  );
}
