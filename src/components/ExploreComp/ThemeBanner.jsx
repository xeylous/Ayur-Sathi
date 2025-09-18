export default function ThemeBanner() {
  return (
    <section className="relative w-full bg-[#ECF39E]/30">
      {/* Banner image only visible on md+ screens */}
      <div className="hidden md:block">
        <img
          src="/banner.png"
          alt="AyurSaathi Banner"

          className="w-full h-10 object-left md:h-10 lg:h-[500px] pb-10"

        />
      </div>
    </section>
  );
}
