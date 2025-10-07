package com.example.demo;

import com.example.demo.model.Period;
import com.example.demo.model.Topic;
import com.example.demo.model.Chapter;
import com.example.demo.model.Question;
import com.example.demo.repository.PeriodRepository;
import com.example.demo.repository.TopicRepository;
import com.example.demo.repository.ChapterRepository;
import com.example.demo.repository.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Arrays;

@Component
public class DataLoader implements CommandLineRunner {

    private final PeriodRepository periodRepository;
    private final TopicRepository topicRepository;
    private final ChapterRepository chapterRepository;
    private final QuestionRepository questionRepository;

    public DataLoader(PeriodRepository periodRepository,
                     TopicRepository topicRepository,
                     ChapterRepository chapterRepository,
                     QuestionRepository questionRepository) {
        this.periodRepository = periodRepository;
        this.topicRepository = topicRepository;
        this.chapterRepository = chapterRepository;
        this.questionRepository = questionRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create Period
        Period prehistory = new Period();
        prehistory.setTitle("Prehistory");
        prehistory.setDescription("The period before written records");
        periodRepository.save(prehistory);

        // Create Topic
        Topic paleolithic = new Topic();
        paleolithic.setTitle("Paleolithic Era");
        paleolithic.setDescription("The Old Stone Age");
        paleolithic.setPeriod(prehistory);
        topicRepository.save(paleolithic);

        // Create Chapter
        Chapter earlyPaleolithic = new Chapter();
        earlyPaleolithic.setTitle("Early Paleolithic");
        earlyPaleolithic.setContent("The Paleolithic Era, also known as the Old Stone Age, was a period in human prehistory distinguished by the development of the first stone tools. It lasted from approximately 2.6 million years ago to around 10,000 BCE.\n\n" +
            "During this era, early humans were primarily hunter-gatherers, moving from place to place in search of food and shelter. They hunted wild animals using increasingly sophisticated stone tools and weapons.\n\n" +
            "One of the most significant achievements was the control and use of fire, which occurred around 400,000 years ago.");
        earlyPaleolithic.setTopic(paleolithic);
        chapterRepository.save(earlyPaleolithic);

        // Create Questions for this chapter
        Question q1 = new Question();
        q1.setChapter(earlyPaleolithic);
        q1.setQuestion("What was the primary tool-making material during the Paleolithic Era?");
        q1.setOptions(Arrays.asList("Stone", "Bronze", "Iron", "Steel"));
        q1.setCorrectAnswer(0);
        questionRepository.save(q1);

        Question q2 = new Question();
        q2.setChapter(earlyPaleolithic);
        q2.setQuestion("What was a major development during the Paleolithic Era?");
        q2.setOptions(Arrays.asList("Agriculture", "Control of fire", "Writing", "Metalworking"));
        q2.setCorrectAnswer(1);
        questionRepository.save(q2);

        Question q3 = new Question();
        q3.setChapter(earlyPaleolithic);
        q3.setQuestion("How did Paleolithic humans primarily obtain food?");
        q3.setOptions(Arrays.asList("Farming", "Hunting and gathering", "Trading", "Fishing only"));
        q3.setCorrectAnswer(1);
        questionRepository.save(q3);

        System.out.println("✅ Sample data loaded: 1 period, 1 topic, 1 chapter, 3 questions");
    }
}