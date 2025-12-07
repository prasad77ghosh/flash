"use client"

import { Paperclip, Send, Smile } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  onSend?: (text: string) => void;
  placeholder?: string;
  maxRows?: number;
};

export default function MessageInput({
  onSend = (t: string) => console.log("send:", t),
  placeholder = "Type a message",
  maxRows = 6,
}: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const autosize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "0px"; // reset
    const scrollHeight = ta.scrollHeight;
    const lineHeight = parseInt(getComputedStyle(ta).lineHeight || "20", 10);
    const maxHeight = lineHeight * maxRows;
    ta.style.height = Math.min(scrollHeight, maxHeight) + "px";
  };

  useEffect(() => {
    autosize();
  }, [value]);

  const send = () => {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
      <div className="w-full mx-auto flex items-end gap-2 px-7 py-2">
        {/* Left controls: Emoji + Attach */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Emoji"
            className="p-2 rounded-full transition cursor-pointer"
            title="Insert emoji"
          >
            <Smile size={20}/>
          </button>

          <button
            type="button"
            aria-label="Attach"
            className="p-2 rounded-full transition cursor-pointer"
            title="Attach files"
          >
            <Paperclip size={20}/>
          </button>
        </div>

        {/* Textarea */}
        <div className="flex-1">
          <div
            className={`rounded-2xl border ${
              isFocused
                ? "border-blue-400 shadow"
                : "border-gray-200 dark:border-gray-700"
            } px-3 py-2`}
          >
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={
                placeholder + " (Press Enter to send, Shift+Enter for newline)"
              }
              rows={1}
              className="w-full resize-none overflow-hidden bg-transparent outline-none text-sm leading-6"
            />
          </div>
        </div>

        {/* Send button */}
        <div className="flex items-center justify-center mb-1">
          <button
            type="button"
            onClick={send}
            disabled={value.trim().length === 0}
            className={`p-2 rounded-full transition  cursor-pointer`}
            aria-label="Send message"
            title="Send (Enter)"
          >
            <Send/>
          </button>
        </div>
      </div>
  );
}
