import { BellRing, Clock3, ShieldAlert, TriangleAlert } from "lucide-react";
import {
  ErrorState,
  LinkButton,
  MetricTile,
  RetryHint,
  SectionHeader,
} from "@/components/GuardPrimitives";
import { getDashboardData } from "@/services";
import { DEMO_USER_ID } from "@/data/constants";

export default async function AlertsPage() {
  const dashboard = await getDashboardData(DEMO_USER_ID);

  if (!dashboard.status.airdrops.ok || !dashboard.status.tasks.ok) {
    return (
      <ErrorState
        title="Alert engine unavailable"
        body={
          dashboard.status.airdrops.message ??
          dashboard.status.tasks.message ??
          "The live backend could not provide alert-driving data."
        }
        action={<RetryHint href="/alerts" label="RELOAD ALERTS" />}
      />
    );
  }

  const expiringSoon = dashboard.airdrops.filter((item) => item.deadline).length;

  return (
    <div className="space-y-8 pb-8">
      <SectionHeader
        kicker="Alert engine"
        title="Push urgency only when it matters"
        description="Telegram notifications are part of the core product loop here, not an afterthought. This page explains and stages the reminder, scam-warning, wallet-risk, and deadline behaviors supported by the backend."
        action={<LinkButton href="/profile">Open profile</LinkButton>}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <MetricTile
          icon={BellRing}
          label="Alert types"
          value={5}
          meta="new_airdrop, deadline_alert, scam_warning, wallet_risk, task_update"
          tone="accent"
        />
        <MetricTile
          icon={Clock3}
          label="Deadline-sensitive"
          value={expiringSoon}
          meta="Campaigns with deadlines that could trigger reminders."
          tone="warn"
        />
        <MetricTile
          icon={ShieldAlert}
          label="Risk-linked"
          value={dashboard.tasks.length}
          meta="Tasks and scans can both feed user-specific alerts."
          tone="success"
        />
        <MetricTile
          icon={TriangleAlert}
          label="Scam posture"
          value={dashboard.airdrops.filter((item) => (item.trustScore ?? 100) < 60).length}
          meta="Lower-confidence campaigns that deserve caution copy."
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {[
          {
            title: "New verified airdrop available",
            body: "Used when fresh catalogue entries arrive and clear the trust threshold you want to surface.",
          },
          {
            title: "Deadline ends soon",
            body: "Timed reminder for users who already generated a checklist and still have pending tasks.",
          },
          {
            title: "High-risk project detected",
            body: "Security-driven alert triggered when an analysis produces a high-risk verdict.",
          },
          {
            title: "Wallet exposed to risky contract",
            body: "Sent when a wallet scan surfaces suspicious contracts or dangerous approvals worth immediate action.",
          },
        ].map((card) => (
          <div key={card.title} className="panel-card p-5">
            <p className="section-kicker">Notification flow</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-white">
              {card.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-text-soft">{card.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
