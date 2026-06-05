import { Gift, ShieldCheck, Wallet2 } from "lucide-react";
import {
  ErrorState,
  LinkButton,
  MetricTile,
  RetryHint,
  SectionHeader,
} from "@/components/GuardPrimitives";
import { getDashboardData } from "@/services";
import { DEMO_USER_ID } from "@/data/constants";
import { formatDate, prettifyLabel } from "@/lib/utils";

export default async function ProfilePage() {
  const dashboard = await getDashboardData(DEMO_USER_ID);

  if (!dashboard.status.user.ok) {
    return (
      <ErrorState
        title="Profile unavailable"
        body={
          dashboard.status.user.message ??
          "The live user profile could not be retrieved."
        }
        action={<RetryHint href="/profile" label="RELOAD PROFILE" />}
      />
    );
  }

  const user = dashboard.user;
  const stats = user?.stats;

  return (
    <div className="space-y-8 pb-8">
      <SectionHeader
        kicker="Session and identity"
        title="Telegram profile, wallet state, and referral position"
        description="This route consolidates the pieces the docs describe around onboarding, identity, referrals, and long-term ownership of the experience."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricTile
          icon={ShieldCheck}
          label="Telegram user"
          value={user?.username ? `@${user.username}` : "Demo guardian"}
          meta={user ? `Joined ${formatDate(user.createdAt)}` : "No user returned"}
          tone="accent"
        />
        <MetricTile
          icon={Wallet2}
          label="Wallet"
          value={user?.walletAddress ?? "Not connected"}
          meta="Wallet connection is backend-backed and stored against the user."
        />
        <MetricTile
          icon={Gift}
          label="Referral code"
          value={user?.referralCode ?? "Unavailable"}
          meta={`${dashboard.referrals?.count ?? 0} confirmed referrals`}
          tone="success"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
        <section className="panel-card rounded-[1.9rem] p-5 sm:p-6">
          <p className="section-kicker">Account snapshot</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {[
              {
                label: "User ID",
                value: user?.id ?? "Unavailable",
              },
              {
                label: "Telegram ID",
                value: user?.telegramId ?? "Unavailable",
              },
              {
                label: "XP / Level",
                value: stats ? `${stats.xp} XP • Level ${stats.level}` : "No stats row",
              },
              {
                label: "Streak",
                value: stats ? `${stats.streak} days` : "0 days",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[1.45rem] border border-border bg-white/[0.03] px-4 py-4"
              >
                <p className="text-[0.68rem] uppercase tracking-[0.2em] text-text-muted">
                  {item.label}
                </p>
                <p className="mt-3 break-all text-sm font-semibold text-white">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mini-divider my-6" />

          <div className="flex flex-wrap gap-3">
            <LinkButton href="/wallet">Review wallet guard</LinkButton>
            <LinkButton href="/leaderboard" variant="secondary">
              Check leaderboard
            </LinkButton>
          </div>
        </section>

        <section className="space-y-4">
          <div className="panel-card rounded-[1.9rem] p-5">
            <p className="section-kicker">Badge state</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {stats?.badges?.length ? (
                stats.badges.map((badge) => (
                  <span key={badge} className="chip" data-tone="accent">
                    {prettifyLabel(badge)}
                  </span>
                ))
              ) : (
                <span className="chip">No badges yet</span>
              )}
            </div>
          </div>

          <div className="panel-card rounded-[1.9rem] p-5">
            <p className="section-kicker">Profile role in the product</p>
            <p className="mt-3 text-sm leading-7 text-text-soft">
              This page gives the user one anchor for identity and progress. In the
              SwiftyDrop Guard concept, that matters because onboarding trust and
              long-term habit formation both depend on the app feeling coherent.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
