"use client";

import {
  Activity,
  BellDot,
  Coins,
  Radar,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AirdropCard,
  EmptyState,
  ErrorState,
  LeaderboardCard,
  LinkButton,
  LoadingState,
  MetricTile,
  RetryHint,
  SectionHeader,
  TaskCard,
} from "@/components/GuardPrimitives";
import { useEffect, useState } from "react";
import { getDashboardData } from "@/services/api/aggregations";
import { getRecommendations } from "@/lib/api";
import { DEMO_USER_ID } from "@/data/constants";
import { useTelegramSession } from "@/providers/TelegramSessionProvider";
import type {
  Airdrop,
  AirdropTask,
  DashboardData,
  LeaderboardEntry,
  TrendingCoin,
} from "@/lib/types";
import { formatCompactNumber } from "@/lib/utils";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function CommandPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Airdrop[] | null>(null);
  const { user: sessionUser, loading: sessionLoading } = useTelegramSession();

  useEffect(() => {
    if (sessionLoading) return;
    const fetchUserId = sessionUser?.id || DEMO_USER_ID;
    getDashboardData(fetchUserId)
      .then((result) => {
        setData(result);
        const messages = [
          result.status.airdrops.ok ? null : result.status.airdrops.message,
          result.status.leaderboard.ok ? null : result.status.leaderboard.message,
          result.status.tasks.ok ? null : result.status.tasks.message,
        ].filter(Boolean);
        setError(messages.length > 0 ? messages.join(" ") : null);
      })
      .catch((reason) => {
        setData(null);
        setError(reason instanceof Error ? reason.message : "Dashboard request failed.");
      });
  }, [sessionUser?.id, sessionLoading]);

  useEffect(() => {
    if (data?.user?.id) {
      getRecommendations({ userId: data.user.id, limit: 2 })
        .then(setRecommendations)
        .catch(console.error);
    }
  }, [data?.user?.id]);

  if (!data) {
    return <LoadingState label="SYNCHRONIZING_CORE..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Dashboard degraded"
        body={error}
        action={<RetryHint href="/" label="RELOAD DASHBOARD" />}
      />
    );
  }

  const featuredAirdrops = data.airdrops.slice(0, 4);
  const featuredTasks = data.tasks.slice(0, 3);
  const topLeaders = data.leaderboard.slice(0, 3);
  const userStats = data.user?.stats;
  const referralCount = data.referrals?.count ?? 0;
  const trustAverage =
    data.airdrops.length > 0
      ? Math.round(
          data.airdrops.reduce(
            (sum: number, item: Airdrop) => sum + (item.trustScore ?? 58),
            0
          ) / data.airdrops.length
        )
      : 0;

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-12 pb-12"
    >
      <SectionHeader
        kicker="Central Intelligence"
        title="Dashboard for your crypto assets."
        description="SwiftyDrop Guard orchestrates discovery, verification, and retention in a high-performance loop. Audit the market, verify signals, and execute with confidence."
        action={
          <div className="flex flex-wrap gap-4">
            <LinkButton href="/airdrops">DISCOVER ASSETS</LinkButton>
            <LinkButton href="/wallet" variant="secondary">
              AUDIT WALLET
            </LinkButton>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <MetricTile
          icon={ShieldCheck}
          label="Guard Score"
          value={`${trustAverage || 72}%`}
          meta="System-wide average trust confidence level."
          tone="accent"
        />
        <MetricTile
          icon={Activity}
          label="Operational Streak"
          value={`${userStats?.streak ?? 0} DAYS`}
          meta={
            userStats
              ? `${formatCompactNumber(userStats.xp)} XP • LEVEL ${userStats.level}`
              : "Synchronizing player stats..."
          }
          tone="success"
        />
        <MetricTile
          icon={Radar}
          label="Active Feed"
          value={data.airdrops.length}
          meta={
            data.airdrops.length > 0
              ? `${data.airdrops.length} opportunities detected in sector.`
              : "Feed empty. Scanning for new signals."
          }
        />
        <MetricTile
          icon={BellDot}
          label="Network Loop"
          value={referralCount}
          meta="Verified units attributed to your uplink."
          tone="warn"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)]">
        <div className="flex flex-col gap-6">
          <section className="panel-card p-8 border-accent/20 border-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
              <div>
                <p className="section-kicker text-accent">Gemini Intelligence</p>
                <h2 className="font-display text-3xl font-bold text-white">
                  For You
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-sub">
                  AI-curated opportunities tailored to your risk and effort preferences.
                </p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {recommendations === null ? (
                <div className="lg:col-span-2">
                  <LoadingState label="ANALYZING_PREFERENCES..." />
                </div>
              ) : recommendations.length > 0 ? (
                recommendations.map((airdrop: Airdrop) => (
                  <AirdropCard
                    key={airdrop.id}
                    airdrop={airdrop}
                    href={`/airdrops/${airdrop.id}`}
                  />
                ))
              ) : (
                <div className="lg:col-span-2">
                  <EmptyState
                    title="No exact matches"
                    body="Gemini couldn't find active campaigns matching your exact preferences right now."
                    action={<LinkButton href="/profile">UPDATE PREFERENCES</LinkButton>}
                  />
                </div>
              )}
            </div>
          </section>

          <section className="panel-card p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
            <div>
              <p className="section-kicker">Asset Discovery</p>
              <h2 className="font-display text-3xl font-bold text-white">
                Featured Airdrops
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-sub">
                Lightweight visual signals anchored in hard risk context. Move only when the evidence matches your posture.
              </p>
            </div>
            <LinkButton href="/airdrops" variant="secondary">
              OPEN FEED
            </LinkButton>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {featuredAirdrops.length > 0 ? (
              featuredAirdrops.map((airdrop: Airdrop) => (
                <AirdropCard
                  key={airdrop.id}
                  airdrop={airdrop}
                  href={`/airdrops/${airdrop.id}`}
                />
              ))
            ) : (
              <div className="lg:col-span-2">
                <EmptyState
                  title="Sector currently silent"
                  body="No active campaigns detected in the live feed. System is maintaining standby status."
                  action={<LinkButton href="/airdrops">RESCAN SECTOR</LinkButton>}
                />
              </div>
            )}
          </div>
        </section>
        </div>

        <section className="space-y-6">
          <div className="panel-card p-8">
            <p className="section-kicker">Market Pulse</p>
            <h2 className="font-display text-2xl font-bold text-white mb-6">
              Trending Signals
            </h2>
            <div className="space-y-4">
              {data.trending.slice(0, 5).map((coin: TrendingCoin, index: number) => (
                <div
                  key={coin.id}
                  className="data-row px-5 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-white/[0.03] border border-border flex items-center justify-center font-mono text-[10px] text-accent">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{coin.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-text-muted">
                        {coin.symbol}
                      </p>
                    </div>
                  </div>
                  <Coins size={16} className="text-accent ml-auto" />
                </div>
              ))}
            </div>
          </div>

          <div className="panel-card p-8">
            <p className="section-kicker">Uplink Status</p>
            <h2 className="font-display text-2xl font-bold text-white mb-6">
              Global Ranking
            </h2>
            <div className="space-y-4">
              {topLeaders.length > 0 ? (
                topLeaders.map((entry: LeaderboardEntry, index: number) => (
                  <LeaderboardCard
                    key={entry.userId}
                    entry={entry}
                    rank={index + 1}
                  />
                ))
              ) : (
                <EmptyState
                  title="No active rankings"
                  body="Uplink is establishing connection to the global leaderboard."
                />
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <section className="panel-card p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
            <div>
              <p className="section-kicker">Active Momentum</p>
              <h2 className="font-display text-3xl font-bold text-white">
                Task Queue
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-sub">
                Onboarding promise turned into repeat behavior. Track progress and execute deadlines.
              </p>
            </div>
            <LinkButton href="/tasks" variant="secondary">
              QUEUE STATUS
            </LinkButton>
          </div>

          <div className="space-y-4">
            {featuredTasks.length > 0 ? (
              featuredTasks.map((task: AirdropTask) => (
                <TaskCard key={task.id} task={task} />
              ))
            ) : (
              <EmptyState
                title="Queue is empty"
                body="No tasks provisioned for the current operative. Establish checklist via discovery."
              />
            )}
          </div>
        </section>

        <section className="panel-card p-8">
          <p className="section-kicker">Protocol Map</p>
          <h2 className="font-display text-3xl font-bold text-white mb-8">
            System Architecture
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "DISCOVERY",
                body: "Unified reward, deadline, and trust signals.",
              },
              {
                title: "AUDIT",
                body: "Direct uplink to security and audit modules.",
              },
              {
                title: "EXECUTION",
                body: "Task-driven checklist generation and updates.",
              },
              {
                title: "RESOURCES",
                body: "Gamified referrals and asset alerts.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border-2 border-border bg-white/[0.03] p-5 hover:border-accent transition-colors"
              >
                <p className="text-sm font-bold text-white tracking-widest">{item.title}</p>
                <p className="mt-3 text-xs leading-relaxed text-text-sub font-medium">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="h-0.5 bg-border my-10" />

          <div className="flex flex-wrap gap-4">
            <LinkButton href="/leaderboard">GLOBAL UPLINK</LinkButton>
            <LinkButton href="/profile" variant="secondary">
              USER CONFIG
            </LinkButton>
            <LinkButton href="/alerts" variant="secondary">
              SIGNAL ALERTS
            </LinkButton>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
