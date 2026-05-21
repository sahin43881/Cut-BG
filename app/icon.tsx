import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/**
 * Browser tab favicon. Renders the CutBG mark as a PNG at build time so the
 * favicon and the in-app logo stay visually identical.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 14,
          background:
            'linear-gradient(135deg, #58bbff 0%, #319dff 55%, #1665e0 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Diagonal "transparency" wedge — solid white as a stand-in for the
            checkerboard, since the @vercel/og runtime doesn't support SVG patterns. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background:
              'linear-gradient(135deg, transparent 50%, #f4f4f5 50%)',
          }}
        />
        {/* AI spark */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            width: 14,
            height: 14,
            background: 'white',
            display: 'flex',
            clipPath:
              'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
