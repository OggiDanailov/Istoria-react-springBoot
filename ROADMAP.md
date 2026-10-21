# ROADMAP - Ave Caesar

**Last updated**: October 20, 2026
**Live site**: https://avecaesar.org
**Direction**: turn the quiz app into a game that teaches history. Short mini-games first, the chapter text as a "learn more" layer, AI-generated content so we can cover world history.

---

## Done (October 2026)

- **Security**: admin-only content edits, secrets moved out of the repo and rotated, database and backend ports closed, SSH key-only (PRs #51, #53; deployed)
- **Admin fixes**: topic section preselected on edit, Back button on batches (PR #52; deployed)
- **AI content pilot** (`tools/content-gen`): generates a ~1,500-word sectioned chapter from Wikipedia, 60 quiz questions linked to sections, and a fact-check pass. About $1 per chapter. Kingdom chapter done; hand-written versions archived for comparison.
- **Game prototype** (`prototypes/age-of-kings`): seven mini-games on the Kingdom chapter: Chronology Jam, Match Pairs, True or False, Odd One Out, Who Am I?, Map Drop, Legion Quiz.

---

## Next

| # | Step | Effort |
|---|------|--------|
| 1 | **Test the prototype with 5-10 people** (ideally not history fans). Add a feedback box to each round. Decide which games to keep. | ~1 week, mostly waiting |
| 2 | **Generator v2**: produce data for every game type per chapter (timeline, pairs, true/false, odd one out, clues, map places), fact-checked. Generate the 4 Early Republic chapters and compare with the hand-written ones. | 1-2 days, ~$10 API credit |
| 3 | **Games in the app**: game data in the database, React versions of the chosen games, a chapter opens as a game run, stars/progress saved per user. Show the explanation after each answer. Deploy. | 2-3 weeks part-time |
| 4 | **Mobile**: installable web app (PWA) first, then App Store / Google Play via Capacitor. Needs a privacy policy and in-app account deletion. | 2-4 weeks |

## Later

- **Strategy layer**: the legion you recruit grows across chapters; a map of Italy you conquer chapter by chapter
- **More history**: rest of Rome, then Greece, Europe, Russia, the US (~150-200 chapters, roughly $150-400 of API credit)
- **Social**: leagues, challenges between friends, weekly events

## Small fixes waiting

- Quiz attempts can be read by any logged-in user (`GET /api/quiz-attempts/{id}`)
- Check whether quiz answers are sent to the browser before the player answers
- Firewall (`ufw`) on the server: allow only ports 22, 80 and 443
- Leftover "demo" names in the code; lint warnings in the admin components

## Open decisions

- Which mini-games survive player testing?
- Do we keep the long hand-written chapters as optional "deep dives"?
- The previous detailed content plan (Late Republic topics) is in the git history of this file.
