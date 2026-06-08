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
    logo: '/providers/netflix.svg',
    type: 'subscription'
  },
  'prime-video': {
    id: 'prime-video',
    name: 'Prime Video',
    logo: '/providers/prime-video.svg',
    type: 'subscription'
  },
  'jiohotstar': {
    id: 'jiohotstar',
    name: 'JioHotstar',
    logo: '/providers/jiohotstar.svg',
    type: 'subscription'
  },
  'sonyliv': {
    id: 'sonyliv',
    name: 'SonyLIV',
    logo: '/providers/sonyliv.svg',
    type: 'subscription'
  },
  'zee5': {
    id: 'zee5',
    name: 'Zee5',
    logo: '/providers/zee5.svg',
    type: 'subscription'
  },
  'apple-tv': {
    id: 'apple-tv',
    name: 'Apple TV',
    logo: '/providers/apple-tv.svg',
    type: 'rent'
  },
  'crunchyroll': {
    id: 'crunchyroll',
    name: 'Crunchyroll',
    logo: '/providers/crunchyroll.svg',
    type: 'subscription'
  },
  'youtube': {
    id: 'youtube',
    name: 'YouTube',
    logo: '/providers/youtube.svg',
    type: 'buy'
  },
  'mx-player': {
    id: 'mx-player',
    name: 'MX Player',
    logo: '/providers/mx-player.svg',
    type: 'free'
  },
  'hulu': {
    id: 'hulu',
    name: 'Hulu',
    logo: '/providers/hulu.svg',
    type: 'subscription'
  },
  'max': {
    id: 'max',
    name: 'Max',
    logo: '/providers/max.svg',
    type: 'subscription'
  },
  'paramount-plus': {
    id: 'paramount-plus',
    name: 'Paramount+',
    logo: '/providers/paramount-plus.svg',
    type: 'subscription'
  },
  'lionsgate-play': {
    id: 'lionsgate-play',
    name: 'Lionsgate Play',
    logo: '/providers/lionsgate-play.svg',
    type: 'subscription'
  }
};
