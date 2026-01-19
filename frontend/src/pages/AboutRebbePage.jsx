import { motion } from 'framer-motion';
import { BookOpen, Heart, Users, Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutRebbePage() {
  const teachings = [
    {
      icon: Heart,
      title: 'Ahavas Yisroel',
      description: 'The Mevaser Tov emphasized unconditional love for every Jew, teaching that each person is a precious gem in Hashem\'s crown.'
    },
    {
      icon: BookOpen,
      title: 'Torah Study',
      description: 'Deep commitment to learning Torah with joy and enthusiasm, making the complex teachings accessible to all.'
    },
    {
      icon: Star,
      title: 'Avodas Hashem',
      description: 'Service of G-d through prayer, song, and connecting to the Divine in every moment of daily life.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building strong, supportive communities where every member feels valued and connected.'
    }
  ];

  const timeline = [
    { year: '1927', event: 'Born in Poland to the previous Biala Rebbe' },
    { year: '1939', event: 'Escaped the Holocaust and arrived in Eretz Yisroel' },
    { year: '1955', event: 'Began leading as Biala Rebbe in Bnei Brak' },
    { year: '1962', event: 'Published first volume of Mevaser Tov' },
    { year: '1980', event: 'Established yeshiva and community in Jerusalem' },
    { year: '2000', event: 'Continued inspiring thousands until his passing' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium mb-6">
                <Star size={16} />
                The Mevaser Tov
              </div>
              
              <h1 className="font-display text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                The Holy Rebbe
                <span className="block text-amber-400 font-hebrew text-3xl mt-2">רבינו המבשר טוב זיע״א</span>
              </h1>
              
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                The Mevaser Tov, Rabbi Yerachmiel Tzvi Rabinowitz זצ״ל, was one of the 
                towering spiritual leaders of the 20th century. His teachings continue to 
                inspire thousands of Jews worldwide.
              </p>

              <Link to="/books" className="btn-gold">
                <BookOpen size={18} />
                Explore His Teachings
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-amber-500/20 rounded-3xl blur-2xl"></div>
                <div className="relative aspect-[3/4] rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-32 h-32 mx-auto rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
                        <span className="font-hebrew text-5xl text-amber-400">מט</span>
                      </div>
                      <p className="font-hebrew text-xl text-amber-400 mb-2">המבשר טוב</p>
                      <p className="text-gray-400 text-sm">זכותו יגן עלינו</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Quote size={48} className="mx-auto text-amber-400 mb-6" />
          <blockquote className="font-display text-2xl md:text-3xl text-gray-900 leading-relaxed mb-4">
            "Every Jew is a precious diamond. Our task is to help them reveal their inner light."
          </blockquote>
          <cite className="text-gray-500">— The Mevaser Tov</cite>
        </div>
      </section>

      {/* Teachings */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
              Core Teachings
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              The Mevaser Tov's teachings centered on love, joy, and deep connection to Hashem
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teachings.map((teaching, index) => (
              <motion.div
                key={teaching.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
                  <teaching.icon size={28} className="text-amber-600" />
                </div>
                <h3 className="font-semibold text-xl text-gray-900 mb-2">{teaching.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{teaching.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
              Life & Legacy
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-amber-200"></div>
            
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'} pl-16 md:pl-0`}>
                  <div className="card p-6">
                    <span className="text-amber-600 font-bold text-lg">{item.year}</span>
                    <p className="text-gray-600 mt-1">{item.event}</p>
                  </div>
                </div>
                <div className="absolute left-8 md:left-1/2 w-4 h-4 -translate-x-1/2 rounded-full bg-amber-500 border-4 border-white shadow"></div>
                <div className="flex-1 hidden md:block"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
            Discover His Writings
          </h2>
          <p className="text-gray-800 mb-8 max-w-2xl mx-auto">
            Explore the published works of the Mevaser Tov and bring his teachings into your life
          </p>
          <Link to="/books" className="btn-primary bg-gray-900 hover:bg-gray-800">
            Browse All Books
          </Link>
        </div>
      </section>
    </div>
  );
}
