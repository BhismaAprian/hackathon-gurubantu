import Navbar from "@/components/navbar";
import Image, {} from "next/image";


export default function LandingPage() {
  return (
    <div className="min-h-dvh">
      <Navbar/>

      {/* Hero Section */}
      <section className="pb-20 bg-gradient-to-b from-[#FFFFFF] via-[#CEF17B] to-[#FFFFFF] h-screen flex items-center ">
        <div className="container flex flex-col items-center">
          <div className="flex flex-col items-center space-y-8 max-w-5xl">
            <div className="flex justify-center items-center w-md px-4 h-12 bg-[#084734] rounded-full text-[#CEF17B] text-base font-semibold">
              <p className="font-jakarta">Bergabung dengan 10,000 Guru di Indonesia</p>
            </div>
            <h1 className="text-heading text-6xl text-center font-jakarta">Platform Kolaborasi untuk <br /> Guru Indonesia</h1>
            <p className="text-paragraph text-center">GuruBantu adalah platform tempat para guru saling berbagi metode pengajaran, berdiskusi tentang tantangan di kelas, dan membangun komunitas pendidikan yang saling mendukung di seluruh Indonesia.</p>
            <Image
              src="/hero-image.png"
              alt="Hero Image"
              width={960}
              height={460}
              className="w-full max-w-4xl"
            />
          </div>
        </div>
      </section>
      
      {/* Why Section */}
      <section className="py-24 h-screen flex bg-gradient-to-b from-[#FFFFFF] to-[#CEEDB2]">
        <div className="container flex flex-col">
          <div className="h-full flex flex-col space-y-20">
            <h1 className="text-heading text-5xl font-jakarta">Kenapa Guru Bantu?</h1>

            {/* Card Section */}
            <div className="grid grid-cols-3 gap-4">

              {/* Card Item */}
              <div className="py-8 px-6 bg-[#084734] rounded-2xl shadow-md overflow-hidden">
                <div className="flex flex-col space-y-4">
                  <h2 className="text-heading text-3xl text-[#CEF17B] font-geist max-w-60">Forum Diskusi Interaktif</h2>
                  <p className="text-paragraph text-base text-[#CEF17B]">Bergabunglah dalam diskusi aktif dengan guru dan relawan lainnya untuk berbagi pengalaman dan strategi mengajar.</p>
                  <div className="relative h-96">
                    <Image
                      src="/benefit-forum.png"
                      alt="Forum Diskusi Interaktif"
                      width={600}
                      height={500}
                      className="max-w-4xl absolute top-14 left-20 shadow-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Card Item */}
              <div className="py-8 px-6 bg-[#084734] rounded-2xl shadow-md overflow-hidden">
                <div className="flex flex-col-reverse space-y-4">
                  <h2 className="text-heading text-3xl text-[#CEF17B] font-geist max-w-60">Perpustakaan</h2>
                  <p className="text-paragraph text-base text-[#CEF17B]">Perpustakaan digital yang menyediakan berbagai sumber daya pendidikan, termasuk modul, video, dan template presentasi.</p>
                  <div className="relative h-96">
                    <Image
                      src="/benefit-ai.png"
                      alt="AI Assistensi Pembelajaran"
                      width={600}
                      height={500}
                      className="max-w-4xl absolute top-14 left-20 shadow-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Card Item */}
              <div className="py-8 px-6 bg-[#084734] rounded-2xl shadow-md overflow-hidden">
                <div className="flex flex-col space-y-4">
                  <h2 className="text-heading text-3xl text-[#CEF17B] font-geist max-w-60">AI Assistensi Pembelajaran</h2>
                  <p className="text-paragraph text-base text-[#CEF17B]">Dapatkan bantuan AI untuk membuat rencana pembelajaran, materi ajar, dan sumber daya pendidikan yang sesuai dengan kebutuhan siswa Anda.</p>
                  <div className="relative h-96">
                    <Image
                      src="/benefit-ai.png"
                      alt="AI Assistensi Pembelajaran"
                      width={600}
                      height={500}
                      className="max-w-4xl absolute top-14 left-20 shadow-lg"
                    />
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 h-screen flex bg-gradient-to-b from-[#CEEDB2] to-[#FFFFFF]">
        <div className="container flex flex-col items-center">
          <div className="max-w-3xl">
            <h1 className="text-heading text-5xl text-center font-jakarta">Langkah Mudah untuk Mulai Bersama Guru Bantu</h1>
          </div>
          <div></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 h-screen flex">
        <div className="container flex flex-col items-center justify-center">
          <div className="bg-[#CEEDB2] rounded-2xl py-6 w-6xl flex items-center justify-center">
            <div className="max-w-3xl py-8 flex flex-col items-center justify-center text-center space-y-8">
              <h1 className="text-heading text-5xl font-jakarta">Bergabunglah dengan Komunitas Guru Bantu</h1>
              <p className="text-paragraph text-lg">Daftar sekarang untuk mendapatkan akses ke forum diskusi, perpustakaan sumber daya, dan bantuan AI dalam mengajar.</p>
              <button className="px-8 py-4 bg-[#084734] text-[#CEF17B] rounded-full text-lg font-semibold">
                Daftar Sekarang
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}