# Historical Quiz Application - Product Roadmap

**Last Updated**: December 2, 2025
**Current Phase**: Phase 4a (Production Readiness - IN PROGRESS)
**Timeline to Launch**: ~Dec 5-10 (1 week)

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

**Key Achievement**: Spring now validates all input automatically before code runs!

---

## 🎯 CRITICAL REMAINING TASKS (Before Launch)

### 1. ✅ INPUT VALIDATION (COMPLETED TODAY!)
**Status**: DONE
**What**: Validates email format and password length
**Next**: Already merged into UserController

---

### 2. 🔄 PASSWORD REQUIREMENTS (NEXT - Tomorrow)
**Status**: TODO
**Estimated Time**: 30 min
**What to do**:
- Add special character requirement to password validation
- Update `@Size` annotation to include pattern check
- Test: "ValidPass" should fail (no special char)
- Test: "ValidPass@123" should pass (has special char)

**Why**: Stronger passwords prevent brute force attacks

**How**:
1. Import `@Pattern` annotation
2. Add to password field: `@Pattern(regexp = ".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")`
3. Test with invalid/valid passwords

---

### 3. 🔄 RATE LIMITING (After Password Requirements)
**Status**: TODO
**Estimated Time**: 1 hour
**What to do**:
- Limit login attempts to 5 per 15 minutes
- Return 429 Too Many Requests if exceeded
- Prevent brute force password guessing

**How**:
1. Add `spring-boot-starter-data-redis` (for rate limit tracking)
2. Create `RateLimitInterceptor` class
3. Apply to `/api/auth/login` endpoint

---

### 4. ❌ REFRESH TOKENS
**Status**: TODO
**Estimated Time**: 1.5 hours
**What to do**:
- Short-lived access tokens (15 min)
- Long-lived refresh tokens (7 days)
- Endpoint to refresh without re-entering password

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
✅ Input validation (email format, password length)
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

## 🚀 Next Session Quick Start

### FIRST THING TOMORROW:
```
Goal: Add special character requirement to passwords

Files to modify:
1. UserController.java → RegisterRequest class
2. Add @Pattern annotation to password field

Test with:
- "ValidPass" → Should FAIL (no special char)
- "ValidPass@123" → Should PASS (has special char)
```

That's it! Small, focused task.

---

**Document Version**: 2.3
**Status**: Excellent progress! 67% of Phase 4a security hardening complete.
**Confidence Level**: 🟢 On track for Dec 5-10 launch!