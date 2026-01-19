import { motion } from 'framer-motion';
import { BookOpen, Heart, Star, Users, Calendar } from 'lucide-react';

export default function AboutRebbePage() {
  const timeline = [
    { year: '1928', event: 'Born in Poland to the previous Biala Rebbe' },
    { year: '1939', event: 'Escaped the Holocaust and arrived in the Holy Land' },
    { year: '1958', event: 'Began leading the Biala community in Jerusalem' },
    { year: '1970', event: 'Established the main Biala Beis Medrash' },
    { year: '1982', event: 'Published first volume of Mevaser Tov' },
    { year: '2005', event: 'Celebrated 50 years of leadership' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 text-cream-100 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold">
                The <span className="text-gold-400">Mevaser Tov</span>
              </h1>
              <p className="font-hebrew text-2xl text-gold-300">
                כ״ק אדמו״ר רבינו המבשר טוב זיע״א
              </p>
              <p className="text-xl text-cream-300 leading-relaxed">
                A Torah luminary whose teachings continue to inspire generations of Jews 
                with messages of hope, devotion, and spiritual growth.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-gold-400/30 to-gold-600/30 rounded-3xl transform rotate-2"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-gold-500/50">
                <img
                  src="/images/rebbe-mevaser-tov.jpg"
                  alt="The Mevaser Tov"
                  className="w-full h-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/500x600/1A2035/C9A008?text=The+Mevaser+Tov';
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Biography Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg max-w-none"
          >
            <h2 className="font-display text-3xl font-bold text-navy-900 mb-6">
              A Life of Torah and Devotion
            </h2>
            
            <p className="text-navy-700 text-lg leading-relaxed mb-6">
              The Mevaser Tov, Rebbe Yerachmiel Tzvi of Biala zy"a, was one of the great 
              Chassidic masters of our generation. Born into the illustrious Biala dynasty, 
              he was raised in an atmosphere of Torah scholarship, fervent prayer, and 
              devotion to the Jewish people.
            </p>

            <p className="text-navy-700 text-lg leading-relaxed mb-6">
              From his earliest years, it was evident that the young Yerachmiel Tzvi was 
              destined for greatness. His extraordinary memory, sharp intellect, and pure 
              heart marked him as a true heir to the Biala tradition. He studied under the 
              greatest scholars of the generation and absorbed the holy ways of Chassidus 
              from his father, the previous Rebbe.
            </p>

            <p className="text-navy-700 text-lg leading-relaxed mb-6">
              After miraculously surviving the horrors of the Holocaust, the Rebbe arrived 
              in the Holy Land where he would rebuild the Biala community from its ashes. 
              Despite the tremendous losses, he never despaired, constantly encouraging 
              his followers with messages of hope and faith.
            </p>

            <p className="text-navy-700 text-lg leading-relaxed">
              The Rebbe's title "Mevaser Tov" (Bearer of Good Tidings) reflects his 
              constant message of optimism and his ability to find the good in every 
              situation and every person. His teachings emphasize the infinite value of 
              every Jew and the power of sincere prayer.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Teachings */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-navy-900 mb-4">
              Core <span className="text-gradient">Teachings</span>
            </h2>
            <p className="text-xl text-navy-600 max-w-2xl mx-auto">
              The fundamental principles that guide the Biala path
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Heart,
                title: 'Ahavas Yisroel',
                description: 'Unconditional love for every Jew, regardless of their level of observance or background.'
              },
              {
                icon: BookOpen,
                title: 'Torah Study',
                description: 'Deep engagement with Torah learning as the path to connecting with the Divine.'
              },
              {
                icon: Star,
                title: 'Simcha & Emunah',
                description: 'Serving Hashem with joy and maintaining faith even in difficult times.'
              },
              {
                icon: Users,
                title: 'Community',
                description: 'Building strong communities bound together by shared values and mutual support.'
              }
            ].map((teaching, index) => (
              <motion.div
                key={teaching.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-8 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                  <teaching.icon size={28} className="text-navy-950" />
                </div>
                <h3 className="font-display text-xl font-bold text-navy-900 mb-3">
                  {teaching.title}
                </h3>
                <p className="text-navy-600">{teaching.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-navy-900 mb-4">
              Life <span className="text-gradient">Timeline</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gold-300"></div>

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className={`relative flex items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Year circle */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center z-10">
                    <span className="font-display font-bold text-navy-950">{item.year}</span>
                  </div>

                  {/* Content */}
                  <div className={`ml-24 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-20 md:text-right' : 'md:pl-20'}`}>
                    <div className="card p-6">
                      <p className="text-navy-700">{item.event}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Literary Legacy */}
      <section className="py-20 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 text-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              Literary <span className="text-gold-400">Legacy</span>
            </h2>
            <p className="text-xl text-cream-300 max-w-2xl mx-auto">
              The Rebbe's teachings have been preserved in numerous volumes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="font-display text-5xl font-bold text-gold-400 mb-2">25+</div>
              <p className="text-cream-300">Published Volumes</p>
            </div>
            <div className="text-center">
              <div className="font-display text-5xl font-bold text-gold-400 mb-2">5</div>
              <p className="text-cream-300">Torah Commentaries</p>
            </div>
            <div className="text-center">
              <div className="font-display text-5xl font-bold text-gold-400 mb-2">1000s</div>
              <p className="text-cream-300">Hours of Recordings</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <a href="/books" className="btn-primary">
              Explore His Writings
            </a>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="ornate-border p-12 text-center"
          >
            <p className="font-hebrew text-2xl text-gold-700 mb-4">
              "כל יהודי הוא אבן יקרה בכתר של הקב״ה"
            </p>
            <p className="text-xl text-navy-700 italic mb-4">
              "Every Jew is a precious gem in the crown of the Holy One, Blessed be He"
            </p>
            <p className="text-navy-500">— The Mevaser Tov</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

