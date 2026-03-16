package com.example.demo.repository;

import com.example.demo.model.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SectionRepository extends JpaRepository<Section, Long> {
  List<Section> findByDiscipline(String discipline);
}