import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold">
          Welcome to FestSphere 👋
        </h1>

        <p className="mt-2 text-gray-500">
          Manage your college fest events from one place.
        </p>
      </div>
    </DashboardLayout>
  );
}