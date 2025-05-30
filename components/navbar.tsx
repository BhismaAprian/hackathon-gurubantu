import { Avatar, AvatarImage } from "./ui/avatar";
import { Inbox } from "lucide-react";

export default function Navbar() {

  return (
    <nav className="bg-white/50 sticky top-0 z-50 h-20 flex items-center backdrop-blur-lg font-jakarta">
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="logo flex items-center">
            <h1 className="text-heading text-[24px]">GuruBantu</h1>
          </div>
      
          <div className="flex items-center gap-6">
            <Inbox color="#084734" />
            <Avatar>
              <AvatarImage src="/image.png"/>
            </Avatar>
          </div>
        </div>
      </div>
    </nav>
  )
}
