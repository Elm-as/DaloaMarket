import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MascotProps {
  type: 'happy' | 'excited' | 'thinking' | 'sleepy';
  size?: number;
  mouseTracking?: boolean;
  reaction?: 'bounce' | 'wave' | 'blink' | 'float' | 'thinking';
  /**
   * passwordState: 'hidden' when password is masked, 'visible' when user toggles show
   * or undefined for neutral. Used to trigger view-away or cover-eyes animations.
   */
  passwordState?: 'hidden' | 'visible';
}

const Mascot: React.FC<MascotProps> = ({
  type,
  size = 120,
  mouseTracking = true,
  reaction = 'float',
  passwordState
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mascotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mouseTracking) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (mascotRef.current) {
        const rect = mascotRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / 50;
        const deltaY = (e.clientY - centerY) / 50;
        setMousePosition({ x: deltaX, y: deltaY });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseTracking]);

  const getReactionClass = () => {
    switch (reaction) {
      case 'bounce': return 'animate-mascot-bounce';
      case 'wave': return 'animate-mascot-wave';
      case 'blink': return 'animate-mascot-blink';
      case 'float': return 'animate-mascot-float';
      case 'thinking': return 'animate-mascot-float';
      default: return '';
    }
  };

  const passwordCover = passwordState === 'visible';
  const passwordLookAway = passwordState === 'hidden' && passwordState !== undefined;

  const getMascotSVG = () => {
    const baseProps = {
      width: size,
      height: size,
      viewBox: "0 0 200 200",
      className: `transition-transform duration-300 ${getReactionClass()}`
    };

  switch (type) {
      case 'happy':
        return (
          <svg {...baseProps}>
            {/* Face */}
            <circle cx="100" cy="100" r="80" fill="#FFE4B5" stroke="#FF7F00" strokeWidth="3"/>
            {/* Eyes (react to password state) */}
            {passwordCover ? (
              // Hands covering eyes (simple rectangles)
              <>
                <rect x="60" y="70" width="30" height="18" rx="6" fill="#FFE4B5" transform="rotate(-12 60 70)" />
                <rect x="110" y="70" width="30" height="18" rx="6" fill="#FFE4B5" transform="rotate(12 110 70)" />
              </>
            ) : passwordLookAway ? (
              // Look away: eyes as small dots on sides
              <>
                <circle cx="70" cy="88" r="5" fill="#000" />
                <circle cx="130" cy="88" r="5" fill="#000" />
              </>
            ) : (
              <>
                <circle cx="80" cy="85" r="8" fill="#000"/>
                <circle cx="120" cy="85" r="8" fill="#000"/>
              </>
            )}
            {/* Smile */}
            <path d="M 70 120 Q 100 140 130 120" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round"/>
            {/* Cheeks */}
            <circle cx="65" cy="105" r="5" fill="#FF9999" opacity="0.6"/>
            <circle cx="135" cy="105" r="5" fill="#FF9999" opacity="0.6"/>
          </svg>
        );

      case 'excited':
        return (
          <svg {...baseProps}>
            {/* Face */}
            <circle cx="100" cy="100" r="80" fill="#FFE4B5" stroke="#FF7F00" strokeWidth="3"/>
            {/* Wide Eyes */}
            <ellipse cx="80" cy="85" rx="10" ry="8" fill="#000"/>
            <ellipse cx="120" cy="85" rx="10" ry="8" fill="#000"/>
            {/* Excited Mouth */}
            <path d="M 75 125 Q 100 150 125 125" stroke="#000" strokeWidth="4" fill="none" strokeLinecap="round"/>
            {/* Sweat drops */}
            <circle cx="60" cy="70" r="3" fill="#99CCFF"/>
            <circle cx="140" cy="70" r="3" fill="#99CCFF"/>
          </svg>
        );

      case 'thinking':
        return (
          <svg {...baseProps}>
            {/* Face */}
            <circle cx="100" cy="100" r="80" fill="#FFE4B5" stroke="#FF7F00" strokeWidth="3"/>
            {/* Eyes */}
            <circle cx="80" cy="85" r="6" fill="#000"/>
            <circle cx="120" cy="85" r="6" fill="#000"/>
            {/* Thinking bubble */}
            <path d="M 140 70 Q 160 50 180 70 Q 180 90 160 90 Q 140 90 140 70" fill="#FFF" stroke="#000" strokeWidth="2"/>
            <text x="160" y="82" fontSize="12" textAnchor="middle" fill="#000">?</text>
            {/* Hand on chin */}
            <ellipse cx="85" cy="130" rx="15" ry="8" fill="#FFE4B5"/>
          </svg>
        );

      case 'sleepy':
        return (
          <svg {...baseProps}>
            {/* Face */}
            <circle cx="100" cy="100" r="80" fill="#FFE4B5" stroke="#FF7F00" strokeWidth="3"/>
            {/* Sleepy Eyes */}
            <path d="M 75 85 Q 85 80 95 85" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <path d="M 105 85 Q 115 80 125 85" stroke="#000" strokeWidth="3" fill="none" strokeLinecap="round"/>
            {/* Zzz */}
            <text x="150" y="60" fontSize="16" fill="#666">Z</text>
            <text x="155" y="75" fontSize="14" fill="#666">z</text>
            <text x="160" y="88" fontSize="12" fill="#666">z</text>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      ref={mascotRef}
      className="flex items-center justify-center"
      animate={{
        x: mouseTracking ? mousePosition.x : 0,
        y: mouseTracking ? mousePosition.y : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {getMascotSVG()}
    </motion.div>
  );
};

export default Mascot;
