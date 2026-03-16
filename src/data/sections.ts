import { teams, stickers as teamStickers } from './teams';
import type { Section, Sticker } from '../types';

export const specials: Section = {
  id: 'special',
  icon: '✨',
  code: 'FWC',
};

export const stadiumSection: Section = {
  id: 'stadiums',
  icon: '🏟️',
  code: 'STA',
};

export const sections: Section[] = [
  specials,
  stadiumSection,
  ...teams.map((t) => ({ id: t.id, icon: t.flag, code: t.code })),
];

const specialStickersNames = [
  'Taça FIFA',
  'Mascote Oficial',
  'Logo Panini',
  'Bola Oficial',
  'Troféu de Fair Play',
  'Cartaz Oficial',
  'Bandeira FIFA',
  'Logo da Copa 2026',
];

const stadiumStickersNames = [
  'MetLife Stadium',
  'SoFi Stadium',
  'AT&T Stadium',
  'Hard Rock Stadium',
  'NRG Stadium',
  'Mercedes-Benz Stadium',
  'Lincoln Financial Field',
  'Lumen Field',
  'Gillette Stadium',
  'Arrowhead Stadium',
  "Levi's Stadium",
  'Estadio Azteca',
  'Estadio BBVA',
  'Estadio Akron',
  'BMO Field',
  'BC Place',
];

function generateSectionStickers(section: Section, names: string[], isShiny: boolean): Sticker[] {
  return names.map((_, index) => ({
    code: `${section.code}${index + 1}`,
    albumIndex: 0,
    name: `stickers.${section.id}.${index + 1}`,
    section: section.id,
    isShiny,
  }));
}

const specialStickers = generateSectionStickers(specials, specialStickersNames, true);
const stadiumStickers = generateSectionStickers(stadiumSection, stadiumStickersNames, false);

export const stickers: Sticker[] = [...specialStickers, ...stadiumStickers, ...teamStickers].map(
  (s, i) => ({ ...s, albumIndex: i + 1 })
);

export const totalStickers = stickers.length;

const stickersBySection = new Map<string, Sticker[]>();
for (const s of stickers) {
  const list = stickersBySection.get(s.section) ?? [];
  list.push(s);
  stickersBySection.set(s.section, list);
}

export function getStickersBySection(sectionId: string): Sticker[] {
  return stickersBySection.get(sectionId) ?? [];
}

export const sectionMap = new Map<string, Section>(sections.map((s) => [s.id, s]));

export function getSectionById(sectionId: string): Section | undefined {
  return sectionMap.get(sectionId);
}

export const stickerMap = new Map<string, Sticker>(stickers.map((s) => [s.code, s]));

export function getStickerByCode(code: string): Sticker | undefined {
  return stickerMap.get(code);
}
