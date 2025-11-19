# Historical Quiz Application - Product Roadmap

**Last Updated**: November 19, 2025
**Current Phase**: Phase 3c ✅ COMPLETE → Phase 4a (Production Readiness - Starting)

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

## Phase 3: Gamification & Advanced Point System (✅ COMPLETE)

**Status**: All Phases Complete - Ready for Phase 4

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

**Code Changes:**
- `QuizAttemptController.java` line 84: Fixed deduction calculation
- All gamification rules implemented in `calculatePointsToAward()` method

**Test Results (Oct 27):**
- ✅ Quiz 1: 0% accuracy → **-6 points** (deduct half of 12)
- ✅ Quiz 2: 100% accuracy → **+12 points** (full reward, no previous pass)
- ✅ Button disabled after first pass
- ✅ Point calculation: -6 + 12 = **6 total points** ✅
- ✅ Dashboard displays correct totals

**Timeline**: Oct 24-27 (Completed)

---

### Phase 3b: Quiz Batching & Mastery System (✅ COMPLETE)

**Status**: ✅ Completed (Nov 19)

**Completed Features:**
- ✅ AdminBatches component created and integrated into Admin panel
- ✅ Batch creation by difficulty (Easy/Medium/Hard) and order (1, 2, 3)
- ✅ Question assignment UI with checkboxes
- ✅ Duplicate prevention - disabled questions already in batches
- ✅ Visual indicators (gray background) for used questions
- ✅ BatchController endpoints (create, get, update batch progress)
- ✅ QuizBatch and BatchProgress entities with mastery calculations
- ✅ Batches integrated into Quiz.jsx (load batch questions)
- ✅ **80% mastery threshold enforcement** - working perfectly
- ✅ **Batch progression logic** - can't advance without 80% accuracy
- ✅ BatchProgress UI showing mastery status and attempt tracking
- ✅ Retake system for all batches (no duplicate points)
- ✅ Visual batch progress indicator in ReadingMaterial (🔒/🔓 locks)
- ✅ Sequential unlocking - must master previous batch first
- ✅ Comprehensive test data (30 questions, 3 difficulty levels)

**Timeline**: Oct 28 - Nov 19, 2025 (Completed)

---

### Phase 3c: Polish & Bug Fixes (✅ COMPLETE)

**Status**: ✅ Completed (Nov 19)

**Fixes Applied:**
- ✅ Dashboard points calculation fixed
  - Issue: Was summing `p.totalPoints` from progress instead of `attempt.pointsAwarded` from attempts
  - Solution: Changed `calculateTotalPoints()` to use attempts array
  - Result: Dashboard now correctly shows 74 total points ✅

- ✅ SignIn/SignUp navigation fixed
  - Issue: Anchor links `<a href="#signup">` didn't switch views
  - Solution: Added button handlers `onSwitchToSignUp` and `onSwitchToSignIn`
  - Result: Auth modal navigation now works smoothly ✅

**Timeline**: Nov 19, 2025 (COMPLETE)

---

## Phase 4: Production Readiness & Beyond

### Phase 4a: Production Readiness Audit (⏳ STARTING)

**Status**: Not Started

**Goal**: Harden security, improve code quality, add tests, prepare for live deployment

#### 🔴 CRITICAL (Before Launch)

1. **Server-side Answer Verification** (HIGH PRIORITY)
   - [ ] Modify `QuizAttemptRequest` to accept `userAnswers[]` instead of pre-calculated score
   - [ ] Add answer verification logic in `QuizAttemptController`
   - [ ] Frontend sends only answers, backend calculates true score
   - [ ] Prevents users from cheating via DevTools manipulation
   - Estimated: 1-2 hours

2. **Remove DEBUG Logs & Add Proper Logging**
   - [ ] Remove all `System.out.println()` statements
   - [ ] Add SLF4J + Logback logging framework
   - [ ] Log important events (login, quiz attempts, errors)
   - Estimated: 1 hour

3. **Security Hardening**
   - [ ] JWT token expiration & refresh token handling
   - [ ] CORS configuration review
   - [ ] Input validation on all endpoints (@Valid annotations)
   - [ ] Password requirements enforcement
   - [ ] Rate limiting on auth endpoints (prevent brute force)
   - [ ] SQL injection prevention audit
   - Estimated: 2-3 hours

4. **Error Handling & User Feedback**
   - [ ] Replace generic RuntimeException with specific exceptions
   - [ ] User-friendly error messages (no stack traces)
   - [ ] Proper HTTP status codes
   - [ ] Frontend error boundaries (catch React errors)
   - Estimated: 1-2 hours

#### 🟡 IMPORTANT (Strongly Recommended)

5. **Unit & Integration Tests**
   - [ ] Unit tests for `calculatePointsToAward()` method
   - [ ] Unit tests for mastery threshold checks (80%)
   - [ ] Integration tests for full quiz flow
   - [ ] Test answer verification logic
   - Estimated: 4 hours

6. **UX Improvements**
   - [✅] localStorage validation on startup (clear dead tokens)
   - [ ] Chapter-level progress display (granular tracking per chapter)
   - [✅] Better loading states and skeletons
   - [ ] Confirmation dialogs for destructive actions
   - Estimated: 2-3 hours

7. **Database & Performance**
   - [ ] Add indexes on `user_id`, `chapter_id`, `topic_id`
   - [ ] Review query performance (check for N+1 queries)
   - [ ] Add pagination to GET endpoints
   - Estimated: 1 hour

#### 🟢 NICE-TO-HAVE (After Launch)

8. **Admin Panel Polish**
   - [ ] Pagination for large question lists
   - [ ] Search/filter for questions
   - [ ] Bulk edit functionality
   - [ ] Export quiz data (CSV/JSON)
   - Estimated: 2-3 hours

9. **Documentation**
   - [ ] API documentation (Swagger/OpenAPI)
   - [ ] Setup & deployment guides
   - [ ] Database schema diagram
   - Estimated: 2 hours

10. **Code Quality**
    - [ ] Add Javadoc comments to public methods
    - [ ] Create DTOs for API responses
    - [ ] Remove console.log() from frontend
    - [ ] Code review & refactoring
    - Estimated: 2-3 hours

**Timeline**: 2-3 weeks (focusing on 🔴 CRITICAL first, then 🟡 IMPORTANT)

**Success Criteria:**
- ✅ All critical security issues fixed
- ✅ Answer verification working server-side
- ✅ Unit & integration tests passing
- ✅ No DEBUG logs in production code
- ✅ App ready for live deployment

---

### Phase 4b: Database & Deployment (Future)

**Planned For**: After Phase 4a

- PostgreSQL migration (from H2)
- Environment configuration (dev/prod)
- Docker setup
- Deployment pipeline
- SSL/HTTPS setup

---

### Phase 4c: Analytics & Monitoring (Future)

**Planned For**: Post-launch

- Error tracking (Sentry)
- Performance monitoring
- User analytics
- Feedback collection

---

### Phase 4d: Native Mobile App (Future)

**Planned For**: After collecting user feedback from web version

- React Native implementation
- Downloadable app (iOS/Android)
- Offline support
- Push notifications

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

## Next Actions (Phase 4a - Production Readiness)

### Week 1: Security & Refactoring
1. Implement server-side answer verification
2. Remove DEBUG logs, add proper logging
3. Security hardening (validation, JWT, rate limiting)

### Week 2: Testing & UX
4. Write unit tests for gamification
5. Write integration tests for quiz flow
6. localStorage validation + chapter-level progress

### Week 3: Polish
7. Database indexing
8. Admin panel improvements
9. Final manual testing

---

## Success Metrics

**Phase 1**: ✅ Complete - Questions randomize, answers shuffle, quizzes work

**Phase 2**: ✅ Complete - Users register/login, attempts save, progress tracks, dashboard works

**Phase 3a**: ✅ Complete (Oct 27)
- ✅ New point system implemented
- ✅ Scoring logic correct (70% threshold)
- ✅ Retakes blocked after passing
- ✅ Negative points for <50% accuracy
- ✅ All calculations verified

**Phase 3b**: ✅ Complete (Nov 19)
- ✅ Quiz batching implemented
- ✅ 80% mastery threshold working
- ✅ Batch progress tracking
- ✅ Retake system for failed batches
- ✅ Visual progress indicators

**Phase 3c**: ✅ Complete (Nov 19)
- ✅ Dashboard points display fixed
- ✅ SignIn/SignUp navigation fixed
- ✅ App fully polished for Phase 4

**Phase 4a** (Starting):
- [ ] Server-side answer verification
- [ ] Security hardening complete
- [ ] Unit & integration tests passing
- [ ] Production-ready code

---

## Session Notes

**Oct 24 - Phase 2 Completion:**
- Quiz attempts save only once (fixed useRef issue)
- Progress calculation working correctly
- Dashboard displaying all stats accurately

**Oct 27 - Phase 3a Completion:**
- ✅ Retake prevention bug fixed
- ✅ Negative points correctly applied
- ✅ Point calculation verified: -6 + 12 = 6 total points

**Nov 17-19 - Phase 3b & 3c Completion:**
- ✅ Quiz batching fully implemented
- ✅ Dashboard points calculation fixed
- ✅ Auth navigation fixed
- ✅ App ready for Phase 4 production hardening

---

## File Structure

```
backend/
├── model/
│   ├── User.java
│   ├── QuizAttempt.java
│   ├── UserProgress.java
│   ├── QuizBatch.java
│   ├── BatchProgress.java
│   └── ... (others)
├── controller/
│   ├── QuizAttemptController.java
│   ├── UserProgressController.java
│   ├── BatchController.java
│   └── ... (others)
└── repository/
    ├── QuizAttemptRepository.java
    ├── UserProgressRepository.java
    ├── QuizBatchRepository.java
    ├── BatchProgressRepository.java
    └── ... (others)

frontend/
├── components/
│   ├── UserDashboard/
│   │   ├── UserDashboard.jsx
│   │   └── UserDashboard.css
│   ├── Results/
│   │   └── Results.jsx
│   ├── Quiz/
│   │   └── Quiz.jsx
│   ├── ReadingMaterial/
│   │   └── ReadingMaterial.jsx
│   └── ... (others)
└── config/
    └── api.js
```

---

## Key Decisions

**Decision 27: Deduction calculation** (Oct 27)
- Use `request.getTotalPoints()` not `request.getScore()`
- Deduct half of total possible points
- Example: 0% on 12-point quiz = -6 (half of 12)

**Decision 28: Phase priority** (Nov 19)
- Focus on desktop-ready app before mobile
- Get real user feedback before React Native
- Harden security before production launch

**Decision 29: Answer verification** (Nov 19)
- Move answer verification to backend
- Frontend sends only answers, not calculated score
- Prevents cheating via DevTools manipulation

---

## Known Issues & Technical Debt

**Fixed Issues:**
- ✅ Retake prevention bug → FIXED (Oct 27)
- ✅ Dashboard points calculation → FIXED (Nov 19)
- ✅ Auth modal navigation → FIXED (Nov 19)

**Technical Debt (Phase 4a):**
- [ ] No automated tests (add in Phase 4a)
- [ ] No CI/CD pipeline (add in Phase 4b)
- [ ] Database not indexed (add in Phase 4a)
- [ ] No logging/monitoring (add in Phase 4c)

---

## Document Version History

- **v1.0** (Oct 22): Initial comprehensive roadmap
- **v1.1** (Oct 23): Phase 1 completion, Phase 2 in progress
- **v1.2** (Oct 24 AM): Phase 2 in progress with dashboard
- **v1.3** (Oct 24 PM): **Phase 2 COMPLETE**, Phase 3 planning
- **v1.4** (Oct 27): **Phase 3a COMPLETE**, Phase 3b ready to start
- **v1.5** (Nov 4): Phase 3b in progress
- **v1.6** (Nov 19): **Phase 3b & 3c COMPLETE**, Phase 4a detailed plan
- **v1.7** (Nov 19): Production readiness audit added to roadmap

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

### Quiz Batching (Protected)
- `GET /api/batches/chapter/{chapterId}` - Get batches for chapter
- `GET /api/batch-progress/user/{userId}` - Get user's batch progress
- `POST /api/batch-progress` - Save batch completion

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
- `update/bugs-polishing-phase3` - Phase 3 complete, Phase 4 starting

**Merge Strategy:**
- Feature branches → main via PR
- Commit often with clear messages
- Test thoroughly before merge

---

**Document Version**: 1.7
**Last Updated**: November 19, 2025
**Next Review**: After Phase 4a completion (2-3 weeks)

---

## 🎯 Key Takeaways

1. **Phases 1-3 Complete** ✅ - Core functionality solid, batching working, gamification proven
2. **Phase 4a Ready** ⏳ - Security hardening, testing, documentation needed before launch
3. **Desktop First** 🖥️ - Get feedback on web version before building React Native app
4. **Answer Verification Critical** 🔒 - Move to backend to prevent cheating
5. **Production-Ready Path Clear** 🚀 - 2-3 weeks of Phase 4a work, then go live

**Next focus**: Start Phase 4a with server-side answer verification to secure the gamification system