import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Globe, Layers3, ShieldCheck, Target } from "lucide-react";
import {
  EmptyState,
  LinkButton,
  SectionHeader,
} from "@/components/GuardPrimitives";
import { getAirdropById } from "@/lib/api";
import { formatDate, formatRelativeDate, getHostnameFromUrl } from "@/lib/utils";

export default async function AirdropDetailPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await props.params;

  const live = await getAirdropById(id).catch(() => null);
  const airdrop = live;

  if (!airdrop) {
    notFound();
  }

  const socialLinks = airdrop.socialLinks || {};
  const primaryWebLink = airdrop.projectUrl || socialLinks.website || socialLinks.site || socialLinks.homepage || Object.values(socialLinks)[0];

  return (
    <div className="space-y-8 pb-8">
      <div>
        <Link
          href="/airdrops"
          className="inline-flex items-center text-sm font-medium text-text-soft transition hover:text-white"
        >
          <ArrowLeft className="mr-2" size={16} />
          Back to Airdrops
        </Link>
      </div>
      <SectionHeader
        kicker="Security verification"
        title={airdrop.name}
        description={
          airdrop.description ??
          "This detail page is where the discovery stage slows down long enough to help the user decide whether to join, ignore, or investigate further."
        }
        action={
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/tasks">Open checklist</LinkButton>
            {primaryWebLink ? (
              <LinkButton href={primaryWebLink} external variant="secondary">
                Visit project
              </LinkButton>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="space-y-4">
          <div className="panel-card p-5 sm:p-6">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  icon: ShieldCheck,
                  label: "Trust score",
                  value:
                    typeof airdrop.trustScore === "number"
                      ? `${airdrop.trustScore}/100`
                      : "Needs scan",
                },
                {
                  icon: Target,
                  label: "Reward estimate",
                  value: airdrop.rewardEstimate ?? "Unlisted",
                },
                {
                  icon: Layers3,
                  label: "Difficulty",
                  value: airdrop.difficulty ?? "Unknown",
                },
                {
                  icon: Globe,
                  label: "Deadline",
                  value: formatRelativeDate(airdrop.deadline),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="border border-border bg-white/[0.03] px-4 py-4"
                >
                  <div className="flex items-center gap-2 text-text-muted">
                    <item.icon size={14} />
                    <span className="text-[0.68rem] uppercase tracking-[0.2em]">
                      {item.label}
                    </span>
                  </div>
                  <p className="mt-3 text-base font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mini-divider my-6" />

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <p className="section-kicker">Decision context</p>
                <p className="mt-3 text-sm leading-7 text-text-soft">
                  This page now mirrors the product flow from the docs: users discover,
                  inspect signals, understand the risk framing, then either continue into
                  tasks or back away. The backend integration is ready to support deeper
                  analysis when project metadata expands.
                </p>
                <ul className="mt-5 space-y-3 text-sm text-text-soft">
                  <li>Source: <span className="font-semibold text-white">{airdrop.source}</span></li>
                  <li>Created: <span className="font-semibold text-white">{formatDate(airdrop.createdAt)}</span></li>
                  <li>Absolute deadline: <span className="font-semibold text-white">{formatDate(airdrop.deadline, { month: "long", day: "numeric", year: "numeric" })}</span></li>
                </ul>
              </div>

              <div className="border border-border bg-white/[0.03] p-4">
                <p className="section-kicker">Project links</p>
                <div className="mt-4 space-y-3">
                  {airdrop.projectUrl && (
                    <Link
                      href={airdrop.projectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block border border-border px-4 py-3 text-sm text-text-soft transition hover:border-border-strong hover:text-white"
                    >
                      CoinGecko / Source
                      <span className="mt-1 block text-xs text-text-muted lowercase">
                        {getHostnameFromUrl(airdrop.projectUrl)}
                      </span>
                    </Link>
                  )}
                  
                  <Link
                    href={`https://x.com/search?q=$${encodeURIComponent(airdrop.name)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block border border-border px-4 py-3 text-sm text-text-soft transition hover:border-border-strong hover:text-white"
                  >
                    Search on X / Twitter
                    <span className="mt-1 block text-xs text-text-muted lowercase">
                      x.com
                    </span>
                  </Link>

                  {Object.entries(airdrop.socialLinks || {}).length > 0 && 
                    Object.entries(airdrop.socialLinks).map(([key, url]) => {
                      if (!url) return null;
                      return (
                        <Link
                          key={key}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="block border border-border px-4 py-3 text-sm text-text-soft transition hover:border-border-strong hover:text-white capitalize"
                        >
                          {key}
                          <span className="mt-1 block text-xs text-text-muted lowercase">
                            {getHostnameFromUrl(url)}
                          </span>
                        </Link>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>

          <EmptyState
            title="Security analysis unavailable"
            body="This screen is now using the live API directly. A detailed scam-analysis payload was not available for this airdrop at render time, so no mock report is being substituted."
          />
        </div>

        <div className="space-y-4">
          <div className="panel-card p-5">
            <p className="section-kicker">Join decision</p>
            <h2 className="mt-2 font-display text-2xl font-semibold text-white">
              Proceed only with bounded risk
            </h2>
            <p className="mt-3 text-sm leading-7 text-text-soft">
              Users should leave this screen feeling informed, not just hyped. That is
              the design principle driving this remake.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <LinkButton href="/tasks">Generate checklist</LinkButton>
              <LinkButton href="/wallet" variant="secondary">
                Review wallet exposure
              </LinkButton>
            </div>
          </div>

          <div className="panel-card p-5">
            <p className="section-kicker">Recommended flow</p>
            <div className="mt-4 space-y-3">
              {[
                "Check trust signals and social link authenticity.",
                "Use a burner wallet if the task stack requires approvals.",
                "Create your task checklist before you leave the detail view.",
                "Set an alert if the deadline is tight or risk changes.",
              ].map((item, index) => (
                <div
                  key={item}
                  className="border border-border bg-white/[0.03] px-4 py-3 text-sm text-text-soft"
                >
                  <span className="mr-2 font-data text-accent">0{index + 1}</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
