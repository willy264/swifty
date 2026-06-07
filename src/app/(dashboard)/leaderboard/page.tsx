import { Gift, Sparkle, Trophy, Users } from "lucide-react";
import {
  ErrorState,
  LeaderboardCard,
  MetricTile,
  RetryHint,
  SectionHeader,
} from "@/components/GuardPrimitives";
import { getDashboardData } from "@/services";
import { DEMO_USER_ID } from "@/data/constants";

export default async function LeaderboardPage() {
  const dashboard = await getDashboardData(DEMO_USER_ID);

  if (!dashboard.status.leaderboard.ok || !dashboard.status.referrals.ok) {
    return (
      <ErrorState
        title="Leaderboard offline"
        body={
          dashboard.status.leaderboard.message ??
          dashboard.status.referrals.message ??
          "The live leaderboard data could not be retrieved."
        }
        action={<RetryHint href="/leaderboard" label="RELOAD UPLINK" />}
      />
    );
  }

  const referralCount = dashboard.referrals?.count ?? 0;
  const topXp = dashboard.leaderboard[0]?.xp ?? 0;
  const badgeSpread = dashboard.leaderboard.reduce(
    (sum, entry) => sum + entry.badges.length,
    0
  );

  return (
    <div className="space-y-8 pb-8">
      <SectionHeader
        kicker="Gamification flow"
        title="XP, badges, streaks, and referral gravity"
        description="This route represents the retention loop from the product docs. Users should feel rewarded, competitive, and motivated to return daily without the experience becoming noisy."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <MetricTile
          icon={Trophy}
          label="Top XP"
          value={topXp}
          meta="Current highest visible score."
          tone="accent"
        />
        <MetricTile
          icon={Gift}
          label="Referrals"
          value={referralCount}
          meta="Attributed to the active user."
          tone="success"
        />
        <MetricTile
          icon={Sparkle}
          label="Badge spread"
          value={badgeSpread}
          meta="Total badges shown in the visible leaderboard."
        />
        <MetricTile
          icon={Users}
          label="Visible guardians"
          value={dashboard.leaderboard.length}
          meta="Leaderboard rows returned right now."
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <section className="space-y-4">
          {dashboard.leaderboard.map((entry, index) => (
            <LeaderboardCard
              key={entry.userId}
              entry={entry}
              rank={index + 1}
            />
          ))}
        </section>

        <section className="space-y-4">
          <div className="panel-card p-5">
            <p className="section-kicker">Referral structure</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-white">
              Share loop and rewards
            </h2>
            <div className="mt-4 space-y-3">
              {dashboard.referrals?.referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="border border-border bg-white/[0.03] px-4 py-3"
                >
                  <p className="text-sm font-semibold text-white">
                    {referral.referredUser.username
                      ? `@${referral.referredUser.username}`
                      : "New recruit"}
                  </p>
                  <p className="mt-1 text-xs text-text-soft">
                    Reward granted: {referral.rewardGranted ? "Yes" : "Pending"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel-card p-5">
            <p className="section-kicker">Retention intent</p>
            <p className="mt-3 text-sm leading-7 text-text-soft">
              Your documents were clear that this should feel like a daily
              companion. This page supports that by connecting progress, identity,
              and social proof into one loop instead of scattering them through the app.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
