# The Age of Kings (game prototype)

A single-page prototype of seven mini-games built on the chapter
"Early Rome & the Kingdom" (`content/generated/Rome/Kingdom/chapter.md`):

| Game | Teaches |
|---|---|
| Chronology Jam | order of events (tap or drag onto the timeline road) |
| Match Pairs | people, terms and what they did or mean |
| True or False | quick facts (swipe or buttons) |
| Odd One Out | connections between people and events |
| Who Am I? | people, from progressive clues |
| Map Drop | where places were (real coordinates, central Italy) |
| Legion Quiz | the chapter's multiple-choice questions; right answers recruit hastati, principes and triarii |

"Play the chapter" starts with a short briefing, then runs five rounds of different games; the mix changes on each play.

Also in the prototype:
- **Legion bar** (always visible): every right answer recruits a soldier that flies into the bar. The game type decides
  the unit (infantry from quizzes and true/false, centurions from Who Am I? and Match Pairs), the difficulty its rank
  (hastati, principes, triarii). Each fact recruits once; a fact missed in an earlier round joins as a veteran.
  Perfect rounds earn an eagle standard; milestones follow real Roman units (contubernium 8, century 80, cohort 480, legion 4,800).
  Progress is kept in the player's browser.
- **The chronicle**: the full chapter text in a slide-up panel. Wrong answers link to the exact section, and the result
  screen lists the sections behind the round's mistakes.
- **Feedback** after every round: owners and members of the owner's organization save it to the page;
  everyone else copies a short summary to paste into a message.

Published (private) at https://claude.ai/artifact/7vX45xzWiZhyPC2siymC4j.
To try it locally, open `index.html` in a browser.

The game data is written into the page by hand for this one chapter, except the Legion Quiz,
which uses fact-checked questions from the generated chapter. The next step is to have
`tools/content-gen` produce this data for every chapter.
