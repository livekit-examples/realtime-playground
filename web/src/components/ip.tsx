"use client";

import Image from "next/image";
import ipLogo from "@/assets/ip.jpg";

export default function IP() {
  return (
    <div>
      <Image src={ipLogo} alt="logo2" width={120} />
    </div>
  );
}