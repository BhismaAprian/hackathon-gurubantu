import NavbarDashboard from "../dashboard-user/navbar-dashboard"
import Sidebar from "../sidebar"


export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <div className="min-h-screen flex bg-[#F0F0F0]">
        <div className="flex flex-1">
          <Sidebar />
          <div className="w-full">
            <NavbarDashboard/>
            <main className="py-10 px-20 overflow-y-auto h-screen">
              {children}
            </main>
          </div>
        </div>
      </div>
  )
}