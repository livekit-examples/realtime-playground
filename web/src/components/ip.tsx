"use client";

import Image from "next/image";
import IpLogo from "@/assets/ip.jpg";

export default function IP() {
  return (
    <div>
      <Image src={IpLogo} alt="logo2" width={120} />
    </div>
  );
}