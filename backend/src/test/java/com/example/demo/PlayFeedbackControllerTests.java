package com.example.demo;

import com.example.demo.repository.PlayFeedbackRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PlayFeedbackControllerTests {

    @Autowired MockMvc mvc;
    @Autowired PlayFeedbackRepository repository;

    @Test
    void anyoneCanSendFeedback() throws Exception {
        long before = repository.count();
        mvc.perform(post("/api/play-feedback").contentType(MediaType.APPLICATION_JSON)
                .content("{\"tester\":\"t1\",\"chapter\":\"kingdom\",\"game\":\"Match Pairs\",\"set\":\"Latin Words\",\"stars\":2,\"mistakes\":1,\"inTest\":true,\"tags\":[\"Fun\",\"Too hard\"],\"comment\":\"Nice\",\"lang\":\"bg\"}"))
            .andExpect(status().isCreated());
        assertThat(repository.count()).isEqualTo(before + 1);
        assertThat(repository.findAllByOrderByCreatedAtDesc().get(0).getTags()).isEqualTo("Fun, Too hard");
    }

    @Test
    void emptyFeedbackIsRefused() throws Exception {
        mvc.perform(post("/api/play-feedback").contentType(MediaType.APPLICATION_JSON).content("{\"stars\":3}"))
            .andExpect(status().isBadRequest());
    }

    @Test
    void onlyAnAdminCanReadIt() throws Exception {
        mvc.perform(get("/api/play-feedback")).andExpect(status().isUnauthorized());
    }
}
