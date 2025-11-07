import React, { useState } from 'react';
import { X, Play } from 'lucide-react';
import { Modal } from './Modal';

interface VideoPlayerProps {
  videoUrl: string | null;
  title?: string;
}

// Extract YouTube video ID from various URL formats
const extractYouTubeId = (url: string): string | null => {
  if (!url) return null;

  // Handle youtu.be short links
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return shortMatch[1];

  // Handle youtube.com watch links
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return watchMatch[1];

  // Handle youtube.com embed links
  const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]+)/);
  if (embedMatch) return embedMatch[1];

  return null;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title = 'Exercise Video' }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!videoUrl) return null;

  const videoId = extractYouTubeId(videoUrl);
  if (!videoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

  return (
    <>
      {/* Video Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-pill bg-white/20 hover:bg-white/30 text-white transition-all duration-200 hover:scale-105"
      >
        <Play className="w-4 h-4" />
        <span className="text-sm font-medium">Watch Video</span>
      </button>

      {/* Video Modal */}
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title={title}
          size="lg"
        >
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src={embedUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Instructions */}
          <div className="mt-4 glass-card p-4 rounded-lg">
            <p className="text-white/80 text-sm">
              Watch the video to learn proper form and technique for this exercise.
            </p>
          </div>
        </Modal>
      )}
    </>
  );
};

// Inline Video Player (for embedding directly in a component)
interface InlineVideoPlayerProps {
  videoUrl: string;
  title?: string;
}

export const InlineVideoPlayer: React.FC<InlineVideoPlayerProps> = ({ videoUrl, title = 'Exercise Video' }) => {
  const videoId = extractYouTubeId(videoUrl);

  if (!videoId) return null;

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;

  return (
    <div className="relative w-full rounded-lg overflow-hidden glass-card" style={{ paddingBottom: '56.25%' }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={embedUrl}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default VideoPlayer;
