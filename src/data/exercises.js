/**
 * Speaking & description exercises for the English learning app.
 */

export const exercises = [
  // ─── Type: describe_image ────────────────────────────────────────────────────
  {
    id: 'ex_001',
    lessonDay: 1,
    type: 'describe_image',
    title: 'Morning Routine',
    promptCzech: 'Popiš, co vidíš na obrázku. Co tato osoba pravděpodobně dělá a proč?',
    promptEnglish: 'Describe what you see in the image. What is this person doing and why?',
    // Using a free Unsplash image URL for a person in morning routine
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    imageAlt: 'A person stretching in the morning by a window',
    targetWords: ['word_001', 'word_002'], // perseverance, acquire
    minWords: 30,
    feedbackFocus: ['vocabulary', 'grammar', 'fluency'],
    exampleAnswer:
      'In this image, I can see a person stretching near a large window. They appear to be starting their morning with exercise, which requires perseverance. Many people try to acquire healthy habits like this, but it takes dedication.',
  },
  {
    id: 'ex_002',
    lessonDay: 1,
    type: 'free_topic',
    title: 'Your Daily Routine',
    promptCzech: 'Popiš svůj typický ráno v angličtině. Co děláš jako první? Co si dáváš ke snídani?',
    promptEnglish: 'Describe your typical morning. What do you do first? What do you have for breakfast?',
    imageUrl: null,
    imageAlt: null,
    targetWords: ['word_002'], // acquire
    minWords: 40,
    feedbackFocus: ['vocabulary', 'grammar', 'tense_consistency'],
    exampleAnswer:
      'Every morning, I wake up at seven o'clock. First, I drink a glass of water. Then I make coffee and eat toast with butter. I try to acquire the habit of exercising before work, but it is not easy.',
  },

  // ─── Type: rewrite_text ──────────────────────────────────────────────────────
  {
    id: 'ex_003',
    lessonDay: 2,
    type: 'rewrite_text',
    title: 'Make It More Formal',
    promptCzech: 'Přepiš následující věty formálněji (pro pracovní email):',
    promptEnglish: 'Rewrite these sentences in a more formal style for a work email:',
    sourceText: '"Hey, can you tell me more about the project? I wanna know all the details ASAP."',
    imageUrl: null,
    imageAlt: null,
    targetWords: ['word_005', 'word_006'], // elaborate, ambiguous
    minWords: 20,
    feedbackFocus: ['register', 'vocabulary', 'grammar'],
    exampleAnswer:
      'Dear colleague, could you please elaborate on the project details? I would appreciate receiving a comprehensive overview at your earliest convenience.',
  },
  {
    id: 'ex_004',
    lessonDay: 2,
    type: 'describe_image',
    title: 'City Life',
    promptCzech: 'Popiš, co se děje na obrázku. Jaká je atmosféra? Jak se asi lidé cítí?',
    promptEnglish: 'Describe what is happening in the image. What is the atmosphere like?',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80',
    imageAlt: 'A busy city street with people walking',
    targetWords: ['word_004', 'word_005'], // resilient, elaborate
    minWords: 35,
    feedbackFocus: ['vocabulary', 'adjectives', 'prepositions'],
    exampleAnswer:
      'The image shows a busy city street filled with people. The atmosphere seems energetic and a little overwhelming. People look resilient as they navigate the crowded pavement.',
  },

  // ─── Lesson 3 exercises ──────────────────────────────────────────────────────
  {
    id: 'ex_005',
    lessonDay: 3,
    type: 'free_topic',
    title: 'Talk About Your Goals',
    promptCzech: 'Řekni alespoň 3–4 věty o tom, co chceš letos dosáhnout a jak toho docílíš.',
    promptEnglish: 'Tell me about your goals for this year. How will you achieve them?',
    imageUrl: null,
    imageAlt: null,
    targetWords: ['word_007', 'word_009'], // procrastinate, acknowledge
    minWords: 50,
    feedbackFocus: ['vocabulary', 'future_tense', 'fluency'],
    exampleAnswer:
      'This year, I want to improve my English. I acknowledge that I have been procrastinating too much. From now on, I will practise every day for at least thirty minutes. I also plan to read English books and watch films without subtitles.',
  },
  {
    id: 'ex_006',
    lessonDay: 3,
    type: 'describe_image',
    title: 'Nature Scene',
    promptCzech: 'Popiš krajinu na obrázku. Jaké počasí je? Jaká roční doba? Jak se cítíš, když se díváš na tento obrázek?',
    promptEnglish: 'Describe the landscape. What is the weather like? What season is it? How does the image make you feel?',
    imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
    imageAlt: 'A peaceful mountain landscape with a lake',
    targetWords: ['word_008'], // subtle
    minWords: 40,
    feedbackFocus: ['vocabulary', 'adjectives', 'feelings'],
    exampleAnswer:
      'The image shows a calm mountain lake surrounded by tall trees. The colours are vivid – deep green forests reflect in the still water. There are subtle shades of blue and purple in the sky. The scene feels peaceful and almost magical.',
  },
];

/**
 * Get exercises for a specific lesson day.
 */
export const getExercisesForLesson = (day) =>
  exercises.filter((ex) => ex.lessonDay === day);

/**
 * Get exercise by ID.
 */
export const getExerciseById = (id) => exercises.find((ex) => ex.id === id);

/**
 * Exercise types.
 */
export const EXERCISE_TYPES = {
  DESCRIBE_IMAGE: 'describe_image',
  FREE_TOPIC: 'free_topic',
  REWRITE_TEXT: 'rewrite_text',
};
