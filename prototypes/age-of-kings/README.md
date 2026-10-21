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

"Play the chapter" runs five rounds of different games, and the mix changes on each play.

Published (private) at https://claude.ai/artifact/7vX45xzWiZhyPC2siymC4j.
To try it locally, open `index.html` in a browser.

The game data is written into the page by hand for this one chapter, except the Legion Quiz,
which uses fact-checked questions from the generated chapter. The next step is to have
`tools/content-gen` produce this data for every chapter.
