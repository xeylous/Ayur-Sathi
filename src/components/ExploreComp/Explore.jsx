"use client";
import { motion } from "framer-motion";

const exploreItems = [
  {
    title: "Ayurvedic Herbs",
    desc: "Discover authentic, geo-tagged medicinal herbs.",
    img: "/images/herbs.jpg",
  },
  {
    title: "Wellness Trips",
    desc: "Explore curated Ayurvedic retreats and tours.",
    img: "/images/trips.jpg",
  },
  {
    title: "Knowledge Hub",
    desc: "Learn about traditional practices and remedies.",
    img: "/images/knowledge.jpg",
  },
  {
    title: "Marketplace",
    desc: "Find trusted suppliers and certified products.",
    img: "/images/marketplace.jpg",
  },
];

export default function ExploreSection() {
  return (
    <section className="py-12 px-6 bg-[#ECF39E]/30">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-8">
        🌿 Explore Ayur Saathi
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {exploreItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition"
          >
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold text-green-700">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
