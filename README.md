# Quiz Application - Complete Documentation

## 📋 Project Overview

A full-stack educational quiz application with reading materials organized by historical periods and topics. Users can read content and test their knowledge through multiple-choice quizzes. Administrators can manage topics, chapters, and questions.

# Quiz Application - Backend (Spring Boot)

> **Note:** This is the backend API. The frontend is a separate React project.
> Frontend runs on: `http://localhost:5173`
> Backend runs on: `http://localhost:8081`

## 🏗️ Architecture

### Data Model Hierarchy

```
Period (e.g., "Antiquity", "Medieval")
  └── Topic (e.g., "Roman History", "Greek History")
      └── Chapter (e.g., "Kingdom Period", "Early Empire")
          └── Question (multiple choice with 4 options)
```

### Technology Stack

**Backend:**
- Java 17+
- Spring Boot
- Spring Data JPA
- H2/PostgreSQL Database
- Gradle

**Frontend:**
- React
- Vite
- CSS3

## 📁 Project Structure

### Backend Models

#### Period
```java
- id: Long
- title: String
- description: String
- topics: List<Topic>
```

#### Topic
```java
- id: Long
- title: String
- description: String
- period: Period
- chapters: List<Chapter>
```

#### Chapter
```java
- id: Long
- title: String
- content: String (reading material, max 10000 chars)
- topic: Topic
- questions: List<Question>
```

#### Question
```java
- id: Long
- question: String
- options: List<String> (4 options)
- correctAnswer: int (index 0-3)
- chapter: Chapter
```

### Frontend Components

**Main App Flow:**
- `App.jsx` - Main router/state manager
- `TopicList.jsx` - Browse available topics
- `ReadingMaterial.jsx` - Display chapter content
- `Quiz.jsx` - Take the quiz
- `Results.jsx` - View quiz results

**Admin Section:**
- `Admin.jsx` - Admin dashboard
- `TopicForm.jsx` - Create/edit topics
- `QuestionForm.jsx` - Create/edit questions

## 🔌 API Endpoints

### Periods

```
GET    /api/periods              - Get all periods
GET    /api/periods/{id}         - Get specific period
POST   /api/periods              - Create period
PUT    /api/periods/{id}         - Update period
DELETE /api/periods/{id}         - Delete period
```

### Topics

```
GET    /api/topics                      - Get all topics
GET    /api/topics/{id}                 - Get specific topic
GET    /api/periods/{periodId}/topics   - Get topics by period
POST   /api/periods/{periodId}/topics   - Create topic for period
PUT    /api/topics/{id}                 - Update topic
DELETE /api/topics/{id}                 - Delete topic
```

### Chapters

```
GET    /api/chapters                    - Get all chapters
GET    /api/chapters/{id}               - Get specific chapter
GET    /api/topics/{topicId}/chapters   - Get chapters by topic
POST   /api/topics/{topicId}/chapters   - Create chapter for topic
PUT    /api/chapters/{id}               - Update chapter
DELETE /api/chapters/{id}               - Delete chapter
```

### Questions

```
GET    /api/questions                        - Get all questions
GET    /api/questions/{id}                   - Get specific question
GET    /api/chapters/{chapterId}/questions   - Get questions by chapter
GET    /api/topics/{topicId}/questions       - Get questions by topic
POST   /api/chapters/{chapterId}/questions   - Create question for chapter
POST   /api/topics/{topicId}/questions       - Create question for topic
PUT    /api/questions/{id}                   - Update question
DELETE /api/questions/{id}                   - Delete question
```

## 🚀 Setup Instructions

### Backend Setup

1. **Prerequisites:**
   - Java 17 or higher
   - Gradle

2. **Run the application:**
   ```bash
   cd backend
   ./gradlew bootRun
   ```

3. **Server will start on:** `http://localhost:8081`

### Frontend Setup

1. **Prerequisites:**
   - Node.js 16+
   - npm or yarn

2. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **App will run on:** `http://localhost:5173`

## ⚙️ Configuration

### CORS Configuration

All controllers have CORS enabled for `http://localhost:5173`:

```java
@CrossOrigin(origins = "http://localhost:5173")
```

For production, update this to your deployed frontend URL.

### Database Configuration

Default uses H2 in-memory database. Check `application.properties` to configure:

```properties
spring.datasource.url=jdbc:h2:mem:quizdb
spring.jpa.hibernate.ddl-auto=update
```

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
**Error:** `Access to fetch at 'http://localhost:8081/api/...' has been blocked by CORS policy`

**Solution:**
- Ensure `@CrossOrigin(origins = "http://localhost:5173")` is on all controllers
- Restart Spring Boot application after adding

### Issue 2: "Cannot read properties of undefined"
**Error:** `Cannot read properties of undefined (reading 'substring')`

**Solution:**
- Field name mismatch between frontend and backend
- Example: Frontend uses `topic.content` but backend has `topic.description`
- Always use optional chaining: `topic.description?.substring(0, 150)`

### Issue 3: Endpoint Not Found (404)
**Error:** Fetch request returns 404

**Solution:**
- Check if the endpoint exists in the controller
- Verify the URL path matches exactly (e.g., `/api/topics/{id}/questions`)
- Check if required repository methods exist

### Issue 4: Empty Results from API
**Problem:** API returns `[]` even though data exists

**Solution:**
- Verify relationships are properly set in the database
- Check foreign keys (`chapter_id`, `topic_id`, `period_id`)
- Ensure data was saved with proper associations
- Add logging to controller methods to debug

## 📊 Repository Query Methods

### QuestionRepository
- `findByChapterId(Long chapterId)` - Questions for a specific chapter
- `findByChapterTopicId(Long topicId)` - Questions for all chapters in a topic

### TopicRepository
- `findByPeriodId(Long periodId)` - Topics for a specific period

### ChapterRepository
- `findByTopicId(Long topicId)` - Chapters for a specific topic

## 🎯 User Flow

1. **User views topic list** → Selects a topic
2. **Reading Material screen** → User reads chapter content
3. **User clicks "Start Quiz"** → Takes multiple-choice quiz
4. **Results screen** → Shows score and correct answers
5. **Admin can access admin panel** → Manage topics and questions

## 🔐 Admin Features

- Create, edit, and delete topics
- Create, edit, and delete questions for each topic
- Preview existing questions with correct answers highlighted

## 🚧 Future Enhancements

- [ ] User authentication and progress tracking
- [ ] Multiple chapters per topic with navigation
- [ ] Question difficulty levels
- [ ] Timed quizzes
- [ ] Leaderboards
- [ ] Image support in questions
- [ ] Export/import questions (CSV/JSON)
- [ ] Analytics dashboard for admins

## 📝 Development Notes

### Key Design Decisions

1. **Questions belong to Chapters, not Topics directly**
   - Allows better content organization
   - Enables multiple reading materials per topic
   - Questions can be associated with specific chapter content

2. **`@JsonIgnore` on parent relationships**
   - Prevents circular JSON serialization
   - Used on: `Period` in Topic, `Topic` in Chapter, `Chapter` in Question

3. **Frontend uses simple state management**
   - Single `App.jsx` manages routing via state
   - No React Router needed for this simple flow
   - Easy to understand and maintain

### Code Conventions

- **Backend:** Follow Java naming conventions (camelCase for methods, PascalCase for classes)
- **Frontend:** React functional components with hooks
- **API:** RESTful conventions with proper HTTP methods
- **Database:** Snake_case for table and column names

## 🤝 Contributing

When adding new features:
1. Update the data model section if adding new entities
2. Document new API endpoints
3. Update this README with any new setup requirements
4. Add common issues you encounter and their solutions

## 📞 Support

If you encounter issues not covered here:
1. Check Spring Boot console logs for backend errors
2. Check browser console for frontend errors
3. Verify API endpoint exists and data relationships are correct
4. Add the issue and solution to this README for future reference

---

**Last Updated:** October 2025
**Version:** 1.0.0