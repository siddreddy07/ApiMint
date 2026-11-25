import { cn } from "@/lib/utils"

/** The mint stage: a green surface with a fine dot grain, in both themes. */
export function GrainPanel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-transparent bg-stage grain dark:border-border",
        className
      )}
      {...props}
    />
  )
}
