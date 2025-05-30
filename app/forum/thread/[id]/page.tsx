import UserLayout from "@/components/layout/UserLayout";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ArrowBigDownDash, ArrowBigUpDash, MessageSquareText } from "lucide-react";

export default function DetailForumPage() {
  return (
    <UserLayout>
      <div className="container p-8 bg-white rounded-lg h-screen overflow-y-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold mb-4 font-jakarta">General Discussion</h1>

        {/* Discussion */}
        <div className="mt-10 flex flex-col gap-6">

          {/* Discussion Card */}
          <div className="px-5 py-7 bg-white rounded-lg border border-gray-200 mb-6">

            {/* Header */}
            <div className="header flex items-start justify-between mb-4">
              {/* Profile */}
              <div className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="./image.png"/>
                </Avatar>
                <div className="flex flex-col font-jakarta -pace-y-1">
                  <h2 className="text-lg font-semibold text-gray-800">Terrano</h2>
                  <p className="text-sm font-semibold text-gray-500">Institut Teknologi Kalimantan</p>
                </div>
              </div>
              {/* Date */}
              <div className="font-geist text-sm font-medium text-gray-500">
                <p>Posted on: 12/10/2023</p>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4 my-10">
              <h3 className="text-3xl font-bold font-jakarta">Cara menang hackathon</h3>
              <p className="font-geist text-base font-medium">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis mi  tristique, molestie lacus ut, mattis sapien. Phasellus porttitor purus  est. Sed pellentesque mattis libero, in cursus justo gravida tincidunt.  Vivamus rutrum, velit nec vulputate tempor, lectus justo consectetur  libero, a porttitor massa urna facilisis lacus.A Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis mi  tristique, molestie lacus ut, mattis sapien. Phasellus porttitor purus  est. Sed pellentesque mattis libero, in cursus justo gravida tincidunt.  Vivamus rutrum, velit nec vulputate tempor, lectus justo consectetur  libero, a porttitor massa urna facilisis lacus.A</p>
            </div>

            {/* Action */}
            <div className="flex items-center justify-between font-jakarta">

              {/* Vote */}
              <div className="flex items-center gap-4">
                <button className="flex items-center font-semibold gap-4">
                  <ArrowBigUpDash color="#4755F1" />
                  Upvote
                </button>
                <button className="flex items-center font-semibold gap-4">
                  <ArrowBigDownDash color="#FF0000" />
                  Downvote
                </button>
              </div>

              {/* Reply */}
              <button className="flex items-center font-semibold gap-2">
                <MessageSquareText size={20} />
                  Balas
              </button>
             
            </div>
          </div>

        </div>
      </div>
    </UserLayout>
  );
}