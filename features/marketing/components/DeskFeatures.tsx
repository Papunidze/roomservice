import {
  ArrowRight,
  ChartNoAxesColumn,
  Inbox,
  Languages,
  Send,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Section } from "./Section";

const FEATURES = [
  {
    icon: Inbox,
    title: "Inbox grouped by room",
    body: "Open requests sit under the room they came from, newest first, with urgency and waiting time on the row. Filter by status, urgency or assignee.",
  },
  {
    icon: Languages,
    title: "Both languages, side by side",
    body: "Each message shows what the guest sent and what your desk reads, with the guest's script and direction preserved.",
  },
  {
    icon: Send,
    title: "Composer with quick replies",
    body: "Three canned replies exist in every language, and the composer previews what the guest will actually see before you send.",
  },
  {
    icon: Users,
    title: "Team, routing and escalation",
    body: "Members have roles, categories route to a role by default, and anything left waiting too long escalates.",
  },
  {
    icon: ChartNoAxesColumn,
    title: "Analytics that answer questions",
    body: "Volume by hour, response times, the categories that keep coming back and the language mix your guests actually speak.",
  },
];

export function DeskFeatures() {
  return (
    <Section
      id="desk"
      eyebrow="Front desk"
      title="One console: inbox, rooms, team, analytics, settings."
      className="bg-paper"
    >
      <div className="grid gap-3.5 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-card border border-line-strong bg-surface p-6"
          >
            <feature.icon strokeWidth={1.4} className="size-5.5 text-sage" />
            <h3 className="mt-7 text-[15.5px] leading-tight font-semibold tracking-[-0.02em]">
              {feature.title}
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              {feature.body}
            </p>
          </div>
        ))}

        <Link
          href="/desk"
          className="flex flex-col rounded-card bg-sage-ink p-6 text-paper"
        >
          <ArrowRight strokeWidth={1.4} className="size-5.5 text-sand" />
          <span className="mt-7 text-[15.5px] leading-tight font-semibold tracking-[-0.02em]">
            Open the console
          </span>
          <span className="mt-2 text-[13px] leading-relaxed text-paper/65">
            It is loaded with a demo hotel — 59 rooms, live sessions and a full
            inbox. Send yourself a request from room 205 and watch it arrive.
          </span>
        </Link>
      </div>
    </Section>
  );
}
