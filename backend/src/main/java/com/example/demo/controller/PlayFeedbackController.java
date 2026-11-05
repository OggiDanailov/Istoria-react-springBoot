package com.example.demo.controller;

import com.example.demo.model.PlayFeedback;
import com.example.demo.repository.PlayFeedbackRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

// Feedback from the test version of the game at /play. Testers send it (the page is behind nginx's password);
// only an admin can read it.
@RestController
@RequestMapping("/api/play-feedback")
public class PlayFeedbackController {

    private static final int MAX_PER_HOUR = 120;   // per address: plenty for a tester, a brake on abuse
    private final PlayFeedbackRepository repository;
    private final Map<String, Deque<Long>> recent = new HashMap<>();

    public PlayFeedbackController(PlayFeedbackRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public ResponseEntity<Void> save(@RequestBody Map<String, Object> body, HttpServletRequest request) {
        if (tooMany(clientAddress(request))) return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
        String comment = text(body.get("comment"), 2000), tags = text(body.get("tags"), 300);
        if (comment == null && tags == null) return ResponseEntity.badRequest().build();
        PlayFeedback f = new PlayFeedback();
        f.setTester(text(body.get("tester"), 40));
        f.setChapter(text(body.get("chapter"), 80));
        f.setGame(text(body.get("game"), 120));
        f.setSetName(text(body.get("set"), 200));
        f.setStars(number(body.get("stars")));
        f.setMistakes(number(body.get("mistakes")));
        f.setInTest(body.get("inTest") instanceof Boolean b ? b : null);
        f.setTags(tags);
        f.setComment(comment);
        f.setLang(text(body.get("lang"), 5));
        repository.save(f);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public List<PlayFeedback> all() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    // a string, trimmed and cut to its column's length; tags may come as a list
    private static String text(Object value, int max) {
        if (value instanceof List<?> list) value = String.join(", ", list.stream().map(String::valueOf).toList());
        if (value == null) return null;
        String s = String.valueOf(value).trim();
        if (s.isEmpty()) return null;
        return s.length() > max ? s.substring(0, max) : s;
    }

    private static Integer number(Object value) {
        return value instanceof Number n ? Math.max(0, Math.min(1000, n.intValue())) : null;
    }

    private static String clientAddress(HttpServletRequest request) {
        String real = request.getHeader("X-Real-IP");   // set by nginx
        return real != null ? real : request.getRemoteAddr();
    }

    private synchronized boolean tooMany(String address) {
        long now = System.currentTimeMillis();
        Deque<Long> times = recent.computeIfAbsent(address, a -> new ArrayDeque<>());
        while (!times.isEmpty() && now - times.peekFirst() > 3_600_000) times.pollFirst();
        if (times.size() >= MAX_PER_HOUR) return true;
        times.addLast(now);
        return false;
    }
}
