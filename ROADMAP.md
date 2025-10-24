# Historical Quiz Application - Product Roadmap

**Last Updated**: October 23, 2025
**Current Phase**: Phase 2 - User Authentication & Progress Tracking (In Progress)

---

## Phase 1: Core Foundation (✅ 100% Complete)

**Completed Milestones:**
- ✅ Chapter-based quiz architecture (Period → Topic → Chapter → Question)
- ✅ 6 chapters for Paleolithic Era with 31 questions distributed
- ✅ Question randomization per attempt
- ✅ Answer option shuffling (Fisher-Yates algorithm)
- ✅ Difficulty levels (1/2/3 points instead of 10/20/30)
- ✅ Text references linking questions to reading sections
- ✅ Bulk import endpoint for questions (`POST /api/chapters/{chapterId}/questions`)
- ✅ Admin panel refactoring (clean component structure)
- ✅ Form components organized in folders (TopicForm/, QuestionForm/, etc.)
- ✅ Markdown rendering with react-markdown
- ✅ Reading material with chapter selection
- ✅ Results screen with score calculation
- ✅ Quiz attempt saving (database integration)

**How to Verify Phase 1:**
1. Go to Prehistory → Paleolithic Era
2. Select a chapter (e.g., "Introduction to the Old Stone Age")
3. Click "Start Quiz"
4. Verify: Questions load in random order
5. Answer questions and see results
6. Take the same quiz again - questions should be in different order

---

## Phase 2: User Authentication & Progress Tracking (🔄 In Progress)

**Current Status**: Core authentication working, now building dashboard

**Completed in Phase 2:**
- ✅ User entity with password hashing (BCrypt)
- ✅ JWT token generation and validation
- ✅ SignUp and SignIn components
- ✅ JwtAuthenticationFilter for request validation
- ✅ QuizAttempt entity (tracks individual quiz attempts)
- ✅ UserProgress entity (tracks progress per topic)
- ✅ QuizAttemptController endpoints
- ✅ UserProgressController endpoints
- ✅ Quiz attempt saving to database (only logged-in users)
- ✅ Token persistence in localStorage
- ✅ User context display in header

**Currently Working On:**
- 🔄 User dashboard component (display progress, history, stats)
- 🔄 Protected routes implementation
- 🔄 Progress display per chapter/topic

**Next Steps:**
1. Create user dashboard component
2. Add navigation to dashboard from main menu
3. Display user's quiz history
4. Show progress per topic (accuracy %, total points)
5. Display mastered topics (80%+ accuracy)
6. Test end-to-end user flow

**Backend Changes Made:**
- New `users` table (id, username, email, password_hash, account_type, premium_expiry_date)
- New `quiz_attempts` table (id, user_id, chapter_id, score, total_questions, total_points, attempt_date)
- New `user_progress` table (id, user_id, topic_id, total_points, questions_answered, questions_correct, last_studied)

**Frontend Changes Made:**
- SignUp/SignIn components with form validation
- Token storage and retrieval
- User email display in header
- Logout functionality
- Results component saves attempts to database

**Timeline:**
- Started: October 23, 2025
- Expected Completion: October 29-30, 2025
- Dashboard Build: Oct 25-27
- Testing & Polish: Oct 28-29

---

## Phase 3: Quiz Features & Mastery Tracking (Future)

**Planned Features:**
1. Quiz batching (10 questions per batch)
2. 80% mastery threshold
3. Retake system for failed batches
4. Quiz history with attempt details
5. Performance analytics by topic

**Timeline**: After Phase 2 completion (~early November)

---

## Technical Architecture

### Backend Stack
- **Framework**: Spring Boot 3.5.5 (Java 21)
- **ORM**: Spring Data JPA / Hibernate
- **Database**: H2 (dev), PostgreSQL (prod)
- **Authentication**: JWT + BCrypt
- **API**: RESTful

### Frontend Stack
- **Framework**: React + Vite
- **Rendering**: react-markdown for markdown content
- **State Management**: React hooks (useState, useEffect)
- **Styling**: CSS3

### Database Schema (Current)
```
periods (id, title, description)
    └── topics (id, title, description, period_id)
        └── chapters (id, title, content, topic_id)
            └── questions (id, question, difficulty, text_reference, chapter_id)
                └── question_options (question_id, option)

users (id, email, password_hash, account_type, created_at)
    ├── quiz_attempts (id, user_id, chapter_id, score, total_questions, total_points, attempt_date)
    └── user_progress (id, user_id, topic_id, total_points, questions_answered, questions_correct, last_studied)
```

---

## Known Issues & Deferred Tasks

**Known Issues:**
- Markdown anchor links partially working (will fix with remark plugin later)
  - Questions reference sections that may not be in their chapter
  - Need to reorganize content and questions for proper anchor alignment
  - Deferred to future content expansion phase

**Technical Debt:**
- No automated tests (unit/integration)
- No CI/CD pipeline
- Database not indexed for production
- No logging/monitoring system
- Bulk import doesn't read `chapterId` from JSON (always uses selected chapter)

**Deferred Features (Not Critical for MVP):**
- Multiple correct answers per question
- More than 4 answer options
- Question randomization backend endpoint (using Collections.shuffle())
- Markdown anchor ID cleanup with remark plugins

---

## Recent Decisions

**Decision 18: Chapter-Based Quizzes**
- Each chapter has its own set of questions
- Users select chapter → see content → take quiz for that chapter
- Better UX than topic-wide quizzes, more granular progress tracking

**Decision 19: 1/2/3 Point System**
- Changed from 10/20/30 to keep scoring simple
- Easy (1pt), Medium (2pts), Hard (3pts)
- More intuitive for users

**Decision 20: Defer Anchor Links**
- Markdown anchor links work but need content reorganization
- Current system functional for navigation
- Proper fix requires remark plugin + content refactoring
- Low priority, can fix later

**Decision 21: User Dashboard After Authentication**
- Building dashboard before moving to Phase 3
- Users need to see their progress to understand system value
- Foundation for all future progress tracking features

---

## Bulk Import Format (Updated)

**Current JSON Format for Bulk Import:**

```json
{
  "chapterId": 7,
  "questions": [
    {
      "question": "When did the Paleolithic Era begin?",
      "options": ["2.6 million years ago", "10,000 BCE", "1 million years ago", "500,000 years ago"],
      "correctAnswer": 0,
      "difficulty": 1,
      "textReference": "#introduction-to-the-old-stone-age"
    }
  ]
}
```

**Steps to Import:**
1. Go to Admin → Bulk Import Questions
2. Select the target chapter
3. Paste JSON (use correct `chapterId`)
4. Click "Import"

**Note**: Each import goes to one chapter. To distribute across multiple chapters, import 6 separate JSON files.

---

## Success Criteria

### Phase 1 ✅ COMPLETE
- [x] Randomization working
- [x] Answer shuffling working
- [x] Text references functional
- [x] Chapter-based architecture
- [x] 31 questions distributed across 6 chapters

## Phase 2: User Authentication & Progress Tracking (🔄 70% Complete)

**Completed:**
- ✅ User registration/login with JWT
- ✅ User entity with password hashing
- ✅ QuizAttempt entity and repository
- ✅ UserProgress entity (structure ready)
- ✅ QuizAttemptController endpoints
- ✅ Quiz attempt saving to database
- ✅ UserDashboard component UI
- ✅ Dashboard navigation (header button)
- ✅ Quiz history display (recent 10 attempts)
- ✅ Statistics cards (quizzes taken, total points)
- ✅ Fixed navigation flow: Period → Topic → Reading → Quiz
- ✅ Fixed Results.jsx to pass isLoggedIn prop

**Working Now:**
- Quiz attempts save correctly (201 status)
- Dashboard displays quiz history with scores
- Recent attempts show accurate data
- User can see all their quiz attempts

**Remaining for Phase 2 Completion:**
1. Create UserProgressController
   - Calculate accuracy per topic
   - Track total points per topic
   - Track questions answered/correct per topic

2. Implement progress calculation logic
   - After quiz saved, calculate/update user_progress
   - Aggregate stats by topic

3. Update dashboard to display progress
   - Show progress bar per topic
   - Display mastery status (80%+)
   - Show accuracy percentage per topic

4. Test end-to-end flow
   - Take quiz → Attempt saves → Progress calculates → Dashboard updates

**Timeline:**
- Started: Oct 23, 2025
- Dashboard UI: Oct 23 ✅
- Progress calculation: Oct 24 (next session)
- Expected Phase 2 completion: Oct 24-25

**Key Files:**
- `UserDashboard.jsx` - UI component complete
- `QuizAttemptController.java` - Saving attempts working
- `Results.jsx` - Fixed to pass isLoggedIn
- `App.jsx` - Fixed navigation flow

### Phase 3 (Future)
- [ ] Quiz batching (10 questions)
- [ ] 80% mastery threshold
- [ ] Retake system
- [ ] Performance analytics

---

## Next Session Priorities

1. **Create User Dashboard Component**
   - Display user email/account info
   - Show total points earned
   - List quiz attempts with scores
   - Show progress per topic (accuracy %)
   - Highlight mastered topics (80%+)

2. **Add Dashboard Navigation**
   - Add "Dashboard" button in header (for logged-in users)
   - Create dashboard route in App.jsx

3. **Test End-to-End Flow**
   - Sign up new user
   - Take a quiz
   - Verify attempt saves
   - Check dashboard shows progress

4. **Polish & Bug Fixes**
   - Add loading states
   - Error handling
   - Responsive design

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