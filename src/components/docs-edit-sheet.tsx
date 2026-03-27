"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PencilLineIcon, SaveIcon, LoaderIcon, CheckIcon } from "lucide-react";

export function DocsEditSheet({
  filePath,
  rawContent,
}: {
  filePath: string;
  rawContent: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(rawContent);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  const handleSave = useCallback(async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/docs/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath, content }),
      });
      if (!res.ok) throw new Error("Save failed");
      setStatus("saved");
      setTimeout(() => {
        setOpen(false);
        setStatus("idle");
        router.refresh();
      }, 600);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }, [filePath, content, router]);

  const dirty = content !== rawContent;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="outline" size="sm">
            <PencilLineIcon className="size-3" />
            Edit
          </Button>
        }
      />
      <SheetContent
        side="right"
        className="sm:max-w-2xl w-full flex flex-col"
      >
        <SheetHeader>
          <SheetTitle>Edit document</SheetTitle>
          <SheetDescription className="font-mono text-xs">
            {filePath}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 min-h-0 px-4">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (status === "saved" || status === "error") setStatus("idle");
            }}
            spellCheck={false}
            className="h-full w-full resize-none rounded-md border bg-muted/50 p-4 font-mono text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>

        <SheetFooter className="flex-row justify-between border-t pt-4">
          <p className="text-xs text-muted-foreground self-center">
            {dirty ? "Unsaved changes" : "No changes"}
          </p>
          <Button
            onClick={handleSave}
            disabled={!dirty || status === "saving"}
            size="sm"
          >
            {status === "saving" && (
              <LoaderIcon className="size-3.5 animate-spin" />
            )}
            {status === "saved" && <CheckIcon className="size-3.5" />}
            {(status === "idle" || status === "error") && (
              <SaveIcon className="size-3.5" />
            )}
            {status === "saving"
              ? "Saving..."
              : status === "saved"
                ? "Saved"
                : status === "error"
                  ? "Failed — retry"
                  : "Save"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
