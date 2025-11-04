# Historical Quiz Application - Product Roadmap

**Last Updated**: October 27, 2025
**Current Phase**: Phase 3a ✅ COMPLETE → Phase 3b - Quiz Batching (Starting)

---

## Phase 1: Core Foundation (✅ 100% Complete)

**Status**: Production Ready

- ✅ Chapter-based quiz architecture (Period → Topic → Chapter → Question)
- ✅ 6 chapters for Paleolithic Era with 31 questions
- ✅ Question randomization per attempt
- ✅ Answer option shuffling (Fisher-Yates algorithm)
- ✅ Difficulty levels (1/2/3 points)
- ✅ Markdown rendering with react-markdown
- ✅ Reading material with chapter selection
- ✅ Results screen with score calculation

---

## Phase 2: User Authentication & Progress Tracking (✅ 100% Complete)

**Status**: Production Ready

**Completed:**
- ✅ User registration/login with JWT + BCrypt
- ✅ User entity with password hashing
- ✅ QuizAttempt entity and saving to database
- ✅ UserProgress entity with accuracy calculation
- ✅ QuizAttemptController with duplicate prevention
- ✅ UserProgressController for progress tracking
- ✅ UserDashboard component with full stats display
- ✅ Dashboard navigation (header button)
- ✅ Quiz history display (recent attempts)
- ✅ Progress aggregation by topic
- ✅ Mastery badge display (80%+)
- ✅ Fixed Results.jsx useEffect (no duplicate saves)
- ✅ Token persistence in localStorage

**Key Features Working:**
- Users can sign up and login
- Quiz attempts save to database only once
- Progress calculated in real-time
- Dashboard shows:
  - Total points earned
  - Quizzes taken
  - Topics studied
  - Topics mastered (80%+ accuracy)
  - Progress per topic with accuracy %
  - Recent quiz attempts (last 10)

**Bug Fixes (Oct 24):**
- ✅ Fixed duplicate quiz saves (React Strict Mode issue)
- ✅ Fixed Results.jsx useRef to prevent double POST requests
- ✅ Progress calculation working correctly
- ✅ Removed DEBUG console logs

---

## Phase 3: Gamification & Advanced Point System (✅ Phase 3a COMPLETE)

**Status**: Phase 3a Complete, Phase 3b Starting

### Phase 3a: New Point Scoring System (✅ COMPLETE)

**Status**: ✅ Tested and Verified (Oct 27)

**Goal**: Incentivize learning, not clicking. Penalize careless attempts.

**New Rules (Implemented & Tested):**
1. **Pass (70%+ accuracy)**: Award full points ✅
   - Example: 100% accuracy on 12-point quiz = +12 points
2. **Fail (50-69% accuracy)**: Award 0 points ✅
3. **Fail (<50% accuracy)**: Deduct points ✅
   - Deduction: Half of total possible points
   - Example: 0% accuracy on 12-point quiz = -6 points
4. **Retakes**: No additional points if already passed ✅
   - Button disabled after first pass (prevents farming)
   - Users cannot retake passed quizzes
5. **Total Points**: Accurately calculated across all attempts ✅

**Implementation Details:**
- Modified `QuizAttemptController.calculatePointsToAward()`
- Changed deduction logic to use `request.getTotalPoints()` instead of `request.getScore()`
- Retake prevention checks database for passing attempts (70%+ accuracy)
- Quiz button disabled via `ReadingMaterial` component state

**Code Changes:**
- `QuizAttemptController.java` line 84: Fixed deduction calculation
- All gamification rules implemented in `calculatePointsToAward()` method

**Test Results (Oct 27):**
- ✅ Quiz 1: 0% accuracy → **-6 points** (deduct half of 12)
- ✅ Quiz 2: 100% accuracy → **+12 points** (full reward, no previous pass)
- ✅ Button disabled after first pass
- ✅ Point calculation: -6 + 12 = **6 total points** ✅
- ✅ Dashboard displays correct totals
- ✅ Cannot click quiz button after passing

**Timeline**: Oct 24-27 (Completed)

---

### Phase 3b: Quiz Batching & Mastery System (⏳ NEXT)

**Status**: Not Started

**Goal**: Organize quizzes into 10-question batches with mastery thresholds.

**Features to Implement:**
1. Quiz batching (10 questions per batch)
2. 80% mastery threshold for batch completion
3. Can't move to next batch until current batch mastered
4. Retake system for failed batches
5. Progress tracking per batch
6. Visual batch progress display

**Implementation Plan:**
- Add `QuizBatch` entity (groups 10 questions)
- Add `BatchProgress` entity (tracks completion/mastery)
- Create `BatchController` endpoints
- Update `Quiz.jsx` to load batch questions
- Add UI for batch progress display
- Modify quiz flow to enforce mastery before advancement

**Estimated Time**: 2-3 hours

**Acceptance Criteria:**
- [ ] Questions grouped into 10-question batches
- [ ] Users cannot proceed to next batch without 80% accuracy
- [ ] Progress tracking per batch works
- [ ] Can retake failed batches
- [ ] UI shows current batch and progress

**Timeline**: Oct 28-29 (Planned)

---

## Phase 4: Additional Features (Future)

- localStorage validation
- Premium tier & Stripe payments
- Competitive mode with leaderboards
- Mobile app (React Native)
- Internationalization (5 languages)
- Chapter-level progress display
- Automated testing framework

---

## Technical Architecture

### Backend Stack
- Spring Boot 3.5.5 (Java 21)
- Spring Data JPA / Hibernate
- H2 (dev), PostgreSQL (prod)
- JWT + BCrypt authentication

### Frontend Stack
- React + Vite
- react-markdown for content
- React hooks for state management

### Database Schema (Current)
```
periods → topics → chapters → questions → question_options
users → quiz_attempts (links to chapters)
users → user_progress (links to topics)

// Phase 3 additions:
quiz_batches (groups 10 questions per chapter)
batch_progress (tracks user's mastery per batch)
```

---

## Session Notes

**Oct 24 - Phase 2 Completion:**
- Quiz attempts save only once (fixed useRef issue)
- Progress calculation working correctly
- Dashboard displaying all stats accurately
- All DEBUG logs removed
- Ready for Phase 3

**Oct 24 - Phase 3a Planning:**
- New point system: 70% threshold, negative points for <50%
- No retake bonuses (prevents farming)
- Quiz batching: 10 questions per batch
- Mastery: 80% accuracy required

**Oct 27 - Phase 3a Completion:**
- ✅ Retake prevention bug fixed (used wrong variable in calculation)
- ✅ Negative points correctly applied: 0% accuracy → -6 points on 12-point quiz
- ✅ Retake prevention working: button disabled after first pass
- ✅ Point calculation verified: -6 + 12 = 6 total points ✅
- ✅ Database correctly tracking attempts
- ✅ Ready to start Phase 3b (Quiz Batching)

**Today - Anchor Links & Navigation Fix:**
- ✅ FIXED "Read about this topic" anchor links
- ✅ Fixed chapter state persistence through quiz flow
- ✅ CORS filter properly configured for protected endpoints

## Next Actions (Phase 3b - Starting)

1. **Create QuizBatch Entity**
   - Store batch ID, chapter reference, questions list
   - Track batch order/sequence

2. **Create BatchProgress Entity**
   - Track user's progress per batch
   - Store best score, mastery status, completion date

3. **Implement BatchController**
   - GET batches for chapter
   - GET user's batch progress
   - POST batch completion

4. **Modify Quiz.jsx**
   - Load questions from batch instead of full chapter
   - Enforce batch order
   - Show batch progress indicator

5. **Update ReadingMaterial**
   - Show which batch user is on
   - Show 80% mastery requirement

6. **Test thoroughly**
   - Complete batch 1 with 80% → unlock batch 2
   - Complete batch 1 with 70% → cannot unlock batch 2
   - Can retake failed batch

---

## Success Metrics

**Phase 1**: ✅ Complete - Questions randomize, answers shuffle, quizzes work

**Phase 2**: ✅ Complete - Users register/login, attempts save, progress tracks, dashboard works

**Phase 3a**: ✅ Complete (Oct 27)
- ✅ New point system implemented
- ✅ Scoring logic correct (70% threshold)
- ✅ Retakes blocked after passing
- ✅ Negative points for <50% accuracy (-6 on 12-point quiz)
- ✅ Quiz button disabled after pass
- ✅ All calculations verified

**Phase 3b** (In Progress):
- [ ] Quiz batching implemented
- [ ] 80% mastery threshold working
- [ ] Batch progress tracking
- [ ] Retake system for failed batches
- [ ] Visual progress indicators

---

## File Structure

```
backend/
├── model/
│   ├── User.java
│   ├── QuizAttempt.java
│   ├── UserProgress.java
│   ├── QuizBatch.java (NEW for Phase 3b)
│   ├── BatchProgress.java (NEW for Phase 3b)
│   └── ... (others)
├── controller/
│   ├── QuizAttemptController.java (FIXED Oct 27)
│   ├── UserProgressController.java
│   ├── BatchController.java (NEW for Phase 3b)
│   └── ... (others)
└── repository/
    ├── QuizAttemptRepository.java
    ├── UserProgressRepository.java
    ├── QuizBatchRepository.java (NEW for Phase 3b)
    ├── BatchProgressRepository.java (NEW for Phase 3b)
    └── ... (others)

frontend/
├── components/
│   ├── UserDashboard/
│   │   ├── UserDashboard.jsx
│   │   └── UserDashboard.css
│   ├── Results/
│   │   └── Results.jsx (FIXED)
│   ├── Quiz/
│   │   └── Quiz.jsx (TO BE UPDATED for batching)
│   ├── ReadingMaterial/
│   │   └── ReadingMaterial.jsx (TO BE UPDATED)
│   └── ... (others)
└── config/
    └── api.js
```

---

## Key Decisions (Oct 24-27)

**Decision 22: useRef for duplicate prevention**
- Use useRef instead of sessionStorage/localStorage
- Prevents React Strict Mode double-call
- More reliable than timestamp checking
- Impact: Single quiz save guaranteed

**Decision 23: 70% mastery threshold**
- Not too harsh (80% was too hard)
- Encourages learning without frustration
- Can adjust based on user feedback

**Decision 24: Phase 3 order**
- Point system first (simpler) ✅ DONE
- Then batching (builds on point system) ⏳ NEXT
- Then polish
- Allows testing/adjustment before batching

**Decision 27: Deduction calculation** (Oct 27)
- Use `request.getTotalPoints()` not `request.getScore()`
- Deduct half of total possible points (not based on score which is 0)
- Example: 0% on 12-point quiz = -6 (half of 12)
- Rationale: Penalizes carelessness, not difficulty of questions

---

## Known Issues & Technical Debt

**Fixed Issues:**
- ✅ Retake prevention not working → FIXED (Oct 27)
  - Root cause: Used wrong variable in deduction
  - Solution: Changed to `request.getTotalPoints()`

- ✅ "Read about this topic" anchor links → FIXED (Today)
  - Root cause: Chapter state was being reset on navigation
  - Solution: Preserve selectedChapter in App state

**Current Issues (Minor):**
- DEBUG logs still in QuizAttemptController
  - Can be cleaned up in next pass
- localStorage validation on app startup missing
  - Minor issue, affects testing only

**Technical Debt:**
- No automated tests
- No CI/CD pipeline
- Database not indexed for production
- No logging/monitoring

---

## Document Version History

- **v1.0** (Oct 22): Initial comprehensive roadmap
- **v1.1** (Oct 23): Phase 1 completion, Phase 2 in progress
- **v1.2** (Oct 24 AM): Phase 2 in progress with dashboard
- **v1.3** (Oct 24 PM): **Phase 2 COMPLETE**, Phase 3 planning
- **v1.4** (Oct 27): **Phase 3a COMPLETE**, Phase 3b ready to start

---

**Ready to start Phase 3b!** 🚀

---

## File Structure (Admin Panel - Organized)

```
components/Admin/
├── Admin.jsx
├── AdminPeriods.jsx
├── AdminTopics.jsx
├── AdminChapters.jsx
├── AdminQuestions.jsx
├── BulkImportForm/
│   ├── BulkImportForm.jsx
│   └── BulkImportForm.css
├── PeriodForm/
│   ├── PeriodForm.jsx
│   └── PeriodForm.css
├── TopicForm/
│   ├── TopicForm.jsx
│   └── TopicForm.css
├── ChapterForm/
│   ├── ChapterForm.jsx
│   └── ChapterForm.css
└── QuestionForm/
    ├── QuestionForm.jsx
    └── QuestionForm.css
```

---

## Paleolithic Era Content

**6 Chapters Created:**
1. Introduction to the Old Stone Age (8 questions)
2. Human Evolution During the Paleolithic (7 questions)
3. Stone Tool Technology (5 questions)
4. Subsistence and Lifestyle (4 questions)
5. Art and Symbolic Expression (3 questions)
6. Climate, Environment, and Legacy (4 questions)

**Total**: 31 questions across 6 chapters

---

## API Endpoints Reference

### Content (Public)
- `GET /api/periods` - List all periods
- `GET /api/periods/{id}` - Get period details
- `GET /api/periods/{id}/topics` - Get topics for period
- `GET /api/topics` - List all topics
- `GET /api/topics/{id}` - Get topic details
- `GET /api/topics/{id}/chapters` - Get chapters for topic
- `GET /api/chapters/{id}` - Get chapter details
- `GET /api/chapters/{id}/questions` - Get questions for chapter
- `GET /api/questions` - List all questions

### Authentication (Public)
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user (returns JWT token)

### Quiz Attempts (Protected)
- `POST /api/quiz-attempts` - Save a quiz attempt
- `GET /api/quiz-attempts/user` - Get user's quiz history
- `GET /api/quiz-attempts/user/chapter/{chapterId}` - Get attempts for chapter

### User Progress (Protected)
- `GET /api/user-progress` - Get all progress records
- `GET /api/user-progress/topic/{topicId}` - Get progress for topic
- `PUT /api/user-progress/topic/{topicId}` - Update topic progress
- `GET /api/user-progress/mastered` - Get mastered topics (80%+)

### Quiz Batching (Protected - Phase 3b)
- `GET /api/batches/chapter/{chapterId}` - Get batches for chapter (NEW)
- `GET /api/batch-progress/user/{userId}` - Get user's batch progress (NEW)
- `POST /api/batch-progress` - Save batch completion (NEW)

---

## Development Workflow

**Creating New Content:**
1. Go to Admin Panel (⚙️ button)
2. Manage Periods → Create/edit periods
3. Manage Topics → Select period, create topics
4. Manage Chapters → Select topic, create chapters with markdown content
5. Manage Questions → Select chapter, bulk import or create individually

**Testing Quiz Flow:**
1. Sign in or sign up
2. Select Period → Topic → Chapter
3. Read content (markdown renders automatically)
4. Click "Start Quiz on [Chapter Name]"
5. Answer questions
6. View results with score
7. Check dashboard to see saved progress

---

## Performance Notes

- Questions randomize on each quiz attempt
- Answer options shuffle on each question display
- Chapter content loads via ReactMarkdown (client-side rendering)
- Quiz attempts save immediately to database
- No pagination yet (content grows as DB grows)

---

## Future Optimizations

1. Add database indexes (user_id, chapter_id, topic_id)
2. Implement query caching with Redis
3. Add pagination for question lists
4. Implement lazy loading for large content
5. Add service workers for offline support (mobile)
6. Batch processing for bulk imports

---

## Quick Commands

**Backend:**
```bash
cd backend
./gradlew bootRun  # Starts on http://localhost:8081
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev  # Starts on http://localhost:5173
```

**Database:**
- H2 Console: http://localhost:8081/h2-console
- Credentials: username=oggi, password=(empty)

---

## Git Workflow

**Current Branches:**
- `main` - Production-ready code
- `feature/phase-3a-gamification` - Phase 3a complete, ready to merge
- Previous: `feature/user-progress-tracking` - Merged to main

**Next Branch:**
- `feature/phase-3b-batching` - Starting Phase 3b

**Merge Strategy:**
- Feature branches → main via PR
- Commit often with clear messages
- Test thoroughly before merge

---

**Document Version**: 1.5
**Last Updated**: november 4, 2025
**Next Review**: After Phase 3b completion

---

## 🎯 Key Takeaways

1. **Phase 1 & 2 are solid** - Quizzes work, authentication secure, dashboard functional
2. **Phase 3a is complete** - Gamification working perfectly, point system accurate
3. **Retake prevention proven** - Users cannot farm points, button correctly disabled
4. **Ready for Phase 3b** - Quiz batching will improve learning structure
5. **Quality gates working** - 70% pass threshold, 80% mastery for batching

**Next focus**: Implement quiz batching to organize learning into 10-question batches with 80% mastery requirement