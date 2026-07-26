"use client";

import React, { useState, useEffect } from "react";
import { 
  Heart, 
  Clock, 
  User, 
  Calendar, 
  Share2, 
  Bookmark, 
  ArrowLeft, 
  Search, 
  MessageSquare, 
  Tag, 
  Send, 
  CheckCircle2, 
  ChevronRight, 
  BookOpen, 
  AlertCircle,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

// ----------------- MOCK ARTICLES DATA -----------------
const ARTICLES = [
  {
    id: 1,
    title: "Ashwagandha: The Root of Vitality & Resilience",
    category: "Herbs",
    tagColor: "bg-emerald-100 text-emerald-800",
    image: "/Image_1.jpeg",
    readTime: "6 min read",
    date: "July 24, 2026",
    author: "Dr. Aarav Mehta",
    authorTitle: "Senior Ayurvedic Physician",
    excerpt: "Ashwagandha (Withania somnifera) is one of the most celebrated adaptogens in Ayurveda. Explore the biochemical science of how it reduces cortisol, eases anxious minds, and rebuilds immune reserves.",
    content: `Ashwagandha, which translates to "the smell of a horse" (alluding to both its unique aroma and the strength and vitality it is said to impart), is a cornerstone of Ayurvedic medicine. Classed as a *Rasayana* (rejuvenator), it has been used for over 3,000 years to support vitality, ease stress, and enhance concentration.

In modern herbal medicine, Ashwagandha is celebrated as an adaptogen—a substance that helps the body adapt to physiological and psychological stress.

### The Science of Stress Reduction
Chronic stress increases cortisol levels, which can lead to sleep disorders, high blood pressure, and weakened immunity. Research shows that Ashwagandha significantly lowers cortisol production, signaling the adrenals to wind down. By acting on the GABA receptors in the brain, it supports a calm nervous system, making it an excellent natural remedy for anxious minds.

> "Ashwagandha serves as a bridge, harmonizing the Vata and Kapha energies in the body to establish a profound state of inner balance."

### Traditional Ayurvedic Preparations
Classic texts recommend consuming Ashwagandha root powder mixed with warm milk and honey before sleep. This combination leverages the nourishing (*anupana*) qualities of milk to carry the active compounds (*withanolides*) deep into the nervous system, promoting restful sleep and tissue regeneration.`,
    marketplaceSearch: "Ashwagandha",
    initialLikes: 48
  },
  {
    id: 2,
    title: "Tulsi: The Sacred Queen of Ayurvedic Herbs",
    category: "Wellness",
    tagColor: "bg-teal-100 text-teal-800",
    image: "/Image_2.jpeg",
    readTime: "4 min read",
    date: "July 22, 2026",
    author: "Dr. Anjali Sharma",
    authorTitle: "Panchakarma & Wellness Specialist",
    excerpt: "Tulsi (Holy Basil) has been revered for millennia in Indian households. Discover its phenomenal anti-viral, respiratory cleansing, and adaptogenic properties that elevate physical and mental energy.",
    content: `Tulsi (Holy Basil), known as the "Incomparable One," is considered a sacred plant in India. Beyond its spiritual significance, Tulsi is a pharmacological powerhouse. It is highly valued for its ability to clear respiratory congestion, reduce fever, and alleviate bronchial distress.

### Respiratory Cleansing & Immunity
Rich in eugenol and antioxidants, Tulsi acts as an immunomodulator. It liquefies phlegm (*Kapha*) and acts as an anti-spasmodic, making it a natural choice for coughs, cold symptoms, and seasonal allergies. Drinking freshly brewed Tulsi tea daily forms a protective barrier for your respiratory tract.

### A Natural Cognitive Adaptogen
Tulsi has been shown to counteract metabolic stress by normalizing blood glucose, blood pressure, and lipid profiles. Its calming effects on the mind are comparable to modern anxiolytics, helping to increase cognitive clarity and resilience without causing drowsiness.

### Simple Recipe: Immunizing Tulsi Infusion
1. Boil 1.5 cups of water.
2. Add 6-8 fresh Tulsi leaves (or 1 tsp dried Tulsi).
3. Simmer for 5 minutes.
4. Add 2 crushed black peppercorns and a slice of ginger.
5. Strain, add a teaspoon of raw honey (once warm, not hot!), and enjoy.`,
    marketplaceSearch: "Tulsi",
    initialLikes: 35
  },
  {
    id: 3,
    title: "Turmeric (Haridra): The Golden Healer",
    category: "Nutrition",
    tagColor: "bg-amber-100 text-amber-800",
    image: "/Image_3.jpeg",
    readTime: "5 min read",
    date: "July 18, 2026",
    author: "Dr. Vikram Ranade",
    authorTitle: "Rasayana Expert",
    excerpt: "Turmeric owes its vibrant color and healing properties to curcumin. Discover how Haridra acts as a natural anti-inflammatory, detoxifies the liver, and strengthens joint mobility.",
    content: `Haridra (Turmeric) has been a staple of Indian cuisine and Ayurvedic medicine for centuries. Modern science has confirmed its therapeutic benefits, attributing them primarily to *curcumin*, a polyphenol with extraordinary anti-inflammatory and antioxidant properties.

### Fighting Inflammation Naturally
In Ayurveda, inflammation is often associated with an imbalance in the Pitta and Kapha doshas. Curcumin acts on multiple cellular targets to block inflammatory molecules, offering relief from joint pain, digestive irritation, and skin conditions such as eczema and acne.

### Maximizing Absorption (Bioavailability)
One limitation of curcumin is its poor absorption in the digestive tract. Traditional Ayurveda solved this by always cooking turmeric in healthy fats (like ghee) and combining it with black pepper. Modern studies confirm that *piperine* (the active compound in black pepper) increases curcumin absorption by up to 2,000%!

> Always combine Turmeric with a pinch of Black Pepper and a healthy fat (such as coconut oil or ghee) to unlock its full therapeutic potential.

### Golden Milk Recipe
A classic recipe is *Haldi Doodh*. Warm 1 cup of almond or cow's milk, stir in 1/2 tsp of pure organic turmeric powder, a pinch of black pepper, a small piece of cinnamon, and a teaspoon of ghee. Sweeten with maple syrup or honey to taste.`,
    marketplaceSearch: "Turmeric",
    initialLikes: 56
  },
  {
    id: 4,
    title: "Panchakarma: The Five-Fold Cleansing Path",
    category: "Detox",
    tagColor: "bg-blue-100 text-blue-800",
    image: "/Image_4.jpeg",
    readTime: "8 min read",
    date: "July 15, 2026",
    author: "Dr. Anjali Sharma",
    authorTitle: "Panchakarma & Wellness Specialist",
    excerpt: "Explore classical Panchakarma therapy: the ultimate physiological purification process. Learn how Vamana, Virechana, Basti, Nasya, and Raktamokshana purge deep cellular toxins.",
    content: `Panchakarma is the ultimate detoxification process in Ayurvedic medicine. It consists of five therapeutic actions aimed at clearing accumulated metabolic waste (*Ama*) and restoring balance to the three Doshas.

Unlike standard diets, Panchakarma is a deep cellular cleanse that pulls toxins from bodily tissues (*Dhatus*) back into the digestive tract for elimination.

### The Five Actions Explained
1. **Vamana (Emesis)**: Clears excess Kapha from the lungs and stomach.
2. **Virechana (Purgation)**: Cleanses Pitta toxins from the liver, gallbladder, and small intestines.
3. **Basti (Enema)**: The mother of therapies; balances Vata in the colon.
4. **Nasya (Nasal Administration)**: Cleanses the sinuses, head, and nervous system.
5. **Raktamokshana (Bloodletting)**: Purifies the blood (often done via leeches or micro-circulation therapies).

### Preparing the Body: Purvakarma
A successful Panchakarma requires thorough preparation (*Purvakarma*). This involves internal oleation (drinking warm ghee) and external oleation (*Abhyanga* massage) followed by herbal steam therapy (*Swedana*). This process loosens deep-seated toxins and channels them toward the elimination organs.

Panchakarma must always be undertaken under the supervision of a certified Ayurvedic physician (Vaidya), with treatments customized to your specific constitution.`,
    marketplaceSearch: "Detox",
    initialLikes: 29
  },
  {
    id: 5,
    title: "Secrets of Dinacharya: Ayurvedic Daily Routines",
    category: "Routine",
    tagColor: "bg-rose-100 text-rose-800",
    image: "/Image_5.jpeg",
    readTime: "7 min read",
    date: "July 10, 2026",
    author: "Dr. Aarav Mehta",
    authorTitle: "Senior Ayurvedic Physician",
    excerpt: "Aligning your daily actions with cosmic biological rhythms is the key to longevity. Discover the optimal times for waking, exercising, dining, and sleeping according to solar energies.",
    content: `In Ayurveda, health is maintained by aligning our daily schedules with natural rhythms. This daily routine is called *Dinacharya*. By establishing a regular rhythm, you prevent the accumulation of toxins, keep your digestion strong, and maintain mental clarity.

### The Morning Cleansing Cycle (06:00 AM - 10:00 AM)
Ayurveda recommends waking up before sunrise during *Brahma Muhurta* (approx. 04:30 AM - 05:30 AM), when Vata energy is dominant in the atmosphere. This time is ideal for meditation and yoga.

Following waking:
- **Scrape your tongue**: Removes overnight bacterial buildup and stimulates digestion.
- **Oil Pulling (Gandusha)**: Swishing warm sesame oil in the mouth for 10-15 minutes strengthens teeth and gums.
- **Dry Brushing (Garshana)** or **Abhyanga**: Stimulates lymphatic drainage and blood flow.

### Digestion Peak (10:00 AM - 02:00 PM)
The solar energy is at its highest during the middle of the day, which aligns with *Pitta* energy in the body. This is when your digestive fire (*Agni*) is strongest. Make lunch your largest, most nourishing meal of the day.

### Evening Wind-Down (06:00 PM - 10:00 PM)
As Kapha energy rises in the evening, the body slows down. Eat a light dinner before 7:30 PM. Unplug from screens, drink warm milk with nutmeg, and aim to sleep by 10:00 PM to support liver detoxification during the subsequent Pitta cycle.`,
    marketplaceSearch: "Ghee",
    initialLikes: 42
  }
];

// Initial mock comments data
const INITIAL_COMMENTS = {
  1: [
    { name: "Suresh Patel", text: "This article is so informative. I started taking Ashwagandha milk at night and my sleep quality has drastically improved!", date: "July 25, 2026" },
    { name: "Dr. Karen Vance", text: "Great breakdown of the biochemical impact of withanolides on the adrenal glands. Excellent post!", date: "July 24, 2026" }
  ],
  2: [
    { name: "Priya Menon", text: "Tulsi tea has been my go-to for years during monsoons. Adding ginger makes it even better.", date: "July 23, 2026" }
  ],
  3: [
    { name: "Rohan Das", text: "I did not know black pepper increased turmeric absorption by that much! Thanks for the tip.", date: "July 20, 2026" },
    { name: "Meera Nair", text: "Is it better to use fresh turmeric root or organic powder for Golden Milk?", date: "July 19, 2026" }
  ],
  4: [
    { name: "Amit Joshi", text: "I underwent Panchakarma treatment in Kerala last winter. It completely revived my digestion.", date: "July 16, 2026" }
  ],
  5: [
    { name: "Nisha Patel", text: "Trying to wake up at Brahma Muhurta is hard but whenever I manage it, the day feels so peaceful.", date: "July 12, 2026" }
  ]
};

export default function BlogPage() {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  // Persistent States
  const [likes, setLikes] = useState({});
  const [bookmarks, setBookmarks] = useState([]);
  const [comments, setComments] = useState({});
  const [newCommentName, setNewCommentName] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  // Hydration safe loading
  useEffect(() => {
    // 1. Likes
    const storedLikes = localStorage.getItem("ayursaathi_blog_likes");
    if (storedLikes) {
      setLikes(JSON.parse(storedLikes));
    } else {
      const defaultLikes = {};
      ARTICLES.forEach(a => { defaultLikes[a.id] = a.initialLikes; });
      setLikes(defaultLikes);
      localStorage.setItem("ayursaathi_blog_likes", JSON.stringify(defaultLikes));
    }

    // 2. Bookmarks
    const storedBookmarks = localStorage.getItem("ayursaathi_blog_bookmarks");
    if (storedBookmarks) {
      setBookmarks(JSON.parse(storedBookmarks));
    }

    // 3. Comments
    const storedComments = localStorage.getItem("ayursaathi_blog_comments");
    if (storedComments) {
      setComments(JSON.parse(storedComments));
    } else {
      setComments(INITIAL_COMMENTS);
      localStorage.setItem("ayursaathi_blog_comments", JSON.stringify(INITIAL_COMMENTS));
    }
  }, []);

  // Filter Articles
  const filteredArticles = ARTICLES.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "All" || art.category === activeCategory;
    
    const matchesBookmark = !showBookmarkedOnly || bookmarks.includes(art.id);

    return matchesSearch && matchesCategory && matchesBookmark;
  });

  // Handle Like
  const handleLike = (id, e) => {
    e?.stopPropagation(); // Prevent card click
    const currentLikes = { ...likes };
    currentLikes[id] = (currentLikes[id] || 0) + 1;
    setLikes(currentLikes);
    localStorage.setItem("ayursaathi_blog_likes", JSON.stringify(currentLikes));
    toast.success("Thank you for liking this article!");
  };

  // Handle Bookmark
  const handleBookmark = (id, e) => {
    e?.stopPropagation();
    let updatedBookmarks = [...bookmarks];
    if (updatedBookmarks.includes(id)) {
      updatedBookmarks = updatedBookmarks.filter(bId => bId !== id);
      toast.info("Removed from Bookmarks");
    } else {
      updatedBookmarks.push(id);
      toast.success("Added to Bookmarks!");
    }
    setBookmarks(updatedBookmarks);
    localStorage.setItem("ayursaathi_blog_bookmarks", JSON.stringify(updatedBookmarks));
  };

  // Handle Share
  const handleShare = (blog, e) => {
    e?.stopPropagation();
    const shareUrl = `${window.location.origin}/blog?id=${blog.id}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast.success("Share link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Could not copy link", err);
      });
  };

  // Handle Add Comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) {
      toast.error("Please fill in both your name and comment.");
      return;
    }

    const newComment = {
      name: newCommentName.trim(),
      text: newCommentText.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    };

    const updatedComments = { ...comments };
    if (!updatedComments[selectedBlog.id]) {
      updatedComments[selectedBlog.id] = [];
    }
    updatedComments[selectedBlog.id].push(newComment);
    setComments(updatedComments);
    localStorage.setItem("ayursaathi_blog_comments", JSON.stringify(updatedComments));

    setNewCommentName("");
    setNewCommentText("");
    toast.success("Comment posted successfully!");
  };

  // Categories list
  const categories = ["All", "Herbs", "Wellness", "Nutrition", "Detox", "Routine"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ECF39E]/10 via-white to-[#ECF39E]/5 font-sans text-brand-900 selection:bg-[#ECF39E] selection:text-[#31572C]">
      
      {/* Blog Hero Banner */}
      <section className="bg-gradient-to-br from-[#31572C] to-[#4F772D] text-white py-12 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-12 -left-12 w-96 h-96 bg-[#ECF39E] rounded-full filter blur-3xl opacity-10" />
        <div className="absolute -bottom-16 -right-16 w-96 h-96 bg-[#90A955] rounded-full filter blur-3xl opacity-20" />

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10 space-y-4">
          <span className="inline-flex items-center gap-1 bg-[#ECF39E]/25 text-[#ECF39E] font-bold text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-[#ECF39E]" /> Ayurvedic Wisdom Hub
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto">
            Herbal Knowledge Blog
          </h1>
          <p className="text-sm md:text-base text-[#ECF39E]/90 max-w-xl mx-auto leading-relaxed">
            Delve into ancient formulations, certified botanical insights, and evidence-backed wellness routines to optimize your health.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!selectedBlog ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-10"
            >
              {/* Search, Categories & Filters Bar */}
              <div className="bg-white p-5 rounded-2xl border border-[#4F772D]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
                
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles, topics, ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#90A955]/40 text-sm font-medium placeholder-gray-400"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-bold">
                      Clear
                    </button>
                  )}
                </div>

                {/* Bookmark Toggle Filter */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
                    className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      showBookmarkedOnly
                        ? "bg-[#31572C] border-[#31572C] text-white"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-600"
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${showBookmarkedOnly ? "fill-white" : ""}`} />
                    <span>Bookmarked Only</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none justify-start md:justify-center">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 text-xs font-bold rounded-full border flex-shrink-0 transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-[#90A955] border-[#90A955] text-white shadow-sm scale-105"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat === "All" ? "All Topics" : cat}
                  </button>
                ))}
              </div>

              {/* Blog Post Grid */}
              {filteredArticles.length === 0 ? (
                <div className="bg-white rounded-2xl border border-[#4F772D]/10 p-12 text-center shadow-sm">
                  <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="text-xl font-bold text-gray-800">No Articles Found</h4>
                  <p className="text-gray-500 mt-2 max-w-sm mx-auto text-sm leading-relaxed">
                    We couldn't find any articles matching your filters or search query "{searchQuery}". Try modifying your selections.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("All");
                      setShowBookmarkedOnly(false);
                    }}
                    className="mt-5 px-6 py-2.5 rounded-xl bg-[#31572C] text-white hover:bg-[#4F772D] transition-colors text-sm font-bold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredArticles.map((blog) => {
                    const isBookmarked = bookmarks.includes(blog.id);
                    return (
                      <article
                        key={blog.id}
                        className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group hover:-translate-y-1"
                      >
                        {/* Article Cover Image */}
                        <div className="h-52 w-full overflow-hidden relative bg-slate-100 cursor-pointer" onClick={() => setSelectedBlog(blog)}>
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Category pill overlays */}
                          <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-extrabold shadow-sm ${blog.tagColor}`}>
                            {blog.category}
                          </span>
                        </div>

                        {/* Card body */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div className="space-y-3.5">
                            
                            {/* Metadata */}
                            <div className="flex items-center gap-4 text-[11px] text-gray-400 font-semibold">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" /> {blog.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> {blog.readTime}
                              </span>
                            </div>

                            {/* Title */}
                            <h2 
                              className="text-lg font-bold text-gray-900 group-hover:text-[#31572C] cursor-pointer transition-colors leading-snug line-clamp-2"
                              onClick={() => setSelectedBlog(blog)}
                            >
                              {blog.title}
                            </h2>

                            {/* Excerpt */}
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                              {blog.excerpt}
                            </p>
                          </div>

                          {/* Footer Actions */}
                          <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between">
                            
                            {/* Read More button */}
                            <button
                              onClick={() => setSelectedBlog(blog)}
                              className="text-xs font-bold text-[#31572C] hover:text-[#4F772D] flex items-center gap-1 group/btn cursor-pointer"
                            >
                              Read Article 
                              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                            </button>

                            {/* Action icons */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => handleLike(blog.id, e)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                                title="Like article"
                              >
                                <Heart className="w-4 h-4" />
                                <span className="text-[10px] font-bold">{likes[blog.id] || 0}</span>
                              </button>
                              <button
                                onClick={(e) => handleBookmark(blog.id, e)}
                                className="p-2 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all cursor-pointer"
                                title="Bookmark article"
                              >
                                <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-amber-500 text-amber-500" : ""}`} />
                              </button>
                              <button
                                onClick={(e) => handleShare(blog, e)}
                                className="p-2 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all cursor-pointer"
                                title="Share article link"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                            </div>

                          </div>
                        </div>

                      </article>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            
            // ----------------- DETAILED ARTICLE VIEW -----------------
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start"
            >
              {/* Back & Floating Action Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Back to list */}
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="w-full flex items-center justify-center gap-2 bg-[#31572C] hover:bg-[#4F772D] text-white font-bold py-3 px-4 rounded-2xl transition-all text-sm shadow-sm cursor-pointer hover:scale-[1.02]"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Articles
                </button>

                {/* Article Info & Interactive Actions */}
                <div className="bg-white border border-[#4F772D]/10 rounded-3xl p-5 shadow-sm space-y-5">
                  <div className="border-b pb-3.5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${selectedBlog.tagColor}`}>
                      {selectedBlog.category}
                    </span>
                    <h4 className="font-bold text-base text-gray-900 mt-3 leading-snug">
                      {selectedBlog.title}
                    </h4>
                  </div>

                  {/* Actions counters */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleLike(selectedBlog.id)}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-red-100 bg-red-50/20 hover:bg-red-50 text-red-600 hover:text-red-700 flex items-center justify-between text-xs font-bold transition-all cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Heart className="w-4.5 h-4.5 fill-red-600 text-red-600" />
                        Liked this article
                      </span>
                      <span>{likes[selectedBlog.id] || 0}</span>
                    </button>

                    <button
                      onClick={() => handleBookmark(selectedBlog.id)}
                      className={`w-full py-2.5 px-3.5 rounded-xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                        bookmarks.includes(selectedBlog.id)
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-gray-100 bg-gray-50 hover:bg-gray-100 text-gray-600"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Bookmark className={`w-4.5 h-4.5 ${bookmarks.includes(selectedBlog.id) ? "fill-amber-500 text-amber-500" : ""}`} />
                        {bookmarks.includes(selectedBlog.id) ? "Bookmarked!" : "Bookmark article"}
                      </span>
                    </button>

                    <button
                      onClick={() => handleShare(selectedBlog)}
                      className="w-full py-2.5 px-3.5 rounded-xl border border-sky-100 bg-sky-50/20 hover:bg-sky-50 text-sky-600 hover:text-sky-700 flex items-center gap-2 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Share2 className="w-4.5 h-4.5" />
                      Copy Share Link
                    </button>
                  </div>

                  {/* Date & time */}
                  <div className="text-xs text-gray-500 space-y-2 border-t pt-4">
                    <div className="flex justify-between">
                      <span>Published:</span>
                      <span className="font-bold text-gray-800">{selectedBlog.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Read Time:</span>
                      <span className="font-bold text-gray-800">{selectedBlog.readTime}</span>
                    </div>
                  </div>
                </div>

                {/* Marketplace Call to Action (Traceable Herbs) */}
                <div className="bg-gradient-to-br from-[#31572C] to-[#4F772D] text-white rounded-3xl p-6 shadow-sm border border-[#ECF39E]/20 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-6 -mt-6" />
                  <h4 className="text-lg font-bold flex items-center gap-2 text-[#ECF39E]">
                    <BookOpen className="w-5 h-5" /> Traceable Remedy
                  </h4>
                  <p className="text-xs text-slate-100 leading-relaxed">
                    Looking for genuine, lab-verified {selectedBlog.marketplaceSearch}? Check out live batches with geo-tagged harvest coordinates and immutable provenance records on our marketplace.
                  </p>
                  <a
                    href="/marketplace"
                    className="block text-center bg-[#ECF39E] hover:bg-white text-[#31572C] font-bold py-2.5 px-4 rounded-xl transition-all text-xs shadow-sm hover:scale-[1.02]"
                  >
                    Browse {selectedBlog.marketplaceSearch} Batches
                  </a>
                </div>

              </div>

              {/* Main Article Body & Comments */}
              <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-8">
                
                {/* Author profile header */}
                <div className="flex items-center gap-4 border-b pb-5">
                  <div className="w-12 h-12 rounded-full bg-[#ECF39E] text-[#31572C] font-extrabold flex items-center justify-center text-lg shadow-inner">
                    {selectedBlog.author[4]}
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-gray-900">{selectedBlog.author}</h5>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{selectedBlog.authorTitle}</p>
                  </div>
                </div>

                {/* Large Featured Image */}
                <div className="w-full h-80 rounded-2xl overflow-hidden bg-slate-50 border border-gray-100">
                  <img
                    src={selectedBlog.image}
                    alt={selectedBlog.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Article Header Title */}
                <div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                    {selectedBlog.title}
                  </h2>
                </div>

                {/* Main Content Paragraphs (with styled Drop-Cap) */}
                <div className="prose max-w-none text-xs md:text-sm text-gray-600 leading-relaxed space-y-6">
                  {selectedBlog.content.split("\n\n").map((para, i) => {
                    if (para.startsWith("###")) {
                      return (
                        <h3 key={i} className="text-base md:text-lg font-bold text-[#31572C] pt-3">
                          {para.replace("###", "").trim()}
                        </h3>
                      );
                    }
                    if (para.startsWith(">")) {
                      return (
                        <blockquote key={i} className="border-l-4 border-[#90A955] bg-[#ECF39E]/10 p-4 rounded-r-xl italic font-medium text-[#31572C] text-sm leading-relaxed my-4">
                          {para.replace(">", "").replace(/"/g, "").trim()}
                        </blockquote>
                      );
                    }
                    
                    // Style the very first paragraph with a Drop-Cap
                    if (i === 0) {
                      const firstLetter = para.charAt(0);
                      const restOfText = para.slice(1);
                      return (
                        <p key={i}>
                          <span className="float-left text-4xl md:text-5xl font-extrabold text-[#31572C] mr-2 mt-1 font-serif leading-none">
                            {firstLetter}
                          </span>
                          {restOfText}
                        </p>
                      );
                    }

                    return <p key={i} dangerouslySetInnerHTML={{ __html: para }} />;
                  })}
                </div>

                {/* Comments Section */}
                <div className="border-t pt-8 space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#90A955]" />
                    Comments ({(comments[selectedBlog.id] || []).length})
                  </h3>

                  {/* Comment List */}
                  <div className="space-y-4">
                    {!(comments[selectedBlog.id]) || comments[selectedBlog.id].length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No comments yet. Be the first to share your thoughts!</p>
                    ) : (
                      comments[selectedBlog.id].map((comm, idx) => (
                        <div key={idx} className="bg-gray-50 border border-gray-100 rounded-2xl p-4 text-xs space-y-1">
                          <div className="flex justify-between items-center font-bold text-gray-800">
                            <span>{comm.name}</span>
                            <span className="text-[10px] text-gray-400 font-normal">{comm.date}</span>
                          </div>
                          <p className="text-gray-600 leading-relaxed font-medium pt-1">
                            {comm.text}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Comment Submission Form */}
                  <form onSubmit={handleAddComment} className="bg-gray-50/50 rounded-3xl p-5 border border-gray-100 space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Leave a Comment</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-1">
                        <input
                          type="text"
                          required
                          placeholder="Your Name *"
                          value={newCommentName}
                          onChange={(e) => setNewCommentName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#90A955]/30 text-xs font-medium"
                        />
                      </div>
                      <div className="md:col-span-2 relative">
                        <input
                          type="text"
                          required
                          placeholder="Type comment message... *"
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          className="w-full pl-3.5 pr-12 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#90A955]/30 text-xs font-medium"
                        />
                        <button
                          type="submit"
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#31572C] hover:bg-[#4F772D] text-white transition-colors cursor-pointer"
                          title="Post comment"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </form>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

    </div>
  );
}
