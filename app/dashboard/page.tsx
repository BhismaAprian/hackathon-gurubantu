import UserLayout from "@/components/layout/UserLayout";

export default function GuruBantuDashboardPage() {
  return (
    <UserLayout>
      <div className="container p-8 bg-white rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800">GuruBantu Dashboard</h1>
        <p className="text-gray-600 mt-2">Selamat datang di dashboard GuruBantu!</p>
        {/* Add your dashboard content here */}
      </div>
    </UserLayout>
  );
}