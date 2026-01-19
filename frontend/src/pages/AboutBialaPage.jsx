import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Users, BookOpen, Building2, Calendar, ChevronRight } from 'lucide-react';

export default function AboutBialaPage() {
  const rebbes = [
    {
      name: 'The Divrei Binah',
      hebrewName: 'הרב יצחק יעקב רבינוביץ זצ״ל',
      period: '1847-1905',
      description: 'The founder of the Biala dynasty, known for his profound scholarship and Chassidic teachings.',
      image: '/images/rebbes/divrei-binah.jpg'
    },
    {
      name: 'The Chelkas Yehoshua',
      hebrewName: 'הרב יהושע רבינוביץ זצ״ל',
      period: '1860-1930',
      description: 'Led the Biala community during challenging times in pre-war Poland.',
      image: '/images/rebbes/chelkas-yehoshua.jpg'
    },
    {
      name: 'The Mevaser Tov',
      hebrewName: 'הרב ירחמיאל צבי רבינוביץ זיע״א',
      period: '1928-2018',
      description: 'Rebuilt the dynasty after the Holocaust and inspired generations with his teachings.',
      image: '/images/rebbe-mevaser-tov.jpg'
    },
    {
      name: 'The Current Rebbe',
      hebrewName: 'כ״ק אדמו״ר שליט״א',
      period: '2018-Present',
      description: 'Continues to lead the growing Biala community worldwide.',
      image: '/images/rebbe-current.jpg'
    }
  ];

  const communities = [
    { location: 'Jerusalem', country: 'Israel', members: '500+', institutions: 'Beis Medrash, Yeshiva, Kollel' },
    { location: 'Bnei Brak', country: 'Israel', members: '300+', institutions: 'Beis Medrash, Schools' },
    { location: 'Brooklyn', country: 'USA', members: '400+', institutions: 'Beis Medrash, Yeshiva' },
    { location: 'London', country: 'UK', members: '150+', institutions: 'Beis Medrash, Community' },
    { location: 'Antwerp', country: 'Belgium', members: '100+', institutions: 'Beis Medrash' },
    { location: 'Montreal', country: 'Canada', members: '80+', institutions: 'Beis Medrash' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 text-cream-100 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 border border-gold-400 rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 border border-gold-400 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              Biala <span className="text-gold-400">Hasidism</span>
            </h1>
            <p className="font-hebrew text-2xl text-gold-300 mb-6">
              חסידות ביאלא
            </p>
            <p className="text-xl text-cream-300 leading-relaxed">
              A living tradition spanning over 150 years, bringing the light of Chassidus 
              to Jews across the globe
            </p>
          </motion.div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl font-bold text-navy-900 mb-8 text-center">
              Our <span className="text-gradient">History</span>
            </h2>

            <div className="prose prose-lg max-w-none">
              <p className="text-navy-700 text-lg leading-relaxed mb-6">
                The Biala dynasty traces its origins to the town of Biała Rawska in central Poland, 
                where the first Biala Rebbe established his court in the 19th century. The dynasty 
                emerged from the great Chassidic movement founded by the Baal Shem Tov, carrying 
                forward his teachings of joy, prayer, and love for every Jew.
              </p>

              <p className="text-navy-700 text-lg leading-relaxed mb-6">
                The founders of Biala were disciples of the great masters of Polish Chassidus, 
                including the renowned Vorka dynasty. They developed a unique approach that 
                emphasized heartfelt prayer, genuine love for fellow Jews, and finding the Divine 
                spark in every aspect of life.
              </p>

              <p className="text-navy-700 text-lg leading-relaxed mb-6">
                Like many Chassidic dynasties, Biala suffered tremendous losses during the 
                Holocaust. The majority of its followers perished, and its sacred institutions 
                were destroyed. However, through the miraculous survival of key leaders and their 
                unwavering faith, the dynasty was rebuilt in the Land of Israel and around the world.
              </p>

              <p className="text-navy-700 text-lg leading-relaxed">
                Today, Biala continues to thrive with vibrant communities on multiple continents, 
                yeshivos and schools educating the next generation, and a publishing house 
                dedicated to spreading the Rebbe's teachings to all who seek spiritual inspiration.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Rebbes Section */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-navy-900 mb-4">
              The <span className="text-gradient">Rebbes</span> of Biala
            </h2>
            <p className="text-xl text-navy-600 max-w-2xl mx-auto">
              Generations of Torah leadership
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {rebbes.map((rebbe, index) => (
              <motion.div
                key={rebbe.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-40 h-48 sm:h-auto shrink-0 bg-navy-900">
                    <img
                      src={rebbe.image}
                      alt={rebbe.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/200x250/1A2035/C9A008?text=Rebbe';
                      }}
                    />
                  </div>
                  <div className="p-6 flex-1">
                    <h3 className="font-display text-xl font-bold text-navy-900 mb-1">
                      {rebbe.name}
                    </h3>
                    <p className="font-hebrew text-gold-700 text-sm mb-1">{rebbe.hebrewName}</p>
                    <p className="text-navy-500 text-sm mb-3 flex items-center gap-1">
                      <Calendar size={14} />
                      {rebbe.period}
                    </p>
                    <p className="text-navy-600 text-sm">{rebbe.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/about/rebbe" className="btn-secondary inline-flex items-center gap-2">
              Learn More About the Mevaser Tov
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold text-navy-900 mb-4">
              Global <span className="text-gradient">Communities</span>
            </h2>
            <p className="text-xl text-navy-600 max-w-2xl mx-auto">
              Biala communities flourish around the world
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community, index) => (
              <motion.div
                key={community.location}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold-100 flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-gold-600" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-navy-900">
                      {community.location}
                    </h3>
                    <p className="text-gold-600 text-sm mb-2">{community.country}</p>
                    <div className="flex items-center gap-2 text-navy-600 text-sm mb-1">
                      <Users size={14} />
                      {community.members} families
                    </div>
                    <div className="flex items-center gap-2 text-navy-600 text-sm">
                      <Building2 size={14} />
                      {community.institutions}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutions Section */}
      <section className="py-20 bg-gradient-to-br from-navy-900 via-navy-950 to-navy-900 text-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl font-bold mb-4">
              Our <span className="text-gold-400">Institutions</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Building2,
                title: 'Batei Medrash',
                description: 'Houses of study and prayer serving as the spiritual centers of each community.'
              },
              {
                icon: BookOpen,
                title: 'Yeshivos & Schools',
                description: 'Educational institutions nurturing the next generation in Torah and Chassidus.'
              },
              {
                icon: Users,
                title: 'Kollelim',
                description: 'Advanced study programs for married scholars dedicated to Torah learning.'
              }
            ].map((institution, index) => (
              <motion.div
                key={institution.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold-500/20 border-2 border-gold-500/50 flex items-center justify-center">
                  <institution.icon size={32} className="text-gold-400" />
                </div>
                <h3 className="font-display text-2xl font-bold text-gold-400 mb-3">
                  {institution.title}
                </h3>
                <p className="text-cream-300">{institution.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="ornate-border p-12 text-center"
          >
            <h2 className="font-display text-3xl font-bold text-navy-900 mb-4">
              Join Our Community
            </h2>
            <p className="text-lg text-navy-600 mb-8 max-w-xl mx-auto">
              Whether through learning the Rebbe's teachings, visiting our communities, 
              or supporting our institutions, we welcome you to be part of the Biala family.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/books" className="btn-primary">
                Explore Our Books
              </Link>
              <Link to="/contact" className="btn-secondary">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

