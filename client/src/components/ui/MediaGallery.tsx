import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  caption?: string;
  thumbnail?: string;
}

interface MediaGalleryProps {
  items: MediaItem[];
  isOpen: boolean;
  onClose: () => void;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ items, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!isOpen || items.length === 0) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % items.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center bg-bg-primary/95 backdrop-blur-md p-4 md:p-10"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full glass hover:text-accent-tertiary transition-colors z-[210]"
        >
          <X size={24} />
        </button>

        <div className="relative w-full max-w-5xl aspect-video flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex items-center justify-center"
            >
              {items[currentIndex].type === 'image' ? (
                <img 
                  src={items[currentIndex].url} 
                  alt={items[currentIndex].caption || ''} 
                  className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                />
              ) : (
                <video 
                  src={items[currentIndex].url} 
                  controls 
                  autoPlay 
                  className="max-w-full max-h-full rounded-xl shadow-2xl"
                />
              )}
            </motion.div>
          </AnimatePresence>

          {items[currentIndex].caption && (
            <div className="mt-6 text-center">
              <p className="text-text-primary text-lg font-medium">{items[currentIndex].caption}</p>
            </div>
          )}

          {items.length > 1 && (
            <>
              <button 
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-3 rounded-full glass hover:text-accent-violet transition-colors"
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-3 rounded-full glass hover:text-accent-violet transition-colors"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'w-8 bg-accent-violet' : 'bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MediaGallery;
