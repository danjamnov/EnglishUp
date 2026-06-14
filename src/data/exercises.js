/**
 * Speaking & description exercises for the English learning app.
 * 2 exercises per lesson day (days 1–7).
 */

export const exercises = [
  // ─── Lesson 1 ────────────────────────────────────────────────────────────────
  {
    id: 'ex_001',
    lessonDay: 1,
    type: 'describe_image',
    title: 'Morning Routine',
    promptCzech: 'Popiš, co vidíš na obrázku. Co tato osoba pravděpodobně dělá a proč?',
    promptEnglish: 'Describe what you see in the image. What is this person doing and why?',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    imageAlt: 'A person stretching in the morning by a window',
    targetWords: ['word_001', 'word_002'],
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
    targetWords: ['word_002'],
    minWords: 40,
    feedbackFocus: ['vocabulary', 'grammar', 'tense_consistency'],
    exampleAnswer:
      'Every morning, I wake up at seven o\'clock. First, I drink a glass of water. Then I make coffee and eat toast with butter. I try to acquire the habit of exercising before work, but it is not easy.',
  },

  // ─── Lesson 2 ────────────────────────────────────────────────────────────────
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
    targetWords: ['word_005', 'word_006'],
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
    targetWords: ['word_004', 'word_005'],
    minWords: 35,
    feedbackFocus: ['vocabulary', 'adjectives', 'prepositions'],
    exampleAnswer:
      'The image shows a busy city street filled with people. The atmosphere seems energetic and a little overwhelming. People look resilient as they navigate the crowded pavement.',
  },

  // ─── Lesson 3 ────────────────────────────────────────────────────────────────
  {
    id: 'ex_005',
    lessonDay: 3,
    type: 'free_topic',
    title: 'Talk About Your Goals',
    promptCzech: 'Řekni alespoň 3–4 věty o tom, co chceš letos dosáhnout a jak toho docílíš.',
    promptEnglish: 'Tell me about your goals for this year. How will you achieve them?',
    imageUrl: null,
    imageAlt: null,
    targetWords: ['word_007', 'word_009'],
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
    targetWords: ['word_008'],
    minWords: 40,
    feedbackFocus: ['vocabulary', 'adjectives', 'feelings'],
    exampleAnswer:
      'The image shows a calm mountain lake surrounded by tall trees. The colours are vivid – deep green forests reflect in the still water. There are subtle shades of blue and purple in the sky. The scene feels peaceful and almost magical.',
  },

  // ─── Lesson 4 ────────────────────────────────────────────────────────────────
  {
    id: 'ex_007',
    lessonDay: 4,
    type: 'rewrite_text',
    title: 'Make It More Precise',
    promptCzech: 'Přepiš tento vágní popis konkrétněji a profesionálněji:',
    promptEnglish: 'Rewrite this vague description to make it more precise and professional:',
    sourceText: '"The report was kind of okay. We looked at some stuff and found some problems."',
    imageUrl: null,
    imageAlt: null,
    targetWords: ['word_010', 'word_012'],
    minWords: 25,
    feedbackFocus: ['precision', 'vocabulary', 'grammar'],
    exampleAnswer:
      'The report was satisfactory overall. We scrutinized the financial data and identified three critical issues that require immediate attention. The findings were immaculate in their presentation.',
  },
  {
    id: 'ex_008',
    lessonDay: 4,
    type: 'free_topic',
    title: 'Your Work Style',
    promptCzech: 'Popiš svůj pracovní styl. Jsi spíše pečlivý a detailní, nebo upřednostňuješ rychlost? Jak plánuješ svůj den?',
    promptEnglish: 'Describe your work or study style. Are you detail-oriented or do you prefer speed? How do you plan your day?',
    imageUrl: null,
    imageAlt: null,
    targetWords: ['word_010', 'word_011', 'word_012'],
    minWords: 50,
    feedbackFocus: ['vocabulary', 'present_simple', 'fluency'],
    exampleAnswer:
      'I would describe my work style as methodical. I always scrutinize my tasks before starting and make a tentative plan for the day. I prefer to produce immaculate results rather than rush and make mistakes. In the morning, I list three main priorities and work through them one by one.',
  },

  // ─── Lesson 5 ────────────────────────────────────────────────────────────────
  {
    id: 'ex_009',
    lessonDay: 5,
    type: 'free_topic',
    title: 'Talking About the Future',
    promptCzech: 'Co si myslíš o budoucnosti? Jaké změny považuješ za nevyhnutelné ve světě za 10 let? Mluv upřímně.',
    promptEnglish: 'What do you think about the future? What changes do you consider inevitable in the world in ten years? Be candid.',
    imageUrl: null,
    imageAlt: null,
    targetWords: ['word_013', 'word_014'],
    minWords: 50,
    feedbackFocus: ['vocabulary', 'future_tense', 'opinion_language'],
    exampleAnswer:
      'I think it is inevitable that artificial intelligence will change many jobs in the next ten years. To be candid, I find this both exciting and frightening. Some tasks that people do today will be automated, so it is diligent to prepare now by learning new skills.',
  },
  {
    id: 'ex_010',
    lessonDay: 5,
    type: 'describe_image',
    title: 'Team at Work',
    promptCzech: 'Popiš obrázek. Co lidé dělají? Jak spolu komunikují? Jaká je atmosféra na pracovišti?',
    promptEnglish: 'Describe the image. What are the people doing? How are they communicating? What is the workplace atmosphere like?',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
    imageAlt: 'A team of people collaborating around a table in an office',
    targetWords: ['word_014', 'word_015'],
    minWords: 40,
    feedbackFocus: ['vocabulary', 'present_continuous', 'prepositions'],
    exampleAnswer:
      'The image shows a diverse team of people working together around a large table. They appear to be having a candid discussion about a project. Everyone looks diligent and engaged. The atmosphere is collaborative and professional.',
  },

  // ─── Lesson 6 ────────────────────────────────────────────────────────────────
  {
    id: 'ex_011',
    lessonDay: 6,
    type: 'free_topic',
    title: 'A Difficult Decision',
    promptCzech: 'Popiš situaci, kdy jsi měl/a těžké rozhodnutí. Jak ses cítil/a? Byl/a jsi rozpolcený/á? Jak ses nakonec rozhodl/a?',
    promptEnglish: 'Describe a time when you had to make a difficult decision. How did you feel? Were you ambivalent? How did you decide?',
    imageUrl: null,
    imageAlt: null,
    targetWords: ['word_016', 'word_018'],
    minWords: 55,
    feedbackFocus: ['vocabulary', 'past_tense', 'feelings'],
    exampleAnswer:
      'Last year, I had to decide whether to change my job. I was completely ambivalent – the new opportunity was exciting, but I felt empathy for my colleagues who would have extra work. In the end, I chose to stay because the team needed me. It was a difficult but rewarding decision.',
  },
  {
    id: 'ex_012',
    lessonDay: 6,
    type: 'rewrite_text',
    title: 'Make It More Diplomatic',
    promptCzech: 'Přepiš tyto přímočaré věty tak, aby zněly diplomatičtěji a citlivěji:',
    promptEnglish: 'Rewrite these blunt sentences to sound more diplomatic and empathetic:',
    sourceText: '"Your idea is wrong. Nobody wants this. You are wasting our time."',
    imageUrl: null,
    imageAlt: null,
    targetWords: ['word_016', 'word_017'],
    minWords: 25,
    feedbackFocus: ['diplomacy', 'vocabulary', 'register'],
    exampleAnswer:
      'I understand where you are coming from, and I appreciate your effort. However, I have some concerns about this approach. The data presents a compelling case for an alternative direction. Could we explore other options together?',
  },

  // ─── Lesson 7 ────────────────────────────────────────────────────────────────
  {
    id: 'ex_013',
    lessonDay: 7,
    type: 'free_topic',
    title: 'Critical Thinking',
    promptCzech: 'Vyber jedno téma ze zpráv (technologie, zdraví, politika...) a zamysli se nad ním kriticky. Proč bys byl/a skeptický/á? Co by bylo potřeba prokázat, abys uvěřil/a?',
    promptEnglish: 'Choose a topic from the news and think about it critically. Why might you be skeptical? What evidence would you need to believe it?',
    imageUrl: null,
    imageAlt: null,
    targetWords: ['word_019', 'word_021'],
    minWords: 55,
    feedbackFocus: ['vocabulary', 'critical_thinking', 'opinion_language'],
    exampleAnswer:
      'I am skeptical about claims that a new supplement can boost memory by fifty percent. I would need to scrutinize the research meticulous­ly – who funded the study, how many participants were involved, and whether the results were peer-reviewed. Without this evidence, I cannot accept such bold claims.',
  },
  {
    id: 'ex_014',
    lessonDay: 7,
    type: 'describe_image',
    title: 'A Thriving Market',
    promptCzech: 'Popiš obrázek trhu nebo rušné ulice. Co se zde prodává? Jaká je atmosféra? Jak se lidé chovají?',
    promptEnglish: 'Describe the market or busy street scene. What is being sold? What is the atmosphere like? How are people behaving?',
    imageUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
    imageAlt: 'A colourful outdoor market with fresh produce and busy shoppers',
    targetWords: ['word_020', 'word_021'],
    minWords: 40,
    feedbackFocus: ['vocabulary', 'adjectives', 'present_continuous'],
    exampleAnswer:
      'The image shows a vibrant outdoor market that appears to flourish with activity. Colourful fruits and vegetables are displayed on wooden stalls. People are browsing and chatting cheerfully. I am slightly skeptical that such a perfect scene exists every day – it looks like a special market day!',
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
