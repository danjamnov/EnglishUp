import { vocabulary } from './vocabulary';
import { oxfordB1Words } from './oxford_b1';

/**
 * Registry of all available word lists.
 * Add new lists here as new sources are imported.
 */
export const WORD_LISTS = [
  {
    id: 'lessons',
    label: 'Naučená slovíčka',
    description: 'Slovíčka z tvých lekcí',
    emoji: '📚',
    // Words are filtered dynamically by unlockedWordIds — see getWordsForList()
    words: vocabulary,
    dynamic: true, // only show unlocked words
  },
  {
    id: 'oxford_b1',
    label: 'Oxford 3000 – B1',
    description: '802 nejdůležitějších slov na úrovni B1',
    emoji: '🎓',
    words: oxfordB1Words,
    dynamic: false,
  },
];

/**
 * Get words for a list, filtering by unlockedWordIds when dynamic.
 */
export function getWordsForList(listId, unlockedWordIds = []) {
  const list = WORD_LISTS.find((l) => l.id === listId);
  if (!list) return [];
  if (list.dynamic) {
    return list.words.filter((w) => unlockedWordIds.includes(w.id));
  }
  return list.words;
}
