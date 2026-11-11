# ROADMAP - Ave Caesar

**Last updated**: November 1, 2026
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
- **A shorter, even test** (Nov 9): one round per game, drawn for each attempt from all the chapter's material: Chronology Jam 6 events spread over the chapter (tap only; dragging blocked scrolling on phones), Match Pairs 10 pairs on two screens of 5, True or False 10, Legion Quiz 10, Legion Run 10 gates (practice). Odd One Out removed (its answers were often arguable). Who Am I? unchanged for now: 10 people per chapter would need new content (API credit). Unfinished old-format tests restart; won chapters keep their results.
- **The Empire in three eras** (Nov 7): Early Empire (27 BC–AD 68: Augustus to Nero, 3 chapters), Middle Empire (69–284: the Flavians, the good emperors, the Severans and the crisis, 3), Late Empire (284–476: Diocletian to the fall, plus Art and Architecture, 4). The split at 284 is the classic Principate/Dominate boundary.
- **The Empire's nine battles** (Nov 4): the Teutoburg Forest to the Catalaunian Plains, on an 8 × 11 field, with the cohort card and a new unit, enemy and twist in each. All 28 battle chapters now have a playable battle.
- **The Clash of the Gods** (Nov 4): the religion chapter's battle. Greek gods march down with name tags; only each one's Roman twin can stop it.

---

## Next

| # | Step | Effort |
|---|------|--------|
| 1 | **Test the prototype with 5-10 people** (ideally not history fans), using the feedback box after each round. Decide which games to keep. | ~1 week, mostly waiting |
| 2 | **Battles for the Empire**: the Teutoburg Forest, Germanicus in Germany, Boudica, the siege of Jerusalem, the Dacian Wars, Zenobia, the Milvian Bridge, Adrianople, the Catalaunian Plains (`battle.level` in `chapters.json`). | a few days |
| 3 | **Games in the app**: game data in the database, React versions of the chosen games, a chapter opens as a game run, test scores, battles and progress saved per user. Show the explanation after each answer. **Leaderboard**: all-time "Hall of Legions" (total men, eagles as tie-breaker) plus a weekly board that resets every Monday (what it ranks needs rethinking now that soldiers are gone: e.g. battles won, stars, test scores); players shown by nickname, can opt out. Deploy. | 3-4 weeks part-time |
| 4 | **Mobile**: installable web app (PWA) first, then App Store / Google Play via Capacitor. Needs a privacy policy and in-app account deletion. | 2-4 weeks |

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
