export default function GuideGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 lg:grid-cols-3">{children}</div>;
}
