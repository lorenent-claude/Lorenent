import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

const weights = [
  ['Regular', '400'],
  ['SemiBold', '600'],
  ['Bold', '700'],
  ['ExtraBold', '800'],
] as const;

export const fontsLoaded = Promise.all(
  weights.map(([file, weight]) =>
    loadFont({family: 'Inter', url: staticFile(`fonts/Inter-${file}.otf`), weight}),
  ),
);

export const FONT = 'Inter, sans-serif';
export const C = {
  bg: '#0f1720',
  card: '#1b2633',
  text: '#f4f7fb',
  muted: '#9fb0c3',
  green: '#3ddc84',
  yellow: '#ffd166',
  red: '#ff5a5f',
};
