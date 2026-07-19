import DashboardLayout from "@/dashboard/components/DashboardLayout";
import "./dashboard.css";

export default function DashboardRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="dashboard-scope">
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}
