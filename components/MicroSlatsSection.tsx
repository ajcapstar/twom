'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

const MicroSlats = dynamic(() => import('./MicroSlats'), { ssr: false });

interface MicroSlatsSectionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps any section with MicroSlats as the background layer.
 * Children float above the animation via z-index.
 */
export default function MicroSlatsSection({ children, className = '' }: MicroSlatsSectionProps) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`.trim()}>
      {/* MicroSlats background — fills all margins/padding around content */}
      <div className="absolute inset-0 z-0">
        <MicroSlats
          preset="signal"
          color="#000000"
          glintColor="#000000"
          backgroundColor="#ffce27"
          slatWidth={10}
          slatHeight={25}
          gap={3}
          roundness={0.75}
          interactive={false}
          swirl={0}
          trail={1.4}
          lean={0}
          intro={false}
          speed={1.2}
          scale={0.85}
          direction={180}
          chop={0.6}
          stretch={0.85}
          glint={0.25}
          contrast={1.2}
          perspective={0}
          fog={0}
        />
      </div>
      {/* Content sits on top */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

