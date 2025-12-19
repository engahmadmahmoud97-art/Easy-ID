import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import logo from "@/assets/logo.jpeg";
import whiteSmartCard from "@/assets/products/white-smart-card.jpg";
import whiteSmartSticker from "@/assets/products/white-smart-sticker.jpg";
import blackSmartSticker from "@/assets/products/black-smart-sticker.jpg";
import smartWhatsappKeychain from "@/assets/products/smart-whatsapp-keychain.jpg";
import googleReviewsKeychain from "@/assets/products/google-reviews-keychain.jpg";
import printableSmartKeychain from "@/assets/products/printable-smart-keychain.jpg";
import instagramSmartKeychain from "@/assets/products/instagram-smart-keychain.jpg";
import blackSmartCard from "@/assets/products/black-smart-card.jpg";
import specialNfcCard from "@/assets/products/special-nfc-card.jpg";
import instagramSmartCard from "@/assets/products/instagram-smart-card.jpg";
import whatsappSmartCard from "@/assets/products/whatsapp-smart-card.jpg";
import smartRing from "@/assets/products/smart-ring.png";
import smartNecklace from "@/assets/products/smart-necklace.png";
import personalisedSmartCard from "@/assets/products/personalised-smart-card.png";
import smartStandMenu from "@/assets/products/smart-stand-menu.png";
import personalisedWoodenCard from "@/assets/products/personalised-wooden-card.png";
import smartWhiteNecklace from "@/assets/products/smart-white-necklace.png";

const products = [
  // 1-Personalised
  { id: 1, name: "Smart Stand for Menu & Google Review", price: "50 $", category: "Personalised", image: smartStandMenu },
  { id: 2, name: "Personalised Smart Card", price: "40 $", category: "Personalised", image: personalisedSmartCard },
  { id: 3, name: "Personalised Wooden Card", price: "35 $", category: "Personalised", image: personalisedWoodenCard },

  // 2-Smart accessories
  { id: 4, name: "Smart White Necklace", price: "40 $", category: "Smart Accessories", image: smartWhiteNecklace },
  { id: 5, name: "Smart Black Necklace", price: "35 $", category: "Smart Accessories", image: smartNecklace },
  { id: 6, name: "Smart Ring", price: "35 $", category: "Smart Accessories", image: smartRing },

  // 3- Cards
  { id: 7, name: "Special Smart Card", price: "25 $", category: "Cards", image: specialNfcCard },
  { id: 8, name: "Black Smart Card", price: "22 $", category: "Cards", image: blackSmartCard },
  { id: 9, name: "White Smart Card", price: "22 $", category: "Cards", image: whiteSmartCard },
  { id: 10, name: "WhatsApp Smart Card", price: "25 $", category: "Cards", image: whatsappSmartCard },
  { id: 11, name: "Instagram Smart Card", price: "25 $", category: "Cards", image: instagramSmartCard },

  // 4 - Smart keychain
  { id: 12, name: "WhatsApp Keychain", price: "25 $", category: "Smart Keychain", image: smartWhatsappKeychain },
  { id: 13, name: "Google Reviews Keychain", price: "25 $", category: "Smart Keychain", image: googleReviewsKeychain },
  { id: 14, name: "Printable Smart Keychain", price: "20 $", category: "Smart Keychain", image: printableSmartKeychain },
  { id: 15, name: "Instagram Keychain", price: "25 $", category: "Smart Keychain", image: instagramSmartKeychain },

  // 5- Smart stickers
  { id: 16, name: "White Smart Sticker", price: "18 $", category: "Smart Stickers", image: whiteSmartSticker },
  { id: 17, name: "Black Smart Sticker", price: "17 $", category: "Smart Stickers", image: blackSmartSticker },

  // 6- Protection products
  { id: 18, name: "Anti ID Thief Card", price: "20 $", category: "Protection Products", image: blackSmartCard }, // Placeholder
  { id: 19, name: "Protected Wallet & Passport", price: "25 $", category: "Protection Products", image: specialNfcCard }, // Placeholder
  { id: 20, name: "Card Guard", price: "18 $", category: "Protection Products", image: whiteSmartCard }, // Placeholder
];

const categories = [
  "All",
  "Personalised",
  "Smart Accessories",
  "Cards",
  "Smart Keychain",
  "Smart Stickers",
  "Protection Products"
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const ProductCard = ({ product }: { product: typeof products[0] }) => {
  const whatsappLink = `https://wa.me/962797541415?text=${encodeURIComponent(`Hi, I'm interested in the ${product.name}`)}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col glass-card rounded-[2rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <span className="absolute top-4 left-4 bg-white/10 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-white/20">
          {product.category}
        </span>
      </div>

      <div className="p-6 space-y-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <p className="text-2xl font-black text-white">{product.price}</p>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider transition-all duration-500 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 mt-0 group-hover:mt-1">
                SHIPPING AND PROGRAMMING INCLUDED
              </p>
            </div>
          </div>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-primary text-primary-foreground rounded-2xl glow-on-hover transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const Landing = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const filteredProducts = activeCategory === "All"
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 landing-page" dir="ltr">
      {/* Navbar stays the same */}
      <nav className="fixed top-0 inset-x-0 z-[100] h-20 bg-background/50 backdrop-blur-xl border-b border-white/5">
        <div className="container h-full mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Easy ID" className="h-10 w-10 rounded-xl" />
            <span className="text-xl font-black tracking-tighter uppercase">Easy ID</span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {["Products", "Features", "How it Works"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm font-medium text-muted-foreground hover:text-white transition-colors capitalize"
              >
                {item}
              </a>
            ))}
          </div>

          <a
            href="#products"
            className="px-6 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-primary hover:text-white transition-all duration-300"
          >
            Shop Now
          </a>
        </div>
      </nav>

      {/* Hero Section stays the same */}
      <section ref={targetRef} className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
        <motion.div style={{ opacity, scale }} className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-white/10 mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground">The Future of Networking</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-8"
          >
            CONNECT <br />
            <span className="text-gradient-primary animate-gradient">INSTANTLY.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Share your contact details, social media, and more with just a single tap.
            Smart NFC technology designed for the modern professional.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a
              href="#products"
              className="group relative px-10 py-5 bg-primary text-primary-foreground font-black text-lg rounded-[2rem] overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span className="relative z-10">Explore Collection</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </a>
            <a
              href="#how-it-works"
              className="px-10 py-5 bg-white/5 border border-white/10 text-white font-bold text-lg rounded-[2rem] hover:bg-white/10 transition-all duration-300"
            >
              How it works
            </a>
          </motion.div>
        </motion.div>

        {/* Floating background elements */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/20 blur-[150px] rounded-full" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-500/10 blur-[150px] rounded-full" />
      </section>

      {/* Trust Stats Section */}
      <section className="py-24 border-y border-white/5 bg-white/[0.02]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { label: "Happy Clients", value: "2k+" },
              { label: "Products Sold", value: "5k+" },
              { label: "NFC Interactions", value: "100k+" },
              { label: "Custom Designs", value: "500+" },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <h4 className="text-4xl md:text-5xl font-black text-white">{stat.value}</h4>
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">WHY LINKME?</h2>
            <p className="text-muted-foreground text-lg">Experience the next generation of business cards. Beautifully crafted hardware powered by smart tech.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "One Tap",
                desc: "No more paper cards. One tap to any smartphone shares everything instantly."
              },
              {
                icon: "🎨",
                title: "Fully Custom",
                desc: "Design your card to match your brand. Laser engraving, full color, or minimalist."
              },
              {
                icon: "🛡️",
                title: "Safe & Secure",
                desc: "Your data is protected. You control exactly what you share and when."
              },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-10 glass-card rounded-[3rem] space-y-6 hover:border-primary/50 transition-colors"
              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-3xl">{feat.icon}</div>
                <h3 className="text-2xl font-bold">{feat.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section with Tabs */}
      <section id="products" className="py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase">OUR COLLECTION</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mb-12">From premium cards to stylish wearables. Find the perfect piece for your digital identity.</p>

            <div className="flex flex-wrap items-center justify-center gap-2 p-2 glass-card rounded-full border-white/5 overflow-x-auto max-w-full">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:text-white hover:bg-white/5"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 bg-white/[0.01]">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-24">HOW IT WORKS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { step: "01", title: "Pick your product", desc: "Choose from our wide range of NFC-enabled gear." },
              { step: "02", title: "Set your profile", desc: "Easily upload your links and contact info via our portal." },
              { step: "03", title: "Tap to share", desc: "Tap your Easy ID to any smartphone and you're connected!" },
            ].map((item, i) => (
              <div key={i} className="relative text-center space-y-6">
                <div className="text-8xl font-black text-white/[0.03] absolute -top-12 inset-x-0">{item.step}</div>
                <div className="relative z-10 w-20 h-20 bg-primary mx-auto rounded-full flex items-center justify-center text-2xl font-black text-primary-foreground">
                  {i + 1}
                </div>
                <h3 className="text-2xl font-bold relative z-10">{item.title}</h3>
                <p className="text-muted-foreground relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="relative glass-card rounded-[4rem] p-12 md:p-24 overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

            <h2 className="text-4xl md:text-7xl font-black tracking-tight mb-8 relative z-10">
              READY TO <br className="md:hidden" /> UPGRADE?
            </h2>
            <p className="text-muted-foreground text-lg mb-12 max-w-xl mx-auto relative z-10">
              Join thousands of professionals who have ditched paper for the future of networking.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <a
                href="#products"
                className="px-12 py-5 bg-white text-black font-black text-lg rounded-full hover:bg-primary hover:text-white transition-all duration-300"
              >
                Shop All Products
              </a>
              <a
                href="https://wa.me/962797541415"
                target="_blank"
                rel="noopener noreferrer"
                className="px-12 py-5 bg-green-500 text-white font-black text-lg rounded-full hover:bg-green-600 transition-all duration-300 flex items-center gap-3 shadow-lg shadow-green-500/20"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 text-center md:text-left">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <img src={logo} alt="Logo" className="h-10 w-10 rounded-xl" />
                <span className="text-2xl font-black tracking-tighter uppercase">Easy ID</span>
              </div>
              <p className="text-muted-foreground max-w-sm mx-auto md:mx-0">
                Premium smart networking solutions for professionals who want to leave a lasting impression.
              </p>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Connect</h5>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">TikTok</a></li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Support</h5>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:row items-center justify-between pt-12 border-t border-white/5 gap-6">
            <p className="text-xs text-muted-foreground/60">© 2024 LinkMe. All rights reserved.</p>
            <div className="flex gap-8 text-xs text-muted-foreground/60">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
