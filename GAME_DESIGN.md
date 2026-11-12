# Ave Caesar: game design

How the game works today: the chapter test, the point system, the battles and the content rules.
It describes the prototype (`prototypes/age-of-kings`, battles in `prototypes/hold-the-line`); the real app will follow it.

**Last updated**: October 29, 2026

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
| Middle Republic | The First Punic War (264–241 BC) | Agrigentum (261 BC) |
| | Hannibal in Italy (241–216 BC) | Cannae (216 BC) |
| | Scipio and the Road to Zama (216–201 BC) | Zama (202 BC) |
| | Rome Turns East (200–167 BC) | Pydna (168 BC) |
| | The Fall of Carthage and Corinth (167–133 BC) | The Siege of Carthage (146 BC) |
| | The Gracchi (133–121 BC) | none (a political chapter) |
| Late Republic | Marius and the Northern Invaders (121–100 BC) | Aquae Sextiae (102 BC) |
| | The Social War and Sulla (91–78 BC) | The Colline Gate (82 BC) |
| | Spartacus and Pompey (78–63 BC) | The Silarius River (71 BC) |
| | Cicero, Catiline and the Triumvirate (63–53 BC) | Carrhae (53 BC) |
| | Caesar in Gaul (58–50 BC) | Alesia (52 BC), on two fronts |
| | Caesar's Civil War and the Ides of March (49–44 BC) | Pharsalus (48 BC) |
| | Antony, Octavian and the End of the Republic (44–27 BC) | Actium (31 BC), at sea |

A chapter without a battle (the Gracchi) opens the next chapter as soon as its test is finished.

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

(Reworked on Nov 11 with the user: the equites are now earned by the score and placed by the player.)

**Below 50% there is no battle**: "the army refuses to march"; the app sends the player back to the sections their
mistakes came from and the test. From 50% the score buys:

- **Equites**, the horsemen in the camp who charge up a lane once when an enemy breaks through. The user's table, for
  the Kingdom's five lanes: 0 at 50%, 2 at 60%, 3 at 70%, 4 at 80%, 5 at 90%, 6 at 100% (never more than the lanes).
  A wider field gets one more per extra lane, so the score always leaves the same number of lanes unguarded (3 at 60%,
  2 at 70%, 1 at 80%, none from 90%). They start under the middle lanes; a lane without one is marked red in the camp,
  and the player drags a horseman along the camp to another lane, before or during the battle. An enemy through an
  unguarded lane (or one whose eques has charged) loses the battle.
- **Starting grain**: a share of the battle's `start`: 15% at 50%, 55% at 60%, 80% at 70%, 100% at 80%, 125% at 90%,
  150% at 100% (Nov 12: 60% was 70%, 70% was 85%; the user's daughter won the Volscian Raids at 60%).
- **A bolder enemy below 80%**: every wave brings more men: +20% at 50%, +15% at 60%, +8% at 70% (Nov 12).
- **Veterans** (free soldiers placed before the first enemy: slinger, triarius, slinger…): 1 at 80%, 2 at 90%, 3 at
  100%.

| Score | Lake Regillus (grain · equites) | Volscian Raids | Siege of Veii | Aquilonia | Beneventum | Veterans |
|---|---|---|---|---|---|---|
| 50% | 25 · 0 | 25 · 0 | 25 · 0 | 25 · 0 | 50 · 0 | 0 |
| 60% | 100 · 2 | 150 · 3 | 125 · 3 | 150 · 3 | 200 · 3 | 0 |
| 70% | 125 · 3 | 175 · 4 | 150 · 4 | 200 · 4 | 225 · 4 | 0 |
| 80% | 150 · 4 | 200 · 5 | 175 · 5 | 225 · 5 | 275 · 5 | 1 |
| 90% | 200 · 5 | 250 · 6 | 225 · 6 | 275 · 6 | 350 · 6 | 2 |
| 100% | 225 · 5 | 300 · 6 | 275 · 6 | 350 · 6 | 425 · 6 | 3 |

**Helpers** (also earned by the score):

| Score | Helper | What it does |
|---|---|---|
| 80%+ | **Medicus** (army doctor) | heals a wounded soldier to full: tap ✚ Medicus, then the soldier. once per battle |
| 90%+ | **Augur** (priest who reads the omens in the flight of birds) | once per battle: for 15 seconds your soldiers throw faster and hit 1.5× harder |

Free grain also falls from the sky every 12–14 seconds, and supply carts bring 25 every 20 seconds, so building carts
early always matters.

The code: `SCORE` and `armyFor()` in `prototypes/hold-the-line/game.js`; each battle's `start` in `LEVELS`.

## 5. The target, and how it was checked

| Score | What it should feel like |
|---|---|
| under 50% | no battle: re-read and retake the test |
| 50% | practically impossible (the user: "people get keen on playing and returning to reading") |
| 60% | super hard: a long fight, usually lost |
| 70% | hard: only careful play wins |
| 80% | fair: an average player playing well wins |
| 90–100% | comfortable |

Checked on Nov 11 with the scripted average player (bots.test.mjs), which now covers the red lanes first and moves an
eques to a lane an enemy is nearing: at 50% lost within a minute and a half; at 60% always lost, but after a fight of
2.5–3.5 minutes; at 70% mostly lost; at 80% won 10 of 12 runs. After the Nov 12 tightening: at 60% even the strong
player lost every run (Volscian Raids within 2 minutes; Lake Regillus by one enemy); at 70% about half; at 80% won 4 of 4 of the five early battles and 19 of 21 later battles
(Zenobia and Adrianople, the hardest before too, still lost at 80%).

## 6. The battles (Hold the Line)

A lane-defence game: five lanes, the enemy marches down to the Roman camp. Place units on squares (drag, or tap then
tap), move placed soldiers to another square, collect grain. If an enemy reaches the camp, that lane's equites charge
once; a second break, or a break in a lane with no eques, loses the battle. Stars: 3 if the equites never charged, 2 if one or two lanes needed them, 1 otherwise.

Each battle adds a new enemy and a new Roman unit, and some have a twist from their history: the gates of Veii, Pyrrhus's
exhausted night march and the elephant calf at Beneventum.

**The field grows each era** (the user's idea, Nov 2026): the Kingdom 5 lanes × 7 rows, the Early Republic 6 × 8,
the Middle Republic 7 × 9, the Late Republic 8 × 10. The extra row keeps the field filling an upright phone; squares
shrink from 68 to 42 px there (8 lanes is about the smallest a finger taps reliably). Each wave gains extra ordinary
troops to fill the wider field (`more` per battle), and Pharsalus starts a little later (`delay`), as Pompey waited.

From the Middle Republic on, each battle has a twist built into the field or the timeline:

| Battle | New enemy | New Roman unit | Twist |
|---|---|---|---|
| Agrigentum | Balearic slingers (shoot from far) | Scorpion: a bolt that flies through the whole lane | the siege ditch: enemies crossing it slow down; no building in it |
| Cannae | Gauls, Numidians (ride round a blocker into the next lane), Africans (outer lanes) | Velites: cheap javelins, fall back one square once | late on, the left wing collapses: no equites on the left lane |
| Zama | charging elephants, Hannibal's veterans | Trumpeter: panics elephants in three lanes | Scipio's lanes: an elephant down an empty lane runs out of the battle; Masinissa returns, equites ready again |
| Pydna | the phalanx: blocks three lanes wide, pikes reach a square ahead, shields stop missiles from the front only | Maniple: strikes the lanes beside it from the side | rough ground breaks the phalanx's shields |
| Siege of Carthage | citizens, freed slaves, Carthaginian archers | Torch-bearer: burns a house | houses block squares, and defenders burst out of them |

Checked with the scripted players on the new fields: at 80% the average player wins about half to most of the runs;
Veii, Cannae, Alesia and Pharsalus are the hardest.

The Late Republic adds two new kinds of battle, on the 8 × 10 field:

| Battle | New enemy | New Roman unit | Twist |
|---|---|---|---|
| Aquae Sextiae | Teutones, Ambrones | Legionary: his pilum ruins any shield it hits | they charge uphill (slower on the last rows); Marius's hidden men strike from behind |
| The Colline Gate | Samnites, Lucanians | Centurion: soldiers around him fight 30% harder | Sulla's wing breaks (one lane loses its equites), then Crassus routs the right |
| The Silarius River | gladiators (murmillo, retiarius whose net stops a soldier), Spartacus | — | the river slows the charge; Spartacus attacks in the last wave |
| Carrhae | Parthian horse archers (ride back and keep shooting), cataphracts | Testudo: arrows barely hurt it | desert: no grain from the sky |
| Alesia | the Gauls inside and the relief army outside | Lilia: hidden pits that hurt and slow | **two fronts**: enemies come from above and below; equites on both edges |
| Pharsalus | Pompey's legionaries, archers, a 7,000-horse charge on the left | Fourth line: triple damage to cavalry | the cavalry charge on one wing |
| Actium | Antony's warships and great ships, Cleopatra's squadron | Harpax ship: a hook that holds a ship still | **at sea**: every unit is a ship; Cleopatra flees mid-battle and Antony follows |

Starting grain in these battles is 250–400 at 80% (Carrhae has the most, since nothing falls from the sky). The
average scripted player wins most of them at 80%; Pharsalus and the Colline Gate are the hardest. Twists still planned: Castor and Pollux (Lake Regillus),
ambushes (Volscian Raids), mountain rocks and the sacred chickens (Aquilonia).

**The Pantheon Siege** (the Gods and Myths chapter; replaced the Clash of the Gods on Nov 9, the user's design): not a
battle but a matching game. The Greek gods walk down three lanes to the gates of Rome as marble statues with blue name
tags; you hold six Roman gods (the twin of every god on the field is always in the hand, the rest are decoys) and drag
one onto a lane. The right twin turns the Greek god into the Roman one in a flash of laurel (points, Favor, a combo ×2
at 3 in a row, ×3 at 6, ×4 at 10); a wrong one is knocked aside, rests for 5 s, and the right pair flashes ("Ares =
Mars · god of war"). A god at the gate costs one gate point; 3 wrong in a row and the Senate loses faith. Favor buys a
slowed lane (3), who comes next (2) or +1 gate (5). Three levels follow the chapter's table of 15 pairs (the great
Olympians; gods of home and work; the whole Pantheon, with Apollo, the one god with the same name), each 5 waves of
4–8 gods, each a little faster, then a boss shown only by its symbol and a clue. The chapter test sets the gate (since Nov 11: 1 point at 50%, 2 at 60% … 6 at 100%; before: 3 below 80%,
4 at 80–89%, 5 at 90%+). Stars: 3 for no mistakes, 2 for one or two. Winning level 1 wins the chapter; the levels and
stars are saved in the browser. Slowed down after the user's first play ("no time to read the names and drag when three come at once"): gods take 15–18 s to
walk down, at most 1 on the field in wave 1, 2 in waves 2–4 and 3 in wave 5, never two within 2.5 s, and a hand of 5.
Scripted players (pantheon.test.mjs, 1.5–3 s per move): knowing the pairs wins with 3 stars; a learner
wins with 1–2 and sometimes loses gate points in level 3; a guesser (40% wrong) loses level 3.

**The Falling Gods** (Nov 9, the user's idea, the second game of the same chapter; the briefing lets the player choose,
each game keeps its own levels and stars, and winning level 1 of either wins the chapter): one Roman god falls at a
time; eight Greek gods, out of all fifteen of the chapter's table, stand as small marble statues in one row (the
user's choice over two shelves), their name tags staggered high and low so each has two columns' width. Tap its Greek
twin, or anywhere above it (or the arrows), swipe down to drop. Right: laurel flash, points, combo, and a new
Greek god takes that place. Wrong: the god bounces back up with the right pair flashing and the twin's place glowing (a
mistake for the stars); a second miss costs a point of the gate. Levels differ in speed only (Gently 10→7 s, Faster
8.5→5.5 s, Fastest 7→4.5 s per god, 20 gods each), then a boss falling with only its symbol and a clue. Like the other
games, it stays one narrow column on wide screens. Scripted players (pantheon.test.mjs, 'fall', 1.5–3 s to find the
twin among eight): knowing the pairs wins with 3 stars, a learner with 1–3, a guesser gets through with 1.

The Empire's nine battles are fought on the biggest field, **8 lanes × 11 rows**, and bring the **cohort**: one card
that places three legionaries side by side (the middle one carries the standard).

| Battle | New enemy | New Roman unit | Twist |
|---|---|---|---|
| The Teutoburg Forest (AD 9) | Germanic warriors | Cohort | ambush: warriors burst out of the woods at the sides, mid-field |
| Germanicus in Germany (AD 16) | the Cherusci, Arminius | Auxiliary archer | Arminius leads the last wave |
| Boudica's Revolt (AD 60/61) | Britons, war chariots (race over the first soldier) | Pilum volley (one use, the nine squares around it) | the narrow pass: woods close the outer lanes |
| The Siege of Jerusalem (AD 70) | Zealots, archers | Onager (its stone also hits the lanes beside) | sallies from the two gates |
| The Dacian Wars (101–106) | Dacians with the falx (double damage), draco bearers | Armoured legionary (no extra harm from the falx) | the Danube to cross |
| Zenobia of Palmyra (272) | armoured horsemen (clibanarii) | Club-man (triple damage to riders) | the heat: armoured horses tire after a while |
| The Milvian Bridge (312) | Maxentius's Praetorians | The labarum (its lane fights 25% harder) | the bridge of boats collapses: everyone on the river drowns |
| Adrianople (378) | Goths, Gothic horsemen | Dart-thrower (plumbatae, three lanes, short range) | the wagon ring; the cavalry attacks from behind |
| The Catalaunian Plains (451) | Hunnic horse archers, Ostrogoths, Attila | Visigothic allies (foederati) | the ridge: slower on the last four rows |

Checked with the scripted players: at 80% the average player wins about 60% of runs across the nine.

## 7. Content rules (every chapter)

- **Chronicle**: about 1,500–2,500 words in sections; each game item links to the section that explains it.
- **Latin**: key terms in parentheses after the English, at first mention, shown in red italics with a note at the top
  of the chronicle; no Latin that only repeats the English word.
- **Latin in the test**: a "Latin Words" match round and a few Latin quiz questions.
- **Key facts**: about 10 people, 9 dates and 20 Latin words, each linked to its section (`keyfacts.json`).
- **Maps**: one or two small maps in the chronicle (`maps.json`), coordinates from Wikipedia, uncertain sites noted.
  Map Drop covers Italy for the Kingdom and Early Republic, and the whole Mediterranean from the Middle Republic on
  (`mapArea` in `chapters.json`).
  Battles can also get a simple battle plan (`"plan": true`: unit blocks and arrows, Rome red, the enemy blue),
  as for Cannae, Zama, Pydna and Numantia.
- **Measurements**: metric first, the source's unit in parentheses: "about 5 km (three miles)". Ancient miles and pounds
  are Roman (a mile is about 1.5 km, a pound about 330 g).
- **Sources count as history**: ancient writers (Livy, Fabius Pictor…) and modern historians may be in the games when
  the chapter explains who they are and what they argued; not when the chapter only names them in passing.
- **Names**: the writer may name at most 5 people per chapter (`maxNames` in `chapters.json`; 8 for the Empire), so it
  describes the rest by role. At review, name anyone a reader would expect to meet (Cleopatra, Arminius, Seneca…).
- **Odd One Out**: exactly one defensible answer (check other ways of grouping the four items).
- **Reviewed chapters are locked** (`"locked": true` in `tools/content-gen/chapters.json`) so a regeneration can't
  overwrite them.
