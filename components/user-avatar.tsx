import Image from "next/image";
import { cn } from "@/lib/utils";

export function UserAvatar({
  name,
  image,
  size = "md",
  className,
  frameless = false
}: {
  name: string;
  image?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  frameless?: boolean;
}) {
  const sizes = {
    sm: "size-9 rounded-lg text-sm",
    md: "size-12 rounded-xl text-base",
    lg: "size-16 rounded-2xl text-xl",
    xl: "size-24 rounded-3xl text-3xl"
  };

  return (
    <div
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden font-black uppercase",
        frameless ? "bg-cloud text-ink" : "surface-panel",
        sizes[size],
        className
      )}
    >
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          sizes={size === "xl" ? "96px" : size === "lg" ? "64px" : "48px"}
          className="object-cover"
        />
      ) : (
        name.slice(0, 1)
      )}
    </div>
  );
}

