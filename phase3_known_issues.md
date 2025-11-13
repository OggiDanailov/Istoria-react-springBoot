# Phase 3 - Known Issues & Technical Debt

**Last Updated**: October 27, 2025
**Status**: Phase 3a âœ… COMPLETE â†’ Phase 3b Starting

---

## âœ… FIXED ISSUES (Phase 3a Complete)

### 1. âœ… Retake Prevention Not Working - FIXED
**Severity**: HIGH
**Status**: âœ… COMPLETE (Oct 27)
**Description**: Users could retake quizzes after passing and get points multiple times

**Root Cause**:
- Point deduction logic used `request.getScore()` (which is 0 for failed quizzes)
- Calculation: `-(0/2)` = 0, resulting in no penalty applied

**Solution Applied**:
- Changed `calculatePointsToAward()` to use `request.getTotalPoints()` instead of `request.getScore()`
- Now correctly deducts half of total possible points for <50% accuracy

**Testing Verified** (Oct 27):
- âœ… Quiz 1: 0% accuracy â†’ **-6 points** (half of 12 possible)
- âœ… Quiz 2: 100% accuracy â†’ **+12 points** (full reward, no previous pass)
- âœ… Quiz button correctly disabled after first pass
- âœ… Point calculation accurate: -6 + 12 = **6 total points**
- âœ… Retake prevention logic working on subsequent attempts
- âœ… Users cannot click quiz button after passing

**Code Change**:
- File: `QuizAttemptController.java`
- Method: `calculatePointsToAward()`
- Line: 84
- Change: `return -(request.getTotalPoints() / 2);` (was using `request.getScore()`)

**Impact**:
- âœ… Gamification working as intended
- âœ… Point farming prevention functional
- âœ… Users rewarded correctly for learning
- âœ… Penalties applied for careless attempts

### 2. ✅ "Read About This Topic" Anchor Links - FIXED
**Severity**: MEDIUM
**Status**: ✅ COMPLETE (Today)
**Description**: Clicking "Read about this topic" button wasn't scrolling to the correct section in reading material

**Root Cause**:
- When returning from Quiz → Results → ReadingMaterial, `selectedChapter` state was being lost
- ReadingMaterial would reset to Chapter 1 instead of preserving the chapter being studied
- Anchor element couldn't be found because wrong chapter content was displayed

**Solution Applied**:
- Updated `fetchChapters()` to preserve `selectedChapter` when it's already set
- Added check to prevent overriding chapter selection during data fetch
- Ensured `selectedChapter` prop takes precedence over default chapter selection

**Code Changes**:
- File: `ReadingMaterial.jsx`
- Function: `fetchChapters()`
- Added: `if (selectedChapter) return` before defaulting to first chapter
- Also fixed: `handleChapterSelect()` to call parent callback `onChapterSelect(chapter)`

**Architecture Fix**:
- App.jsx now passes `selectedChapter` as prop to ReadingMaterial
- ReadingMaterial uses prop to restore correct chapter after navigation
- Clean separation: App manages state, ReadingMaterial respects it

**Testing Verified**:
- ✅ Select Chapter 6 ("Climate, Environment, and Legacy")
- ✅ Take quiz, get question wrong
- ✅ Click "Read about this topic"
- ✅ Stays on Chapter 6, scrolls to correct anchor (`#legacy-of-the-paleolithic-era`)
- ✅ Anchor links working for all chapters
- ✅ Multiple chapters can be scrolled to without issue
- ✅ State persists correctly through quiz flow

**Impact**:
- ✅ Users can now learn from their mistakes by referencing correct material
- ✅ Better learning experience with immediate reference access
- ✅ Text references fully functional
- ✅ Navigation flow now reliable and predictable

---

## Critical Issues (Block Release)

Currently: None blocking release. Phase 3a complete with all critical features working.

---

## Medium Issues (Should Fix Soon)

### 2. Quiz Attempts Show Generic Names
**Severity**: MEDIUM
**Status**: Not Started
**Description**:
- Recent Quiz Attempts shows "Quiz 1, Quiz 2, Quiz 3..." instead of chapter names
- Example: Should show "Quiz: Stone Tool Technology" not "Quiz 1"

**Impact**: Users can't tell which quiz is which (minor - context usually clear)

**Fix**:
- Include chapter name in QuizAttempt entity or response
- Update dashboard to display `chapter.title` instead of generic "Quiz N"

**Estimated Time**: 30 min

**Priority**: Nice-to-have (Phase 4 polish)

---

### 3. localStorage Validation on App Startup Missing
**Severity**: MEDIUM
**Status**: Not Started
**Description**:
- If database is cleared but user still has token in localStorage, they appear "logged in" with dead token
- Only affects dev/testing when DB is reset

**Root Cause**:
- No validation check when app loads
- App assumes token is valid without checking if user exists

**Fix**:
- On App.jsx mount, validate token with backend
- If user not found, clear localStorage and log out

**Estimated Time**: 15 min

**Priority**: Low - dev convenience only

---

## UX Issues (Polish)

### 4. No Warning When Retaking Passed Quiz
**Severity**: LOW
**Status**: RESOLVED (Button Disabled)
**Description**: User can click "Start Quiz" on already-passed chapter
- **UPDATED**: Quiz button is now disabled after passing, so no warning needed
- Users cannot attempt retakes

**Previous Solution**:
- Show modal: "You already passed this chapter. Continue anyway? (No points)"

**Actual Implementation**:
- âœ… Quiz button disabled in ReadingMaterial component
- âœ… No UI clutter from warnings
- âœ… Prevents accidental retakes

**Status**: Resolved by button disable (better UX than modal)

---

### 5. Point Deduction Displays Confusing
**Severity**: LOW
**Status**: Acceptable (Works, but could be clearer)
**Description**:
- When user gets <50% accuracy, points show as negative (-6, -12)
- Dashboard shows negative total points: "6" after -6 + 12 calculation
- Current display: "Score: -6/12 points"

**Current Behavior** (Oct 27):
- Displays correctly: -6 points for 0% accuracy on 12-point quiz
- Math is clear to users who understand the system
- Dashboard shows correct net total

**Potential UX Improvement** (Phase 4):
- Display as "Points Deducted: -6" instead of showing in score
- Or show: "Score: 0/12 - 6 point penalty"

**Estimated Time**: 30 min (Phase 4)

**Priority**: UX improvement (not blocking)

---

### 6. No Retake Counter
**Severity**: LOW
**Status**: Not Started
**Description**:
- Users don't know how many times they've attempted a quiz
- No "Attempt 1, Attempt 2" labeling

**Solution**:
- Add attempt counter to Recent Quiz Attempts
- Show: "Quiz: Stone Tool Technology (Attempt 2 of 3)"

**Estimated Time**: 30 min

**Priority**: Nice-to-have (Phase 4)

---

## Technical Debt

### 7. DEBUG Logs Still in Code
**Severity**: LOW
**Status**: Partially Fixed
**Description**:
- QuizAttemptController still has System.out.println() statements
- Current logs (useful during testing):
  - "DEBUG: Points to award: ..."
  - "DEBUG: Accuracy: ...%"
  - "DEBUG: User progress updated!"

**Fix**:
- Remove all DEBUG statements before production
- Or implement SLF4J/Log4j framework

**Impact**:
- Console logs are noisy but don't affect functionality
- Should be cleaned before production

**Priority**: Before Phase 3b launch (can do next cleanup pass)

---

### 8. No Automated Tests
**Severity**: MEDIUM
**Status**: Not Started
**Description**:
- No unit tests for scoring logic
- No integration tests for quiz flow
- Hard to catch regressions

**Impact**: Risk of bugs like retake prevention (we caught this one manually)

**Recommended Testing**:
- Unit test: `calculatePointsToAward()` with all scenarios
  - Test pass (70%+)
  - Test fail (50-69%)
  - Test fail (<50%)
  - Test retake after pass
- Integration test: Full quiz flow (create â†’ attempt â†’ save â†’ progress)

**Estimated Time**: 4-6 hours

**Priority**: After Phase 3b (pre-launch testing)

---

### 9. No CI/CD Pipeline
**Severity**: MEDIUM
**Status**: Not Started
**Description**:
- Manual testing required for each change
- No automated build/deploy process

**Impact**: Slow development, risk of shipping broken code

**Priority**: Post-Phase 3 (before production)

---

### 10. Database Not Indexed
**Severity**: MEDIUM
**Status**: Not Started
**Description**:
- Foreign keys exist but no indexes on frequently-queried columns
- Will slow down as data grows

**Missing Indexes**:
- `quiz_attempts(user_id)`
- `quiz_attempts(chapter_id)`
- `user_progress(user_id)`
- `user_progress(topic_id)`

**Estimated Time**: 30 min

**Priority**: Before scaling to 1000+ users

---

### 11. No Logging/Monitoring
**Severity**: MEDIUM
**Status**: Not Started
**Description**:
- Only console logs, no persistent logging
- No error tracking (Sentry, etc.)
- No performance monitoring

**Impact**: Can't debug production issues

**Recommended Stack**:
- Logging: SLF4J + Logback
- Error tracking: Sentry or similar
- Performance: New Relic or DataDog

**Priority**: Before production

---

## Feature Gaps (Phase 3b & Beyond)

### 12. Quiz Batching Not Implemented
**Severity**: HIGH
**Status**: Next (Phase 3b)
**Description**:
- Phase 3b feature not started
- Need to group 10 questions per batch
- Need mastery threshold (80%) before advancing

**Related**: ROADMAP Phase 3b

**Priority**: Next after Phase 3a âœ…

**Estimated Start**: Oct 28

---

### 13. No Chapter-Level Progress Display
**Severity**: MEDIUM
**Status**: Not Started
**Description**:
- Dashboard shows topic-level progress
- Should also show chapter-level mastery within each topic

**Example**:
```
Paleolithic Era: 70% overall
  â”œâ”€â”€ Introduction to Old Stone Age: 100% âœ“
  â”œâ”€â”€ Human Evolution: 50%
  â”œâ”€â”€ Stone Tool Technology: 80% âœ“
  â””â”€â”€ Subsistence & Lifestyle: 25%
```

**Estimated Time**: 2-3 hours

**Priority**: Phase 3c or Phase 4 (UX improvement)

---

## Session Summary

**Oct 24 - Phase 3a Progress (Day 1):**
- âœ… New point system implemented (70% threshold)
- âœ… Negative points for <50% accuracy
- âŒ Retake prevention not working correctly
- âŒ Chapter name display in quizzes missing
- âš ï¸ UX needs improvement for edge cases

**Oct 27 - Phase 3a Completion (Day 2):**
- âœ… **FIXED** Retake prevention bug (used wrong variable)
- âœ… Negative points now correctly applied
- âœ… Point calculation verified and accurate
- âœ… Quiz button disable working as intended
- âœ… All gamification rules functional
- âœ… Ready for Phase 3b

**Today - Anchor Links & Navigation Fix (Day 3):**
- âœ… **FIXED** "Read about this topic" anchor links not working
- âœ… Fixed chapter state persistence through quiz flow
- âœ… Proper architecture: App manages state, components respect it
- âœ… CORS filter issue resolved (OPTIONS requests now allowed)
- âœ… Anchor navigation now scrolls to correct section
- âœ… Tested: Chapter 6 → Quiz → Results → Back → Scroll to anchor âœ…

**Next Session Priorities**:
1. Start Phase 3b (Quiz Batching) â³
2. Create QuizBatch and BatchProgress entities
3. Implement batch enforcement logic
4. Update Quiz component for batch mode
5. Test batch flow and mastery requirements

---

## Quick Reference: Bugs by Priority

### âœ… Fixed (This Week)
- [x] Retake prevention working correctly
- [x] Negative points being applied
- [x] Point calculation accurate
- [x] "Read about this topic" anchor links working
- [x] Chapter selection state persists through quiz flow

### Must Fix (Before Phase 3b Launch)
- [ ] Remove DEBUG logs from QuizAttemptController
- [ ] Test quiz batching thoroughly

### Should Fix (Phase 4)
- [ ] Add chapter names to quiz attempts
- [ ] localStorage validation on startup
- [ ] Point deduction UX clarity
- [ ] Retake counter display

### Nice to Have (Phase 4+)
- [ ] Chapter-level progress display
- [ ] Automated tests
- [ ] Database indexing

### Infrastructure (Pre-Launch)
- [ ] Logging/monitoring setup
- [ ] CI/CD pipeline
- [ ] Performance optimization

---

## Decision Log

**Decision 25: Defer retake UX to after fix**
- First fix the detection logic
- Then decide on UX (modal, button disable, or complete disable)
- âœ… RESOLVED: Used button disable (cleanest UX)

**Decision 26: Keep negative points internally**
- Display needs improvement, but calculation is correct
- Can improve display in Phase 4
- âœ… CONFIRMED: Negative points working as intended

**Decision 27: Deduction calculation** (Oct 27)
- Use `request.getTotalPoints()` not `request.getScore()`
- Deduct half of total possible points
- Example: 0% on 12-point quiz = -6 (half of 12)
- Rationale: Penalizes carelessness proportionally to quiz difficulty
- âœ… IMPLEMENTED: Working correctly

**Decision 28: Next Phase** (Oct 27)
- Proceed with Phase 3b (Quiz Batching)
- Foundation is solid, ready to build on it
- âœ… CONFIRMED: Phase 3a complete, Phase 3b starting

**Decision 29: State Management for Navigation** (Today)
- Anchor links require correct chapter to be displayed
- Solution: Lift `selectedChapter` to App.jsx state
- ReadingMaterial preserves chapter through quiz flow
- Clean separation of concerns: App manages, components render
- âœ… IMPLEMENTED: Navigation now reliable

---

**Document Version**: 1.2
**Maintainer**: Updated after anchor links fix
**Review Frequency**: After each development session
**Last Reviewed**: Today


**Issues to be addressed in the future**
# November 13
- Sign in and Signup links don't seem to work when I click on the links;