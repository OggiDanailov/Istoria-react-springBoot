# Ave Caesar: game design

How the game works today: the chapter test, the point system, the battles and the content rules.
It describes the prototype (`prototypes/age-of-kings`, battles in `prototypes/hold-the-line`); the real app will follow it.

**Last updated**: October 28, 2026

---

## 1. The loop

1. **Read** the chapter (the chronicle), as much or as little as you like.
2. **Take the chapter test**: play every round of every game in the chapter. Your first answers set your score.
3. **Fight the chapter's battle** (Hold the Line) with the army your score earned.
4. **Win** → the next chapter opens. **Lose** → go back to the chapter, re-read the sections your mistakes came from,
   and retake the whole test for a better army, or fight again with the same army.

One battle per chapter. The battle is locked until every round of the test is done.

**Review mode** (for checking content; in the progress sheet): every chapter open, a "Questions & answers" sheet per
chapter listing everything the test can ask with the answers, and every battle playable at a chosen score (60–100%).
Review battles don't change progress.

| Era | Chapter | Battle |
|---|---|---|
| The Kingdom | Early Rome & the Kingdom (753–509 BC) | Lake Regillus (496 BC) |
| Early Republic | Conflict of the Orders: Origins | The Volscian Raids |
| | Conflict of the Orders: Toward Resolution | The Siege of Veii (396 BC) |
| | The Samnite Wars | Aquilonia (293 BC) |
| | Final Conquest of Italy | Beneventum (275 BC) |
| Middle Republic | The First Punic War (264–241 BC) | *not built yet* |
| | Hannibal in Italy (241–216 BC) | *not built yet* |
| | Scipio and the Road to Zama (216–201 BC) | *not built yet* |
| | Rome Turns East (200–167 BC) | *not built yet* |
| | The Fall of Carthage and Corinth (167–133 BC) | *not built yet* |
| | The Gracchi (133–121 BC) | *not built yet* |

A chapter whose battle isn't built yet opens the next chapter as soon as its test is finished.

## 2. The chapter test

- **The rounds**: every set of every game in the chapter (the Kingdom has 14: three Chronology Jam, three Match Pairs,
  two True or False, one Odd One Out, two Who Am I?, one Map Drop, two Legion Quiz). Legion Run is practice and doesn't count.
- **Only the first answer counts.** Every item (a card, a pair, a question, an event in a timeline) is scored once,
  on the player's first try. Playing a round again doesn't change the score.
- **Forced answers don't count**: when only one option is left (the last event of a timeline, the last pair, the last
  town on the map), that item is left out of the score.
- **Retake**: "Retake the test" clears the answers, draws two new Legion Quiz rounds from the chapter's question pool
  (answers in a new order), and the new score replaces the old one. A player can't just replay the wrong answers.

## 3. The point system

Each item is worth a weight; the score is the share of weight answered right on the first try:

> **score = Σ weight of right first answers ÷ Σ weight of all answered items**

The weight is how much better than a guess a right answer is (**1 − chance of guessing**), times a difficulty factor for
quiz questions.

| Game | Weight of one item | Why |
|---|---|---|
| True or False | **0.5** | a coin flip is right half the time |
| Legion Quiz (4 options) | **0.75** easy · **0.94** medium · **1.13** hard | 1 − 1/4, × 1 / 1.25 / 1.5 by difficulty |
| Odd One Out (4 items) | **0.75** | 1 − 1/4 |
| Who Am I? (4 names) | **0.75** | 1 − 1/4 |
| Chronology Jam, Match Pairs, Map Drop | **0.8** per item | ordering, pairing and placing are hard to guess |

Guessing everything scores about 35–40%, so 70% really means knowing most of the chapter.

*Under discussion*: a difficulty factor per game, e.g. Odd One Out 1.25 and Who Am I? (first clue) 1.0, because they need
reasoning, not just recall; and showing "+points" after each answer.

The code: `weightOf()`, `testScore()` and `record()` in `prototypes/age-of-kings/template.html`.

## 4. From score to army

The score buys two things for the battle: **starting grain** (rations to build units) and **veterans** (free soldiers
placed before the first enemy arrives). The battle's normal start is reached at 80%; each 10 points is worth 75 grain
and one veteran.

Starting grain and veterans by score (veterans in order: slinger, triarius, slinger, hastatus):

| Score | Lake Regillus | Volscian Raids | Siege of Veii | Aquilonia | Beneventum | Veterans |
|---|---|---|---|---|---|---|
| 60% | 25 | 25 | 25 | 25 | 75 | none |
| 70% | 25 | 75 | 50 | 100 | 150 | none |
| 80% | 75 | 150 | 125 | 175 | 225 | 1 |
| 90% | 150 | 225 | 200 | 250 | 300 | 2 |
| 100% | 225 | 300 | 275 | 325 | 375 | 3 |

**Helpers** (also earned by the score):

| Score | Helper | What it does |
|---|---|---|
| 80%+ | **Medicus** (army doctor) | heals a wounded soldier to full: tap ✚ Medicus, then the soldier. once per battle |
| 90%+ | **Augur** (priest who reads the omens in the flight of birds) | once per battle: for 15 seconds your soldiers throw faster and hit 1.5× harder |

Free grain also falls from the sky every 12–14 seconds, and supply carts bring 25 every 20 seconds, so building carts
early always matters.

The code: `SCORE` and `armyFor()` in `prototypes/hold-the-line/game.js`; each battle's `start` in `LEVELS`.

## 5. The target, and how it was checked

| Score | Who should win |
|---|---|
| under 60% | practically nobody |
| 70% | only a strong player |
| 80% | an average player, playing well |
| 90–100% | nearly everyone |

Checked with three scripted players (strong, average, casual) that never move soldiers or plan ahead, so a real person
does better: at 60% the strong player lost every game; at 70% the strong player won 1 in 3 and the average player lost;
at 80% the average player won every battle checked (Beneventum, the hardest, about half the time); at 90% the casual
player won 2 in 3.

## 6. The battles (Hold the Line)

A lane-defence game: five lanes, the enemy marches down to the Roman camp. Place units on squares (drag, or tap then
tap), move placed soldiers to another square, collect grain. If an enemy reaches the camp, that lane's equites charge
once; a second break loses the battle. Stars: 3 if the equites never charged, 2 if one or two lanes needed them, 1 otherwise.

Each battle adds a new enemy and a new Roman unit, and some have a twist from their history: the gates of Veii, Pyrrhus's
exhausted night march and the elephant calf at Beneventum. Twists still planned: Castor and Pollux (Lake Regillus),
ambushes (Volscian Raids), mountain rocks and the sacred chickens (Aquilonia).

## 7. Content rules (every chapter)

- **Chronicle**: about 1,500–2,500 words in sections; each game item links to the section that explains it.
- **Latin**: key terms in parentheses after the English, at first mention, shown in red italics with a note at the top
  of the chronicle; no Latin that only repeats the English word.
- **Latin in the test**: a "Latin Words" match round and a few Latin quiz questions.
- **Key facts**: about 10 people, 9 dates and 20 Latin words, each linked to its section (`keyfacts.json`).
- **Maps**: one or two small maps in the chronicle (`maps.json`), coordinates from Wikipedia, uncertain sites noted.
  Map Drop covers Italy for the Kingdom and Early Republic, and the whole Mediterranean from the Middle Republic on
  (`mapArea` in `chapters.json`).
- **Measurements**: metric first, the source's unit in parentheses: "about 5 km (three miles)". Ancient miles and pounds
  are Roman (a mile is about 1.5 km, a pound about 330 g).
- **Sources count as history**: ancient writers (Livy, Fabius Pictor…) and modern historians may be in the games when
  the chapter explains who they are and what they argued; not when the chapter only names them in passing.
- **Odd One Out**: exactly one defensible answer (check other ways of grouping the four items).
- **Reviewed chapters are locked** (`"locked": true` in `tools/content-gen/chapters.json`) so a regeneration can't
  overwrite them.
