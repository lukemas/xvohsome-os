export default function BeatStoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="box-border h-full min-h-0 overflow-y-auto overflow-x-hidden">
      {children}
    </div>
  );
}
