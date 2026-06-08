export type ProviderType = 'free' | 'subscription' | 'rent' | 'buy';

export interface OTTProvider {
  id: string;
  name: string;
  logo: string;
  type: ProviderType;
}

export const PROVIDER_REGISTRY: Record<string, OTTProvider> = {
  'netflix': {
    id: 'netflix',
    name: 'Netflix',
    logo: '/providers/netflix.png',
    type: 'subscription'
  },
  'prime-video': {
    id: 'prime-video',
    name: 'Prime Video',
    logo: '/providers/prime-video.png',
    type: 'subscription'
  },
  'jiohotstar': {
    id: 'jiohotstar',
    name: 'JioHotstar',
    logo: '/providers/jiohotstar.png',
    type: 'subscription'
  },
  'sonyliv': {
    id: 'sonyliv',
    name: 'SonyLIV',
    logo: '/providers/sonyliv.png',
    type: 'subscription'
  },
  'zee5': {
    id: 'zee5',
    name: 'Zee5',
    logo: '/providers/zee5.png',
    type: 'subscription'
  },
  'apple-tv': {
    id: 'apple-tv',
    name: 'Apple TV',
    logo: '/providers/apple-tv.png',
    type: 'rent'
  },
  'crunchyroll': {
    id: 'crunchyroll',
    name: 'Crunchyroll',
    logo: '/providers/crunchyroll.png',
    type: 'subscription'
  },
  'youtube': {
    id: 'youtube',
    name: 'YouTube',
    logo: '/providers/youtube.png',
    type: 'buy'
  },
  'mx-player': {
    id: 'mx-player',
    name: 'MX Player',
    logo: '/providers/mx-player.png',
    type: 'free'
  }
};
