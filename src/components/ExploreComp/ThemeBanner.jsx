export default function ThemeBanner() {
  return (
    <section className="relative w-full bg-[#dffdef]">
      {/* Banner image only visible on md+ screens */}
      <div className="hidden md:block">
        <img
          src="/banner.png"
          alt="AyurSaathi Banner"

          className="w-full h-48 object-contain md:h-48 lg:h-[300px] "

        />
      </div>
    </section>
  );
}
