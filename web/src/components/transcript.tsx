import { cn } from "@/lib/utils";
import { useAgent } from "@/hooks/use-agent";
import { useEffect, useRef, RefObject, useState } from "react";

export function Transcript({
  scrollContainerRef,
  scrollButtonRef,
}: {
  scrollContainerRef: RefObject<HTMLElement>;
  scrollButtonRef: RefObject<HTMLButtonElement>;
}) {
  const { displayTranscriptions } = useAgent();
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const calculateDistanceFromBottom = (container: HTMLElement) => {
    const { scrollHeight, scrollTop, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight;
  };

  const handleScrollVisibility = (
    container: HTMLElement,
    scrollButton: HTMLButtonElement,
  ) => {
    const distanceFromBottom = calculateDistanceFromBottom(container);
    const shouldShowButton = distanceFromBottom > 100;
    setShowScrollButton(shouldShowButton);
    scrollButton.style.display = shouldShowButton ? "flex" : "none";
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    const scrollButton = scrollButtonRef.current;
    if (container && scrollButton) {
      const handleScroll = () =>
        handleScrollVisibility(container, scrollButton);

      handleScroll(); // Check initial state
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [
    scrollContainerRef,
    scrollButtonRef,
    displayTranscriptions,
    handleScrollVisibility,
  ]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const distanceFromBottom = calculateDistanceFromBottom(container);
      const isNearBottom = distanceFromBottom < 100;

      if (isNearBottom) {
        transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [displayTranscriptions, scrollContainerRef, transcriptEndRef]);

  const scrollToBottom = () => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const scrollButton = scrollButtonRef.current;
    if (scrollButton) {
      scrollButton.addEventListener("click", scrollToBottom);
      return () => scrollButton.removeEventListener("click", scrollToBottom);
    }
  }, [scrollButtonRef]);

  const handleDownloadTranscript = () => {
    // Create CSV content
    let csvContent = "Timestamp,Participant,Text\n";

    displayTranscriptions.forEach(({ segment, participant, timestamp }) => {
      const csvRow = [
        new Date(timestamp || 0).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }),
        participant?.isAgent ? "Agent" : "User",
        `"${segment.text.trim().replace(/"/g, '""')}"`, // Escape quotes in the text
      ].join(",");

      csvContent += csvRow + "\n";
    });

    // Create Blob
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create download link
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `transcript_${new Date().toISOString()}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    console.log("Downloading transcript...");
  };

  return (
    <>
      <div className="flex items-center justify-between bg-white w-full p-4 border-b sticky top-0 z-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest">
          Transcript
        </h2>
        <button
          onClick={handleDownloadTranscript}
          className="inline-flex text-xs font-semibold uppercase tracking-widest items-center justify-center whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-300 text-neutral-50 shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 h-9 px-4 py-2 text-sm font-semibold bg-oai-green"
        >
          <span>Download</span>
        </button>
      </div>
      <div className="p-4 min-h-[300px] relative">
        {displayTranscriptions.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-300 text-sm">
            Get talking to start the conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {displayTranscriptions.map(
              ({ segment, participant, publication, timestamp }) =>
                segment.text.trim() !== "" && (
                  <div
                    key={segment.id}
                    className={cn(
                      "flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                      participant?.isAgent
                        ? "bg-neutral-100 text-[#09090B]"
                        : "ml-auto border border-neutral-300",
                    )}
                  >
                    <div className="flex flex-col">
                      <span>{segment.text.trim()}</span>
                      <span
                        className={`text-xs text-gray-400 mt-1 ${
                          participant?.isAgent
                            ? "text-left block"
                            : "text-right block"
                        }`}
                      >
                        {new Date(timestamp || 0).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ),
            )}
            <div ref={transcriptEndRef} />
          </div>
        )}
      </div>
    </>
  );
}
