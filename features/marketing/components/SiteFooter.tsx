import { ka } from "@/shared/i18n/ka";
import { Wordmark } from "@/shared/ui/wordmark";

export function SiteFooter() {
  return (
    <>
      <div className="grid gap-6.5 pb-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="min-w-0">
          <div className="mb-3.5">
            <Wordmark size={22} />
          </div>
          <div className="text-[13px] leading-relaxed text-muted-foreground">
            {ka.marketing.footer.address}
            <br />
            {ka.marketing.footer.phone}
          </div>
        </div>

        {ka.marketing.footer.columns.map((column) => (
          <div key={column.title} className="min-w-0">
            <div className="mb-3 text-xs font-bold tracking-[0.1em] text-ghost uppercase">
              {column.title}
            </div>
            <div className="flex flex-col gap-2.25">
              {column.links.map((link) => (
                <span key={link} className="text-[13.5px] text-ghost">
                  {link}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4.5 pb-2">
        <div className="text-[12.5px] text-ghost">
          {ka.marketing.footer.copyright}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {ka.marketing.footer.payments.map((payment) => (
            <span
              key={payment}
              className="rounded-full border border-white/90 bg-white/72 px-3.5 py-2 text-xs font-bold text-ink-soft"
            >
              {payment}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
