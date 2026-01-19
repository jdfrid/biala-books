import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Headphones, Video, Filter, Search, Clock, Calendar } from 'lucide-react';

export default function MediaPage() {
  const [activeTab, setActiveTab] = useState('videos');
  const [searchTerm, setSearchTerm] = useState('');

  const videos = [
    { id: 1, title: 'Friday Night Tish - Parshas Bereishis', duration: '45:30', date: '2026-01-10', category: 'Tish' },
    { id: 2, title: 'Shabbos Morning Davening', duration: '1:20:00', date: '2026-01-11', category: 'Prayer' },
    { id: 3, title: 'Torah Shiur - Emunah', duration: '32:15', date: '2026-01-08', category: 'Shiur' },
    { id: 4, title: 'Chanukah Celebration 5786', duration: '55:00', date: '2025-12-25', category: 'Events' },
    { id: 5, title: 'Yahrtzeit of the Mevaser Tov', duration: '1:10:00', date: '2025-12-15', category: 'Events' },
    { id: 6, title: 'Weekly Parsha Insights', duration: '28:45', date: '2026-01-05', category: 'Shiur' },
  ];

  const audio = [
    { id: 1, title: 'Niggun - Mevaser Tov', duration: '8:30', category: 'Niggunim' },
    { id: 2, title: 'Shabbos Zemiros', duration: '25:00', category: 'Niggunim' },
    { id: 3, title: 'Torah Reading - Weekly Parsha', duration: '15:20', category: 'Torah' },
    { id: 4, title: 'Chassidic Melodies Collection', duration: '45:00', category: 'Niggunim' },
    { id: 5, title: 'Havdalah Ceremony', duration: '12:00', category: 'Prayer' },
    { id: 6, title: 'Stories from the Mevaser Tov', duration: '35:00', category: 'Stories' },
  ];

  const categories = ['All', 'Tish', 'Shiur', 'Prayer', 'Events', 'Niggunim'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 flex items-center justify-center mb-6">
              <Play className="text-amber-400" size={32} />
            </div>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Media Gallery
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Experience the beauty of Biala through videos, recordings, and niggunim
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs & Search */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('videos')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                  activeTab === 'videos'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Video size={18} />
                Videos
              </button>
              <button
                onClick={() => setActiveTab('audio')}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                  activeTab === 'audio'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Headphones size={18} />
                Audio
              </button>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search media..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-11 py-2.5"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === 'videos' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card group cursor-pointer"
                >
                  <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-hebrew text-4xl text-amber-400/30">
                        {video.category === 'Tish' ? 'טיש' : video.category === 'Shiur' ? 'שיעור' : 'וידאו'}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        <Play size={24} className="text-gray-900 ml-1" fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 text-white text-xs flex items-center gap-1">
                      <Clock size={12} />
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-amber-600 font-medium uppercase tracking-wide">
                      {video.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-1 group-hover:text-amber-600 transition-colors">
                      {video.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 text-gray-400 text-sm">
                      <Calendar size={14} />
                      {new Date(video.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {audio.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="card p-4 flex items-center gap-4 group cursor-pointer hover:shadow-lg"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Play size={24} className="text-gray-900 ml-0.5" fill="currentColor" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-amber-600 font-medium uppercase tracking-wide">
                      {track.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 truncate group-hover:text-amber-600 transition-colors">
                      {track.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm shrink-0">
                    <Clock size={14} />
                    {track.duration}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
              Featured Content
            </h2>
            <p className="text-gray-500">Our most popular recordings</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-hebrew text-6xl text-amber-400/20">טיש</span>
              </div>
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <Play size={36} className="text-gray-900 ml-1" fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="font-semibold text-xl text-white">Complete Shabbos Tish</h3>
                <p className="text-gray-300 text-sm mt-1">Experience a full Friday night tish with niggunim and divrei Torah</p>
              </div>
            </div>

            <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-center">
                <Headphones size={80} className="text-white/20" />
              </div>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center transform group-hover:scale-110 transition-transform">
                  <Play size={36} className="text-gray-900 ml-1" fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                <h3 className="font-semibold text-xl text-white">Classic Biala Niggunim</h3>
                <p className="text-gray-200 text-sm mt-1">A collection of traditional melodies passed down through generations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
            Never Miss New Content
          </h2>
          <p className="text-gray-500 mb-8">
            Subscribe to our channel and get notified when new videos and recordings are uploaded
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="btn-gold">
              <Video size={18} />
              Subscribe on YouTube
            </button>
            <button className="btn-secondary">
              <Headphones size={18} />
              Follow on Spotify
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
