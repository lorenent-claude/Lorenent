import {AbsoluteFill, Interactive, interpolate, useCurrentFrame} from 'remotion';
import {useEnter, useExit} from '../anim';
import {C, FONT} from '../theme';

const ListingInner = ({
  item,
  price,
  message,
}: {
  readonly item: string;
  readonly price: string;
  readonly message: string;
}) => {
  const frame = useCurrentFrame();
  const phone = useEnter(0, 200);
  const toast = useEnter(60, -120);
  const out = useExit();
  const views = Math.round(interpolate(frame, [15, 120], [0, 47], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: out, fontFamily: FONT}}>
      <div
        style={{
          ...phone,
          width: 760,
          height: 1440,
          borderRadius: 90,
          background: '#05080c',
          padding: 28,
          boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{width: '100%', height: '100%', borderRadius: 66, background: '#f2f4f7', overflow: 'hidden', position: 'relative'}}>
          {/* Product "photo": soft daylight backdrop with a folded jacket silhouette */}
          <div
            style={{
              height: 760,
              background: 'linear-gradient(160deg, #e9e2d6 0%, #cfc4b2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="420" height="420" viewBox="0 0 200 200">
              <path d="M70 30 L100 45 L130 30 L170 55 L155 95 L140 88 L140 175 L60 175 L60 88 L45 95 L30 55 Z" fill="#2f4858" />
              <path d="M100 45 L100 175" stroke="#1d2f3a" strokeWidth="3" />
              <path d="M85 38 L100 60 L115 38" fill="none" stroke="#1d2f3a" strokeWidth="4" />
              <circle cx="108" cy="90" r="3" fill="#cfd8dc" />
              <circle cx="108" cy="115" r="3" fill="#cfd8dc" />
              <circle cx="108" cy="140" r="3" fill="#cfd8dc" />
            </svg>
          </div>
          <div style={{padding: '40px 44px', color: '#0f1720'}}>
            <div style={{fontSize: 70, fontWeight: 800}}>{price}</div>
            <div style={{fontSize: 44, fontWeight: 600, marginTop: 12, lineHeight: 1.25}}>{item}</div>
            <div style={{fontSize: 34, color: '#5b6b7c', marginTop: 24, lineHeight: 1.4}}>
              Состояние хорошее. Надевал пару раз, без дефектов. Самовывоз или доставка.
            </div>
            <div style={{fontSize: 34, color: '#5b6b7c', marginTop: 28}}>Просмотров: {views}</div>
          </div>
          <div
            style={{
              ...toast,
              position: 'absolute',
              top: 40,
              left: 28,
              right: 28,
              padding: '26px 30px',
              borderRadius: 32,
              background: 'rgba(255,255,255,0.97)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
              display: 'flex',
              gap: 22,
              alignItems: 'center',
            }}
          >
            <div style={{width: 76, height: 76, borderRadius: 38, background: C.green, flexShrink: 0}} />
            <div>
              <div style={{fontSize: 30, color: '#5b6b7c'}}>Новое сообщение</div>
              <div style={{fontSize: 40, fontWeight: 700, color: '#0f1720'}}>{message}</div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Listing = Interactive.create({
  Component: ListingInner,
  layout: 'absolute-fill',
  schema: {
    ...Interactive.backgroundSchema,
    item: {type: 'string', default: '', description: 'Item'},
    price: {type: 'string', default: '', description: 'Price'},
    message: {type: 'string', default: '', description: 'Buyer message'},
  },
});
