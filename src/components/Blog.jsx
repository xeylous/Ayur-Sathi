import { useState } from "react";

const blogData = [
  {
    id: 1,
    title: "Benefits of Ashwagandha in Daily Life",
    image: "/images/ashwagandha.jpg",
    excerpt:
      "Ashwagandha is one of the most powerful herbs in Ayurveda, known for reducing stress and boosting immunity...",
    content:
      "Ashwagandha helps in reducing cortisol levels, improving sleep, increasing stamina and enhancing overall mental clarity. Regular consumption can support a healthier lifestyle."
  },
  {
    id: 2,
    title: "Why Tulsi is Called The Queen of Herbs",
    image: "/images/tulsi.jpg",
    excerpt:
      "Tulsi has been used in Indian households for centuries due to its medicinal power...",
    content:
      "Tulsi improves respiratory health, strengthens immunity and helps fight infections naturally. It is also known for its anti-inflammatory properties."
  },
  {
    id: 3,
    title: "Turmeric: The Golden Healer",
    image: "/images/turmeric.jpg",
    excerpt:
      "Turmeric contains curcumin which acts as a natural antioxidant and pain reliever...",
    content:
      "Turmeric is widely used to treat wounds, boost digestion and reduce inflammation. It also enhances skin glow and supports joint health."
  }
];

export default function BlogPage() {
  const [selectedBlog, setSelectedBlog] = useState(null);

  return (
    <div className="min-h-screen bg-[#f8fbe0] p-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-[#31562d]">
        Herbal Knowledge Blog
      </h1>

      {!selectedBlog ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogData.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition cursor-pointer"
              onClick={() => setSelectedBlog(blog)}
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <div className="p-5">
                <h2 className="text-xl font-semibold text-[#31562d] mb-2">
                  {blog.title}
                </h2>
                <p className="text-gray-600">{blog.excerpt}</p>
                <button className="mt-4 text-sm bg-[#90A955] hover:bg-[#4F772D]  text-white px-4 py-2 rounded-full">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <button
            onClick={() => setSelectedBlog(null)}
            className="mb-4 text-sm bg-[#31562d] text-white px-4 py-2 rounded-full"
          >
            ← Back to Blogs
          </button>

          <h2 className="text-3xl font-bold text-[#31562d] mb-4">
            {selectedBlog.title}
          </h2>

          <img
            src={selectedBlog.image}
            alt={selectedBlog.title}
            className="w-full h-72 object-cover rounded-xl mb-6"
          />

          <p className="text-gray-700 leading-relaxed">
            {selectedBlog.content}
          </p>
        </div>
      )}
    </div>
  );
}
