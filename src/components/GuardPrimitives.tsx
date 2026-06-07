import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  ArrowRight,
  LoaderCircle,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { formatRelativeDate, prettifyLabel } from "@/lib/utils";
import type {
  Airdrop,
  AirdropTask,
  LeaderboardEntry,
  SecurityReport,
  WalletAnalysis,
} from "@/lib/types";

export function SectionHeader({
  kicker,
  title,
  description,
  action,
}: {
  kicker?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {kicker ? <p className="section-kicker">{kicker}</p> : null}
        <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.1]">
          {title}
        </h2>
        {description ? (
          <p className="text-text-sub text-base leading-relaxed mt-4 max-w-2xl">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function MetricTile({
  icon: Icon,
  label,
  value,
  meta,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  meta?: React.ReactNode;
  tone?: "default" | "accent" | "warn" | "success";
}) {
  const toneClass =
    tone === "accent"
      ? "text-accent"
      : tone === "warn"
        ? "text-gold"
        : tone === "success"
          ? "text-success"
          : "text-white";

  return (
    <div className="metric-tile group">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-white/[0.03] border border-border flex items-center justify-center group-hover:border-accent/30 transition-colors">
          <Icon
            size={14}
            className="text-text-muted group-hover:text-accent transition-colors"
          />
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold">
          {label}
        </span>
      </div>
      <p className={`font-display text-2xl font-bold tracking-tight ${toneClass}`}>
        {value}
      </p>
      {meta ? (
        <p className="text-xs mt-3 text-text-sub leading-relaxed">{meta}</p>
      ) : null}
    </div>
  );
}

export function AirdropCard({
  airdrop,
  href,
}: {
  airdrop: Airdrop;
  href: string;
}) {
  const trustTone =
    typeof airdrop.trustScore === "number"
      ? airdrop.trustScore >= 75
        ? "text-success"
        : airdrop.trustScore >= 50
          ? "text-gold"
          : "text-danger"
      : "text-accent";

  return (
    <div>
      <Link href={href} className="panel-card group block p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="min-w-0">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="tag">{airdrop.source}</span>
              {airdrop.category ? <span className="tag">{airdrop.category}</span> : null}
            </div>
            <h3 className="font-display text-xl font-bold text-white group-hover:text-accent transition-colors">
              {airdrop.name}
            </h3>
          </div>
          <div
            className={`text-sm font-display font-bold shrink-0 bg-white/[0.03] px-3 py-1.5 border border-border ${trustTone}`}
          >
            {typeof airdrop.trustScore === "number"
              ? `${airdrop.trustScore}%`
              : "SCAN"}
          </div>
        </div>

        <p className="text-sm text-text-sub leading-relaxed mb-6 line-clamp-2">
          {airdrop.description ??
            "No campaign description supplied yet. Use the detail view to inspect the full trust context."}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="badge badge-accent">
            {airdrop.rewardEstimate ?? "Reward unknown"}
          </span>
          <span className="badge badge-blue">
            {formatRelativeDate(airdrop.deadline)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-5 border-t border-border group-hover:border-border-hi transition-colors">
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
            ID: {airdrop.id.slice(0, 8)}
          </span>
          <span className="text-accent text-xs font-bold inline-flex items-center gap-2 group-hover:gap-3 transition-all">
            VIEW DETAILS <ArrowRight size={14} />
          </span>
        </div>
      </Link>
    </div>
  );
}

export function TaskCard({
  task,
  airdropName,
}: {
  task: AirdropTask;
  airdropName?: string;
}) {
  const tone =
    task.status === "completed"
      ? "text-success"
      : task.status === "in_progress"
        ? "text-accent"
        : "text-gold";

  return (
    <div className="data-row group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h3 className="text-sm font-bold text-white group-hover:text-accent transition-colors">
            {task.label}
          </h3>
          <span className={`text-[10px] uppercase tracking-[0.15em] font-bold ${tone}`}>
            {prettifyLabel(task.status)}
          </span>
        </div>
        <p className="text-[11px] text-text-muted mt-1.5 font-medium">
          {airdropName ?? "Linked airdrop"} • UPDATED{" "}
          {formatRelativeDate(task.completedAt ?? task.createdAt).toUpperCase()}
        </p>
        <div className="w-full h-1.5 bg-white/[0.05] mt-4 overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-700"
            style={{ width: `${task.progress}%` }}
          />
        </div>
      </div>
      <div className="shrink-0 text-right ml-4">
        <p className="font-display text-xl font-bold text-white">
          {task.progress}%
        </p>
      </div>
    </div>
  );
}

export function LeaderboardCard({
  entry,
  rank,
}: {
  entry: LeaderboardEntry;
  rank: number;
}) {
  return (
    <div className="data-row group">
      <div className="w-12 h-12 bg-white/[0.03] border-2 border-border flex items-center justify-center shrink-0 group-hover:border-accent/40 transition-colors">
        <span className="font-display text-base font-bold text-accent">
          #{rank}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white group-hover:text-accent transition-colors">
          {entry.user.username ? `@${entry.user.username}` : `Guard ${rank}`}
        </p>
        <p className="text-[11px] text-text-muted mt-1 font-medium">
          {entry.user.referralCode} • {entry.streak} DAY STREAK
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {entry.badges.slice(0, 2).map((badge) => (
            <span key={badge} className="tag text-[9px] font-bold">
              {prettifyLabel(badge).toUpperCase()}
            </span>
          ))}
        </div>
      </div>
      <div className="text-right shrink-0 ml-4">
        <p className="font-display text-xl font-bold text-white">{entry.xp}</p>
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
          LV {entry.level}
        </p>
      </div>
    </div>
  );
}

export function SecuritySummaryCard({
  report,
}: {
  report: SecurityReport;
}) {
  const badgeTone =
    report.risk_level === "high"
      ? "badge-red"
      : report.risk_level === "medium"
        ? "badge-yellow"
        : "badge-green";

  return (
    <div className="panel-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <p className="section-kicker">Security report</p>
          <h3 className="font-display text-3xl font-bold text-white">
            {report.trust_score}% CONFIDENCE
          </h3>
        </div>
        <span className={`badge ${badgeTone}`}>
          {prettifyLabel(report.risk_level)} risk
        </span>
      </div>
      <p className="text-sm text-text-sub leading-relaxed mb-6">
        {report.explanation}
      </p>
      <div className="flex flex-wrap gap-2 mb-6">
        {report.warnings.length > 0 ? (
          report.warnings.map((warning) => (
            <span key={warning} className="tag">
              {prettifyLabel(warning).toUpperCase()}
            </span>
          ))
        ) : (
          <span className="tag">NO MAJOR WARNINGS</span>
        )}
      </div>
      <div className="pt-5 border-t border-border">
        <p className="text-xs font-bold text-accent uppercase tracking-widest mb-2">
          Recommendation
        </p>
        <p className="text-sm text-text-sub leading-relaxed font-medium">
          {report.recommendation}
        </p>
      </div>
    </div>
  );
}

export function WalletSummaryCard({
  analysis,
}: {
  analysis: WalletAnalysis;
}) {
  return (
    <div className="panel-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <p className="section-kicker">Wallet health</p>
          <h3 className="font-display text-3xl font-bold text-white">
            {analysis.wallet_health_score}% SCORE
          </h3>
        </div>
        <span
          className={`badge ${
            analysis.wallet_health_score >= 75
              ? "badge-green"
              : analysis.wallet_health_score >= 50
                ? "badge-yellow"
                : "badge-red"
          }`}
        >
          {analysis.dangerous_approvals.length} APPROVALS
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/[0.03] border-2 border-border p-4">
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold mb-2">
            INDICATORS
          </p>
          <p className="font-display text-2xl font-bold text-white">
            {analysis.risk_indicators.length}
          </p>
        </div>
        <div className="bg-white/[0.03] border-2 border-border p-4">
          <p className="text-[10px] uppercase tracking-wider text-text-muted font-bold mb-2">
            SUSPICIOUS
          </p>
          <p className="font-display text-2xl font-bold text-white">
            {analysis.suspicious_contracts.length}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {analysis.recommendations.slice(0, 3).map((item) => (
          <div key={item} className="data-row p-4 text-sm font-medium text-text-sub">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="panel-card text-center py-20 px-8">
      <div className="w-20 h-20 bg-white/[0.03] border-2 border-border flex items-center justify-center mx-auto mb-6">
        <ArrowRight size={32} className="text-text-muted rotate-45" />
      </div>
      <p className="font-display text-3xl font-bold text-white mb-4">{title}</p>
      <p className="text-base text-text-sub max-w-lg mx-auto leading-relaxed mb-10">
        {body}
      </p>
      {action ? <div className="flex justify-center">{action}</div> : null}
    </div>
  );
}

export function LoadingState({
  label = "SYNCHRONIZING",
}: {
  label?: string;
}) {
  return (
    <div className="h-96 flex items-center justify-center">
      <div className="flex items-center gap-3 font-mono text-accent text-sm tracking-widest">
        <LoaderCircle size={18} className="animate-spin" />
        {label}
      </div>
    </div>
  );
}

export function ErrorState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="panel-card text-center py-20 px-8 border-danger/30">
      <div className="w-20 h-20 bg-danger/10 border-2 border-danger/20 flex items-center justify-center mx-auto mb-6">
        <AlertTriangle size={32} className="text-danger" />
      </div>
      <p className="font-display text-3xl font-bold text-white mb-4">{title}</p>
      <p className="text-base text-text-sub max-w-lg mx-auto leading-relaxed mb-10">
        {body}
      </p>
      {action ? <div className="flex justify-center">{action}</div> : null}
    </div>
  );
}

export function RetryHint({
  href,
  label = "TRY AGAIN",
}: {
  href: string;
  label?: string;
}) {
  return (
    <LinkButton href={href} variant="secondary">
      <span className="inline-flex items-center gap-2">
        <RefreshCw size={14} />
        {label}
      </span>
    </LinkButton>
  );
}

export function LinkButton({
  href,
  children,
  external = false,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  variant?: "primary" | "secondary";
}) {
  const className = variant === "primary" ? "btn-primary" : "btn-secondary";

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
        <ExternalLink size={14} />
      </a>
    );
  }

  return (
    <div>
      <Link href={href} className={className}>
        {children}
      </Link>
    </div>
  );
}
