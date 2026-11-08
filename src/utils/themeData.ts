import { ThemeDefinition, ThemeId, ThemeInfo } from '../types/theme';
import type { Translations } from '../i18n/translations';
import { getAssetUrl } from './assetPath';

// 테마 데이터는 번역 키와 이미지 경로만 보관하고, 표시 문자열은 현재 언어로 해석함.
export const THEMES: Record<ThemeId, ThemeDefinition> = {
  nature: {
    id: 'nature',
    nameKey: 'themeNatureName',
    categoryKey: 'themeNatureCategory',
    descriptionKey: 'themeNatureDescription',
    imagePath: getAssetUrl('assets/images/theme_nature.png'),
  },
  pixel_art: {
    id: 'pixel_art',
    nameKey: 'themePixelArtName',
    categoryKey: 'themePixelArtCategory',
    descriptionKey: 'themePixelArtDescription',
    imagePath: getAssetUrl('assets/images/theme_pixel_art.png'),
  },
  abstract: {
    id: 'abstract',
    nameKey: 'themeAbstractName',
    categoryKey: 'themeAbstractCategory',
    descriptionKey: 'themeAbstractDescription',
    imagePath: getAssetUrl('assets/images/theme_abstract.png'),
  },
  animal: {
    id: 'animal',
    nameKey: 'themeAnimalName',
    categoryKey: 'themeAnimalCategory',
    descriptionKey: 'themeAnimalDescription',
    imagePath: getAssetUrl('assets/images/theme_animal.png'),
  },
};

export const THEME_LIST: ThemeDefinition[] = Object.values(THEMES);
export const DEFAULT_THEME_ID: ThemeId = 'nature';

export function localizeTheme(theme: ThemeDefinition, t: Translations): ThemeInfo {
  return {
    id: theme.id,
    name: t[theme.nameKey],
    category: t[theme.categoryKey],
    description: t[theme.descriptionKey],
    imagePath: theme.imagePath,
  };
}

export function getLocalizedTheme(themeId: ThemeId, t: Translations): ThemeInfo {
  return localizeTheme(THEMES[themeId], t);
}
