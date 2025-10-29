# Final Requirements & Execution Plan - Suggested Questions Feature

## 🎯 WHAT YOU WANT (Crystal Clear)

### Layout:
```
Messages Area ↑
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[___________Text Input Field___________] [Send]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[White Card 1]  [White Card 2]  [White Card 3]
Full Question   Full Question   Full Question
    ●○○○○○○○○ (showing 3 of 9)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Requirements:
1. **Position:** Below text input field
2. **Theme:** Current light theme (white cards, borders)
3. **Display:** 3 questions visible (full text, no truncation)
4. **Content:** Minimum 9 questions per book (45 total)
5. **Rotation:** Click question → send message → replace with new question
6. **Tracking:** Don't repeat questions until all 9 used

---

## 📐 LAYOUT: Single Row Horizontal Scroll

**Desktop:** 3 cards visible, scroll for more
**Mobile:** 1-2 cards visible, swipe to see more
**Indicators:** 9 dots showing progress

---

## 📝 CONTENT GENERATION (Most Difficult Part)

### Challenge:
Create 9 comprehensive questions per book that help users learn the entire book content.

### Recommended Method: AI-Assisted + Manual Review

**Time:** 1.5-2 hours

**Process:**

1. **Use AI to generate 12 questions** (10 min per book)
2. **Review and select best 9** (10 min per book)
3. **Repeat for all 5 books** (2 hours total)

**AI Prompt Template:**
```
Based on this Vietnamese book:

Title: [BOOK TITLE]
Summary: [EXCERPT from books.json]

Generate 12 comprehensive questions in Vietnamese that:
1. Cover different aspects of the book
2. Help readers understand the complete content
3. Progress from basic to advanced
4. Are specific (not generic)
5. Use natural Vietnamese phrasing

Return as JSON array of strings.
```

---

## 🔄 ROTATION MECHANISM

**How it works:**

```
Initial: visible = [Q1, Q2, Q3], available = [Q4-Q9], used = []

User clicks Q1 →
  1. Send Q1 as message
  2. Replace Q1 with Q4
  3. visible = [Q4, Q2, Q3], available = [Q5-Q9], used = [Q1]

User clicks Q2 →
  1. Send Q2 as message
  2. Replace Q2 with Q5
  3. visible = [Q4, Q5, Q3], available = [Q6-Q9], used = [Q1, Q2]

...continue until all 9 used...

After 9 used → Hide component (users explore on their own)
```

**Storage:** sessionStorage (persists during tab session, resets when tab closes)

---

## 🛠️ EXECUTION STEPS

### PHASE 1: Content Creation (1.5-2 hours)

**Step 1:** Create file `content/books/suggestedQuestions.json`

**Step 2:** For each book (1-5):
- Copy title and excerpt from `books.json`
- Use AI prompt to generate 12 questions
- Review and select best 9
- Add to JSON file

**Step 3:** Validate
- Each book has 9 questions
- All Vietnamese
- No duplicates
- Reasonable length (2-4 lines)

**Final JSON structure:**
```json
{
  "1": ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9"],
  "2": ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9"],
  "3": ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9"],
  "4": ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9"],
  "5": ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9"]
}
```

---

### PHASE 2: Component Development (1.5-2 hours)

**Step 1:** Create `components/chat/SuggestedQuestions.tsx`

**Step 2:** Implement features:
- Load questions from JSON by bookId
- State management (visible/used/available)
- sessionStorage persistence
- Click handler with rotation logic
- Horizontal scroll container
- Progress dots (9 indicators)

**Step 3:** Add CSS utility in `app/globals.css`:
```css
@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

---

### PHASE 3: Integration (30 minutes)

**Step 1:** Import component in `components/chat/ChatSection.tsx`

**Step 2:** Add below input area:
```typescript
<SuggestedQuestions
  bookId={bookId}
  onQuestionClick={handleSendMessage}
  isDisabled={isChatDisabled || isSending || !!pendingUserMessage}
/>
```

---

### PHASE 4: Testing (1 hour)

**Functional:**
- [ ] Questions load for each book
- [ ] Click sends message and replaces question
- [ ] All 9 questions can be used
- [ ] Component hides after 9 used
- [ ] State persists on refresh

**Responsive:**
- [ ] Desktop: 3 cards visible
- [ ] Mobile: 1-2 cards visible, swipe works
- [ ] Scroll is smooth

---

## ⏱️ TOTAL TIME: 4.5-5.5 hours

| Phase | Duration |
|-------|----------|
| Content Creation | 1.5-2 hours |
| Component Dev | 1.5-2 hours |
| Integration | 30 minutes |
| Testing | 1 hour |

---

## ✅ FINAL CHECKLIST

- [ ] Create `suggestedQuestions.json` with 45 questions
- [ ] Create `SuggestedQuestions.tsx` component
- [ ] Add scrollbar-hide CSS utility
- [ ] Integrate into `ChatSection.tsx`
- [ ] Test all 5 books
- [ ] Test rotation mechanism
- [ ] Test responsive behavior
- [ ] Verify sessionStorage works

---

## 🚀 READY?

**What you'll get:**
- 3 white question cards below input
- 9 questions per book with smart rotation
- Progress dots showing position
- Mobile-responsive horizontal scroll
- Persists state across refreshes

**Say "execute" or "start" to begin!** 🎯
