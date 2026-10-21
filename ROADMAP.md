# ROADMAP - Ave Caesar

**Last updated**: October 20, 2026
**Live site**: https://avecaesar.org
**Direction**: turn the quiz app into a game that teaches history. Short mini-games first, the chapter text as a "learn more" layer, AI-generated content so we can cover world history.

---

## Done (October 2026)

- **Security**: admin-only content edits, secrets moved out of the repo and rotated, database and backend ports closed, SSH key-only (PRs #51, #53; deployed)
- **Admin fixes**: topic section preselected on edit, Back button on batches (PR #52; deployed)
- **AI content pilot** (`tools/content-gen`): generates a ~1,500-word sectioned chapter from Wikipedia, 60 quiz questions linked to sections, and a fact-check pass. About $1 per chapter. Kingdom chapter done; hand-written versions archived for comparison.
- **Game prototype** (`prototypes/age-of-kings`): seven mini-games on the Kingdom chapter: Chronology Jam, Match Pairs, True or False, Odd One Out, Who Am I?, Map Drop, Legion Quiz. Plus a legion that grows with every fact you know (no soldiers for forced answers, veterans for mistakes fixed later, eagles for perfect rounds), the chapter text one tap away, and round feedback.

---

## Next

| # | Step | Effort |
|---|------|--------|
| 1 | **Test the prototype with 5-10 people** (ideally not history fans), using the feedback box after each round. Decide which games to keep. | ~1 week, mostly waiting |
| 2 | **Generator v2**: produce data for every game type per chapter (timeline, pairs, true/false, odd one out, clues, map places), fact-checked. Generate the 4 Early Republic chapters and compare with the hand-written ones. | 1-2 days, ~$10 API credit |
| 3 | **Games in the app**: game data in the database, React versions of the chosen games, a chapter opens as a game run, legion/stars/progress saved per user. Show the explanation after each answer. **Leaderboard**: all-time "Hall of Legions" (total men, eagles as tie-breaker) plus a weekly board that resets every Monday; players shown by nickname, can opt out. Deploy. | 3-4 weeks part-time |
| 4 | **Mobile**: installable web app (PWA) first, then App Store / Google Play via Capacitor. Needs a privacy policy and in-app account deletion. | 2-4 weeks |

## Business model (decided)

- **Now: no monetisation.** First prove that people come back (day-1 and day-7 retention from player testing).
- **Free tier**: the first chapters of every era and daily play, generous enough to hook people.
- **Premium subscription** (later): all eras and chapters, unlimited replays, special legion units, no ads. Price to be tested (a few dollars a month, discounted yearly plan). On the web via Stripe (`users` already has `account_type`, `premium_expiry_date`, `stripe_customer_id`); in the phone apps via Apple/Google in-app purchase (currently a 15% fee for small developers).
- **Optional rewarded ads** for free players (e.g. a video for a clue). Never forced ads.
- **Schools** (later): teacher dashboard and class licences.
- **No paid-entry cash prizes**: close to gambling law, needs licences, and cheating would ruin it. Competition comes from free leaderboards and non-cash rewards (premium months, special units, Hall of Fame). Sponsor-funded prizes only much later, with legal advice.

## Later

- **Strategy layer**: the legion you recruit grows across chapters; a map of Italy you conquer chapter by chapter
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
