# content-gen

Generates chapters for Ave Caesar from Wikipedia with the Claude API, and loads them into the app.

For each chapter in `chapters.json`:
1. fetches the listed Wikipedia articles (cached in `.cache/wiki`);
2. writes a ~1,500-word chapter split into sections with anchors (`chapter.md`);
3. writes quiz questions from that text, each linked to the section that explains it (`textReference`);
4. fact-checks the sections against Wikipedia and the questions against the chapter (`review.md` lists anything flagged).

Output goes to `content/generated/<folder>/`. Each finished API step is saved in `.cache/responses`,
so a rerun after a failure only repeats the step that failed.

## Setup

```bash
npm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env   # git-ignored; never commit it
```

## Usage

```bash
npm run dry-run                          # fetch sources and show sizes, no API calls
npm run generate -- --only kingdom       # one chapter (~$1)
npm run generate                         # every chapter without output yet
npm run generate -- --only kingdom --force   # regenerate

# Load a generated chapter into a running backend through the admin API
ADMIN_EMAIL=... ADMIN_PASSWORD=... node load.mjs --chapter kingdom --section "Ancient Rome" --topic "The Roman Kingdom"
```

`API_URL` defaults to `http://localhost:8081`.
