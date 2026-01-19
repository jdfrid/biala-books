import { motion } from 'framer-motion';
import { MapPin, Users, BookOpen, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutBialaPage() {
  const rebbes = [
    {
      name: 'Rebbe Yaakov Yitzchak',
      hebrewName: 'רבי יעקב יצחק',
      title: 'The First Biala Rebbe',
      years: '1847-1905',
      description: 'Founder of the Biala dynasty, known for his holiness and miraculous deeds.'
    },
    {
      name: 'Rebbe Nosson Dovid',
      hebrewName: 'רבי נתן דוד',
      title: 'The Second Biala Rebbe',
      years: '1866-1930',
      description: 'Expanded the dynasty and established communities across Poland.'
    },
    {
      name: 'Rebbe Yerachmiel Tzvi',
      hebrewName: 'רבי ירחמיאל צבי',
      title: 'The Mevaser Tov',
      years: '1927-2000',
      description: 'Rebuilt the dynasty after the Holocaust and authored the Mevaser Tov seforim.'
    },
    {
      name: 'The Current Rebbe',
      hebrewName: 'האדמו"ר שליט"א',
      title: 'The Current Biala Rebbe',
      years: 'Present',
      description: 'Continues the sacred tradition, leading vibrant communities worldwide.'
    },
  ];

  const communities = [
    { name: 'Jerusalem', country: 'Israel', members: '500+ families' },
    { name: 'Bnei Brak', country: 'Israel', members: '300+ families' },
    { name: 'Brooklyn', country: 'USA', members: '200+ families' },
    { name: 'London', country: 'UK', members: '100+ families' },
    { name: 'Antwerp', country: 'Belgium', members: '50+ families' },
  ];

  const institutions = [
    { name: 'Yeshiva Gedolah', type: 'Education', location: 'Jerusalem' },
    { name: 'Kollel Avreichim', type: 'Torah Study', location: 'Bnei Brak' },
    { name: 'Talmud Torah', type: 'Children\'s Education', location: 'Multiple locations' },
    { name: 'Chesed Organizations', type: 'Social Services', location: 'Worldwide' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-b from-gray-900 to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center mb-8">
              <span className="font-hebrew text-5xl text-amber-400">ב</span>
            </div>
            
            <h1 className="font-display text-4xl lg:text-5xl font-bold mb-6">
              The Biala Dynasty
              <span className="block font-hebrew text-3xl text-amber-400 mt-2">חסידות ביאלא</span>
            </h1>
            
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
              For over 150 years, the Biala dynasty has illuminated Jewish life with its unique 
              approach to Chassidus, emphasizing joy, love of fellow Jews, and deep devotion to Hashem.
            </p>
          </motion.div>
        </div>
      </section>

      {/* History */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl font-bold text-gray-900 mb-6">
                Our History
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  The Biala dynasty traces its origins to the town of Biala Podlaska in Poland, 
                  where Rebbe Yaakov Yitzchak Rabinowitz established a new path in Chassidus 
                  in the mid-19th century.
                </p>
                <p>
                  A descendant of the great Chassidic masters, the first Biala Rebbe drew from 
                  the wells of Pshischa and Kotzk while developing his own unique approach 
                  characterized by deep joy and love of every Jew.
                </p>
                <p>
                  Despite the devastation of the Holocaust, the dynasty was rebuilt in Eretz 
                  Yisroel by the Mevaser Tov, who inspired a new generation and established 
                  thriving communities that continue to flourish today.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-amber-100 rounded-3xl -rotate-3"></div>
              <div className="relative bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <Calendar className="text-amber-600" size={24} />
                  <h3 className="font-semibold text-xl text-gray-900">Key Milestones</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    { year: '1850s', event: 'Dynasty founded in Biala, Poland' },
                    { year: '1905', event: 'Leadership passed to second generation' },
                    { year: '1939', event: 'Community devastated by Holocaust' },
                    { year: '1950s', event: 'Rebuilt in Eretz Yisroel' },
                    { year: 'Today', event: 'Thriving communities worldwide' },
                  ].map((item) => (
                    <li key={item.year} className="flex gap-4">
                      <span className="text-amber-600 font-semibold w-20 shrink-0">{item.year}</span>
                      <span className="text-gray-600">{item.event}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rebbes */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
              The Biala Rebbes
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              A chain of holy leaders who have guided the Biala community through generations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rebbes.map((rebbe, index) => (
              <motion.div
                key={rebbe.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center mb-4">
                  <span className="font-hebrew text-xl text-amber-400">{rebbe.hebrewName.substring(0, 2)}</span>
                </div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">{rebbe.name}</h3>
                <p className="font-hebrew text-sm text-amber-600 mb-1">{rebbe.hebrewName}</p>
                <p className="text-xs text-gray-400 mb-3">{rebbe.years}</p>
                <p className="text-sm text-gray-500">{rebbe.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/about/rebbe" className="btn-secondary">
              Learn About the Mevaser Tov
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Communities */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-4">
              Our Communities
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Vibrant Biala communities flourish around the world
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
            {communities.map((community, index) => (
              <motion.div
                key={community.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="card p-6 text-center hover:shadow-lg"
              >
                <MapPin className="mx-auto text-amber-500 mb-3" size={24} />
                <h3 className="font-semibold text-gray-900">{community.name}</h3>
                <p className="text-sm text-gray-500">{community.country}</p>
                <p className="text-xs text-amber-600 mt-2">{community.members}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutions */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">
              Institutions & Organizations
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A network of educational and charitable institutions serving our communities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {institutions.map((inst, index) => (
              <motion.div
                key={inst.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
                  {inst.type === 'Education' && <BookOpen className="text-amber-400" size={24} />}
                  {inst.type === 'Torah Study' && <BookOpen className="text-amber-400" size={24} />}
                  {inst.type === 'Children\'s Education' && <Users className="text-amber-400" size={24} />}
                  {inst.type === 'Social Services' && <Users className="text-amber-400" size={24} />}
                </div>
                <h3 className="font-semibold text-white mb-1">{inst.name}</h3>
                <p className="text-sm text-gray-400">{inst.type}</p>
                <p className="text-xs text-amber-400 mt-2">{inst.location}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
            Support Our Institutions
          </h2>
          <p className="text-gray-800 mb-8 max-w-2xl mx-auto">
            Help us continue the sacred work of spreading Torah and supporting our communities
          </p>
          <Link to="/donate" className="btn-primary bg-gray-900 hover:bg-gray-800">
            Make a Donation
          </Link>
        </div>
      </section>
    </div>
  );
}
