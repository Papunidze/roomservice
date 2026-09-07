import { ka } from "@/shared/i18n/ka";
import { Avatar } from "@/shared/ui/avatar";
import { Card } from "@/shared/ui/card";

export function Proof() {
  return (
    <section className="py-11 md:py-18">
      <div className="relative overflow-hidden rounded-[30px] bg-linear-140 from-primary-glow to-[#4b25c4] px-6.5 py-7.5 shadow-[0_30px_62px_rgb(108_60_255/0.34)] md:px-11 md:py-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-30 -right-20 size-100 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.22),transparent_70%)] blur-[40px]"
        />
        <div className="relative grid items-center gap-6.5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <div className="mb-2.5 text-[13px] font-bold text-white/78">
              {ka.marketing.stats.label}
            </div>
            <div className="bg-linear-100 from-white to-[#d9ccff] bg-clip-text text-[62px] leading-none font-extrabold tracking-[-0.04em] text-transparent md:text-[88px]">
              {ka.marketing.stats.value}
            </div>
            <div className="mt-2.5 text-[15px] leading-relaxed text-white/85">
              {ka.marketing.stats.text}
            </div>
          </div>
          <div className="grid min-w-0 gap-4 md:grid-cols-[repeat(auto-fit,minmax(120px,1fr))]">
            {ka.marketing.stats.cells.map((cell) => (
              <div
                key={cell.label}
                className="rounded-[20px] border border-white/10 bg-white/14 px-5 py-4.5 backdrop-blur-[14px]"
              >
                <div className="text-[26px] font-extrabold tracking-[-0.03em] whitespace-nowrap text-white">
                  {cell.value}
                </div>
                <div className="mt-1.5 text-[12.5px] text-white/78">
                  {cell.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        {ka.marketing.testimonials.map((testimonial) => (
          <Card key={testimonial.name} className="hover-lift px-7 py-6.5">
            <div className="text-[15px] leading-relaxed text-ink-soft">
              {testimonial.quote}
            </div>
            <div className="mt-5 flex items-center gap-3 border-t border-black/6 pt-4.5">
              <Avatar name={testimonial.name} size="default" />
              <div className="min-w-0">
                <div className="text-[13.5px] font-bold">
                  {testimonial.name}
                </div>
                <div className="mt-0.5 text-[12.5px] text-muted-foreground">
                  {testimonial.role}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
