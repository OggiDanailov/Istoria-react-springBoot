# Historical Quiz Application - Product Roadmap & Technical Specifications

## 📖 Project Vision

A comprehensive historical education platform where users can read curated historical content and test their knowledge through quizzes. The app will feature multiple historical periods, gamification elements, competitive modes, and multi-language support.

---

## 🎯 Core Concept

### Application Purpose
An interactive learning platform focused on world history, combining reading materials with assessment quizzes. Users can learn at their own pace (free tier) or track progress and compete for prizes (premium tier).

### Target Audience
- History enthusiasts
- Students preparing for exams
- Competitive learners
- International audience (multi-language support)

---

## 📊 Data Model Hierarchy

```
Period (Prehistory, Antiquity, Medieval Europe, etc.)
  └── Topic (Neolithic, Ancient Greece, Ancient Rome, etc.)
      └── Chapter (Roman Kingdom, Roman Republic, etc.)
          └── Question (Multiple choice with 4 options)
```

### Important Design Decisions

**No Subchapter Entity**: Chapters contain one continuous reading material with HTML structure (H2/H3 headings) for organization. This keeps the data model simple while maintaining content structure.

**Questions Link to Text**: Each question has a `textReference` field (anchor link) pointing to the relevant section in the reading material. When users answer incorrectly, they can click to read the related content.

**Example Structure:**
```
Topic: Ancient Rome
├── Reading Material (one continuous document)
│   ├── Chapter 1: Roman Kingdom (H2)
│   │   ├── Foundation of Rome (H3) #roman-kingdom-foundation
│   │   └── The Seven Kings (H3) #seven-kings
│   ├── Chapter 2: Roman Republic (H2)
│   │   ├── Early Republic (H3) #early-republic
│   │   └── Sulla's Dictatorship (H3) #sulla-dictatorship
│   └── ... continues
└── Questions
    ├── Q1: "Who was the first king?" → textReference: "#seven-kings"
    ├── Q2: "When was Rome founded?" → textReference: "#roman-kingdom-foundation"
    └── ...
```

---

## 🏗️ Technical Architecture

### Backend
- **Framework**: Spring Boot (Java)
- **Database**: PostgreSQL (production), H2 (development)
- **API**: RESTful
- **Authentication**: JWT tokens (Phase 2)
- **Payment**: Stripe integration (Phase 2)

### Frontend
- **Web**: React + Vite
- **Mobile**: React Native + Expo (Phase 4)
- **Styling**: CSS3
- **State Management**: React hooks (useState, useContext for later)
- **Internationalization**: react-i18next (Phase 5)

### Key Libraries & Tools
- Spring Data JPA (backend queries)
- Papaparse (CSV imports for bulk questions)
- Stripe SDK (payments)
- React Navigation (mobile routing)

---

## 🎮 Feature Breakdown

### 1. Reading Material System

**Current Implementation:**
- One continuous document per topic
- Uses H2/H3 HTML headings for structure
- Scrollable, free navigation
- No separate pages per chapter

**User Experience:**
- Users can read entire topic history in one flow
- Can jump to specific sections via table of contents
- Can search within the text
- Mobile-friendly reading experience

**Technical Details:**
```java
// Chapter model
@Entity
public class Chapter {
    private Long id;
    private String title;
    @Column(length = 10000)
    private String content; // HTML content with <h2>, <h3> tags
    private Topic topic;
    private List<Question> questions;
}
```

```jsx
// Frontend rendering
<div className="reading-content">
    <h2 id="roman-kingdom">Roman Kingdom</h2>
    <h3 id="foundation">Foundation of Rome</h3>
    <p>Content about foundation...</p>
    <h3 id="seven-kings">The Seven Kings</h3>
    <p>Content about the kings...</p>
</div>
```

---

### 2. Quiz System with Difficulty Levels

**Question Difficulty:**
- **Level 1 (Easy)**: 10 points - Basic facts, dates, names
- **Level 2 (Medium)**: 20 points - Understanding concepts, connections
- **Level 3 (Hard)**: 30 points - Analysis, complex scenarios

**Database Schema Update:**
```java
@Entity
public class Question {
    private Long id;
    private String question;
    private List<String> options; // 4 options
    private int correctAnswer; // index 0-3
    private int difficulty; // 1, 2, or 3
    private String textReference; // anchor link, e.g., "#roman-kingdom-foundation"
    private Chapter chapter;
}
```

**Scoring System:**
- Base points by difficulty level
- Time bonus (competitive mode): +5 points if answered in <10 seconds
- Streak bonus: +2 points per consecutive correct answer
- No penalty for wrong answers (learning-focused)

**Anti-Memorization Features:**
1. **Randomize question order** - Questions appear in random order each time
2. **Shuffle answer options** - A, B, C, D positions change every quiz
3. **Question pool rotation** - More questions than shown per quiz

**Implementation:**
```java
// Backend: Random question selection
@Query("SELECT q FROM Question q WHERE q.chapter.id = :chapterId ORDER BY RANDOM()")
List<Question> findRandomQuestionsByChapter(@Param("chapterId") Long chapterId);
```

```javascript
// Frontend: Shuffle answer options
const shuffleOptions = (question) => {
    const shuffled = [...question.options];
    const correctAnswer = shuffled[question.correctAnswer];

    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return {
        options: shuffled,
        correctAnswer: shuffled.indexOf(correctAnswer)
    };
};
```

---

### 3. Results & Learning Integration

**After Quiz Completion:**
- Show score and percentage
- Display all questions with user's answers
- Highlight correct/incorrect answers
- **For wrong answers**: "📖 Read about this" button

**Text Reference Feature:**
```jsx
// Results.jsx
{incorrectQuestions.map(q => (
    <div key={q.id} className="question-review">
        <h4>{q.question}</h4>
        <p className="wrong">Your answer: {q.userAnswer}</p>
        <p className="correct">Correct answer: {q.correctAnswer}</p>

        {q.textReference && (
            <a
                href={`/reading/${topicId}${q.textReference}`}
                className="read-more-btn"
            >
                📖 Read about this topic
            </a>
        )}
    </div>
))}
```

**Learning Loop:**
1. User takes quiz on "Roman Kingdom"
2. Gets 7/10 correct
3. Sees 3 questions they missed
4. Clicks "Read about this" on each
5. Navigates directly to relevant reading section
6. Can retake quiz after reviewing

---

### 4. User System & Tiers

**Free Tier:**
- Read all content
- Take unlimited quizzes
- No progress tracking
- No competitive mode access
- Results shown but not saved

**Premium Tier ($3/month):**
- All free tier features
- Progress tracking dashboard
- Quiz history and statistics
- Performance analytics by topic/period
- Access to competitive mode
- Leaderboard participation
- Achievements and badges

**Database Schema:**
```java
@Entity
public class User {
    private Long id;
    private String username;
    private String email;
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private AccountType accountType; // FREE, PREMIUM

    private LocalDateTime premiumExpiryDate;
    private String stripeCustomerId;

    @OneToMany(mappedBy = "user")
    private List<QuizAttempt> quizAttempts;

    @OneToMany(mappedBy = "user")
    private List<UserProgress> progressRecords;
}

@Entity
public class QuizAttempt {
    private Long id;
    private User user;
    private Chapter chapter;
    private int score;
    private int totalQuestions;
    private int totalPoints;
    private LocalDateTime attemptDate;
    private List<QuestionResponse> responses;
}

@Entity
public class UserProgress {
    private Long id;
    private User user;
    private Topic topic;
    private int totalPoints;
    private int questionsAnswered;
    private int questionsCorrect;
    private LocalDateTime lastStudied;
}
```

**User Dashboard:**
- Total points earned
- Topics mastered (80%+ accuracy)
- Recent quiz results
- Study streak (consecutive days)
- Recommended topics (weakest areas)
- Leaderboard rank (premium only)

---

### 5. Competitive Mode

**Access:** Premium users only

**Rules:**
- 10 questions per round
- 20 seconds per question
- Cannot pause or go back
- Must answer all questions
- Rankings updated in real-time

**Anti-Cheat Measures:**
1. **Disable copy/paste**
   ```javascript
   // Prevent copying questions
   onCopy={(e) => e.preventDefault()}
   onCut={(e) => e.preventDefault()}
   onPaste={(e) => e.preventDefault()}
   ```

2. **Disable right-click**
   ```javascript
   onContextMenu={(e) => e.preventDefault()}
   ```

3. **Tab detection** - Track if user switches tabs (suspicious activity)
   ```javascript
   useEffect(() => {
       const handleVisibilityChange = () => {
           if (document.hidden) {
               // Log suspicious activity
               setSuspiciousActivityCount(prev => prev + 1);
           }
       };
       document.addEventListener('visibilitychange', handleVisibilityChange);
   }, []);
   ```

4. **Time tracking** - Server validates completion time

**Prize Distribution:**
- Weekly tournaments
- Top 10 get rewards
- Prize pool: % of subscription revenue
- Payouts via Stripe Connect or PayPal

**Legal Considerations:**
- May need gambling license depending on jurisdiction
- Alternative: Award "learning credits" for platform features
- Consult legal counsel before implementing cash prizes

---

### 6. Admin Panel

**Current Features:**
- Create/edit/delete topics
- Create/edit/delete questions
- View all content

**Phase 2 Additions:**
- Bulk question import (CSV)
- Question difficulty assignment
- Text reference assignment
- Content moderation tools
- User management
- Analytics dashboard

**Admin Workflow for Questions:**
1. Select topic/chapter
2. Write question text
3. Add 4 answer options
4. Mark correct answer
5. **Assign difficulty level** (1-3)
6. **Add text reference** (select section from dropdown or manual anchor)
7. Preview and save

---

### 7. Mobile Application

**Technology:** React Native + Expo

**Why React Native:**
- Code reuse with web app (70-80% shared)
- Same backend API
- One codebase for iOS + Android
- Existing React knowledge applies
- Fast development and deployment

**Mobile-Specific Features:**
- Offline reading mode (download chapters)
- Push notifications (daily quiz reminders)
- Touch-optimized quiz interface
- Native gestures (swipe between questions)

**Development Timeline:**
- Setup & basic navigation: 2 weeks
- Port reading material UI: 2 weeks
- Port quiz functionality: 2 weeks
- Testing & polish: 2 weeks
- App store submission: 1-2 weeks

**Expo Benefits:**
- Over-the-air updates
- Easier build process
- Built-in components
- Simplified deployment

---

### 8. Internationalization (i18n)

**Target Languages:**
- English (default)
- Bulgarian
- Russian
- Spanish
- German

**Implementation Strategy:**

**Phase 1: UI Translation** (react-i18next)
```javascript
// English
{
  "button.start_quiz": "Start Quiz",
  "button.submit": "Submit Answer",
  "nav.reading": "Reading Material"
}

// German
{
  "button.start_quiz": "Quiz starten",
  "button.submit": "Antwort absenden",
  "nav.reading": "Lesematerial"
}
```

**Phase 2: Content Translation** (Database schema change)
```java
@Entity
public class ChapterTranslation {
    private Long id;
    private String language; // ISO 639-1: "en", "de", "es", "bg", "ru"
    private String title;
    private String content;

    @ManyToOne
    private Chapter chapter;
}

@Entity
public class QuestionTranslation {
    private Long id;
    private String language;
    private String question;
    private List<String> options;

    @ManyToOne
    private Question question;
}
```

**Language Switching:**
- User selects language in profile
- All UI elements update instantly
- Content fetched in selected language
- Fallback to English if translation missing

**Translation Workflow:**
1. Content created in English (base language)
2. Professional translators hired for each target language
3. Translations stored in database
4. Quality review by native speakers
5. Deployed per language

**Cost Estimation:**
- Professional translation: $0.08-0.15 per word
- Average chapter: 2,000 words = $160-$300 per chapter
- Budget accordingly for content library

---

## 🚀 Development Phases

### Phase 1: Core Foundation & Improvements (Weeks 1-3) 🔨

**Status:** In Progress

**Goals:**
- Solidify existing functionality
- Add difficulty levels to questions
- Implement text references
- Build randomization features
- Polish UI/UX

**Tasks:**
1. ✅ Fix backend/frontend structure
2. ✅ Set up Git monorepo
3. ⬜ Debug empty questions issue
4. ⬜ **Add `difficulty` field to Question model**
   ```java
   private int difficulty; // 1, 2, or 3
   ```
5. ⬜ **Add `textReference` field to Question model**
   ```java
   private String textReference; // e.g., "#roman-kingdom-foundation"
   ```
6. ⬜ **Update QuestionForm.jsx** - Add difficulty selector and text reference input
7. ⬜ **Implement question randomization** (backend query)
8. ⬜ **Implement answer shuffling** (frontend logic)
9. ⬜ **Build Results component with text references**
10. ⬜ **Create continuous reading material** with proper H2/H3 structure
11. ⬜ **Add anchor navigation** to reading material
12. ⬜ **Implement scoring system** based on difficulty
13. ⬜ **Test full user flow**: Read → Quiz → Review → Re-read

**Deliverables:**
- Fully functional quiz system with difficulty levels
- Text reference navigation working
- Randomized quizzes
- Polished reading experience

---

### Phase 2: User Authentication & Premium Tier (Weeks 4-9) 👤

**Goals:**
- User registration and login
- Free vs Premium account management
- Payment integration
- Progress tracking database

**Tasks:**

**Backend:**
1. Create User, QuizAttempt, UserProgress entities
2. Implement JWT authentication
3. Add Spring Security configuration
4. Create user registration/login endpoints
5. Integrate Stripe for subscriptions
6. Build progress tracking endpoints
7. Add webhook handlers for Stripe events

**Frontend:**
1. Build Sign Up / Sign In pages
2. Create user dashboard
3. Add Stripe checkout flow
4. Build progress tracking UI
5. Show quiz history and statistics
6. Display achievements/badges
7. Implement protected routes (premium only)

**Database Migrations:**
- Create users table
- Create quiz_attempts table
- Create user_progress table
- Add foreign keys and indexes

**Stripe Integration:**
- Set up Stripe account
- Create subscription product ($3/month)
- Implement checkout session
- Handle subscription lifecycle
- Build customer portal

**Testing:**
- User registration flow
- Login authentication
- Payment processing
- Progress data accuracy
- Premium feature access control

**Deliverables:**
- Working authentication system
- Subscription payment flow
- User dashboard with progress tracking
- Free/premium tier differentiation

---

### Phase 3: Competitive Mode & Gamification (Weeks 10-13) 🏆

**Goals:**
- Timed quiz mode
- Leaderboards
- Anti-cheat measures
- Prize distribution system

**Tasks:**

**Backend:**
1. Create CompetitiveRound, Leaderboard entities
2. Build tournament scheduling system
3. Implement scoring algorithm with time bonuses
4. Add suspicious activity tracking
5. Build prize distribution logic
6. Create leaderboard calculation jobs

**Frontend:**
1. Build competitive quiz UI with countdown timer
2. Implement anti-cheat measures (disable copy/paste, track tabs)
3. Create leaderboard view (global, weekly, topic-specific)
4. Build tournament registration flow
5. Display prize pool and rankings
6. Add animations and excitement elements

**Features:**
- 20-second countdown per question
- Cannot go back to previous questions
- Real-time score updates
- Weekly tournament schedule
- Top 10 leaderboard
- Prize notifications

**Prize Distribution Options:**
- Direct cash via Stripe (requires legal review)
- Platform credits (safer alternative)
- Badges and achievements
- Subscription extensions

**Testing:**
- Timer accuracy
- Anti-cheat effectiveness
- Leaderboard calculation accuracy
- Prize payout process
- Tournament lifecycle

**Deliverables:**
- Competitive quiz mode
- Working leaderboard system
- Prize distribution mechanism
- Tournament management tools

---

### Phase 4: Mobile Application (Weeks 14-23) 📱

**Goals:**
- Cross-platform mobile app (iOS + Android)
- Feature parity with web version
- App store deployment

**Tasks:**

**Setup (Weeks 14-15):**
1. Initialize React Native project with Expo
2. Set up navigation structure
3. Configure build settings
4. Test on emulators/devices

**Development (Weeks 16-21):**
1. Port reading material UI
2. Port quiz interface
3. Port user authentication
4. Port dashboard and progress tracking
5. Implement offline reading mode
6. Add push notifications
7. Optimize for mobile performance
8. Add mobile-specific gestures

**Testing (Week 22):**
1. Test on various iOS devices
2. Test on various Android devices
3. Test offline functionality
4. Performance optimization
5. Bug fixes and polish

**Deployment (Week 23):**
1. Prepare app store assets (screenshots, descriptions)
2. Submit to Apple App Store
3. Submit to Google Play Store
4. Monitor reviews and respond to issues

**Mobile-Specific Considerations:**
- Smaller screen layout adaptations
- Touch targets (minimum 44x44 points)
- Network connectivity handling
- Battery optimization
- App size optimization

**Deliverables:**
- iOS app in App Store
- Android app in Google Play Store
- Mobile-optimized user experience
- Push notification system

---

### Phase 5: Internationalization (Weeks 24+) 🌍

**Goals:**
- Multi-language support
- Localized content
- Language switching

**Tasks:**

**Phase 5a: UI Localization (Weeks 24-25)**
1. Install and configure react-i18next
2. Extract all UI strings to translation files
3. Translate UI to target languages
4. Add language selector component
5. Test language switching
6. Handle RTL languages if needed (Arabic, Hebrew future)

**Phase 5b: Content Translation (Weeks 26+)**
1. Update database schema for translations
2. Build translation management interface (admin)
3. Hire professional translators
4. Import translated content
5. Implement fallback logic (English default)
6. Quality assurance by native speakers

**Translation Priority:**
1. English (base) ✅
2. Spanish (large market)
3. German (European market)
4. Bulgarian (local market)
5. Russian (Eastern European market)

**Budget Planning:**
- UI translation: $500-1,000 per language (one-time)
- Content translation: $160-300 per chapter per language
- Quality review: $50-100 per chapter per language
- Ongoing maintenance: Budget for new content

**Deliverables:**
- Fully localized UI in 5 languages
- Translated content library (prioritize popular topics)
- Language switching functionality
- Translation management tools

---

## 📋 Database Schema Overview

### Core Entities

```sql
-- Periods table
CREATE TABLE periods (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT
);

-- Topics table
CREATE TABLE topics (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    period_id BIGINT REFERENCES periods(id)
);

-- Chapters table
CREATE TABLE chapters (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT, -- HTML with H2/H3 structure
    topic_id BIGINT REFERENCES topics(id)
);

-- Questions table
CREATE TABLE questions (
    id BIGSERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    correct_answer INT NOT NULL, -- index 0-3
    difficulty INT NOT NULL, -- 1, 2, or 3
    text_reference VARCHAR(255), -- anchor link
    chapter_id BIGINT REFERENCES chapters(id)
);

-- Question options (separate table for list)
CREATE TABLE question_options (
    question_id BIGINT REFERENCES questions(id),
    option VARCHAR(500) NOT NULL,
    option_order INT NOT NULL
);

-- Users table (Phase 2)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    account_type VARCHAR(20) NOT NULL, -- FREE, PREMIUM
    premium_expiry_date TIMESTAMP,
    stripe_customer_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz attempts table (Phase 2)
CREATE TABLE quiz_attempts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    chapter_id BIGINT REFERENCES chapters(id),
    score INT NOT NULL,
    total_questions INT NOT NULL,
    total_points INT NOT NULL,
    attempt_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress table (Phase 2)
CREATE TABLE user_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    topic_id BIGINT REFERENCES topics(id),
    total_points INT DEFAULT 0,
    questions_answered INT DEFAULT 0,
    questions_correct INT DEFAULT 0,
    last_studied TIMESTAMP,
    UNIQUE(user_id, topic_id)
);

-- Translation tables (Phase 5)
CREATE TABLE chapter_translations (
    id BIGSERIAL PRIMARY KEY,
    chapter_id BIGINT REFERENCES chapters(id),
    language VARCHAR(5) NOT NULL, -- ISO 639-1
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    UNIQUE(chapter_id, language)
);

CREATE TABLE question_translations (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT REFERENCES questions(id),
    language VARCHAR(5) NOT NULL,
    question TEXT NOT NULL,
    UNIQUE(question_id, language)
);
```

---

## 🎨 UI/UX Considerations

### Design Principles
- **Clean and minimal** - Focus on content, not distractions
- **Readable typography** - Large enough for comfortable reading
- **Clear hierarchy** - H1 > H2 > H3 structure obvious
- **Consistent spacing** - Predictable layout
- **Mobile-first** - Design for small screens, scale up
- **Accessibility** - WCAG 2.1 AA compliance

### Color Scheme Suggestions
- Primary: Historical/scholarly (deep blue, burgundy)
- Success: Green (correct answers)
- Error: Red (incorrect answers)
- Neutral: Grays for text and backgrounds
- Accent: Gold (premium features, achievements)

### Key User Flows

**New User Journey:**
1. Land on homepage → See topic list
2. Click topic → Read introduction
3. Start reading → Scroll through content
4. Click "Take Quiz" → Answer 10 questions
5. See results → Review wrong answers
6. Click "Read about this" → Jump to relevant section
7. Prompted to sign up for progress tracking

**Premium User Journey:**
1. Login → See dashboard with progress
2. Dashboard shows recommended topics
3. Select topic → Continue where left off
4. Complete quiz → See score added to total
5. Check leaderboard → See ranking
6. Join competitive tournament → Win prizes

---

## 🔐 Security Considerations

### Authentication
- Password hashing with BCrypt
- JWT tokens for session management
- Refresh token rotation
- Rate limiting on login attempts
- Email verification for new accounts

### Data Protection
- HTTPS only (SSL certificate)
- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- XSS protection (escape user input)
- CSRF tokens for forms

### Payment Security
- PCI compliance via Stripe
- Never store credit card data
- Secure webhook validation
- Subscription status verification

### Competitive Mode Security
- Server-side time validation
- Suspicious activity logging
- IP-based rate limiting
- Question order validation
- Answer submission timestamps

---

## 📊 Analytics & Monitoring

### Key Metrics to Track

**User Engagement:**
- Daily/weekly/monthly active users
- Average session duration
- Quizzes completed per user
- Reading time per topic

**Content Performance:**
- Most popular topics
- Most difficult questions (low success rate)
- Topics with highest completion rates
- Average quiz scores by topic

**Business Metrics:**
- Free to premium conversion rate
- Monthly recurring revenue (MRR)
- Churn rate
- Customer lifetime value (CLV)
- Stripe subscription status

**Technical Metrics:**
- API response times
- Error rates
- Server uptime
- Database query performance

### Tools
- Google Analytics (web)
- Firebase Analytics (mobile)
- Stripe Dashboard (subscriptions)
- Custom admin dashboard (content stats)

---

## 🐛 Known Issues & Technical Debt

### Current Issues
1. ⬜ Empty questions array when fetching by topic
2. ⬜ Need to add difficulty levels to existing questions
3. ⬜ No text references on existing questions
4. ⬜ Reading material needs proper HTML structure

### Technical Debt
- No automated tests yet
- No CI/CD pipeline
- Database not optimized (add indexes)
- No caching layer (Redis future)
- No API rate limiting
- No logging/monitoring system

### Future Improvements
- Add automated testing (JUnit, Jest, React Testing Library)
- Set up CI/CD (GitHub Actions)
- Implement caching (Redis)
- Add comprehensive logging (ELK stack)
- Performance optimization (lazy loading, pagination)
- API versioning strategy
- Database backup strategy

---

## 💰 Monetization Strategy

### Revenue Streams

**Primary: Subscriptions**
- $3/month premium tier
- Target: 1,000 users = $3,000/month
- Annual plan option: $30/year (save $6)

**Secondary: Competitive Mode**
- Entry fees for tournaments
- Prize pool: 70% distributed, 30% platform fee
- Or platform credits system (safer legally)

**Future Possibilities:**
- Corporate licenses (schools, universities)
- White-label version for institutions
- Affiliate marketing (history books, courses)
- Sponsored content from museums/organizations

### Cost Structure

**Fixed Costs:**
- Server hosting: $50-100/month (scales with users)
- Database: $20-50/month
- Stripe fees: 2.9% + $0.30 per transaction
- Domain and SSL: $15/year
- Mobile app developer accounts: $99/year (Apple), $25 one-time (Google)

**Variable Costs:**
- Content translation: $160-300 per chapter per language
- Professional content creation: $50-100 per chapter
- Customer support: Time-based or outsource
- Marketing: Budget dependent

**Break-Even Analysis:**
- Fixed costs: ~$100/month
- Need ~34 premium subscribers to break even
- Each additional user = $3/month profit (minus Stripe fees)

---

## 📞 Support & Maintenance Plan

### User Support
- FAQ section
- Email support (response within 24 hours)
- In-app help documentation
- Community forum (future)

### Content Updates
- Add new topics quarterly
- Update existing content annually
- Fix reported errors within 1 week
- Translate new content within 1 month

### Bug Fixes
- Critical bugs: Fix within 24 hours
- High priority: Fix within 1 week
- Medium priority: Fix within 1 month
- Low priority: Fix in next major release

### Version Updates
- Monthly minor updates (bug fixes, small features)
- Quarterly major updates (new features)
- Annual major version (significant changes)

---

## 🎯 Success Criteria

### Phase 1 Success
- [ ] 50+ questions across 5 topics
- [ ] All questions have difficulty levels
- [ ] Text references working correctly
- [ ] Users can complete full quiz cycle
- [ ] 90% quiz completion rate

### Phase 2 Success
- [ ] 100+ registered users
- [ ] 20+ premium subscribers
- [ ] Payment processing working smoothly
- [ ] <1% payment failure rate
- [ ] User retention >60% month-over-month

### Phase 3 Success
- [ ] Weekly tournaments running
- [ ] 50+ competitive mode participants
- [ ] Leaderboard updating correctly
- [ ] Zero cheating incidents detected
- [ ] Prize distributions completed successfully

### Phase 4 Success
- [ ] Mobile app approved in both stores
- [ ] 1,000+ mobile downloads
- [ ] <5% crash rate
- [ ] 4+ star rating average
- [ ] Feature parity with web version

### Phase 5 Success
- [ ] UI translated in 5 languages
- [ ] 10+ chapters translated per language
- [ ] International users >30% of total
- [ ] Translation quality >4/5 rating
- [ ] Successful market expansion

---

## 🚦 Risk Management

### Technical Risks
- **Server downtime**: Mitigation: Use reliable hosting (AWS, Heroku), implement monitoring
- **Data loss**: Mitigation: Daily automated backups, database replication
- **Security breach**: Mitigation: Regular security audits, keep dependencies updated
- **Scaling issues**: Mitigation: Design for horizontal scaling, use CDN

### Business Risks
- **Low user adoption**: Mitigation: Marketing strategy, free tier to build audience
- **High churn rate**: Mitigation: Engaging content, gamification, regular updates
- **Competition**: Mitigation: Unique features (text references), quality content
- **Legal issues (prizes)**: Mitigation: Consult lawyer, use platform credits alternative

### Content Risks
- **Inaccurate information**: Mitigation: Expert review, community reporting
- **Copyright issues**: Mitigation: Create original content, cite sources properly
- **Translation errors**: Mitigation: Professional translators, native speaker review

---

## 📚 Resources & References

### Learning Resources
- Spring Boot Documentation: https://spring.io/guides
- React Documentation: https://react.dev
- React Native Docs: https://reactnative.dev
- Stripe Integration Guide: https://stripe.com/docs
- i18next Documentation: https://www.i18next.com

### Design Inspiration
- Duolingo (gamification, progress tracking)
- Khan Academy (education, learning paths)
- Quizlet (quiz interface, study tools)
- Medium (reading experience, typography)

### Tools & Services
- Figma (UI/UX design)
- Postman (API testing)
- GitHub (version control)
- Vercel (web hosting)
- Expo (mobile development)

---

## 📝 Notes & Decisions Log

### Key Decisions Made

**Decision 1: No Subchapter Entity**
- Date: October 2025
- Rationale: Adding another database layer would increase complexity without significant benefit. HTML structure (H2/H3) provides sufficient organization while keeping the data model simple.
- Impact: Easier to maintain, faster development, simpler queries

**Decision 2: Question Difficulty Levels (1-3)**
- Date: October 2025
- Rationale: Three levels provide good granularity without overwhelming users or admins. Simple integer field easy to implement and understand.
- Impact: Better scoring system, progressive difficulty, more engaging gameplay

**Decision 3: Text References via Anchor Links**
- Date: October 2025
- Rationale: Using HTML anchors (#section-id) is simple, reliable, and works across web and mobile. No complex routing needed.
- Impact: Seamless integration between quiz results and reading material, better learning outcomes

**Decision 4: React Native for Mobile**
- Date: October 2025
- Rationale: Maximizes code reuse with existing React web app, faster development, one codebase for both platforms.
- Impact: Faster time to market, easier maintenance, lower development cost

**Decision 5: Monorepo Structure**
- Date: October 2025
- Rationale: Single repository for frontend and backend simplifies development for solo developer, easier to see full picture.
- Impact: Simpler Git workflow, single README, easier to manage

**Decision 6: Premium Tier at $3/month**
- Date: October 2025
- Rationale: Low barrier to entry encourages conversions, competitive with similar educational platforms, sustainable revenue at scale.
- Impact: Accessible pricing, predictable revenue stream

**Decision 7: Start with English Only**
- Date: October 2025
- Rationale: Focus on core functionality first, add translations when revenue supports translation costs.
- Impact: Faster MVP, can validate product-market fit before investing in translations

---

## 🎬 Getting Started Guide

### For New Developers

**1. Clone and Setup**
```bash
git clone <repository-url>
cd SpringBeginning

# Backend setup
cd backend
./gradlew bootRun
# Server starts on http://localhost:8081

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

**2. Database Setup**
- H2 in-memory database (default for development)
- Access H2 console: http://localhost:8081/h2-console
- No additional setup needed for development

**3. Create Sample Data**
```sql
-- Insert a period
INSERT INTO periods (title, description) VALUES ('Antiquity', 'Ancient civilizations');

-- Insert a topic
INSERT INTO topics (title, description, period_id) VALUES
('Ancient Rome', 'History of the Roman civilization', 1);

-- Insert a chapter with HTML content
INSERT INTO chapters (title, content, topic_id) VALUES