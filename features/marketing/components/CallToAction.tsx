import Link from "next/link";

export function CallToAction() {
  return (
    <section className="mt-20 flex flex-col gap-8 rounded-sheet bg-sage px-7 py-12 text-paper md:mt-22 md:flex-row md:items-center md:justify-between md:px-12 md:py-14">
      <div>
        <h2 className="text-[28px] leading-[1.1] font-semibold tracking-[-0.03em] md:text-[34px]">
          Print the codes tonight.
          <br />
          Answer your first guest tomorrow.
        </h2>
        <p className="mt-3 text-[15px] text-paper/75">
          30 days free · no card · cancel any time
        </p>
      </div>
      <Link
        href="/sign-up"
        className="inline-flex min-h-14 shrink-0 items-center self-start rounded-full bg-paper px-7 text-[16px] font-medium text-ink md:self-auto"
      >
        Start free trial
      </Link>
    </section>
  );
}
