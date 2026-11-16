# ROADMAP - Ave Caesar

**Last updated**: November 14, 2026
**How the game works**: [GAME_DESIGN.md](GAME_DESIGN.md)
**Live site**: https://avecaesar.org
**Direction**: turn the quiz app into a game that teaches history. Short mini-games first, the chapter text as a "learn more" layer, AI-generated content so we can cover world history.

---

## Done (October 2026)

- **Security**: admin-only content edits, secrets moved out of the repo and rotated, database and backend ports closed, SSH key-only (PRs #51, #53; deployed)
- **Admin fixes**: topic section preselected on edit, Back button on batches (PR #52; deployed)
- **AI content pilot** (`tools/content-gen`): generates a ~1,500-word sectioned chapter from Wikipedia, 60 quiz questions linked to sections, and a fact-check pass. About $1 per chapter. Kingdom chapter done; hand-written versions archived for comparison.
- **Game prototype** (`prototypes/age-of-kings`): five chapters (Kingdom + Early Republic), each with a chronicle, a test made of eight mini-games, and a battle. The test score (first answers, weighted) sets the army for the chapter's **Hold the Line** battle (`prototypes/hold-the-line`, a Roman lane-defence game); winning opens the next chapter. All chapters reviewed: Latin terms, Latin round and questions, Key facts, chronicle maps.
- **Middle Republic** (Oct 28-29): six chapters generated (First Punic War to the Gracchi, ~$10), reviewed and locked; five new battles on a bigger 6×8 field (Agrigentum, Cannae, Zama, Pydna, the Siege of Carthage), each with a new enemy, a new Roman unit and a historical twist. Helpers earned by the test score: a medicus (80%+, one heal) and an augur (90%+, one omen boost). See `GAME_DESIGN.md`.
- **Late Republic** (Oct 29): seven chapters (Marius to Augustus, ~$11), reviewed and locked; seven battles, including the first battle on two fronts (Alesia) and the first at sea (Actium).
- **Hold the Line on phones and wide screens** (Oct 30-31): faster drawing, nothing over the field, one slim row of cards; on a computer, tablet or a phone turned sideways the cards sit on the left and the controls on the right.
- **The Empire: content** (Nov 1): nine chapters, Augustus to the fall of the West ($15.67), reviewed and locked, with Latin, key facts and maps. Each has a battle chosen but not built yet (they show "coming soon"). The writer's limit of 5 named people per chapter hid famous people (Cleopatra, Arminius, Seneca, even Otho); they were named by hand, and the limit is now set per chapter (`maxNames`, 8 for the Empire).
- **Two culture chapters** (Nov 1): Roman Religion and Mythology (chapter 2, after the Kingdom) and Roman Art and Architecture (the last chapter), ~$2; no battles. Every chapter now names its battle (`battle.level`), so chapters can be inserted anywhere. 29 chapters in all.
- **A bigger field each era** (Nov 3): 6 lanes in the Early Republic, 7 in the Middle, 8 in the Late Republic (the Kingdom keeps 5), re-balanced with the scripted players. 
- **Bulgarian** (Nov 5): the whole app and Hold the Line switch between English and Bulgarian (a button on the Ancient Rome screen). All 29 chapters translated through the API with a shared glossary of ~900 names (chronicles, maps, Key facts, questions, games; ~$26 of credit); Hold the Line's text translated by hand. The Kingdom was reviewed by the user first.
- **The Clash of the Gods, readable** (Nov 9): the gods come down one at a time (4.5 s apart, never right behind another in the same lane), each announced with its lane lit up; Greek gods on clouds with blue name tags, yours with red ones; for the first 4 waves the cards show each Roman god's Greek twin, then from memory; the equites are replaced by Juno's sacred geese (the story of 390 BC is told after the battle).
- **The Pantheon Siege** (Nov 9): the Clash of the Gods replaced by the user's design, a three-lane matching game over all 15 pairs of the chapter's table (three levels with bosses, combo, Favor, gate strength from the test). The battle card and the army line after each chapter test are now in Bulgarian too (they were half English for every chapter).
- **The Falling Gods** (Nov 9): a second game for the gods' chapter (the user's idea): steer each falling Roman god onto its Greek twin. The briefing offers both games; the user will keep the better one or both.
- **An interactive chronicle: the twin gods** (Nov 11, a pilot): above the table of Roman and Greek gods in the Gods and Myths chronicle, the 15 pairs come in one at a time (the Roman god, the one to learn, as a marble statue on the left, its Greek twin in colour on the right; tap the statue and it takes on its colour and symbol), with what each rules and a line of myth; arrows, swipe, dots and "Show them all". If it works, next: Latin words as flip cards and a timeline strip in every chronicle.
- **An interactive chronicle: the seven kings** (Nov 11, the user's idea): after "The Fall of the Kings" in the Kingdom chronicle, the kings one at a time in order (I–VII): a figure with something to remember him by, traditional dates, origin, a nickname and three facts from the chronicle; a numbered strip to jump between them, "One after another", and a last slide with all seven and a sentence to remember them by.
- **An interactive chronicle: the Allia in dots** (Nov 13, the user's idea): in chapter 4's "Disaster at the Allia", an 18-second replay after Livy (slowed from 8 s so the captions can be read): the thin Roman line from the Tiber to a hill, Brennus striking the reserves, panic, the left wing driven into the Tiber (many drown, the rest swim to Veii), the right wing running to Rome; five captions; it plays when scrolled into view, with "Play again". Chronicle extras now live in one list (`CHRONICLE_EXTRAS`), so more battles can follow.
- **Heavy enemies withstand the equites** (Nov 14, the user's idea): the charge still cuts down everyone in its lane, except elephants, the great leaders (Brennus, Spartacus, Arminius, Attila) and the big ships, which lose half their strength and are driven back half the field. The armoured horsemen of Carrhae and Zenobia were tried on the list but come in dozens and made those battles unwinnable, so they stay off it. Beneventum, Carrhae, the Silarius, Germanicus and Zenobia got +50 starting grain; scripted players at 80%: Beneventum and the Silarius won 2/2, Carrhae 1/2, Germanicus and Zenobia lost narrowly (still the hardest).
- **The campaign record** (Nov 13, the user's request, "so it stimulates the player to keep fighting even when the battle is lost or won"): every battle now saves enemies down, soldiers lost and its length; the Progress screen shows the campaign (enemies down, soldiers lost, battles won, stars, chapters conquered, average test, best battle), the Ancient Rome screen a one-line summary, and after each battle won or lost a message with the new total and any new record. In the browser for now; on the server with player accounts later.
- **Planned for the end (the user, Nov 13): real sound recordings.** Today every sound is generated in code (`sfx` in hold-the-line/game.js). Once the app is tested and approved, the user will supply MP3s (mono, 64–96 kbps, trimmed) named after the sounds (sling, throw, hit, chop, clang, die, place, collect, horn, charge, win, lose, crack, boom, trumpet, squeal, honk); each replaces its generated sound, the rest stay. About 200–400 KB for 20 effects; music, if any, loaded separately.
- **The Allia replaces the Siege of Veii** (Nov 13, the user's idea, reworked after their first play): the Tiber is behind the Roman line (no camp, no equites; 10 rows). A Gaul's first blow knocks the man he hits one square back toward the river, and from the last row into it (he drowns; panic halves his neighbours' speed for 4 s); a comrade right behind him, a triarius, a cart or a trap never budges. A Gaul who reaches the river sweeps his whole lane into the water and costs a life; lives come from the test score (0 at 50%, 2 at 60% … 6 at 100%). The first wave strikes the hill on the right. Scripted players: 80% won 3/3, 90% won, 70% and 60% lost.
- **Battle replays for chapters 3–10** (Nov 14, the user's rule: "every chapter with a battle game must have an animation of it"): Agrigentum, Mylae and the Aegates (ships, the corvus, captured ships changing colour, wind), Lake Trasimene (mist, lake), Cannae (the crescent and the double envelopment), Zama (the elephant lanes), Pydna; and three that were missing in chapters already read: the First Secession (chapter 3 has no battle in its chronicle), Aquilonia (the Linen Legion), Beneventum (the night march, the elephant calf). Chapters 11–28 still need theirs.
- **Divide the Land** (Nov 16, the user's pick of three ideas): the Gracchi chapter's game, in the battle slot like the gods' games. A map of public land in strips held by six rich families; the law lets each keep 500 iugera, +250 per son (Appian), up to 1,000. Tap an estate over the limit to cut it (its surplus becomes plots), tap a plot to settle a landless family; every cut angers the Senate (10 + 4 per plot, so big estates are cheaper per plot than borderline ones), and at 100 the senators storm the Capitol. Settle 14 families in time; the tribune Octavius vetoes a third of the way in (wait, or depose him for more anger). The test score sets the time (70-120 s) and the Senate's starting anger.
- **The Siege of Carthage, rebuilt** (Nov 15-16, the user's design over many rounds): a 9 × 11 field split by the city wall on row 6. Four gates, each opening and shutting on its own ~20 s timer (all open for a great wave); a shut gate is wall for soldiers, horses and missiles, and only stones fly over. Defenders come out through open gates and fan out; a garrison and three catapults hold the city (stones fly in visible arcs, a red ring where they land). The win: three eagle-bearers (the new vanguard unit, 600 health, advances on his own) reach and burn the statues of Baal Hammon, Tanit and Eshmun on the Byrsa; the goal shows in the bottom label. Horses stop at the wall and never reach the Byrsa. Many freed slaves (the weakest enemy). New Roman units: the vanguard, the stone-thrower (lobs over walls). Along the way: phones got a bigger field (messages float over it, slimmer cards and controls, no app bar in battle, swipe-back blocked at the edges), soldiers move twice as fast, a build stamp shows the version.
- **Pydna's phalanx and the Legion** (Nov 15, the user's design): phalanx blocks move as one and halt together when any man meets a soldier; 3 lanes wide at 80%+, 5 below; the pikes do double damage while in formation, half on maniples, which push in past the pike points; rough ground breaks a man out of the block. New card: the Legion (300), three maniples side by side. A Legion or cohort moves as one line (drag any of the three). An eques can now ride into a lane whose eques has charged (not a routed wing).
- **Longer battles and Zama's sandstorms** (Nov 15, the user's ideas): from Zama on, every battle runs about a quarter longer (`lengthen` in hold-the-line/game.js: copies of the ordinary waves before the first great wave; the great waves, events and storms after it move later). Zama gets two sandstorms, each announced 8 seconds ahead, that hide the top of the field (a game twist, not recorded history). The scorpion's bolt now pierces at most three enemies and reloads in 4 s; Cannae is harder (300 grain, thicker waves, a bigger African pincer); dragging an eques shows a ghost horse with a gold or red ring.
- **Agrigentum, the walls fight back** (Nov 14, the user's ideas): catapults on the walls of Akragas throw stones at the first soldier in a lane; bolts that fly past the enemy strike the walls and stick in them; the damage shows in stages (cracks, fallen battlements, holes, towers falling, smoke, fires); breaching them silences the city (+150 grain); at victory the city falls and burns. The scorpion costs 200 (was 175), and each enemy its bolt pierces visibly jolts. Horses in the camp now take a press before a grain sack, and a refused move says why.
- **Battle replays: the engine and the Early Republic** (Nov 13): the Allia rebuilt as data in a small engine (`REPLAYS` and `mountReplay` in the app: ground, groups of dots with keyframes, falls, panic, splashes, barricades, the yoke, a flash), plus the Caudine Forks, Sentinum (Decius's devotio) and Heraclea (the elephants; Asculum in the last caption). Next, by era as the user reads: Lake Trasimene, Cannae, Zama, Pydna; then Aquae Sextiae, Carrhae, Alesia, Pharsalus; then the Teutoburg Forest, the Milvian Bridge, Adrianople.
- **Test score → army, reworked** (Nov 11, the user's design): no battle below 50%; the equites are earned (0 at 50%, 2 at 60%, 3 at 70%, 4 at 80%, 5 at 90%, 6 at 100% on five lanes, one more per extra lane) and placed and moved by the player; gentler grain steps; hastatus 125 (was 150); the gods' gate 1–6 by score. Rebalanced with the scripted players (see GAME_DESIGN §4–5).
- **A shorter, even test** (Nov 9): one round per game, drawn for each attempt from all the chapter's material: Chronology Jam 6 events spread over the chapter (tap only; dragging blocked scrolling on phones), Match Pairs 10 pairs on two screens of 5, True or False 10, Legion Quiz 10, Legion Run 10 gates (practice). Odd One Out removed (its answers were often arguable). Who Am I? unchanged for now: 10 people per chapter would need new content (API credit). Unfinished old-format tests restart; won chapters keep their results.
- **The Empire in three eras** (Nov 7): Early Empire (27 BC–AD 68: Augustus to Nero, 3 chapters), Middle Empire (69–284: the Flavians, the good emperors, the Severans and the crisis, 3), Late Empire (284–476: Diocletian to the fall, plus Art and Architecture, 4). The split at 284 is the classic Principate/Dominate boundary.
- **The Empire's nine battles** (Nov 4): the Teutoburg Forest to the Catalaunian Plains, on an 8 × 11 field, with the cohort card and a new unit, enemy and twist in each. All 28 battle chapters now have a playable battle.
- **The Clash of the Gods** (Nov 4): the religion chapter's battle. Greek gods march down with name tags; only each one's Roman twin can stop it.

---

## Next: the road to launch, in order

| # | Step | Effort |
|---|------|--------|
| 1 | **Chapter-by-chapter review** (in progress: chapters 1-11 done, next chapter 13, Marius and Aquae Sextiae; chapter 11, Carthage, still needs its chronicle replay): the user reads each chronicle, takes the test, plays the battle; fixes and ideas as they come. Each battle chapter gets its chronicle replay (chapters 11–28 still to do). | ongoing |
| 2 | **Test the prototype with 5-10 people** (ideally not history fans), using the feedback box at avecaesar.org/play. Decide which games to keep. | ~1 week, mostly waiting |
| 3 | **The finale: the Grand Test and the Battle of Battles** (see below). Built once all chapters are approved, because it draws on all of them. | ~1 week |
| 4 | **Real sound recordings**: the user supplies MP3s once the app is approved. | a few days |
| 5 | **Games in the app**: game data in the database, React versions of the chosen games, a chapter opens as a game run, test scores, battles and progress saved per user. Show the explanation after each answer. **Leaderboard**: all-time "Hall of Legions" plus a weekly board that resets every Monday (what it ranks needs rethinking: e.g. battles won, stars, test scores); players shown by nickname, can opt out. Deploy. | 3-4 weeks part-time |
| 6 | **Mobile**: installable web app (PWA) first, then App Store / Google Play via Capacitor. Needs a privacy policy and in-app account deletion. | 2-4 weeks |

## The finale (the user's idea, Nov 14)

At the end of Roman history, one last test and one last battle. Pass both and you are an **Expert in Roman History**.

1. **The Grand Test**
   - Unlocks once every chapter test has been passed.
   - About 30-40 questions drawn from all the existing question pools: every era, the gods and Art and Architecture, spread evenly. No API cost.
   - The same formats as the chapter tests (pairs, true or false, chronology, Legion Quiz, Who Am I…).
   - A higher bar to pass: **70%**.
2. **The Battle of Battles: Rome against all its enemies**
   - About twice as long as a normal battle, **in two halves** (the Republic, then the Empire) with a short break between them, so a phone interruption doesn't cost everything.
   - The waves follow Roman history in order, each era opening with a banner ("264 BC: Carthage!"): Gauls as at the Allia, Pyrrhus's elephants, Hannibal's army, Germanic tribes, Goths, and Attila's Huns as the final wave.
   - The army: every unit unlocked in the campaign. The Grand Test score sets grain, veterans and equites, as in every chapter.
3. **The reward: a Roman triumph**
   - A short procession on the canvas: the player in the general's chariot, wearing a laurel wreath.
   - Then **the player's own statue** stands in the Forum, beside Caesar's and Augustus's.
   - A certificate, *"Civis Romanus · Expert in Roman History"*, with the player's name and the date, to save or print.
   - Kept on the device until player accounts exist; then it goes on the profile and the leaderboard.

## Business model (decided)

- **Now: no monetisation.** First prove that people come back (day-1 and day-7 retention from player testing).
- **Free tier**: the first chapters of every era and daily play, generous enough to hook people.
- **Premium subscription** (later): all eras and chapters, unlimited replays, special legion units, no ads. Price to be tested (a few dollars a month, discounted yearly plan). On the web via Stripe (`users` already has `account_type`, `premium_expiry_date`, `stripe_customer_id`); in the phone apps via Apple/Google in-app purchase (currently a 15% fee for small developers).
- **Optional rewarded ads** for free players (e.g. a video for a clue). Never forced ads.
- **Schools** (later): teacher dashboard and class licences.
- **No paid-entry cash prizes**: close to gambling law, needs licences, and cheating would ruin it. Competition comes from free leaderboards and non-cash rewards (premium months, special units, Hall of Fame). Sponsor-funded prizes only much later, with legal advice.

## Later

- **More battle twists**: Castor and Pollux (Lake Regillus), ambushes (Volscian Raids), the sacred chickens (Aquilonia); units that level up.
- **Sea battles** (the user's idea): ships in sea lanes, ramming with the *rostrum*, the corvus boarding bridge, fireships, storms. Candidates: Mylae or the Aegates Islands (First Punic War), Pompey against the pirates (67 BC), Actium (31 BC).
- **Battles from two sides** (the user's idea): the Romans in the middle, attacked from the top and the bottom at once; later from the left and right too. Needs enemies walking both ways and soldiers facing either side. Perfect match: Alesia (52 BC), where Caesar held two rings of walls against Vercingetorix inside and the Gallic relief army outside.
- **More history**: rest of Rome, then Greece, Europe, Russia, the US (~150-200 chapters, roughly $150-400 of API credit)
- **Social**: weekly leagues (promotion between Bronze/Silver/Gold groups of ~30 players), challenges between friends, weekly events

## Small fixes waiting

- Quiz attempts can be read by any logged-in user (`GET /api/quiz-attempts/{id}`)
- Check whether quiz answers are sent to the browser before the player answers
- Firewall (`ufw`) on the server: allow only ports 22, 80 and 443
- Leftover "demo" names in the code; lint warnings in the admin components

## Open decisions

- Which mini-games survive player testing?
- Do we keep the long hand-written chapters as optional "deep dives"?
- The previous detailed content plan (Late Republic topics) is in the git history of this file.
