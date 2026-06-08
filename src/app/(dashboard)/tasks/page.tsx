"use client";

import { ListTodo, Target, TimerReset } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  MetricTile,
  RetryHint,
  SectionHeader,
  TaskCard,
} from "@/components/GuardPrimitives";
import { getDashboardData } from "@/services/api/aggregations";
import { DEMO_USER_ID } from "@/data/constants";
import { useTelegramSession } from "@/providers/TelegramSessionProvider";
import type { AirdropTask, DashboardData } from "@/lib/types";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function TasksPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user: sessionUser, loading: sessionLoading } = useTelegramSession();

  useEffect(() => {
    if (sessionLoading) return;
    const fetchUserId = sessionUser?.id || DEMO_USER_ID;

    getDashboardData(fetchUserId)
      .then((result) => {
        setData(result);
        setError(result.status.tasks.ok ? null : result.status.tasks.message ?? "Task request failed.");
      })
      .catch((reason) => {
        setData(null);
        setError(reason instanceof Error ? reason.message : "Task request failed.");
      });
  }, [sessionUser?.id, sessionLoading]);

  if (!data) {
    return <LoadingState label="RETRIEVING_QUEUE..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Task queue unavailable"
        body={error}
        action={<RetryHint href="/tasks" />}
      />
    );
  }

  const airdropMap = new Map(data.airdrops.map((item) => [item.id, item.name]));
  const completed = data.tasks.filter((task: AirdropTask) => task.status === "completed").length;
  const inProgress = data.tasks.filter((task: AirdropTask) => task.status === "in_progress").length;
  const averageProgress =
    data.tasks.length > 0
      ? Math.round(
          data.tasks.reduce((sum: number, task: AirdropTask) => sum + task.progress, 0) /
            data.tasks.length
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
        kicker="TASK TRACKING FLOW"
        title="Keep participation organized, visible, and streak-friendly"
        description="This page is designed around the docs’ task stage: checklists, reminders, progress bars, and clear status transitions that support momentum instead of confusion."
      />

      <div className="grid gap-6 md:grid-cols-3">
        <MetricTile
          icon={ListTodo}
          label="Checklist Items"
          value={data.tasks.length}
          meta="All tasks tied to the active user."
        />
        <MetricTile
          icon={Target}
          label="Completed"
          value={completed}
          meta={`${inProgress} currently in progress`}
          tone="success"
        />
        <MetricTile
          icon={TimerReset}
          label="Average Progress"
          value={`${averageProgress}%`}
          meta="Useful for deciding whether to push alerts or XP nudges."
          tone="accent"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <section className="space-y-6">
          <div className="panel-card p-8">
            <div className="mb-8">
              <p className="section-kicker">Active Momentum</p>
              <h2 className="font-display text-3xl font-bold text-white">
                Queue Status
              </h2>
            </div>
            
            {data.tasks.length > 0 ? (
              <div className="space-y-4">
                {data.tasks.map((task: AirdropTask) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    airdropName={airdropMap.get(task.airdropId)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No live tasks provisioned"
                body="The backend did not return any tasks for this user right now. Mock task rows have been removed."
              />
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="panel-card p-8">
            <p className="section-kicker">Experience Principle</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-white">
              Actionable Intelligence
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-text-sub">
              In the SwiftyDrop Guard concept, task tracking is not just storage. It
              is what makes the user feel organized and productive after the
              verification phase.
            </p>
            <div className="mt-8 space-y-4">
              {[
                "Provision checklist rows when a user commits to a campaign.",
                "Update status or progress as task actions are completed.",
                "Use progress plus deadlines to drive reminder notifications.",
                "Tie completed states back into XP and streak growth.",
              ].map((item, index) => (
                <div
                  key={item}
                  className="border border-border bg-white/[0.03] p-5 hover:border-accent transition-colors"
                >
                  <div className="flex gap-4">
                    <span className="font-mono text-xs text-accent">0{index + 1}</span>
                    <p className="text-xs font-medium leading-relaxed text-text-soft">
                      {item}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
