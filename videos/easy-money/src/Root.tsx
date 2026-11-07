import {Composition} from 'remotion';
import {EasyMoney} from './EasyMoney';

export const RemotionRoot = () => {
  return (
    <Composition id="EasyMoney" component={EasyMoney} durationInFrames={1020} fps={30} width={1080} height={1920} />
  );
};
