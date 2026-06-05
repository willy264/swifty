import AppShell from "@/components/AppShell";

export default function MiniAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
