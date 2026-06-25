import { AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import React from 'react';

// Common Styles
const textStyle: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontWeight: 'bold',
  color: 'white',
  textAlign: 'center',
};

const bgStyle: React.CSSProperties = {
  backgroundColor: '#09090b', // zinc-950
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
};

const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 120, 150], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  const scale = spring({ frame, fps: 30, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ ...bgStyle, opacity }}>
      <h1 style={{ ...textStyle, fontSize: 80, marginBottom: 50, transform: `scale(${scale})` }}>
        The Indian Web is Complex.
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 100px)', gap: 10 }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} style={{ 
            width: 100, 
            height: 100, 
            backgroundColor: '#27272a',
            opacity: interpolate(frame - i * 3, [0, 10], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
          }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 120, 150], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  const logoScale = spring({ frame: frame - 10, fps: 30, config: { damping: 10 } });

  return (
    <AbsoluteFill style={{ ...bgStyle, opacity }}>
      <div style={{
        width: 150, height: 150, borderRadius: 20, 
        backgroundColor: '#a855f7', 
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        transform: `scale(${logoScale})`,
        boxShadow: '0 0 100px rgba(168, 85, 247, 0.5)',
        marginBottom: 60
      }}>
        <span style={{ fontSize: 90, fontWeight: 'bold', color: 'white' }}>J</span>
      </div>
      <h1 style={{ ...textStyle, fontSize: 70, opacity: interpolate(frame - 30, [0, 15], [0, 1], { extrapolateLeft: 'clamp' }) }}>
        Meet Jodo.<br/><span style={{ color: '#a855f7' }}>The Everyday AI Innovator.</span>
      </h1>
    </AbsoluteFill>
  );
};

const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 210, 240], [0, 1, 1, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ ...bgStyle, opacity, flexDirection: 'row', gap: 100 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: interpolate(frame - 10, [0, 15], [0, 1], {extrapolateLeft: 'clamp'}) }}>
        <h2 style={{ ...textStyle, fontSize: 50, color: '#ef4444', marginBottom: 40 }}>Screen Recorder</h2>
        <div style={{ width: 300, height: 400, border: '4px solid #3f3f46', borderRadius: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#ef4444' }} />
        </div>
        <p style={{ ...textStyle, fontSize: 30, color: '#a1a1aa', marginTop: 30 }}>Dumb Pixel Capture</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: interpolate(frame - 40, [0, 15], [0, 1], {extrapolateLeft: 'clamp'}) }}>
        <h2 style={{ ...textStyle, fontSize: 50, color: '#a855f7', marginBottom: 40 }}>Jodo Agent</h2>
        <div style={{ width: 300, height: 400, border: '4px solid #a855f7', borderRadius: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', padding: 20, backgroundColor: 'rgba(168, 85, 247, 0.1)' }}>
          <div style={{ backgroundColor: '#27272a', padding: 15, borderRadius: 10, color: 'white', textAlign: 'center', fontWeight: 'bold' }}>1. Observation</div>
          <div style={{ backgroundColor: '#27272a', padding: 15, borderRadius: 10, color: 'white', textAlign: 'center', fontWeight: 'bold' }}>2. Reasoning</div>
          <div style={{ backgroundColor: '#a855f7', padding: 15, borderRadius: 10, color: 'white', textAlign: 'center', fontWeight: 'bold' }}>3. Action</div>
        </div>
        <p style={{ ...textStyle, fontSize: 30, color: '#a1a1aa', marginTop: 30 }}>Structural AI Co-Pilot</p>
      </div>
    </AbsoluteFill>
  );
};

const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15, 180, 210], [0, 1, 1, 0], { extrapolateRight: 'clamp' });
  const checkScale = spring({ frame: frame - 60, fps: 30, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ ...bgStyle, opacity }}>
      <h1 style={{ ...textStyle, fontSize: 70, marginBottom: 80 }}>
        No visual hunting required. Just intent.
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 30, marginBottom: 80 }}>
        <div style={{ width: 600, height: 80, backgroundColor: '#27272a', borderRadius: 40, display: 'flex', alignItems: 'center', paddingLeft: 30, color: 'white', fontSize: 30 }}>
          "Book Tatkal Ticket"
        </div>
        <div style={{ width: 150, height: 80, backgroundColor: '#a855f7', borderRadius: 40, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: 30, fontWeight: 'bold' }}>
          Send
        </div>
      </div>
      
      <div style={{ transform: `scale(${checkScale})`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: '#22c55e', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 60, color: 'white' }}>✓</span>
        </div>
        <h2 style={{ ...textStyle, fontSize: 40, color: '#22c55e' }}>Action Executed Successfully</h2>
      </div>
    </AbsoluteFill>
  );
};

const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ ...bgStyle, opacity }}>
      <div style={{
        width: 150, height: 150, borderRadius: 20, 
        backgroundColor: '#a855f7', 
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        boxShadow: '0 0 100px rgba(168, 85, 247, 0.5)',
        marginBottom: 60
      }}>
        <span style={{ fontSize: 90, fontWeight: 'bold', color: 'white' }}>J</span>
      </div>
      <h1 style={{ ...textStyle, fontSize: 80 }}>
        Jodo
      </h1>
      <h2 style={{ ...textStyle, fontSize: 50, color: '#a1a1aa', marginTop: 20 }}>
        Life, Made Better.
      </h2>
    </AbsoluteFill>
  );
};

export const JodoDemo: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#09090b' }}>
      <Sequence from={0} durationInFrames={150}>
        <Scene1 />
      </Sequence>
      <Sequence from={150} durationInFrames={150}>
        <Scene2 />
      </Sequence>
      <Sequence from={300} durationInFrames={240}>
        <Scene3 />
      </Sequence>
      <Sequence from={540} durationInFrames={210}>
        <Scene4 />
      </Sequence>
      <Sequence from={750} durationInFrames={150}>
        <Scene5 />
      </Sequence>
    </AbsoluteFill>
  );
};
