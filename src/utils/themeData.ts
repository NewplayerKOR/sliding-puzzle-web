import { ThemeId, ThemeInfo } from '../types/theme';
import { getAssetUrl } from './assetPath';

export const THEMES: Record<ThemeId, ThemeInfo> = {
  nature: {
    id: 'nature',
    name: '자연 & 풍경',
    category: '풍경',
    description: '풍부하고 다채로운 색감의 숲과 산 풍경',
    imagePath: getAssetUrl('assets/images/theme_nature.png'),
  },
  pixel_art: {
    id: 'pixel_art',
    name: '레트로 픽셀',
    category: '픽셀아트',
    description: '선명한 도트 그래픽의 따뜻한 마을 일러스트',
    imagePath: getAssetUrl('assets/images/theme_pixel_art.png'),
  },
  abstract: {
    id: 'abstract',
    name: '기하학 추상',
    category: '패턴',
    description: '고난도 퍼즐 매니아를 위한 모던 기하학 패턴',
    imagePath: getAssetUrl('assets/images/theme_abstract.png'),
  },
  animal: {
    id: 'animal',
    name: '귀여운 동물',
    category: '캐릭터',
    description: '사랑스럽고 친근한 동물 캐릭터 일러스트',
    imagePath: getAssetUrl('assets/images/theme_animal.png'),
  },
};

export const THEME_LIST: ThemeInfo[] = Object.values(THEMES);
export const DEFAULT_THEME_ID: ThemeId = 'nature';

