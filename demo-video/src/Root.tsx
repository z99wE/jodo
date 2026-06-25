import { Composition } from 'remotion';
import { JodoDemo } from './JodoDemo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="JodoDemo"
        component={JodoDemo}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
