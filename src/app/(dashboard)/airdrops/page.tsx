"use client";

import { Radar, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  AirdropCard,
  EmptyState,
  ErrorState,
  LinkButton,
  LoadingState,
  MetricTile,
  RetryHint,
  SectionHeader,
} from "@/components/GuardPrimitives";
import { getAirdrops } from "@/lib/api";
import type { Airdrop } from "@/lib/types";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function AirdropsPage() {
  const [airdrops, setAirdrops] = useState<Airdrop[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAirdrops(24, 0)
      .then((data) => {
        setError(null);
        setAirdrops(data);
      })
      .catch(() => {
        setAirdrops([]);
        setError("The live airdrop feed request failed.");
      });
  }, []);

  if (!airdrops) {
    return <LoadingState label="SCANNING_SECTOR..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Airdrop feed unavailable"
        body="The live backend request did not succeed, so this screen cannot display current campaigns right now."
        action={<RetryHint href="/airdrops" />}
      />
    );
  }

  const averageTrust = Math.round(
    airdrops.reduce((sum, item) => sum + (item.trustScore ?? 58), 0) /
      airdrops.length
  );
  const highConviction = airdrops.filter(
    (item) => (item.trustScore ?? 0) >= 75
  ).length;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-12 pb-12"
    >
      <SectionHeader
        kicker="AIRDROP DISCOVERY"
        title="Verified opportunities, framed through trust"
        description="This feed is redesigned around the idea in your documents: speed on the surface, security context underneath. Every card emphasizes reward, deadline, difficulty, and trust posture before the user commits attention."
        action={
          <LinkButton href="/wallet" variant="secondary">
            SCAN WALLET
          </LinkButton>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        <MetricTile
          icon={Radar}
          label="Visible Campaigns"
          value={airdrops.length}
          meta="Aggregated from the backend catalogue."
        />
        <MetricTile
          icon={Shield}
          label="Average Trust"
          value={`${averageTrust}%`}
          meta="Cached score from the latest security pass."
          tone="accent"
        />
        <MetricTile
          icon={Sparkles}
          label="High Conviction"
          value={highConviction}
          meta="Campaigns currently above 75 trust score."
          tone="success"
        />
      </div>

      <section className="panel-card p-8">
        <div className="mb-8">
          <p className="section-kicker">Live Feed</p>
          <h2 className="font-display text-3xl font-bold text-white">
            Available Ops
          </h2>
        </div>
        
        {airdrops.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {airdrops.map((airdrop) => (
              <AirdropCard
                key={airdrop.id}
                airdrop={airdrop}
                href={`/airdrops/${airdrop.id}`}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No live campaigns available"
            body="The backend returned an empty airdrop feed right now. This view is using the live endpoint directly and no longer substitutes mock opportunities."
          />
        )}
      </section>
    </motion.div>
  );
}
