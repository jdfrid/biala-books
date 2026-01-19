import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, Download, Filter, X, Music, Video, Mic } from 'lucide-react';
import api from '../services/api';

export default function MediaPage() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');
  const [playingId, setPlayingId] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    api.get('/media')
      .then(res => setMedia(res.data.media || []))
      .catch(() => setMedia(placeholderMedia))
      .finally(() => setLoading(false));
  }, []);

  const placeholderMedia = [
    {
      id: 1,
      title: 'Friday Night Tish - Parshas Bereishis',
      type: 'video',
      duration: '1:23:45',
      date: '2026-01-12',
      thumbnail: '/images/media/tish-1.jpg',
      description: 'Experience the spiritual atmosphere of the Rebbe\'s tish.',
      url: '#'
    },
    {
      id: 2,
      title: 'Torah Shiur - The Power of Emunah',
      type: 'video',
      duration: '45:30',
      date: '2026-01-10',
      thumbnail: '/images/media/shiur-1.jpg',
      description: 'A profound teaching on the importance of faith in daily life.',
      url: '#'
    },
    {
      id: 3,
      title: 'Havdalah Ceremony',
      type: 'video',
      duration: '12:15',
      date: '2026-01-05',
      thumbnail: '/images/media/havdalah.jpg',
      description: 'The beautiful Biala tradition of ushering out the Shabbos Queen.',
      url: '#'
    },
    {
      id: 4,
      title: 'Nigun - Keili Ata',
      type: 'audio',
      duration: '8:20',
      date: '2026-01-08',
      thumbnail: '/images/media/nigun-1.jpg',
      description: 'A classic Biala melody sung at the tish.',
      url: '#'
    },
    {
      id: 5,
      title: 'Nigun - Yismach Moshe',
      type: 'audio',
      duration: '6:45',
      date: '2026-01-03',
      thumbnail: '/images/media/nigun-2.jpg',
      description: 'Traditional Shabbos morning melody.',
      url: '#'
    },
    {
      id: 6,
      title: 'Recorded Shiur - Parshas Shemos',
      type: 'audio',
      duration: '52:10',
      date: '2025-12-28',
      thumbnail: '/images/media/shiur-audio.jpg',
      description: 'Audio recording of the Rebbe\'s weekly Torah lecture.',
      url: '#'
    },
    {
      id: 7,
      title: 'Chanukah Lighting 5786',
      type: 'video',
      duration: '25:30',
      date: '2025-12-20',
      thumbnail: '/images/media/chanukah.jpg',
      description: 'The Rebbe lighting the Chanukah menorah.',
      url: '#'
    },
    {
      id: 8,
      title: 'Stories of the Tzaddikim',
      type: 'audio',
      duration: '35:00',
      date: '2025-12-15',
      thumbnail: '/images/media/stories.jpg',
      description: 'Inspiring stories from previous Biala Rebbes.',
      url: '#'
    },
  ];

  const displayMedia = media.length > 0 ? media : placeholderMedia;
  const types = ['all', 'video', 'audio'];
  
  const filteredMedia = selectedType === 'all' 
    ? displayMedia 
    : displayMedia.filter(m => m.type === selectedType);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Music;
      default: return Mic;
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-navy-900 mb-4">
            Media <span className="text-gradient">Gallery</span>
          </h1>
          <p className="text-xl text-navy-600 max-w-2xl mx-auto">
            Videos, recordings, and music from the Biala community
          </p>
        </motion.div>

        {/* Type Filters */}
        <div className="flex justify-center gap-4 mb-12">
          {types.map((type) => {
            const Icon = type === 'all' ? Filter : getTypeIcon(type);
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-display text-sm uppercase tracking-wider transition-all ${
                  selectedType === type
                    ? 'bg-gold-500 text-navy-950'
                    : 'bg-cream-200 text-navy-700 hover:bg-cream-300'
                }`}
              >
                <Icon size={18} />
                {type === 'all' ? 'All Media' : type}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-video bg-cream-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-cream-200 rounded w-3/4"></div>
                  <div className="h-4 bg-cream-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMedia.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card group cursor-pointer"
                onClick={() => item.type === 'video' && setSelectedVideo(item)}
              >
                <div className="relative aspect-video overflow-hidden bg-navy-900">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/640x360/1A2035/C9A008?text=${item.type === 'video' ? 'Video' : 'Audio'}`;
                    }}
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-navy-950/40 group-hover:bg-navy-950/60 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                      <Play size={28} className="text-navy-950 ml-1" fill="currentColor" />
                    </div>
                  </div>

                  {/* Type badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`badge ${item.type === 'video' ? 'badge-info' : 'badge-success'} flex items-center gap-1`}>
                      {item.type === 'video' ? <Video size={12} /> : <Music size={12} />}
                      {item.type}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-navy-950/80 text-cream-100 text-sm">
                    {item.duration}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-display text-lg font-bold text-navy-900 mb-2 group-hover:text-gold-700 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-navy-600 text-sm line-clamp-2 mb-3">{item.description}</p>
                  <p className="text-navy-400 text-xs">
                    {new Date(item.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Audio Player Section */}
        {filteredMedia.some(m => m.type === 'audio') && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold text-navy-900 mb-8">
              Featured <span className="text-gradient">Recordings</span>
            </h2>
            <div className="space-y-4">
              {filteredMedia.filter(m => m.type === 'audio').slice(0, 5).map((item) => (
                <div 
                  key={item.id}
                  className="card p-4 flex items-center gap-4"
                >
                  <button 
                    onClick={() => setPlayingId(playingId === item.id ? null : item.id)}
                    className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center shrink-0 hover:bg-gold-400 transition-colors"
                  >
                    {playingId === item.id ? (
                      <Pause size={20} className="text-navy-950" fill="currentColor" />
                    ) : (
                      <Play size={20} className="text-navy-950 ml-0.5" fill="currentColor" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-navy-900 truncate">{item.title}</h4>
                    <p className="text-navy-500 text-sm">{item.duration}</p>
                  </div>
                  <button className="p-2 rounded-lg hover:bg-cream-200 transition-colors">
                    <Download size={18} className="text-navy-600" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90"
          onClick={() => setSelectedVideo(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-xl font-bold text-cream-100">
                {selectedVideo.title}
              </h3>
              <button 
                onClick={() => setSelectedVideo(null)}
                className="p-2 rounded-lg hover:bg-cream-100/10 transition-colors"
              >
                <X size={24} className="text-cream-100" />
              </button>
            </div>
            <div className="aspect-video bg-navy-900 rounded-lg overflow-hidden">
              {/* In a real app, this would be an actual video player */}
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src={selectedVideo.thumbnail}
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/1280x720/1A2035/C9A008?text=Video+Player';
                  }}
                />
              </div>
            </div>
            <p className="mt-4 text-cream-300">{selectedVideo.description}</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}

