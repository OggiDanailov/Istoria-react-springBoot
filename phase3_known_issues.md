# Phase 3 - Known Issues & Technical Debt

**Last Updated**: October 24, 2025
**Status**: Phase 3a In Progress

---

## Critical Issues (Block Release)

### 1. Retake Prevention Not Working
**Severity**: HIGH
**Status**: In Progress
**Description**:
- Users can retake quizzes and get points multiple times
- Example: User passed Quiz 1 (100%) → Retook it → Got +12 points again (should be 0)
- Current code checks database but detection isn't working correctly

**Root Cause**:
- `calculatePointsToAward()` checks for previous passing attempts, but logic fails
- Likely issue: Quiz attempt saved after check, so detection fails on second run

**Possible Solutions**:
1. Disable retakes completely after passing (Option A/B/C from discussion)
2. Fix the database query logic (currently failing)
3. Use Redis cache to track passed chapters in-memory

**Recommended**: Option B (warning modal) - Better UX

**Priority**: Fix before Phase 3b

---

### 2. "Read About This Topic" Navigation Bug
**Severity**: MEDIUM
**Status**: Deferred
**Description**:
- Clicking "Read about this topic" from Results shows "No reading material available yet"
- Should scroll to the relevant section in reading material

**Root Cause**:
- Navigation state gets confused during route change
- selectedTopic state is reset before ReadingMaterial component renders

**Possible Solutions**:
1. Restructure navigation to keep ReadingMaterial state
2. Remove the button entirely (simpler)
3. Use modal overlay instead of navigation

**Recommended**: Remove button for now, implement in Phase 4

**Priority**: Low - UX polish

---

## Medium Issues (Should Fix Soon)

### 3. Quiz Attempts Show Generic Names
**Severity**: MEDIUM
**Status**: Not Started
**Description**:
- Recent Quiz Attempts shows "Quiz 1, Quiz 2, Quiz 3..." instead of chapter names
- Example: Should show "Quiz: Stone Tool Technology" not "Quiz 1"

**Impact**: Users can't tell which quiz is which

**Fix**:
- Include chapter name in QuizAttempt entity or response
- Update dashboard to display `chapter.title` instead of generic "Quiz N"

**Estimated Time**: 30 min

**Priority**: Fix before Phase 3b

---

### 4. localStorage Validation on App Startup Missing
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

### 5. No Warning When Retaking Passed Quiz
**Severity**: LOW
**Status**: Not Started
**Description**:
- User can click "Start Quiz" on already-passed chapter
- No warning that they won't get points
- Creates confusion

**Solution**:
- Show modal: "You already passed this chapter. Continue anyway? (No points)"
- Or disable button with message

**Estimated Time**: 1-2 hours (modal implementation)

**Priority**: After Phase 3a completion

---

### 6. Point Deduction Displays Confusing
**Severity**: LOW
**Status**: Not Started
**Description**:
- When user gets <50% accuracy, points show as negative (-1, -2)
- Dashboard shows negative total points
- UX is confusing for users

**Current Display Example**:
```
Quiz 3: -12%
Score: -1/8 points
```

**Solution**:
- Keep calculation the same (negative internally)
- Display as "Points Deducted: -1" instead of showing in score
- Or show: "Score: 0/8 - 1 point penalty"

**Estimated Time**: 30 min

**Priority**: UX improvement before launch

---

### 7. No Retake Counter
**Severity**: LOW
**Status**: Not Started
**Description**:
- Users don't know how many times they've attempted a quiz
- No "Attempt 1, Attempt 2" labeling

**Solution**:
- Add attempt counter to Recent Quiz Attempts
- Show: "Quiz: Stone Tool Technology (Attempt 2 of 3)"

**Estimated Time**: 30 min

**Priority**: Nice-to-have

---

## Technical Debt

### 8. DEBUG Logs Still in Code
**Severity**: LOW
**Status**: Partially Fixed
**Description**:
- QuizAttemptController still has System.out.println() statements
- Should be removed or converted to proper logging framework

**Fix**:
- Remove all DEBUG statements before production
- Or implement SLF4J/Log4j

**Priority**: Before Phase 3b

---

### 9. No Automated Tests
**Severity**: MEDIUM
**Status**: Not Started
**Description**:
- No unit tests for scoring logic
- No integration tests for quiz flow
- Hard to catch regressions

**Impact**: Risk of bugs like retake prevention

**Recommended Testing**:
- Unit test: `calculatePointsToAward()` with all scenarios
- Integration test: Full quiz flow (create → attempt → save → progress)

**Estimated Time**: 4-6 hours

**Priority**: After Phase 3b (pre-launch testing)

---

### 10. No CI/CD Pipeline
**Severity**: MEDIUM
**Status**: Not Started
**Description**:
- Manual testing required for each change
- No automated build/deploy process

**Impact**: Slow development, risk of shipping broken code

**Priority**: Post-Phase 3 (before production)

---

### 11. Database Not Indexed
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

### 12. No Logging/Monitoring
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

### 13. Quiz Batching Not Implemented
**Severity**: HIGH
**Status**: Not Started
**Description**:
- Phase 3b feature not started
- Need to group 10 questions per batch
- Need mastery threshold (80%) before advancing

**Related**: ROADMAP Phase 3b

**Priority**: Next after Phase 3a

---

### 14. No Chapter-Level Progress Display
**Severity**: MEDIUM
**Status**: Not Started
**Description**:
- Dashboard shows topic-level progress
- Should also show chapter-level mastery within each topic

**Example**:
```
Paleolithic Era: 70% overall
  ├── Introduction to Old Stone Age: 100% ✓
  ├── Human Evolution: 50%
  ├── Stone Tool Technology: 80% ✓
  ├── Subsistence & Lifestyle: 25%
```

**Estimated Time**: 2-3 hours

**Priority**: Phase 3c (UX improvement)

---

## Session Summary

**Oct 24 - Phase 3a Progress**:
- ✅ New point system implemented (70% threshold)
- ✅ Negative points for <50% accuracy
- ❌ Retake prevention not working correctly
- ❌ Chapter name display in quizzes missing
- ⚠️ UX needs improvement for edge cases

**Next Session Priorities**:
1. Fix retake prevention (critical)
2. Add chapter names to quiz display
3. Decide on UX approach (modal warning vs disable button)
4. Complete Phase 3a and commit
5. Start Phase 3b (quiz batching)

---

## Quick Reference: Bugs by Priority

### Must Fix (This Week)
- [ ] Retake prevention working correctly
- [ ] Add chapter names to quiz attempts
- [ ] Remove DEBUG logs

### Should Fix (Before Phase 3b)
- [ ] localStorage validation on startup
- [ ] Retake warning modal/button disable
- [ ] Point deduction UX clarity

### Nice to Have (Phase 4)
- [ ] Fix "Read about this topic" button
- [ ] Retake counter display
- [ ] Chapter-level progress display
- [ ] Automated tests

### Infrastructure (Pre-Launch)
- [ ] Database indexing
- [ ] Logging/monitoring setup
- [ ] CI/CD pipeline

---

## Decision Log

**Decision 25: Defer retake UX to after fix**
- First fix the detection logic
- Then decide on UX (modal, button disable, or complete disable)

**Decision 26: Keep negative points internally**
- Display needs improvement, but calculation is correct
- Can improve display in Phase 4

---

**Document Version**: 1.0
**Maintainer**: Keep this updated after each session
**Review Frequency**: After each development session