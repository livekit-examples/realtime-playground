"use client";

import { Copy, Share } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePlaygroundState } from "@/hooks/use-playground-state";
import { playgroundStateHelpers } from "@/lib/playground-state-helpers";
import { LockClosedIcon } from "@radix-ui/react-icons";

export function PresetShare() {
  const { pgState } = usePlaygroundState();
  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = playgroundStateHelpers.encodeToUrlParams(pgState);
      setLink(
        `${window.location.origin}${window.location.pathname}${params ? `?${params}` : ""}`,
      );
    }
  }, [pgState]);

  const handleCopy = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" className="text-sm font-semibold">
          <Share className="h-4 w-4" />
          <span className="ml-2 hidden md:block">Share</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[520px]">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-semibold">Share Preset</h3>
          <p className="text-sm text-muted-foreground">
            Anyone with this link and their own OpenAI key can try what
            you&apos;ve come up with.
          </p>
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={link} readOnly className="h-9" />
          </div>
          <Button type="button" size="sm" className="px-3" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
            <span className="text-sm font-semibold ml-1">
              {copied ? "Copied!" : "Copy"}
            </span>
          </Button>
        </div>
        <p className="bg-black/5 text-xs rounded-sm py-2 px-2 mt-4 flex gap-2">
          <LockClosedIcon className="h-3 w-3" />
          Your OpenAI key will not be shared.
        </p>
      </PopoverContent>
    </Popover>
  );
}
