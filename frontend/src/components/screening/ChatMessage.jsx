import { formatDate } from "@/utils/format";
import { cn } from "@/utils/cn";

export function ChatMessage({ message }) {
  const isSystem = message.sender === "system";

  return (
    <div className={cn("flex", isSystem ? "justify-start" : "justify-end")}>
      <div
        className={cn(
          "max-w-[90%] rounded-[24px] border px-5 py-4 text-sm leading-7 shadow-sm sm:max-w-[75%]",
          isSystem
            ? "rounded-bl-md border-slate-200 bg-white text-slate-700 dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-50"
            : "rounded-br-md border-transparent bg-gradient-to-br from-brand to-brand-deep text-white",
        )}
      >
        <p>{message.content}</p>
        <p
          className={cn(
            "mt-2 text-[11px]",
            isSystem
              ? "text-slate-400 dark:text-slate-300"
              : "text-white/70",
          )}
        >
          {formatDate(message.createdAt, { withTime: true })}
        </p>
      </div>
    </div>
  );
}
