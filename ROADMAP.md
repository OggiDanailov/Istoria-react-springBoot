# Historical Quiz Application - Product Roadmap

**Last Updated**: December 3, 2025
**Current Phase**: Phase 4a (Production Readiness - IN PROGRESS)
**Launch Strategy**: Path B - Polished Launch (Dec 15-20)
**Estimated Hours**: ~53 hours focused development

---

## 📊 Project Status Overview

### ✅ COMPLETED PHASES

| Phase | Status | Date |
|-------|--------|------|
| Phase 1: Core Quiz System | ✅ Complete | Oct 22 |
| Phase 2: Authentication & Progress | ✅ Complete | Oct 27 |
| Phase 3a: Gamification & Points | ✅ Complete | Oct 27 |
| Phase 3b: Quiz Batching | ✅ Complete | Nov 19 |
| Phase 3c: Polish & Fixes | ✅ Complete | Nov 19 |
| Phase 4a: Production Hardening | 🔄 IN PROGRESS | Nov 26 - Dec 5 |

---

## 🔴 Phase 4a: Production Hardening (IN PROGRESS)

### SESSION PROGRESS

**Session 1 (Nov 26)**: Database & Frontend Cleanup
- ✅ Flyway migrations setup
- ✅ Removed DEBUG logs from frontend

**Session 2 (Nov 28)**: Server-Side Security & Dashboard
- ✅ Server-side answer verification (prevents cheating)
- ✅ Multiple correct answers support
- ✅ Dashboard sync with real progress

**Session 3 (Nov 29)**: QuestionForm Enhancement
- ✅ Dynamic options (2-8 per question)
- ✅ Multiple correct answers in forms
- ✅ Batch auto-association
- ✅ End-to-end testing

**Session 4 (Dec 1)**: User Roles
- ✅ UserRole enum (PLAYER, TEACHER, ADMIN)
- ✅ Role-based access control
- ✅ JWT includes role claims

**Session 5 (Dec 2)**: Security Hardening - INPUT VALIDATION ✅
- ✅ Added spring-boot-starter-validation dependency
- ✅ Created validation annotations:
  - `@Email` - validates email format
  - `@NotBlank` - ensures fields aren't empty
  - `@Size` - enforces minimum length (8 chars for passwords)
- ✅ Applied `@Valid` to register & login endpoints
- ✅ Removed manual validation checks (Spring handles it)
- ✅ Tested: Invalid email → 400 rejected, Valid data → 201 accepted

**Session 6 (Dec 3)**: Password Security, Error Handling & Rate Limiting ✅
- ✅ Added `@Pattern` annotation for special character requirement
  - Passwords now require: 8+ chars + 1 special character
  - Tested: "ValidPassword" fails, "ValidPass@123" passes ✓
- ✅ Created `GlobalExceptionHandler` for clean error messages
  - Removes stack traces from responses (security!)
  - Returns user-friendly validation messages
  - Example: "password: Password must contain at least one special character"
- ✅ Password visibility toggle (eye icon) in SignUp form
  - Click eye to show/hide password
  - Same for confirm password field
  - Positioned INSIDE input field (right side) with CSS
- ✅ Frontend error formatting
  - Added ❌ emoji to error messages
  - Clean, user-friendly display
- ✅ **Rate limiting service implementation**
  - Created RateLimitService to track login attempts per email
  - Limited to 5 attempts per 15 minutes
  - Returns 429 Too Many Requests when exceeded
  - Resets counter on successful login
  - Frontend displays error message gracefully
- ✅ End-to-end testing - all features working!

**Key Achievement**: Authentication fully hardened with validation, special chars, error handling, and rate limiting!

---

## 🎯 CRITICAL REMAINING TASKS (Before Launch)

### LAUNCH STRATEGY: Path B - Polished Launch

**Why Path B?**
- First impression matters for user retention
- Design polish is hard to add retroactively
- Content depth is core value (history game = needs quality content)
- Realistic with focused development

**Realistic Timeline (Dec 3-20):**
- **Dec 3-5**: Security hardening + Admin CRUD + cleanup (8 hours) ✅ In Progress
- **Dec 6-10**: Design overhaul - paper aesthetic (20 hours)
- **Dec 10-12**: Content expansion - detailed Roman history (15 hours)
- **Dec 12-15**: Testing + bug fixes (10 hours)
- **Dec 15**: Launch! 🚀

---

### TASK PRIORITY (Next 2.5 weeks)

**Week 1 (Dec 3-5): Finish Phase 4a**
1. ✅ Security hardening (90% complete)
2. [ ] Admin CRUD frontend - Edit/Delete batches (1 hour)
3. [ ] Console.logs cleanup - Remove all debug logs (30 min)
4. [ ] Rate limiting MERGE

**Week 2 (Dec 6-10): Design Overhaul**
5. [ ] **Design system** - Paper-like aesthetic with wrinkled textures (8 hours)
   - Background: aged paper color
   - Cards: subtle wrinkled texture effect
   - Typography: serif fonts for historical feel
   - Color palette: warm, earthy tones
6. [ ] **Component redesign** - Apply new theme to all pages (12 hours)
   - Header/Nav refresh
   - Quiz cards styling
   - Dashboard layout
   - Admin panel theme
   - Forms styling

**Week 3 (Dec 10-12): Content Expansion**
7. [ ] **Roman history expansion** - Add detailed content (15 hours)
   - Expand current 30 questions
   - Add 20-30 new questions with research
   - Deepen chapter content with historical detail
   - Verify sources and accuracy
   - This is substantial work requiring historical knowledge

**Week 4 (Dec 12-15): Testing & Polish**
8. [ ] **Backend unit tests** - Test core logic (4 hours)
   - Answer verification
   - Point calculations
   - Mastery thresholds
   - Rate limiting
9. [ ] **Frontend tests** - Component testing (2 hours)
   - Quiz flow
   - Authentication
   - Dashboard rendering
10. [ ] **E2E testing** - Full user journeys (2 hours)
    - Registration → Quiz → Results → Progress
    - Admin operations
    - Error scenarios
11. [ ] **Bug fixes & polish** - Final tweaks (2 hours)

---

### 1. ✅ INPUT VALIDATION (COMPLETED Dec 2!)
**Status**: DONE
**What**: Email format validation + password minimum length (8 chars)

### 2. ✅ PASSWORD REQUIREMENTS (COMPLETED Dec 3!)
**Status**: DONE
**What**: Special character requirement, eye icon toggle, clean error messages

### 3. ✅ RATE LIMITING (COMPLETED Dec 3!)
**Status**: DONE
**What**:
- Created RateLimitService to track login attempts per email
- Limited to 5 attempts per 15 minutes
- Returns 429 Too Many Requests when exceeded
- Resets counter on successful login
- Frontend displays error gracefully with emoji

### 4. 🔄 ADMIN CRUD FRONTEND (NEXT - Dec 3)
**Status**: TODO
**Estimated Time**: 1 hour
**What to do**:
- Add Edit button to batch items
- Add Delete button with confirmation modal
- Add edit form for batch details
- Wire up to backend endpoints (already implemented)

### 5. 🔄 CONSOLE.LOGS CLEANUP (NEXT - Dec 3)
**Status**: TODO
**Estimated Time**: 30 min
**What to do**:
- Remove all `console.log()` from React components
- Remove all `console.error()` that aren't critical
- Leave only error logging for debugging

### 6. 🔄 DESIGN OVERHAUL (NEXT - Dec 6)
**Status**: TODO
**Estimated Time**: 20 hours
**What to do**:
- Create paper-like aesthetic
- Add wrinkled texture effects
- Implement warm, earthy color palette
- Apply to all components
- **This requires significant CSS/design work**

### 7. 🔄 CONTENT EXPANSION (NEXT - Dec 10)
**Status**: TODO
**Estimated Time**: 15 hours
**What to do**:
- Expand Roman history content
- Add 20-30 new detailed questions
- Research historical accuracy
- Add depth to chapter reading material
- **This is content/research work, not code**

### 8. 🔄 UNIT TESTS - BACKEND (NEXT - Dec 12)
**Status**: TODO
**Estimated Time**: 4 hours
**What to do**:
- Test answer verification logic
- Test point calculations (all scenarios)
- Test mastery thresholds
- Test rate limiting
- Test user authentication flow

### 9. 🔄 UNIT TESTS - FRONTEND (NEXT - Dec 12)
**Status**: TODO
**Estimated Time**: 2 hours
**What to do**:
- Test Quiz component flow
- Test SignIn/SignUp validation
- Test Dashboard data display
- Mock API calls for testing

### 10. 🔄 E2E TESTING (NEXT - Dec 12)
**Status**: TODO
**Estimated Time**: 2 hours
**What to do**:
- Full user registration flow
- Quiz attempt → Results → Progress tracking
- Admin batch management
- Error scenarios

**Why**: Better security + better UX (don't kick users out)

---

### 5. ❌ ERROR HANDLING
**Status**: TODO
**Estimated Time**: 1 hour
**What to do**:
- Replace generic `RuntimeException` with specific ones
- Never expose stack traces to frontend
- Return user-friendly error messages
- Proper HTTP status codes (400, 401, 403, 404, 500)

---

## 🟡 IMPORTANT (After Security)

### 6. ❌ ADMIN PANEL FULL CRUD
**Status**: TODO
**Estimated Time**: 1-2 hours
**What**: Can currently only CREATE batches. Need to ADD:
- UPDATE batch (edit description, difficulty, order)
- DELETE batch (with confirmation modal)

---

### 7. ⚠️ OPTION SHUFFLING RE-ENABLE
**Status**: TODO
**Estimated Time**: 1-2 hours
**What**: Currently disabled to prevent index mismatch
- Create shuffled index → original index mapping
- User selects shuffled → convert to original before sending
- Backend receives original index for verification

---

### 8. ❌ UNIT & INTEGRATION TESTS
**Status**: TODO
**Estimated Time**: 4-5 hours
**What**:
- Test answer verification logic
- Test mastery thresholds (80% pass, 79% fail)
- Test point calculations
- Test batch progression

---

## 📅 RECOMMENDED SCHEDULE

**TODAY (Dec 2)**: ✅ Input Validation - DONE!

**TOMORROW (Dec 3)**:
1. Password special characters (30 min)
2. Rate limiting (1 hour)
3. Error handling improvements (1 hour)
4. ~2.5 hours total

**Dec 4-5**:
1. Refresh token implementation (1.5 hours)
2. Admin CRUD completion (1.5 hours)
3. Testing & verification (1 hour)

**Dec 5-10**: Final testing, launch prep

---

## ✨ What's Already Working (No Touch Needed)

✅ Core quiz system (30 questions, Easy/Medium/Hard batches)
✅ User authentication (JWT with BCrypt)
✅ Gamification (point system with mastery thresholds)
✅ Server-side answer verification (prevents cheating)
✅ Quiz batching (sequential unlocking with 80% mastery)
✅ Input validation (email format, password length, special chars)
✅ Rate limiting (5 attempts per 15 minutes on login)
✅ Error handling (clean messages, no stack traces)
✅ Password visibility toggle (eye icon in forms)
✅ Database persistence (Flyway migrations)
✅ Dashboard (real-time progress tracking)
✅ Admin panel (content creation with multiple answers)

---

## 🏗️ Architecture

**Backend**: Spring Boot 3.5.5 + JPA/Hibernate + H2/PostgreSQL
**Frontend**: React + Vite
**Authentication**: JWT + BCrypt + Spring Security
**Validation**: Jakarta Bean Validation
**Database**: Flyway migrations (v3 schema)

---

## 📋 Phase 5: Future Enhancements (Post-Launch)

### Nice-to-Have Features
- [ ] **Email verification** (confirm user owns email address)
  - Send verification email on registration
  - Require email confirmation before account activation
  - Prevents fake/typo emails
  - **Estimated**: 2-3 hours (needs email service like SendGrid)
  - **Priority**: Medium - data quality improvement

- [ ] Refresh token implementation
- [ ] Rate limiting on login endpoints
- [ ] Admin panel CRUD for batches
- [ ] Re-enable option shuffling
- [ ] Unit & integration tests
- [ ] Database indexing

---

## 🚀 Today's Session Summary (Dec 3 - Final)

### ✅ COMPLETED TODAY:
1. Special character requirement for passwords (@Pattern)
2. Password visibility toggle (eye icon in SignUp form)
3. GlobalExceptionHandler for clean error messages
4. Frontend error formatting with emoji
5. Eye icon positioned inside input field with CSS
6. Rate limiting service - 5 attempts per 15 minutes on login
7. Rate limit error handling on frontend
8. **Backend Admin CRUD** - UPDATE and DELETE endpoints for batches
9. UpdateBatchRequest DTO
10. Decided on Path B: Polished Launch (Dec 15-20)

### 🔄 NEXT SESSION PRIORITIES (Dec 3-5):
1. Merge rate limiting changes
2. Admin CRUD frontend - Edit/Delete UI
3. Console.logs cleanup
4. Begin design system planning

### 📊 PROJECT STATUS:
- **Phase 4a Progress**: 92% complete (security hardening done)
- **Phase 4b**: Design & Content (Dec 6-12)
- **Phase 4c**: Testing & Launch Prep (Dec 12-15)

---

**Document Version**: 2.7
**Status**: Major decision made! Path B chosen for polished launch.
**Confidence Level**: 🟢 On track for Dec 15-20 launch with quality!
**Next Milestone**: Admin CRUD frontend + cleanup (Dec 3-5)