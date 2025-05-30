import { Inbox } from "lucide-react"
import ProfileDashboard from "./profile-dashboard"
export default function NavbarDashboard() {
  return (
    <nav className="bg-white/50 sticky top-0 z-50 h-20 w-full flex items-center border-b border-gray-200 backdrop-blur-lg font-jakarta">
      <div className="container">
          <div className="flex items-center justify-end gap-6">
            <Inbox color="#084734" />
             <ProfileDashboard />
          </div>
      </div>
    </nav>
  )
}