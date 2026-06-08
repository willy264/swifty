"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ShieldAlert, Wallet2, Zap } from "lucide-react";
import {
  EmptyState,
  ErrorState,
  LinkButton,
  MetricTile,
  RetryHint,
  SectionHeader,
  WalletSummaryCard,
  LoadingState,
} from "@/components/GuardPrimitives";
import { analyzeWallet, getDashboardData } from "@/lib/api";
import { DEMO_USER_ID } from "@/data/constants";
import { useTelegramSession } from "@/providers/TelegramSessionProvider";
import type { DashboardData, WalletAnalysis } from "@/lib/types";

export default function WalletPage() {
  const { user: sessionUser, loading: sessionLoading } = useTelegramSession();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [liveAnalysis, setLiveAnalysis] = useState<WalletAnalysis | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionLoading) return;
    const fetchUserId = sessionUser?.id || DEMO_USER_ID;

    let cancelled = false;

    getDashboardData(fetchUserId)
      .then(async (data) => {
        if (cancelled) return;
        setDashboard(data);
        const walletAddress = data.user?.walletAddress;
        
        if (walletAddress) {
          try {
            const analysis = await analyzeWallet(walletAddress);
            if (!cancelled) setLiveAnalysis(analysis);
          } catch (error) {
            if (!cancelled) {
              setAnalysisError(
                error instanceof Error
                  ? error.message
                  : "Wallet analysis request failed."
              );
            }
          }
        }
      })
      .catch((err) => {
        if (!cancelled) setAnalysisError("Failed to load dashboard data.");
      });

    return () => {
      cancelled = true;
    };
  }, [sessionUser?.id, sessionLoading]);

  if (!dashboard) {
    return <LoadingState label="FETCHING_WALLET_DATA..." />;
  }

  const walletAddress = dashboard.user?.walletAddress;

  return (
    <div className="space-y-8 pb-8">
      <SectionHeader
        kicker="Wallet safety flow"
        title="Scan approvals, exposure, and dangerous patterns"
        description="This route mirrors the docs’ wallet-safety stage. It exists to help the user connect discovery with self-protection, not as a generic portfolio page."
        action={
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/profile">Manage wallet session</LinkButton>
            <LinkButton href="/airdrops" variant="secondary">
              Back to feed
            </LinkButton>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <MetricTile
          icon={Wallet2}
          label="Connected wallet"
          value={walletAddress ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}` : "Not connected"}
          meta={
            walletAddress
              ? "Live backend scan available."
              : "Using designed fallback analysis until a wallet is attached."
          }
        />
        <MetricTile
          icon={ShieldAlert}
          label="Health score"
          value={liveAnalysis ? `${liveAnalysis.wallet_health_score}/100` : "N/A"}
          meta={
            liveAnalysis
              ? `${liveAnalysis.risk_indicators.length} risk indicators`
              : "Run a live scan by attaching a wallet."
          }
          tone={
            liveAnalysis && liveAnalysis.wallet_health_score >= 75
              ? "success"
              : liveAnalysis && liveAnalysis.wallet_health_score >= 50
                ? "warn"
                : "default"
          }
        />
        <MetricTile
          icon={AlertTriangle}
          label="Dangerous approvals"
          value={liveAnalysis ? liveAnalysis.dangerous_approvals.length : 0}
          meta={
            liveAnalysis
              ? `${liveAnalysis.suspicious_contracts.length} suspicious contract matches`
              : "No live analysis returned."
          }
          tone="warn"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        {analysisError ? (
          <ErrorState
            title="Wallet scan failed"
            body={analysisError}
            action={<RetryHint href="/wallet" label="RERUN SCAN" />}
          />
        ) : liveAnalysis ? (
          <WalletSummaryCard analysis={liveAnalysis} />
        ) : (
          <EmptyState
            title="No wallet analysis available"
            body={
              walletAddress
                ? "The live wallet analysis request did not return usable data."
                : "Attach a wallet first to run a live safety scan. Mock wallet analysis has been removed."
            }
          />
        )}

        <section className="space-y-4">
          <div className="panel-card p-5">
            <p className="section-kicker">Guardrails</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-white">
              Recommended actions
            </h2>
            <div className="mt-4 space-y-3">
              {liveAnalysis?.recommendations?.length ? (
                liveAnalysis.recommendations.map((item) => (
                  <div
                    key={item}
                    className="border border-border bg-white/[0.03] px-4 py-3 text-sm text-text-soft"
                  >
                    {item}
                  </div>
                ))
              ) : (
                <div className="border border-border bg-white/[0.03] px-4 py-3 text-sm text-text-soft">
                  No live recommendation payload available.
                </div>
              )}
            </div>
          </div>

          <div className="panel-card p-5">
            <p className="section-kicker">Why this screen exists</p>
            <p className="mt-3 text-sm leading-7 text-text-soft">
              The docs describe this stage as the moment users should feel safer and
              more empowered. This remake keeps the language practical: approvals,
              suspicious contracts, and direct next steps instead of generic wallet copy.
            </p>
            <div className="mini-divider my-5" />
            <div className="flex items-center gap-2 text-sm text-text-soft">
              <Zap size={16} className="text-accent" />
              When the Telegram Mini App session includes a real wallet, this route
              calls the backend analysis endpoint directly.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
