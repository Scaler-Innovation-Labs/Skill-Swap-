import { DashboardHeader } from "../../components/dashboard/dashboard-header";
import { DashboardTabs } from "../../components/dashboard/dashboard-tabs";

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <DashboardHeader />
      <DashboardTabs />
    </div>
  );
}