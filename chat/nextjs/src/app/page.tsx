"use client";

import CustomButton from "@/components/atoms/CustomButton";
import Chat from "@/components/organisms/Chat";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center gap-10 p-6 md:p-20">
      <Chat />
      <div className="flex flex-col items-center gap-5">
        <a
          href="https://prism.sh"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 group"
        >
          <p className="group-hover:underline">Solana-enabled AI agents by</p>
          <Image src="/prism.svg" alt="PRISM" width={100} height={30} />
        </a>
        <CustomButton cta="Read our docs" href="https://prism.sh/docs" />
      </div>
    </main>
  );
}
