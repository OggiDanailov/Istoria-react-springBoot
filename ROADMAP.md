# Historical Quiz Application - Product Roadmap

**Last Updated**: October 24, 2025
**Current Phase**: Phase 2 Complete ✅ → Phase 3 - Gamification (Starting)

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

## Phase 3: Gamification & Advanced Point System (🚀 Starting)

**Status**: Design Complete, Implementation Starting

### Phase 3a: New Point Scoring System (1-2 hours)

**Goal**: Incentivize learning, not clicking. Penalize careless attempts.

**New Rules:**
1. **Pass (70%+ accuracy)**: Award full points (1/2/3 based on difficulty)
2. **Fail (50-69% accuracy)**: Award 0 points (no penalty)
3. **Fail (<50% accuracy)**: Deduct points (penalty for carelessness)
4. **Retakes**: No additional points if already passed, but can improve score
5. **Leaderboard**: Users won't farm points by repeating easy quizzes

**Implementation:**
- Modify QuizAttemptController to apply new scoring logic
- Store "has_passed" flag in UserProgress for each chapter
- Calculate points based on score bands before saving
- Block point awards on retakes of already-passed quizzes

**Database Change:**
- Add `hasPassed` boolean to UserProgress (or create separate table)

**Testing:**
- Take quiz: 75% → Get full points ✓
- Take quiz: 60% → Get 0 points ✓
- Take quiz: 40% → Lose points ✓
- Retake passed quiz: No new points ✓

**Timeline**: Oct 24 afternoon

---

### Phase 3b: Quiz Batching & Mastery System (2-3 hours)

**Goal**: Organize quizzes into 10-question batches with mastery thresholds.

**Features:**
1. Quiz batching (10 questions per batch)
2. 80% mastery threshold for batch completion
3. Can't move to next batch until current batch mastered
4. Retake system for failed batches
5. Progress tracking per batch

**Implementation:**
- Add `QuizBatch` entity (groups 10 questions)
- Add `BatchProgress` entity (tracks completion/mastery)
- Create BatchController endpoints
- Update Quiz.jsx to load batch questions
- Add UI for batch progress display

**Timeline**: Oct 24-25

---

### Phase 3c: Polish & Bug Fixes (1-2 hours)

**Outstanding Issues:**
- "Read about this topic" button navigation bug
  - Fix: Restructure navigation or remove feature
  - Deferred to Phase 4

- localStorage validation on app startup
  - Add check: if token exists but user not in DB, clear localStorage
  - Impact: Minor - only affects testing

**Timeline**: Oct 25

---

## Phase 4: Additional Features (Future)

- Fix "Read about this topic" anchor links
- localStorage validation
- Premium tier & Stripe payments
- Competitive mode with leaderboards
- Mobile app (React Native)
- Internationalization (5 languages)

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
- Quiz attempts now save only once (fixed useRef issue)
- Progress calculation working correctly
- Dashboard displaying all stats accurately
- All DEBUG logs removed
- Ready for Phase 3

**Oct 24 - Phase 3 Planning:**
- New point system: 70% threshold, negative points for <50%
- No retake bonuses (prevents farming)
- Quiz batching: 10 questions per batch
- Mastery: 80% accuracy required

**Outstanding Bugs:**
- "Read about this topic" shows "No reading material available yet"
  - Cause: Navigation state confusion during route changes
  - Workaround: Leave button but disable for now
  - Fix: Defer to Phase 4 (polish)

---

## Next Actions (Phase 3a - Today)

1. **Update QuizAttemptController**
   - Add logic to apply new point rules
   - Calculate points based on score bands
   - Check if chapter already passed

2. **Create ChapterProgress entity** (optional)
   - Track which chapters user has passed
   - Store best score per chapter

3. **Update Results.jsx**
   - Display new points earned
   - Show if user passed/failed
   - Show option to retake if failed

4. **Test thoroughly**
   - 75% score → Full points
   - 60% score → 0 points
   - 40% score → Negative points
   - Retake already-passed quiz → No points

5. **Commit Phase 3a**

---

## Success Metrics

**Phase 1**: ✅ Complete - Questions randomize, answers shuffle, quizzes work

**Phase 2**: ✅ Complete - Users register/login, attempts save, progress tracks, dashboard works

**Phase 3a (Today)**:
- [ ] New point system implemented
- [ ] Scoring logic correct (70% threshold)
- [ ] Retakes don't award points
- [ ] Negative points for <50% accuracy

**Phase 3b (Tomorrow)**:
- [ ] Quiz batching implemented
- [ ] 80% mastery threshold working
- [ ] Batch progress tracking
- [ ] Retake system for failed batches

---

## File Structure

```
backend/
├── model/
│   ├── User.java
│   ├── QuizAttempt.java
│   ├── UserProgress.java
│   └── ... (others)
├── controller/
│   ├── QuizAttemptController.java (UPDATED)
│   ├── UserProgressController.java
│   └── ... (others)
└── repository/
    ├── QuizAttemptRepository.java
    ├── UserProgressRepository.java
    └── ... (others)

frontend/
├── components/
│   ├── UserDashboard/
│   │   ├── UserDashboard.jsx
│   │   └── UserDashboard.css
│   ├── Results/
│   │   └── Results.jsx (FIXED)
│   └── ... (others)
└── config/
    └── api.js
```

---

## Key Decisions (Oct 24)

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
- Point system first (simpler)
- Then batching (builds on point system)
- Then polish
- Allows testing/adjustment before batching

---

## Known Issues & Technical Debt

**Current Issues:**
- "Read about this topic" button navigation bug
  - Deferred to Phase 4

- localStorage validation on app startup missing
  - Minor issue, affects testing only
  - Todo: Add check for invalid tokens on mount

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

---

**Ready to start Phase 3a!** 🚀
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

## Known Issues & Technical Debt

**Current Issues (Phase 2):**
- localStorage persists after database reset - users stay "logged in" with invalid tokens
  - Fix: Add token validation on app startup, clear localStorage if user not found
  - Impact: Minor - only affects dev/testing when DB is reset

- "Read about this topic" button shows "No reading material available yet"
  - Issue: Navigation state gets confused when routing back from results
  - Deferred to Phase 3 (polish features)

**Technical Debt:**
- No automated tests
- No CI/CD pipeline
- Database not indexed
- No logging/monitoring
- Bulk import doesn't validate JSON structure

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

---

## Document Version History

- **v1.0** (Oct 22): Initial comprehensive roadmap
- **v1.1** (Oct 23): Phase 1 completion update
- **v1.2** (Oct 23): Phase 2 in progress - authentication working, dashboard next

**Status**: Phase 2 Active - 40% Complete

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
- `feature/user-progress-tracking` - Phase 2 in progress
- Previous: `feature/chapter-based-quizzes` - Merged to main

**Next Branch:**
- `feature/user-dashboard` - Coming next

**Merge Strategy:**
- Feature branches → main via PR
- Commit often with clear messages
- Test thoroughly before merge

---

**Document Version**: 1.2
**Last Updated**: October 23, 2025 - 11:30 PM
**Next Review**: After Phase 2 completion (Oct 29-30)

---

## 🎯 Key Takeaways

1. **Phase 1 is complete and solid** - Randomization, shuffling, chapter-based quizzes all working
2. **Authentication is working** - Users can sign up/login and attempts save to DB
3. **Ready for Phase 2 UI** - Need to build dashboard to show users their progress
4. **Content is organized** - 6 chapters, 31 questions, properly distributed
5. **Architecture is clean** - Admin panel refactored, components well-organized

**Next focus**: Build user dashboard to complete Phase 2