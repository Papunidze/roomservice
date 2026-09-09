import { DICTIONARY, LANGUAGES } from "@/shared/i18n";

const RTL_COUNT = LANGUAGES.filter(
  (code) => DICTIONARY[code].dir === "rtl",
).length;

const STATS = [
  {
    value: String(LANGUAGES.length),
    label: "guest languages, chosen per hotel",
  },
  {
    value: String(RTL_COUNT),
    label: "right-to-left scripts, each in its own typeface",
  },
  { value: "0", label: "apps to install" },
  { value: "$49", label: "a month for up to 100 rooms" },
];

export function Stats() {
  return (
    <ul className="mt-18 grid grid-cols-2 gap-x-3.5 gap-y-6 border-y border-line py-9 md:grid-cols-4">
      {STATS.map((stat) => (
        <li key={stat.label}>
          <div className="text-[32px] font-semibold tracking-[-0.035em]">
            {stat.value}
          </div>
          <div className="mt-1.5 text-[13.5px] text-muted">{stat.label}</div>
        </li>
      ))}
    </ul>
  );
}
