import React from 'react';
import ShareModal from './ShareModal';

export default function BadgeModal({ isOpen, onClose, username, profileUrl, user, score, platforms }) {
  return (
    <ShareModal
      isOpen={isOpen}
      onClose={onClose}
      user={user}
      username={username}
      score={score}
      platforms={platforms}
      profileUrl={profileUrl}
      initialTab="badge"
    />
  );
}
