import { ka } from "@/shared/i18n/ka";
import { Button } from "@/shared/ui/button";

export function SocialRow({ label }: { label: string }) {
  return (
    <>
      <div className="my-5 flex items-center">
        <div className="h-px flex-1 bg-input" />
        <span className="px-4 text-xs font-medium tracking-[0.05em] text-muted-foreground uppercase">
          {label}
        </span>
        <div className="h-px flex-1 bg-input" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="block"
        className="rounded-full border-input text-foreground hover:bg-muted/70"
      >
        <span
          aria-hidden
          className="size-5 rounded-full bg-[conic-gradient(#EA4335_0_25%,#FBBC05_0_50%,#34A853_0_75%,#4285F4_0)]"
        />
        {ka.auth.google}
      </Button>
    </>
  );
}
