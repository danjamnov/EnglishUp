/**
 * Vocabulary data for the English learning app.
 * Each lesson contains 3 words with mnemonics tailored for Czech speakers.
 */

export const vocabulary = [
  // ─── Lesson 1 ───────────────────────────────────────────────────────────────
  {
    id: 'word_001',
    lessonDay: 1,
    english: 'perseverance',
    czech: 'vytrvalost',
    phonetic: '/ˌpɜːr.sɪˈvɪər.əns/',
    mnemonic:
      'Představ si PERSON (osobu), která jde přes hory věrně = VERSE za VERSEM – PERSON + VERSE + ANCE = perseverance!',
    exampleSentence: 'Her perseverance helped her pass the final exam.',
    exampleTranslation: 'Její vytrvalost jí pomohla složit závěrečnou zkoušku.',
    difficulty: 'B2',
    tags: ['character', 'abstract'],
  },
  {
    id: 'word_002',
    lessonDay: 1,
    english: 'acquire',
    czech: 'získat / osvojit si',
    phonetic: '/əˈkwaɪər/',
    mnemonic:
      'A + CHOIR (pěvecký sbor) – sbor si musí nejdřív ZÍSKAT nové členy, než může zpívat. Acquire = získat.',
    exampleSentence: 'It takes time to acquire a new language.',
    exampleTranslation: 'Naučit se nový jazyk zabere čas.',
    difficulty: 'B1',
    tags: ['verb', 'learning'],
  },
  {
    id: 'word_003',
    lessonDay: 1,
    english: 'eloquent',
    czech: 'výmluvný / výřečný',
    phonetic: '/ˈel.ə.kwənt/',
    mnemonic:
      'EL + O + QUENT – představ si ELFA (EL) s otevřenými (O) ústy, ze kterých QUENTem (vzletně) tryskají slova. Výmluvný člověk mluví jako elf.',
    exampleSentence: 'The president gave an eloquent speech.',
    exampleTranslation: 'Prezident pronesl výmluvný projev.',
    difficulty: 'C1',
    tags: ['adjective', 'communication'],
  },

  // ─── Lesson 2 ───────────────────────────────────────────────────────────────
  {
    id: 'word_004',
    lessonDay: 2,
    english: 'resilient',
    czech: 'odolný / pružný',
    phonetic: '/rɪˈzɪl.i.ənt/',
    mnemonic:
      'RE + SILI + ENT – "RE" = znovu, "SILI" zní jako "síla" – ten, kdo znovu (RE) nachází sílu (SILI), je resilient. Odolný!',
    exampleSentence: 'Children are often more resilient than adults.',
    exampleTranslation: 'Děti jsou často odolnější než dospělí.',
    difficulty: 'B2',
    tags: ['adjective', 'character'],
  },
  {
    id: 'word_005',
    lessonDay: 2,
    english: 'elaborate',
    czech: 'propracovaný / rozvést myšlenku',
    phonetic: '/ɪˈlæb.ər.ət/',
    mnemonic:
      'E + LABOR + ATE – ten, kdo LABORUJE (pracuje), a ještě to SNĚDL (ATE) – propracoval věc do posledního detailu!',
    exampleSentence: 'Could you elaborate on your idea?',
    exampleTranslation: 'Mohl byste rozvést svůj nápad?',
    difficulty: 'B2',
    tags: ['verb', 'adjective', 'communication'],
  },
  {
    id: 'word_006',
    lessonDay: 2,
    english: 'ambiguous',
    czech: 'nejednoznačný / dvojsmyslný',
    phonetic: '/æmˈbɪɡ.ju.əs/',
    mnemonic:
      'AMB + I + GUOUS – AMBulance jede dvěma směry najednou, je NEJEDNOZNAČNÉ, kam pojede. Ambiguous = má víc výkladů.',
    exampleSentence: 'The instructions were ambiguous and confusing.',
    exampleTranslation: 'Instrukce byly nejednoznačné a matoucí.',
    difficulty: 'C1',
    tags: ['adjective', 'language'],
  },

  // ─── Lesson 3 ───────────────────────────────────────────────────────────────
  {
    id: 'word_007',
    lessonDay: 3,
    english: 'procrastinate',
    czech: 'odkládat / otálet',
    phonetic: '/prəˈkræs.tɪ.neɪt/',
    mnemonic:
      'PRO + CRASTI + NATE – PRO krástu (CRASTI = crastinus = zítřejší v latině) – "pro zítřek" odkládáš všechno. Dnes ne, ZÍTRA!',
    exampleSentence: "Don't procrastinate – start studying today.",
    exampleTranslation: 'Neodkládej to – začni studovat dnes.',
    difficulty: 'B2',
    tags: ['verb', 'behavior'],
  },
  {
    id: 'word_008',
    lessonDay: 3,
    english: 'subtle',
    czech: 'jemný / nenápadný',
    phonetic: '/ˈsʌt.əl/',
    mnemonic:
      'Pozor: B se NEVYSLOVUJE! SUTle – jako "sut" padající tiše a NENÁPADNĚ z kopce. Jemný, tichý, skoro neviditelný.',
    exampleSentence: 'There was a subtle difference between the two versions.',
    exampleTranslation: 'Mezi oběma verzemi byl jemný rozdíl.',
    difficulty: 'B2',
    tags: ['adjective', 'nuance'],
  },
  {
    id: 'word_009',
    lessonDay: 3,
    english: 'acknowledge',
    czech: 'uznat / připustit',
    phonetic: '/əkˈnɒl.ɪdʒ/',
    mnemonic:
      'ACK + KNOWLEDGE – "ACK!" (výkřik překvapení) + KNOWLEDGE (znalost) = když něco uznáš, přiznáš, že to víš. Acknowledge = přiznat znalost.',
    exampleSentence: 'She acknowledged her mistake and apologized.',
    exampleTranslation: 'Přiznala svoji chybu a omluvila se.',
    difficulty: 'B1',
    tags: ['verb', 'communication'],
  },
];

/**
 * Get words for a specific lesson day.
 */
export const getWordsForLesson = (day) =>
  vocabulary.filter((w) => w.lessonDay === day);

/**
 * Get a word by its ID.
 */
export const getWordById = (id) => vocabulary.find((w) => w.id === id);

/**
 * Total number of lessons.
 */
export const TOTAL_LESSONS = Math.max(...vocabulary.map((w) => w.lessonDay));
