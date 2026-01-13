-- V5: Seed all production data - Roman history chapters for Ave Caesar
DELETE FROM quiz_attempts;
DELETE FROM batch_progress;
DELETE FROM batch_questions;
DELETE FROM quiz_batches;
DELETE FROM question_correct_answers;
DELETE FROM question_options;
DELETE FROM questions;
DELETE FROM chapters;
DELETE FROM topics;
-- Insert topics (if not already present)
INSERT INTO topics (id, description, title, period_id) VALUES
(1, 'The Foundation of an Empire (753-509 BCE)', 'Early Roman History', 1);
INSERT INTO topics (id, description, title, period_id) VALUES
(4, 'Roman political development 450-367 BCE', 'Early Republic: Political Conflict (450-367 BCE)', 1);
INSERT INTO topics (id, description, title, period_id) VALUES
(5, 'Roman history period of 367-264 BCE', 'Early Republic: Military Expansion and Conquest (367-264 BCE)', 1);
INSERT INTO topics (id, description, title, period_id) VALUES
(6, 'Political and military development of the Middle Republic', 'Middle Republic: The Punic Wars and Mediterranean Dominance (264-146 BCE)', 1);
INSERT INTO topics (id, description, title, period_id) VALUES
(7, 'Internal political and socio-economic development of the Middle Republic', 'Middle Republic: Social Transformation and Political Crisis (264-121 BCE)', 1);

-- Insert chapters with full content
INSERT INTO chapters (id, content, title, topic_id) VALUES

(1, '# Early Rome & the Kingdom: The Foundation of an Empire (753-509 BCE)

## Introduction to the Regal Period

The history of Rome begins not with empirical historical records, but with legend—a blend of mythology, religious tradition, and the gradual emergence of archaeological evidence. The period known as the Regal Period, or Kingdom of Rome, spans from the traditional founding date of 753 BCE to the fall of the monarchy in 509 BCE. During these two and a half centuries, Rome transformed from a small settlement of shepherds and farmers on the Tiber River into a significant regional power in central Italy, complete with sophisticated political institutions, a distinctive socio-economic structure, and cultural practices that would endure for centuries.

The sources for understanding Early Rome are uniquely challenging. Unlike ancient Greece, which had written records from an early period, Rome''s earliest history was preserved primarily through oral tradition, later compiled into literary narratives by historians such as Livy (Titus Livius, 59 BCE - 17 CE) and Plutarch (46-120 CE), who wrote centuries after the events they described. These sources blend historical fact with legendary embellishment, making it necessary to approach them critically. Archaeological evidence, including pottery fragments, architectural remains, and burial sites excavated on the Palatine Hill and Roman Forum, provides crucial corroboration and often challenges or refines the literary accounts.

## The Foundation Myth: Romulus and Remus

### The Legend

According to Roman tradition, Rome was founded on April 21, 753 BCE by Romulus, a descendant of the Trojan hero Aeneas. The story, as told primarily by Livy and Plutarch, unfolds as follows: Aeneas, fleeing the destruction of Troy, settled in Latium and married Lavinia, the daughter of the local king. Their descendants ruled Alba Longa, a city in the Alban Hills, until King Numitor was overthrown by his brother Amulius. To prevent any challenge to his rule, Amulius forced Numitor''s daughter, Rhea Silvia, to become a Vestal Virgin—sworn to chastity and service to the goddess Vesta.

However, the god Mars seduced Rhea Silvia, and she gave birth to twin sons: Romulus and Remus. Amulius, viewing the twins as a threat, ordered them drowned in the Tiber River. The infants were placed in a basket that washed ashore. A she-wolf (lupa) found them and nursed them; a shepherd named Faustulus discovered them and raised them as his own. As adults, the brothers learned their true identity, overthrew Amulius, and restored their grandfather Numitor to the throne.

The brothers then decided to found a new city on the Tiber, but disagreed about its location. According to legend, Romulus favored the Palatine Hill, while Remus preferred the Aventine Hill. They decided to consult the auspices (divine signs) by observing birds. Romulus reportedly saw twelve vultures, while Remus saw only six. Romulus claimed victory and began building walls around the Palatine. In anger, Remus either jumped over the wall in mockery (according to some accounts) or was killed by Romulus for transgressing the sacred boundary. Romulus thus became sole founder and first king of Rome.

## The Seven Kings of Rome

Roman tradition held that Rome was ruled by seven kings before the establishment of the Republic in 509 BCE. The historical reliability of these accounts varies considerably, with the early kings being largely legendary and the later kings more firmly grounded in historical reality.

[Content continues with detailed descriptions of the Seven Kings...]', 'Early Rome & the Kingdom: The Foundation of an Empire (753-509 BCE)', 1),

(2, '# Early Republic: The Conflict of the Orders - Origins (509-450 BCE)

## Introduction: The Republic Begins

The abolition of the monarchy in 509 BCE did not simply replace a king with a different ruler. Instead, the Romans fundamentally restructured their government, creating a system that distributed power among multiple officials, limited their terms, and subjected them to law. For a citizen accustomed to the Kingdom period, the Republic would have felt radically different in both theory and practice.

## The Central Conflict: Patricians vs. Plebeians

The Early Republic''s defining political struggle was between two distinct social groups: the **patricians** (*patricii*) and the **plebeians** (*plebeii*). Understanding this fundamental division is essential to understanding the entire Early Republican period.

### Who Were the Patricians and Plebeians?

The **patricians** were Rome''s aristocratic families—the elite class that had dominated Rome since the Kingdom period. They traced their lineage to the earliest Roman settlers and claimed descent from Rome''s founders. Patricians monopolized the priesthoods, held the majority of magistracies, and controlled vast landholdings.

The **plebeians** were Rome''s common people—farmers, merchants, artisans, soldiers, and laborers. Some plebeians were wealthy and owned land; others were poor. Plebeians were not slaves (a separate group entirely), but they were formally excluded from political participation and religious authority.

[Content continues with detailed description of the Conflict of the Orders...]', 'Early Republic: The Conflict of the Orders - Origins (509-450 BCE)', 1),

(3, '# Early Republic: The Conflict of the Orders - Toward Resolution (450-367 BCE)

## Introduction – The Struggle Continues

The Twelve Tables had given plebeians written law and formal legal protections, but they had not solved the fundamental problem: plebeians still could not hold the highest offices. The century following 450 BCE would see plebeians intensify their demands for political access with renewed intensity.

## The Gallic Invasion (390 BCE)

### The Gauls: Who Were They and Where Did They Come From?

To understand the invasion that shocked Rome in 390 BCE, we must first understand who the Gauls were and why they were moving into the Mediterranean world at this time.

The **Gauls** (also called **Celts** or **Galatians** in different regions) were Indo-European peoples originating from Central Europe and the Danube region. They spoke Celtic languages and practiced a warrior culture centered on honor, martial prowess, and aristocratic competition.

[Content continues with details about the Gallic invasion and subsequent developments...]', 'Early Republic: The Conflict of the Orders - Toward Resolution (450-367 BCE)', 1),

(4, '# The Samnite Wars (367-290 BCE)

## Introduction – From Regional Dominance to Complete Control

With the defeat of the Samnite coalition in 290 BCE, Rome had eliminated its greatest rival and stood as the dominant power in the Italian peninsula. The Samnite Wars demonstrated Rome''s military resilience, adaptability, and determination to overcome formidable opponents.

## Who Were the Samnites? Understanding Italy''s Peoples

The Samnites were an Italic people inhabiting the mountainous regions of central and southern Italy—modern-day Campania, Basilicata, and Molise. They spoke an Italic language related to Latin and shared Indo-European cultural roots with other Italic peoples, including Romans.

The Samnite territory was rugged and mountainous, quite different from the relatively flat Latin plains where Rome originated. This terrain shaped Samnite society and military tactics. The mountains provided natural defensibility, made cavalry maneuvers difficult, and favored infantry combat in rough terrain. Samnite warriors became expert at mountain warfare and fighting in broken terrain.

[Content continues with comprehensive coverage of the three Samnite Wars...]', 'The Samnite Wars (367-290 BCE)', 1),

(5, '# Final Conquest of Italy (290-264 BCE)

## Introduction – From Regional Dominance to Complete Control

With the defeat of the Samnites in 290 BCE, Rome had eliminated its greatest Italian rival and stood as the dominant power in the Italian peninsula. However, Rome had not yet achieved complete control of Italy. Several regions and peoples remained independent or only loosely allied to Rome.

## The Remaining Independent Peoples of Italy

After the Samnite Wars, several significant territories remained outside direct Roman control:

**Southern Italy and the Greek Cities**: The southern tip of the Italian peninsula and Sicily contained Greek city-states established centuries earlier as colonies of Greek mother-cities.

**Lucania and Bruttium**: The regions south of Samnium contained various peoples who had been allies of the Samnite coalition.

**Etruria**: The Etruscan cities of northern Italy remained partially independent.

**Gauls**: Gallic peoples in Cisalpine Gaul remained unconquered.

By 264 BCE, Rome had consolidated control of the entire Italian peninsula, setting the stage for Mediterranean dominance and conflict with Carthage.', 'Final Conquest of Italy (290-264 BCE)', 1),

(6, '# The First Punic War (264-241 BCE)

## Introduction – Rome and Carthage on a Collision Course

By 264 BCE, Rome had completed the conquest of the Italian peninsula and stood unchallenged as the dominant power in the central Mediterranean. However, Rome''s rise had created an inevitable confrontation with another great power: **Carthage**, the wealthy Phoenician city-state that dominated the western Mediterranean.

## Carthage: Rome''s New Rival

The **Phoenicians** were an ancient Mediterranean people renowned throughout the ancient world as merchants, traders, and seafarers. The Phoenicians built a commercial empire through trade, merchant networks, and strategic trading posts rather than through land-based conquest like the Greeks or Romans.

**Carthage** was founded around 814 BCE as a Phoenician colony and gradually became the leading Phoenician power. Over centuries, Carthage grew from a settlement into an empire, controlling the western Mediterranean trade, establishing colonies throughout the Mediterranean, and developing naval supremacy.

### Carthaginian Civilization and Society

Unlike Rome, which had developed a complex republican system with Senate, magistrates, and assemblies, Carthage maintained a more oligarchic structure dominated by wealthy merchant families. Carthage''s primary military strength was its navy—the largest and most advanced naval fleet of the western Mediterranean. For land warfare, Carthage relied on mercenary armies recruited from various peoples.

## The Causes of Conflict: Sicily and Intervention

Sicily in 264 BCE was politically fragmented and in flux. Sicily was the wealthiest and most productive agricultural region of the Mediterranean. Carthage had controlled much of Sicily for centuries and viewed it as essential to Carthaginian power and prosperity.

The immediate trigger for war came from the city of **Messana**, located on the northeastern tip of Sicily. Messana was controlled by Italian mercenaries called the **Mamertines**. When Messana faced destruction from both Syracuse and Carthage, the Mamertines appealed to Rome for assistance.

Rome decided to intervene, and this intervention led directly to war with Carthage. The **First Punic War** (264-241 BCE) lasted over 20 years and resulted in Rome''s victory, the conquest of Sicily, and the establishment of Rome as a Mediterranean naval power.', 'First Punic War (264-241 BCE)', 1),

(7, '# The Second Punic War (218-201 BCE)

## Introduction – The Rematch That Nearly Destroyed Rome

The First Punic War ended in 241 BCE with Rome victorious and Carthage defeated—but not destroyed. Carthage, though weakened and humiliated, remained a formidable Mediterranean power. The peace of 241 BCE was understood as a temporary truce, not a lasting settlement.

For two decades after the First War, both powers rebuilt their military capabilities and positioned themselves for renewed conflict. The Second Punic War (218-201 BCE), when it came, would be even more brutal than the first. It would last 17 years, bring unprecedented devastation to Italy, and nearly destroy Rome itself. It would be shaped by a single military genius: **Hannibal Barca**.

## Carthage Between the Wars: Recovery and Expansion (241-220 BCE)

Carthage emerged from the First Punic War severely weakened. The war indemnity of 3,200 talents had to be paid to Rome. The loss of Sicily had deprived Carthage of crucial agricultural wealth. Carthaginian military forces had been reduced.

However, Carthage demonstrated remarkable economic resilience. Carthaginian merchants recovered and expanded their commercial operations. Within decades, Carthage had recovered economically through commerce and established a new power base in Spain under the leadership of **Hamilcar Barca**.

## Hannibal''s Invasion of Italy

In 218 BCE, Hannibal led his army northward from Spain toward Italy in one of the most famous military marches in history. Hannibal commanded approximately 90,000 men—infantry, cavalry, and war elephants. He crossed the Alps in winter conditions, suffering enormous casualties but ultimately descending into the Italian peninsula with a formidable army.

### Early Italian Victories and the Crisis

Hannibal''s first engagements with Roman forces occurred in northern Italy. In a series of skirmishes and battles, Hannibal''s army defeated Roman forces sent to oppose his invasion. The **Battle of Trebia River (218 BCE)** was the first major engagement, with Hannibal''s army defeating a Roman force.

Over the following years, Hannibal maneuvered through Italian territories, winning victories that demonstrated superior tactical flexibility compared to Roman commanders.

### The Catastrophe at Cannae (216 BCE)

The most disastrous military defeat Rome would suffer throughout its history occurred at **Cannae** in 216 BCE. Rome had mobilized approximately 80,000 soldiers to confront Hannibal. The battle resulted in massive Roman casualties—approximately 80,000 soldiers were killed, wounded, or captured on a single day.

Hannibal''s victory at Cannae was achieved through superior tactical thinking, particularly his use of a **double envelopment**—a tactical maneuver where Hannibal''s forces allowed the Roman center to advance and then closed in from the flanks and rear, trapping the Roman army.

### Rome''s Recovery and Scipio''s Rise

Despite the disaster at Cannae, Rome did not surrender. Rome shifted to a strategy of containment and rebuilding under **Fabius Maximus**, who advocated for a war of attrition. Eventually, a young Roman commander named **Scipio Africanus** emerged as Rome''s greatest general.

Scipio conducted brilliant campaigns in Spain, defeating Carthaginian forces and eliminating Carthaginian power in Spain by 206 BCE. Scipio then invaded Carthage''s homeland in North Africa, forcing Carthage to recall Hannibal from Italy.

### The Final Battle and Rome''s Victory

The final major engagement occurred at **Zama** in North Africa in 202 BCE, where Scipio and Hannibal faced each other in battle. Scipio''s superior strategic thinking and Rome''s improved tactical proficiency gave Rome the advantage. Hannibal''s army was defeated.

After Zama, Carthage''s position was hopeless. Carthage sued for peace. The **Treaty of 201 BCE** ended the Second Punic War, with Carthage ceding territories to Rome, paying an enormous war indemnity, and accepting severe military restrictions.

## The Significance of the Second Punic War

The Second Punic War was arguably the greatest crisis Rome would face in its entire history. Hannibal had nearly destroyed Rome''s Mediterranean dominance. At Cannae, Rome had suffered a catastrophic military defeat that nearly broke Roman power.

However, Rome survived through institutional capacity, strategic flexibility, and military adaptation. Rome eventually produced commanders of equivalent skill—Scipio Africanus proved capable of defeating Hannibal. Rome''s resilience and determination ultimately prevailed.

For Carthage, the war marked the beginning of irreversible decline. Though Carthage would survive for another 50 years, Carthage would never again challenge Rome''s dominance.', 'Second Punic War (218-201 BCE)', 1),

(8, '# Rome''s Dominance and the Third Punic War (201-146 BCE)

## Introduction – The Final Destruction of Carthage

With Carthage defeated and contained by the treaty of 201 BCE, Rome''s attention turned decisively to the eastern Mediterranean. Rome no longer had to divide its military resources between fighting Carthage and eastern expansion. Rome could now project full military power eastward.

### The War Against Macedonia and the Seleucid Empire

Rome''s military dominance in the eastern Mediterranean was further demonstrated through conflicts with the **Macedonian Kingdom** and the **Seleucid Empire**—two of the great Hellenistic powers.

The **Second Macedonian War (200-196 BCE)** saw Rome defeat **Philip V** and his Macedonian forces at the **Battle of Cynoscephalae** in 197 BCE. The battle demonstrated that the famous Macedonian military system was inferior to the Roman legionary system when led by a skilled commander like **Flamininus**.

The **Syrian War (192-188 BCE)** saw Rome defeat **Antiochus III** and the vast Seleucid Empire. Rome emerged as the dominant military power of the entire Mediterranean and Near Eastern world.

## Carthage''s Predicament: Recovery Under Constraints

Carthage emerged from the Second War severely weakened by the harsh treaty terms: a crushing war indemnity of 10,000 talents, territorial losses including Spain, severe military restrictions, and political subjugation to Rome.

However, Carthage demonstrated remarkable economic recovery through commerce. Carthaginian merchants rebuilt their trade networks throughout the Mediterranean, and within decades, Carthage had recovered economically though weakened politically.

### Masinissa and the Harassment of Carthage

Carthage''s greatest problem in the post-201 BCE period came not from Rome directly, but from Rome''s North African ally: **Masinissa**, the king of **Numidia**. Throughout the period from 180 to 149 BCE, Masinissa engaged in a relentless campaign of harassment, raids, and territorial aggression against Carthage.

Rome tolerated or encouraged Masinissa''s aggression, effectively using him as a tool to weaken Carthage while maintaining plausible deniability about attacking a supposed ally.

## Cato the Elder and the Rise of Anti-Carthage Sentiment

**Cato the Elder**, a prominent Roman politician, began a relentless political campaign in the Roman Senate arguing that Carthage remained a threat and that Rome should destroy Carthage permanently. Cato became famous for ending virtually every speech with the phrase:

**"Carthago delenda est"** ("Carthage must be destroyed!")

This phrase became a rallying cry for anti-Carthage sentiment in Rome. By the late 150s BCE, Cato''s message had gained substantial support in the Roman Senate.

## The Third Punic War (149-146 BCE)

The Third Punic War was brief and one-sided. Carthage, weakened by decades of restriction and harassment, had no realistic prospect of defeating Rome''s powerful legions.

Roman forces, commanded by **Scipio Aemilianus**, landed in North Africa and besieged Carthage itself. After approximately three years of siege, the city''s defenses were overwhelmed. Carthage fell to Roman forces.

### The Destruction of Carthage

Roman forces systematically destroyed Carthage. The city was burned. Buildings were demolished. The population was either killed or enslaved. Six centuries of Carthaginian civilization were reduced to ruins.

According to some ancient sources, Roman forces deliberately salted the earth around Carthage as a symbolic gesture—ensuring that Carthage''s fields would be barren and that the city could never be rebuilt. While this detail may be partly legendary, it captures the symbolic reality: Rome was not merely defeating Carthage, Rome was ensuring that Carthage would never rise again.

## The Significance of Carthage''s Destruction

The destruction of Carthage in 146 BCE marked the absolute end of the Rome-Carthage rivalry. With Carthage destroyed and Macedonia conquered, Rome now controlled or dominated the entire Mediterranean world.

Rome''s legions were feared throughout the Mediterranean. No power possessed military forces capable of resisting Rome. The **Pax Romana** began to spread across the Mediterranean world.

However, the conquest of the Mediterranean created new challenges for Rome. Control of a vast empire required new administrative structures, new military deployments, and new political arrangements. The expansion would reshape Roman politics and society in ways that would eventually lead to internal conflicts and the transformation of the Republic into the Empire.', 'Rome''s Dominance and the Third Punic War (201-146 BCE)', 1),

(9, '# Wealth Inequality and Reform: The Gracchi Crisis (200-121 BCE)

## Introduction – The Paradox of Victory

Rome''s triumph in the Punic Wars transformed the Mediterranean world. Rome emerged as the undisputed master of the ancient world. Yet victory created a problem that would eventually threaten Rome itself: the wealth that flowed into Italy from conquest and trade concentrated in the hands of a wealthy elite, reshaping the entire structure of Roman life.

## The Traditional Roman Economy: The Smallholding Farmer

Before the Punic Wars, Roman agriculture was dominated by the **smallholding farmer**—the owner of a modest **fundus** (farm/estate), typically 5-10 acres, worked it primarily with his own family''s labor.

This farmer was the backbone of Roman society. As the **paterfamilias** (head of household), he owned his property outright. He wasn''t wealthy, but he was independent. He had a stake in Rome''s stability and success. Crucially, he was expected to serve in Rome''s armies as a citizen-soldier.

This combination—independent farmer + citizen-soldier—created a particular kind of Roman society where the military depended on citizen-soldiers with a personal stake in defending Rome.

## The Punic Wars and the Displacement of Farmers

The Punic Wars placed extraordinary demands on smallholding farmers. Military conscription during the First Punic War (264-241 BCE) removed men from their farms for 23 years. The Second Punic War (218-201 BCE) required military service for another 17 years.

A **fundus** owner conscripted in 218 BCE might not return until 200 BCE—nearly two decades away from his property. The consequences were severe: unattended farms deteriorated, family members struggled to maintain agricultural productivity, debt accumulated, and returning veterans often faced financial ruin.

## The Rise of Latifundia

The second part of the problem was even more destructive: the explosion of slavery in Italy after the Punic Wars. As Rome conquered new territories, Rome enslaved hundreds of thousands of prisoners of war. These enslaved people were brought to Italy and put to work, fundamentally altering the economics of agriculture.

Enslaved labor eliminated the largest cost of farming: wages. A smallholding **fundus** required a farmer and his family to invest labor and accept modest returns. A large estate worked entirely by enslaved laborers required no wage payments.

A **latifundium** (plural: **latifundia**) was a vast agricultural estate, often comprising thousands of acres, owned and controlled by a single wealthy family. These weren''t just bigger versions of family farms—they were fundamentally different, worked by enslaved people, specialized in high-value crops for export, and owned by wealthy aristocrats who often never set foot on the property.

For wealthy Roman investors, latifundia made perfect economic sense. After the Punic Wars, Rome had abundant enslaved labor, access to conquered markets, political power to enforce the system, and capital for investment. Wealthy families could buy up small farms and consolidate them into latifundia at enormous profit.

## The Displaced Farmers: The Urban Crisis

As latifundia expanded and small farms disappeared, displaced farmers migrated to Rome itself. Rome''s population exploded in the 2nd century BCE. Based on modern estimates, the capital city grew from roughly 200,000 people to over 500,000. A significant portion came from rural migrants—small farmers who had lost their land.

But Rome''s cities didn''t have enough jobs for hundreds of thousands of rural migrants. The result was a growing class of **free men with no land, no stable employment, and no reliable income**. These were not enslaved people—they were free Roman citizens. But they had no property, no security, no way to sustain themselves independently.

## The Food Supply Crisis

Here''s a crucial detail that would shape Rome''s politics for generations: **Rome and Italy could not feed themselves**.

Most of Italy''s agricultural production was now concentrated in latifundia controlled by export-oriented owners. These owners had every incentive to export grain for profit rather than feed the local population.

As a result, Rome came to depend on imported grain from overseas provinces—particularly Sicily, Egypt, and North Africa. Rome''s urban population of over 500,000 people required constant grain imports to survive.

This created extraordinary political vulnerability. Whoever controlled the grain trade controlled Rome.

## The Gracchi and the Attempt to Reform Rome

### Tiberius Gracchus and His Vision

**Tiberius Gracchus** (born around 163 BCE) was the elder brother from the aristocratic **Sempronia family**. Unlike most senators, Tiberius had observed Rome''s transformation and believed that Rome''s survival required fundamental reform.

Tiberius''s diagnosis was clear: **Rome''s central problem was the loss of small farmers and the concentration of land in aristocratic hands**. If Rome lost the independent farmer-citizen, Rome would lose the foundation of its military power and its Republican ideals.

His solution was direct and radical: **redistribute land to landless citizens**.

Tiberius''s reform was built on the concept of **ager publicus** (public land). When Rome conquered new territories, the conquered land technically became property of the Roman state. However, wealthy aristocrats had gradually taken control of vast tracts of this public land. Tiberius proposed that wealthy landowners be limited in how much public land they could control. Excess land would be redistributed to landless citizens in small plots, recreating the farmer-citizen class.

In 133 BCE, Tiberius was elected **tribune of the people** and immediately proposed his land reform legislation. The Senate''s response was fierce and immediate opposition. These families had grown wealthy through control of **ager publicus**. Enforcing legal limits on public land would reduce their wealth, their power, and their status.

The Senate used legal mechanisms to block Tiberius''s legislation, but Tiberius used his veto power as tribune to block Senate actions until the Senate agreed to allow his proposal to be voted on.

The Senate then deployed another strategy: another tribune—a man named **Octavius**—agreed to veto Tiberius''s proposal. Tiberius responded with an unprecedented action: he proposed that the **plebs** vote to remove Octavius from office as tribune. The **plebs** voted. Octavius was removed from office. Tiberius''s reform proposal went to a vote and passed.

### The Aftermath and Tiberius''s Death

The land redistribution actually occurred. Over the following years, thousands of landless Romans received plots of land. However, Tiberius had made enemies. The Senate and the wealthy aristocracy viewed his actions as dangerous—a threat to their power and their property.

Tiberius''s attempts to consolidate his reforms created a constitutional crisis. He proposed standing for re-election as tribune to protect the land commission, but the Senate viewed this as a threat: a tribune attempting to maintain continuous power by repeatedly seeking re-election.

The confrontation came to a head during voting in 133 BCE. A group of senators—led by **Scipio Nasica Serapio**, a senior senator—organized armed opponents to prevent the vote. Violence erupted. Tiberius and several hundred of his supporters were killed.

What made this killing so shocking was the violation of sacred law: tribunes were **inviolable**—protected by law, their persons sacred. By murdering Tiberius, the Senate had violated one of Rome''s most fundamental legal principles. Most shocking: Scipio Nasica faced no prosecution or consequence. The Senate protected him.

### Gaius Gracchus: The Continuation of Reform

Twelve years later, Tiberius''s younger brother **Gaius Gracchus** was elected tribune. Gaius was even more ambitious than Tiberius. He proposed a comprehensive program of social and political reform:

- Continue and expand land reform
- Provide subsidized grain to the urban poor
- Grant Roman citizenship to Rome''s Italian allies
- Reduce Senate control of courts and empower the **equestrians** (wealthy non-senatorial businessmen)

Gaius successfully pushed through several of his reforms. However, the Senate organized fierce opposition. In 121 BCE, political conflict escalated into open violence. Gaius and thousands of his supporters were killed, as the Senate violently suppressed the reform movement.

## The Aftermath: The System Breaks

The Gracchi were dead. Their most radical reforms were reversed or limited by subsequent senates. The aristocracy had successfully crushed the reform movement through violence.

However, the Gracchi had exposed something fundamental: Rome''s political system was broken in ways that violence alone could not fix. The contradictions they had identified—land concentration, urban dependency, aristocratic dominance—remained. And they would continue to generate conflict.

The grain law they had established remained in place, preventing mass starvation but also becoming a permanent feature of Roman politics. The land redistribution continued, though limited.

But the deeper problem remained: The Senate had demonstrated that it would use violence to maintain its power. It had murdered tribunes and senators with impunity. It had shown that Rome''s legal and constitutional traditions meant nothing when aristocratic power was threatened.

The Gracchi reforms had failed in their immediate objectives. But they had succeeded in demonstrating that the system itself was the problem. The next century of Roman history would be shaped by repeated attempts to address the same contradictions—attempts increasingly led by military generals rather than tribunes, increasingly resolved through civil war rather than law.

In a sense, the Gracchi had won a deeper victory: they had proven that Rome''s traditional political system could not indefinitely withstand the pressure created by extreme inequality and aristocratic dominance. The Republic would survive another century, but it would never recover from the damage that the Gracchi crisis had inflicted. The violence of 133 and 121 BCE had broken something fundamental in Rome''s political culture—the assumption that law and tradition could constrain aristocratic power.', 'Wealth Inequality and Reform: The Gracchi Crisis (200-121 BCE)', 1);

-- V5: Complete seed data for Ave Caesar - topics, chapters, questions, and options


-- Insert questions (60 questions for Chapter 1)
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (93, 1, 1, 'According to Roman legend, in what year was Rome founded?', '#introduction-to-the-regal-period');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (94, 1, 1, 'Who were the legendary twin founders of Rome?', '#the-foundation-myth-romulus-and-remus');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (95, 1, 1, 'According to the legend, who was the mother of Romulus and Remus?', '#the-foundation-myth-romulus-and-remus');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (96, 1, 1, 'In the legend, what animal nursed the infant twins Romulus and Remus?', '#the-foundation-myth-romulus-and-remus');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (97, 1, 1, 'How many kings ruled Rome during the Regal Period?', '#the-seven-kings-of-rome');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (98, 1, 1, 'In what year did the Roman Kingdom end and the Republic begin?', '#the-end-of-the-kingdom-and-transition-to-the-republic');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (99, 1, 1, 'According to tradition, what event led to the expulsion of Tarquinius Superbus?', '#7-tarquinius-superbus-534-509-bce');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (100, 1, 1, 'Which legendary figure led the revolt against Tarquinius Superbus?', '#the-end-of-the-kingdom-and-transition-to-the-republic');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (101, 1, 1, 'Which civilization significantly influenced Rome during the Kingdom period?', '#etruscan-influence');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (102, 1, 1, 'From which region of Italy did the Etruscans come?', '#etruscan-influence');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (103, 1, 1, 'Which social class held the most political power in Early Rome?', '#patricians-patres-familias');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (104, 1, 1, 'What was the primary role of the Roman Senate?', '#the-senate');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (105, 1, 1, 'Which assembly was organized by family groups called curiae?', '#assemblies-of-the-people');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (106, 1, 1, 'What was the role of the paterfamilias in Early Rome?', '#patricians-patres-familias');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (107, 1, 1, 'What was the primary economic basis of Early Rome?', '#economic-basis');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (108, 1, 1, 'What was the main purpose of the patron-client relationship?', '#plebeians');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (109, 1, 1, 'Which Vestal Virgin''s primary duty was especially important?', '#religious-practice');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (110, 1, 1, 'What was the primary role of the Pontifex Maximus?', '#religious-authority');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (111, 1, 1, 'Which of these was NOT a major Roman god during the Kingdom?', '#the-roman-pantheon');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (112, 1, 1, 'What was the Comitia Centuriata primarily used for?', '#assemblies-of-the-people');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (113, 1, 1, 'Which king is credited with establishing religious practices and the calendar?', '#2-numa-pompilius-715-673-bce');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (114, 1, 1, 'Which king is associated with the combat of the Horatii and Curiatii?', '#3-tullus-hostilius-673-642-bce');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (115, 1, 1, 'What did King Tarquinius Priscus introduce from Etruscan culture?', '#5-tarquinius-priscus-616-579-bce');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (116, 1, 1, 'Which structures did Tarquinius Priscus begin to construct?', '#5-tarquinius-priscus-616-579-bce');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (117, 1, 1, 'Which king reorganized Rome''s military based on wealth and property?', '#6-servius-tullius-579-534-bce');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (118, 1, 1, 'What was used to observe the divine will in Roman religion?', '#religious-practice');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (119, 1, 1, 'What was the primary purpose of the Cloaca Maxima?', '#infrastructure-and-urban-development');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (120, 1, 1, 'What was divination through examining animal organs called?', '#religious-practice');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (121, 1, 1, 'Which king is legendary for the rape of Lucretia incident?', '#7-tarquinius-superbus-534-509-bce');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (122, 1, 1, 'Which king established the Servian system of centuries?', '#6-servius-tullius-579-534-bce');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (123, 1, 2, 'How did Servius Tullius''s reforms differ most significantly from earlier kings?', '#6-servius-tullius-579-534-bce');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (124, 1, 2, 'What can we infer about Etruscan influence on Rome from the later kings'' practices?', '#etruscan-influence');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (125, 1, 2, 'Why was Servius Tullius''s wealth-based military system revolutionary?', '#6-servius-tullius-579-534-bce');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (126, 1, 2, 'What does the shift from Comitia Curiata to Comitia Centuriata represent?', '#assemblies-of-the-people');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (127, 1, 2, 'What does the Lucretia legend reveal about late Kingdom tensions?', '#7-tarquinius-superbus-534-509-bce');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (128, 1, 2, 'Why would Tarquinius Priscus build the Temple of Jupiter?', '#5-tarquinius-priscus-616-579-bce');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (129, 1, 2, 'How did patron-client relationships provide social stability in Rome?', '#plebeians');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (130, 1, 2, 'What practical benefit did the Cloaca Maxima provide Rome?', '#infrastructure-and-urban-development');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (131, 1, 2, 'Why were religious and political authority linked in Rome?', '#religious-authority');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (132, 1, 2, 'What does the progression from Numa''s religious emphasis to Tarquinius Priscus''s building projects suggest about Roman priorities?', '#religious-practice');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (133, 1, 2, 'How do scholars reconcile the Romulus and Remus myth with archaeology?', '#historical-reality-vs-legend');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (134, 1, 2, 'What challenge faces historians writing about Early Rome centuries later?', '#literary-sources');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (135, 1, 2, 'What does Palatine Hill archaeology reveal about Rome''s founding?', '#archaeological-evidence');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (136, 1, 2, 'Which approach best helps understand Early Rome despite source problems?', '#literary-sources');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (137, 1, 2, 'What does the patrician-plebeian divide tell us about Rome?', '#patricians-patres-familias');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (138, 1, 2, 'How do scholars distinguish legend from probable history in Rome?', '#historical-reality-vs-legend');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (139, 1, 2, 'What does Rome''s frequent religious practice suggest about society?', '#religious-authority');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (140, 1, 2, 'What evidence suggests Rome adopted Etruscan practices through cultural contact rather than military conquest?', '#etruscan-influence');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (141, 1, 2, 'What does Rome''s complex institutions suggest about development?', '#assemblies-of-the-people');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (142, 1, 2, 'How should scholars evaluate whether the Lucretia story reflects actual historical events?', '#7-tarquinius-superbus-534-509-bce');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (143, 1, 3, 'What does the Lucretia narrative suggest about Rome''s political transition?', '#7-tarquinius-superbus-534-509-bce');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (144, 1, 3, 'Which of the following did Servius Tullius introduce through his constitutional reforms? (Multiple answers)', '#6-servius-tullius-579-534-bce');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (145, 1, 3, 'How does the Servian Constitution represent a pivotal social moment?', '#6-servius-tullius-579-534-bce');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (146, 1, 3, 'Which factors contributed to Rome''s cultural synthesis? (Multiple answers)', '#culture-and-religion');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (147, 1, 3, 'How did patron-client systems both reinforce and aid society?', '#plebeians');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (148, 1, 3, 'What major shifts do the Comitia changes reveal? (Multiple answers)', '#servius-tullius-and-the-servian-reforms');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (149, 1, 3, 'What interconnected changes marked Rome''s transition to kingdom?', '#religious-authority');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (150, 1, 3, 'How were Tarquinius Priscus''s building projects strategic for Rome? (Multiple answers)', '#5-tarquinius-priscus-616-579-bce');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (151, 1, 3, 'What does extensive legendary material suggest about sources?', '#literary-sources');
INSERT INTO questions (id, chapter_id, difficulty, question, text_reference) VALUES (152, 1, 3, 'Which institutional changes established Republican foundations? (Multiple answers)', '#the-end-of-the-kingdom-and-transition-to-the-republic');

-- Insert question options (all 440+ options)
INSERT INTO question_options (question_id, option) VALUES (93, '509 BCE');
INSERT INTO question_options (question_id, option) VALUES (93, '753 BCE');
INSERT INTO question_options (question_id, option) VALUES (93, '616 BCE');
INSERT INTO question_options (question_id, option) VALUES (93, '264 BCE');
INSERT INTO question_options (question_id, option) VALUES (94, 'Aeneas and Lavinia');
INSERT INTO question_options (question_id, option) VALUES (94, 'Tarquinius and Numa');
INSERT INTO question_options (question_id, option) VALUES (94, 'Romulus and Remus');
INSERT INTO question_options (question_id, option) VALUES (94, 'Jupiter and Mars');
INSERT INTO question_options (question_id, option) VALUES (95, 'Rhea Silvia');
INSERT INTO question_options (question_id, option) VALUES (95, 'Lavinia');
INSERT INTO question_options (question_id, option) VALUES (95, 'Lucretia');
INSERT INTO question_options (question_id, option) VALUES (95, 'Egeria');
INSERT INTO question_options (question_id, option) VALUES (96, 'A golden eagle');
INSERT INTO question_options (question_id, option) VALUES (96, 'A she-wolf');
INSERT INTO question_options (question_id, option) VALUES (96, 'A lion');
INSERT INTO question_options (question_id, option) VALUES (96, 'A bear');
INSERT INTO question_options (question_id, option) VALUES (97, 'Five kings');
INSERT INTO question_options (question_id, option) VALUES (97, 'Seven kings');
INSERT INTO question_options (question_id, option) VALUES (97, 'Ten kings');
INSERT INTO question_options (question_id, option) VALUES (97, 'Three kings');
INSERT INTO question_options (question_id, option) VALUES (98, '510 BCE');
INSERT INTO question_options (question_id, option) VALUES (98, '509 BCE');
INSERT INTO question_options (question_id, option) VALUES (98, '508 BCE');
INSERT INTO question_options (question_id, option) VALUES (98, '511 BCE');
INSERT INTO question_options (question_id, option) VALUES (99, 'A military defeat in war');
INSERT INTO question_options (question_id, option) VALUES (99, 'The rape of Lucretia');
INSERT INTO question_options (question_id, option) VALUES (99, 'Economic collapse');
INSERT INTO question_options (question_id, option) VALUES (99, 'Religious displeasure');
INSERT INTO question_options (question_id, option) VALUES (100, 'Romulus');
INSERT INTO question_options (question_id, option) VALUES (100, 'Lucius Junius Brutus');
INSERT INTO question_options (question_id, option) VALUES (100, 'Numa Pompilius');
INSERT INTO question_options (question_id, option) VALUES (100, 'Servius Tullius');
INSERT INTO question_options (question_id, option) VALUES (101, 'The Greeks');
INSERT INTO question_options (question_id, option) VALUES (101, 'The Phoenicians');
INSERT INTO question_options (question_id, option) VALUES (101, 'The Etruscans');
INSERT INTO question_options (question_id, option) VALUES (101, 'The Egyptians');
INSERT INTO question_options (question_id, option) VALUES (102, 'Sicily');
INSERT INTO question_options (question_id, option) VALUES (102, 'Tuscany');
INSERT INTO question_options (question_id, option) VALUES (102, 'Campania');
INSERT INTO question_options (question_id, option) VALUES (102, 'The Latium region');
INSERT INTO question_options (question_id, option) VALUES (103, 'Plebeians');
INSERT INTO question_options (question_id, option) VALUES (103, 'Patricians');
INSERT INTO question_options (question_id, option) VALUES (103, 'Slaves');
INSERT INTO question_options (question_id, option) VALUES (103, 'Freedmen');
INSERT INTO question_options (question_id, option) VALUES (104, 'To command armies');
INSERT INTO question_options (question_id, option) VALUES (104, 'To advise the king');
INSERT INTO question_options (question_id, option) VALUES (104, 'To judge criminals');
INSERT INTO question_options (question_id, option) VALUES (104, 'To collect taxes');
INSERT INTO question_options (question_id, option) VALUES (105, 'The Comitia Centuriata');
INSERT INTO question_options (question_id, option) VALUES (105, 'The Comitia Curiata');
INSERT INTO question_options (question_id, option) VALUES (105, 'The Comitia Tributa');
INSERT INTO question_options (question_id, option) VALUES (105, 'The Comitia Plebis');
INSERT INTO question_options (question_id, option) VALUES (106, 'Military commander of armies');
INSERT INTO question_options (question_id, option) VALUES (106, 'High priest of state');
INSERT INTO question_options (question_id, option) VALUES (106, 'Head of household');
INSERT INTO question_options (question_id, option) VALUES (106, 'Collector of taxes');
INSERT INTO question_options (question_id, option) VALUES (107, 'Maritime trade');
INSERT INTO question_options (question_id, option) VALUES (107, 'Mining precious metals');
INSERT INTO question_options (question_id, option) VALUES (107, 'Agriculture and land');
INSERT INTO question_options (question_id, option) VALUES (107, 'Manufacturing goods');
INSERT INTO question_options (question_id, option) VALUES (108, 'To regulate trade');
INSERT INTO question_options (question_id, option) VALUES (108, 'To manage ceremonies');
INSERT INTO question_options (question_id, option) VALUES (108, 'To organize military training');
INSERT INTO question_options (question_id, option) VALUES (108, 'To provide protection and support');
INSERT INTO question_options (question_id, option) VALUES (109, 'Leading military campaigns');
INSERT INTO question_options (question_id, option) VALUES (109, 'Maintaining the sacred fire');
INSERT INTO question_options (question_id, option) VALUES (109, 'Collecting tribute');
INSERT INTO question_options (question_id, option) VALUES (109, 'Writing records');
INSERT INTO question_options (question_id, option) VALUES (110, 'To lead the army');
INSERT INTO question_options (question_id, option) VALUES (110, 'To manage trade');
INSERT INTO question_options (question_id, option) VALUES (110, 'To judge legal cases');
INSERT INTO question_options (question_id, option) VALUES (110, 'To provide protection and support');
INSERT INTO question_options (question_id, option) VALUES (111, 'Jupiter');
INSERT INTO question_options (question_id, option) VALUES (111, 'Mars');
INSERT INTO question_options (question_id, option) VALUES (111, 'Vesta');
INSERT INTO question_options (question_id, option) VALUES (111, 'Neptune');
INSERT INTO question_options (question_id, option) VALUES (112, 'Religious ceremonies');
INSERT INTO question_options (question_id, option) VALUES (112, 'Military organization and voting');
INSERT INTO question_options (question_id, option) VALUES (112, 'Trade regulations');
INSERT INTO question_options (question_id, option) VALUES (112, 'Criminal trials');
INSERT INTO question_options (question_id, option) VALUES (113, 'Romulus');
INSERT INTO question_options (question_id, option) VALUES (113, 'Numa Pompilius');
INSERT INTO question_options (question_id, option) VALUES (113, 'Servius Tullius');
INSERT INTO question_options (question_id, option) VALUES (113, 'Tarquinius Priscus');
INSERT INTO question_options (question_id, option) VALUES (114, 'Romulus');
INSERT INTO question_options (question_id, option) VALUES (114, 'Tullus Hostilius');
INSERT INTO question_options (question_id, option) VALUES (114, 'Numa Pompilius');
INSERT INTO question_options (question_id, option) VALUES (114, 'Ancus Marcius');
INSERT INTO question_options (question_id, option) VALUES (115, 'Democratic government');
INSERT INTO question_options (question_id, option) VALUES (115, 'Naval dominance');
INSERT INTO question_options (question_id, option) VALUES (115, 'Architectural and urban styles');
INSERT INTO question_options (question_id, option) VALUES (115, 'Agricultural reforms');
INSERT INTO question_options (question_id, option) VALUES (116, 'The Colosseum');
INSERT INTO question_options (question_id, option) VALUES (116, 'The Temple of Jupiter');
INSERT INTO question_options (question_id, option) VALUES (116, 'The Pantheon');
INSERT INTO question_options (question_id, option) VALUES (116, 'The Roman Forum');
INSERT INTO question_options (question_id, option) VALUES (117, 'Numa Pompilius');
INSERT INTO question_options (question_id, option) VALUES (117, 'Tarquinius Superbus');
INSERT INTO question_options (question_id, option) VALUES (117, 'Servius Tullius');
INSERT INTO question_options (question_id, option) VALUES (117, 'Tullus Hostilius');
INSERT INTO question_options (question_id, option) VALUES (118, 'Dreams and visions');
INSERT INTO question_options (question_id, option) VALUES (118, 'Bird observations (augury)');
INSERT INTO question_options (question_id, option) VALUES (118, 'Animal sacrifice patterns');
INSERT INTO question_options (question_id, option) VALUES (118, 'Water divination');
INSERT INTO question_options (question_id, option) VALUES (119, 'Military barracks');
INSERT INTO question_options (question_id, option) VALUES (119, 'Great sewer system');
INSERT INTO question_options (question_id, option) VALUES (119, 'Temple dedication');
INSERT INTO question_options (question_id, option) VALUES (119, 'Public market area');
INSERT INTO question_options (question_id, option) VALUES (120, 'Haruspicy');
INSERT INTO question_options (question_id, option) VALUES (120, 'Augury');
INSERT INTO question_options (question_id, option) VALUES (120, 'Sacrificial ritual');
INSERT INTO question_options (question_id, option) VALUES (120, 'Priestly prophecy');
INSERT INTO question_options (question_id, option) VALUES (121, 'Servius Tullius');
INSERT INTO question_options (question_id, option) VALUES (121, 'Tarquinius Priscus');
INSERT INTO question_options (question_id, option) VALUES (121, 'Tarquinius Superbus');
INSERT INTO question_options (question_id, option) VALUES (121, 'Tullus Hostilius');
INSERT INTO question_options (question_id, option) VALUES (122, 'Romulus');
INSERT INTO question_options (question_id, option) VALUES (122, 'Numa Pompilius');
INSERT INTO question_options (question_id, option) VALUES (122, 'Tullus Hostilius');
INSERT INTO question_options (question_id, option) VALUES (122, 'Servius Tullius');
INSERT INTO question_options (question_id, option) VALUES (123, 'Abolished the Senate');
INSERT INTO question_options (question_id, option) VALUES (123, 'Tied power to wealth, not birth');
INSERT INTO question_options (question_id, option) VALUES (123, 'Removed patrician privileges');
INSERT INTO question_options (question_id, option) VALUES (123, 'Established military rule');
INSERT INTO question_options (question_id, option) VALUES (123, 'Created direct democracy');
INSERT INTO question_options (question_id, option) VALUES (124, 'Rome rejected it entirely');
INSERT INTO question_options (question_id, option) VALUES (124, 'Rome adopted and adapted it');
INSERT INTO question_options (question_id, option) VALUES (124, 'Rome conquered Etruria');
INSERT INTO question_options (question_id, option) VALUES (124, 'It had no real impact');
INSERT INTO question_options (question_id, option) VALUES (124, 'Rome remained isolated');
INSERT INTO question_options (question_id, option) VALUES (125, 'It eliminated social classes');
INSERT INTO question_options (question_id, option) VALUES (125, 'It linked property to power');
INSERT INTO question_options (question_id, option) VALUES (125, 'It freed enslaved people through military service');
INSERT INTO question_options (question_id, option) VALUES (125, 'It removed military training');
INSERT INTO question_options (question_id, option) VALUES (125, 'It abolished the patricians');
INSERT INTO question_options (question_id, option) VALUES (126, 'Loss of political voice');
INSERT INTO question_options (question_id, option) VALUES (126, 'Strengthened patrician control');
INSERT INTO question_options (question_id, option) VALUES (126, 'Power moved to wealth');
INSERT INTO question_options (question_id, option) VALUES (126, 'Religion gained authority');
INSERT INTO question_options (question_id, option) VALUES (126, 'Democracy was created');
INSERT INTO question_options (question_id, option) VALUES (127, 'Society was completely unified');
INSERT INTO question_options (question_id, option) VALUES (127, 'Resentment of royal power');
INSERT INTO question_options (question_id, option) VALUES (127, 'Only religious concerns mattered');
INSERT INTO question_options (question_id, option) VALUES (127, 'Rome had military weakness');
INSERT INTO question_options (question_id, option) VALUES (127, 'Politics were irrelevant');
INSERT INTO question_options (question_id, option) VALUES (128, 'Religious duty only');
INSERT INTO question_options (question_id, option) VALUES (128, 'Display power and wealth');
INSERT INTO question_options (question_id, option) VALUES (128, 'Attract Etruscan settlers');
INSERT INTO question_options (question_id, option) VALUES (128, 'Reduce military costs');
INSERT INTO question_options (question_id, option) VALUES (128, 'Create trade routes');
INSERT INTO question_options (question_id, option) VALUES (129, 'Eliminated all hierarchy');
INSERT INTO question_options (question_id, option) VALUES (129, 'Built bonds across classes');
INSERT INTO question_options (question_id, option) VALUES (129, 'Gave power to plebeians');
INSERT INTO question_options (question_id, option) VALUES (129, 'Replaced government');
INSERT INTO question_options (question_id, option) VALUES (129, 'Created total equality');
INSERT INTO question_options (question_id, option) VALUES (130, 'Improved military defense');
INSERT INTO question_options (question_id, option) VALUES (130, 'Supplied fresh water');
INSERT INTO question_options (question_id, option) VALUES (130, 'Enabled urban expansion');
INSERT INTO question_options (question_id, option) VALUES (130, 'Offered religious shelter');
INSERT INTO question_options (question_id, option) VALUES (130, 'Replaced agriculture');
INSERT INTO question_options (question_id, option) VALUES (131, 'Priests controlled armies');
INSERT INTO question_options (question_id, option) VALUES (131, 'Divine approval legitimized rulers');
INSERT INTO question_options (question_id, option) VALUES (131, 'Plebeians held religious power');
INSERT INTO question_options (question_id, option) VALUES (131, 'Religion was unimportant');
INSERT INTO question_options (question_id, option) VALUES (131, 'Women controlled both');
INSERT INTO question_options (question_id, option) VALUES (132, 'Rome rejected all religious practice');
INSERT INTO question_options (question_id, option) VALUES (132, 'Military concerns replaced spiritual focus');
INSERT INTO question_options (question_id, option) VALUES (132, 'Etruscans eliminated Roman worship');
INSERT INTO question_options (question_id, option) VALUES (132, 'Plebeians seized political power');
INSERT INTO question_options (question_id, option) VALUES (132, 'Rome maintained faith while expanding materially');
INSERT INTO question_options (question_id, option) VALUES (133, 'Accept all details as historical');
INSERT INTO question_options (question_id, option) VALUES (133, 'Reject the story entirely');
INSERT INTO question_options (question_id, option) VALUES (133, 'View myth as ideology, archaeology shows gradual settlement');
INSERT INTO question_options (question_id, option) VALUES (133, 'Written and archaeological sources perfectly align');
INSERT INTO question_options (question_id, option) VALUES (133, 'The she-wolf story is archaeologically proven');
INSERT INTO question_options (question_id, option) VALUES (134, 'They had eyewitness accounts');
INSERT INTO question_options (question_id, option) VALUES (134, 'Earlier sources may be unreliable');
INSERT INTO question_options (question_id, option) VALUES (134, 'Contemporary written records survived');
INSERT INTO question_options (question_id, option) VALUES (134, 'They avoided using any sources');
INSERT INTO question_options (question_id, option) VALUES (134, 'They had no potential bias');
INSERT INTO question_options (question_id, option) VALUES (135, 'Confirms 753 BCE exactly');
INSERT INTO question_options (question_id, option) VALUES (135, 'Shows settlements from 1000 BCE');
INSERT INTO question_options (question_id, option) VALUES (135, 'Proves nothing existed before 500 BCE');
INSERT INTO question_options (question_id, option) VALUES (135, 'Contradicts all written sources');
INSERT INTO question_options (question_id, option) VALUES (135, 'Shows only Etruscan presence');
INSERT INTO question_options (question_id, option) VALUES (136, 'Use only mythological accounts');
INSERT INTO question_options (question_id, option) VALUES (136, 'Rely on excavation exclusively since texts are biased');
INSERT INTO question_options (question_id, option) VALUES (136, 'Combine texts and archaeology critically');
INSERT INTO question_options (question_id, option) VALUES (136, 'Accept legends with some critical question');
INSERT INTO question_options (question_id, option) VALUES (136, 'Read only religious texts');
INSERT INTO question_options (question_id, option) VALUES (137, 'Society was completely equal');
INSERT INTO question_options (question_id, option) VALUES (137, 'Social hierarchy was fundamental');
INSERT INTO question_options (question_id, option) VALUES (137, 'Plebeians held significant power');
INSERT INTO question_options (question_id, option) VALUES (137, 'Class didn''t matter at all');
INSERT INTO question_options (question_id, option) VALUES (137, 'Only slaves existed there');
INSERT INTO question_options (question_id, option) VALUES (138, 'All legends are definitely historical');
INSERT INTO question_options (question_id, option) VALUES (138, 'All legends are definitely false');
INSERT INTO question_options (question_id, option) VALUES (138, 'Compare sources with archaeology');
INSERT INTO question_options (question_id, option) VALUES (138, 'Accept sources without question');
INSERT INTO question_options (question_id, option) VALUES (138, 'Legends have no historical value');
INSERT INTO question_options (question_id, option) VALUES (139, 'Religion was unimportant');
INSERT INTO question_options (question_id, option) VALUES (139, 'Religion was only personal');
INSERT INTO question_options (question_id, option) VALUES (139, 'Religion legitimized political power');
INSERT INTO question_options (question_id, option) VALUES (139, 'Only priests participated');
INSERT INTO question_options (question_id, option) VALUES (139, 'Religion was imported from Greece');
INSERT INTO question_options (question_id, option) VALUES (140, 'Military conquest would eliminate all local practices');
INSERT INTO question_options (question_id, option) VALUES (140, 'Etruscans left no archaeological evidence');
INSERT INTO question_options (question_id, option) VALUES (140, 'Written records explicitly forbid invasion');
INSERT INTO question_options (question_id, option) VALUES (140, 'Etruscans were geographically too distant');
INSERT INTO question_options (question_id, option) VALUES (140, 'Voluntary adoption of cultural practices suggests peaceful exchange');
INSERT INTO question_options (question_id, option) VALUES (141, 'Rome was becoming less organized');
INSERT INTO question_options (question_id, option) VALUES (141, 'External forces controlled Rome');
INSERT INTO question_options (question_id, option) VALUES (141, 'Institutions had no real impact');
INSERT INTO question_options (question_id, option) VALUES (141, 'Rome rejected all organization');
INSERT INTO question_options (question_id, option) VALUES (141, 'Society was becoming more stratified');
INSERT INTO question_options (question_id, option) VALUES (142, 'Accept the account as completely factual');
INSERT INTO question_options (question_id, option) VALUES (142, 'Compare the narrative with other sources and evidence');
INSERT INTO question_options (question_id, option) VALUES (142, 'Reject all stories passed down by ancient authors');
INSERT INTO question_options (question_id, option) VALUES (142, 'Accept myths without any critical analysis');
INSERT INTO question_options (question_id, option) VALUES (142, 'Ignore literary sources entirely');
INSERT INTO question_options (question_id, option) VALUES (143, 'The change was entirely peaceful');
INSERT INTO question_options (question_id, option) VALUES (143, 'Tension between royal and aristocratic power emerged');
INSERT INTO question_options (question_id, option) VALUES (143, 'Military invasion caused the collapse');
INSERT INTO question_options (question_id, option) VALUES (143, 'The transition happened with no warning');
INSERT INTO question_options (question_id, option) VALUES (143, 'Economic factors were irrelevant');
INSERT INTO question_options (question_id, option) VALUES (143, 'Religious authority completely disappeared');
INSERT INTO question_options (question_id, option) VALUES (144, 'Organization of citizens into military centuries based on wealth');
INSERT INTO question_options (question_id, option) VALUES (144, 'The Comitia Centuriata voting assembly');
INSERT INTO question_options (question_id, option) VALUES (144, 'Power transferred from birth to property ownership');
INSERT INTO question_options (question_id, option) VALUES (144, 'Complete elimination of the patrician class');
INSERT INTO question_options (question_id, option) VALUES (144, 'Division of citizens into five property classes');
INSERT INTO question_options (question_id, option) VALUES (144, 'Direct democracy for all citizens');
INSERT INTO question_options (question_id, option) VALUES (145, 'Eliminated all class distinctions');
INSERT INTO question_options (question_id, option) VALUES (145, 'Gave complete power to plebeians');
INSERT INTO question_options (question_id, option) VALUES (145, 'Maintained the exact same system');
INSERT INTO question_options (question_id, option) VALUES (145, 'Created a pure democracy');
INSERT INTO question_options (question_id, option) VALUES (145, 'Abolished the Senate entirely');
INSERT INTO question_options (question_id, option) VALUES (145, 'Connected property to political power');
INSERT INTO question_options (question_id, option) VALUES (146, 'Rome''s central Italian location');
INSERT INTO question_options (question_id, option) VALUES (146, 'Contact with Etruscans');
INSERT INTO question_options (question_id, option) VALUES (146, 'Trade with Greece');
INSERT INTO question_options (question_id, option) VALUES (146, 'Complete cultural isolation');
INSERT INTO question_options (question_id, option) VALUES (146, 'Military conquest of regions');
INSERT INTO question_options (question_id, option) VALUES (146, 'Integration of varied traditions');
INSERT INTO question_options (question_id, option) VALUES (147, 'Created perfect equality');
INSERT INTO question_options (question_id, option) VALUES (147, 'Provided mutual benefits and hierarchy');
INSERT INTO question_options (question_id, option) VALUES (147, 'Eliminated government need');
INSERT INTO question_options (question_id, option) VALUES (147, 'Only benefited patricians');
INSERT INTO question_options (question_id, option) VALUES (147, 'Had no connection to hierarchy');
INSERT INTO question_options (question_id, option) VALUES (147, 'Destabilized the entire system');
INSERT INTO question_options (question_id, option) VALUES (148, 'Military century ranking determined political power');
INSERT INTO question_options (question_id, option) VALUES (148, 'Wealth became influential in governance');
INSERT INTO question_options (question_id, option) VALUES (148, 'Plebeians gradually gained power over patricians');
INSERT INTO question_options (question_id, option) VALUES (148, 'Democratic type of government gradually replaced oligarchy');
INSERT INTO question_options (question_id, option) VALUES (148, 'Kinship lost political weight');
INSERT INTO question_options (question_id, option) VALUES (148, 'Property tied to participation');
INSERT INTO question_options (question_id, option) VALUES (149, 'Religion became less important');
INSERT INTO question_options (question_id, option) VALUES (149, 'Religious authority legitimized power');
INSERT INTO question_options (question_id, option) VALUES (149, 'Politics became independent from religion');
INSERT INTO question_options (question_id, option) VALUES (149, 'Society became less organized');
INSERT INTO question_options (question_id, option) VALUES (149, 'Military replaced all authority');
INSERT INTO question_options (question_id, option) VALUES (149, 'External religions ruled Rome');
INSERT INTO question_options (question_id, option) VALUES (150, 'Served only religious purposes');
INSERT INTO question_options (question_id, option) VALUES (150, 'Showed Rome''s growing power');
INSERT INTO question_options (question_id, option) VALUES (150, 'Required large-scale coordination');
INSERT INTO question_options (question_id, option) VALUES (150, 'Established Rome as a major city');
INSERT INTO question_options (question_id, option) VALUES (150, 'Had purely ceremonial significance');
INSERT INTO question_options (question_id, option) VALUES (150, 'Absorbed Etruscan architectural knowledge');
INSERT INTO question_options (question_id, option) VALUES (151, 'All material is historically accurate');
INSERT INTO question_options (question_id, option) VALUES (151, 'Legends have no historical value');
INSERT INTO question_options (question_id, option) VALUES (151, 'Later authors blended fact and ideology');
INSERT INTO question_options (question_id, option) VALUES (151, 'Contemporary sources are objective');
INSERT INTO question_options (question_id, option) VALUES (151, 'Archaeology contradicts all texts');
INSERT INTO question_options (question_id, option) VALUES (151, 'Accept sources without critical thinking');
INSERT INTO question_options (question_id, option) VALUES (152, 'Senate was completely dissolved');
INSERT INTO question_options (question_id, option) VALUES (152, 'The Centuriata assembly continued to vote');
INSERT INTO question_options (question_id, option) VALUES (152, 'Magistrates replaced the king''s role');
INSERT INTO question_options (question_id, option) VALUES (152, 'All plebeians gained immediate equality');
INSERT INTO question_options (question_id, option) VALUES (152, 'Religious authority was maintained');
INSERT INTO question_options (question_id, option) VALUES (152, 'Patron-client relationships were abolished');

-- question_correct_answers
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (93, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (94, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (95, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (96, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (97, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (98, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (99, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (100, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (101, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (102, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (103, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (104, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (105, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (106, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (107, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (108, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (109, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (110, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (111, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (112, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (113, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (114, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (115, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (116, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (117, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (118, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (119, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (120, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (121, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (122, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (123, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (124, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (125, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (126, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (127, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (128, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (129, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (130, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (131, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (132, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (133, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (134, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (135, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (136, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (137, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (138, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (139, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (140, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (141, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (142, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (143, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (144, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (144, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (144, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (144, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (145, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (146, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (146, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (146, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (147, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (148, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (148, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (148, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (148, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (149, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (150, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (150, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (150, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (151, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (152, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (152, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (152, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (153, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (154, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (155, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (156, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (157, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (158, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (159, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (160, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (161, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (162, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (163, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (164, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (165, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (166, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (167, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (168, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (169, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (170, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (171, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (172, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (173, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (174, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (175, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (176, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (177, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (178, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (179, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (180, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (181, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (182, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (183, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (184, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (184, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (184, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (185, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (186, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (186, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (187, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (187, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (187, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (188, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (189, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (189, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (190, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (191, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (191, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (192, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (193, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (194, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (194, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (194, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (195, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (196, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (196, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (196, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (196, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (197, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (197, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (198, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (199, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (199, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (199, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (199, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (200, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (200, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (201, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (201, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (201, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (202, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (202, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (202, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (203, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (203, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (203, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (204, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (204, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (205, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (206, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (207, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (208, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (208, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (208, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (208, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (209, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (210, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (210, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (210, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (211, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (212, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (212, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (212, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (213, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (214, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (215, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (216, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (217, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (218, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (219, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (220, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (221, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (222, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (223, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (224, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (225, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (226, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (227, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (228, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (229, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (230, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (231, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (232, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (233, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (234, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (235, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (236, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (237, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (238, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (239, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (240, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (241, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (242, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (243, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (244, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (245, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (246, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (247, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (248, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (249, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (250, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (251, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (252, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (253, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (253, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (253, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (254, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (255, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (255, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (255, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (255, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (256, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (257, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (258, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (258, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (258, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (258, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (259, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (259, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (260, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (260, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (260, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (261, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (261, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (262, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (262, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (263, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (263, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (263, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (263, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (264, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (265, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (265, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (265, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (265, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (266, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (266, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (267, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (268, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (268, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (268, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (268, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (269, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (270, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (271, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (271, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (271, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (271, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (272, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (272, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (273, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (273, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (273, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (273, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (274, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (274, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (274, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (274, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (275, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (275, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (275, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (276, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (276, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (276, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (277, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (277, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (277, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (278, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (278, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (278, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (278, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (279, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (279, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (280, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (280, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (280, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (280, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (281, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (281, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (282, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (282, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (283, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (284, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (285, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (286, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (287, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (288, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (289, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (290, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (291, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (292, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (293, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (294, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (295, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (296, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (297, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (298, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (299, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (300, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (301, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (302, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (303, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (304, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (305, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (306, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (307, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (308, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (309, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (310, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (311, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (312, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (313, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (314, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (315, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (315, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (316, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (317, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (318, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (319, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (319, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (319, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (320, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (321, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (322, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (323, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (324, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (325, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (326, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (326, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (327, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (328, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (328, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (328, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (329, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (330, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (330, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (331, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (332, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (333, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (334, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (335, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (336, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (337, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (338, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (339, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (340, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (341, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (342, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (343, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (344, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (345, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (345, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (345, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (346, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (347, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (348, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (349, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (350, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (351, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (352, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (353, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (354, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (355, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (356, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (356, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (357, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (358, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (359, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (360, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (361, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (361, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (362, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (363, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (364, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (365, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (366, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (366, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (366, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (366, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (367, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (367, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (368, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (369, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (369, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (369, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (369, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (370, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (371, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (371, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (372, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (373, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (373, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (373, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (374, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (374, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (374, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (375, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (375, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (375, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (376, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (377, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (377, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (377, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (378, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (378, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (379, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (380, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (380, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (380, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (380, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (381, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (381, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (381, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (382, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (382, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (382, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (382, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (383, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (384, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (385, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (386, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (387, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (388, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (389, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (390, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (391, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (392, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (393, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (394, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (395, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (396, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (396, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (397, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (398, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (399, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (399, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (399, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (399, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (400, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (401, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (402, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (403, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (404, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (405, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (405, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (406, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (407, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (407, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (407, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (408, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (409, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (410, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (410, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (410, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (410, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (411, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (411, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (412, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (412, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (413, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (414, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (414, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (414, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (415, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (416, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (416, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (416, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (416, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (417, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (417, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (417, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (418, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (418, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (418, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (418, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (419, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (419, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (419, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (420, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (421, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (421, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (421, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (421, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (422, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (422, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (423, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (423, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (423, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (423, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (424, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (425, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (426, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (427, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (428, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (429, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (430, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (431, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (432, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (433, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (434, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (435, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (436, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (437, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (438, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (438, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (438, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (438, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (439, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (440, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (441, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (442, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (443, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (444, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (445, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (446, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (447, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (448, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (448, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (448, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (449, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (450, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (450, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (451, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (452, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (452, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (452, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (452, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (453, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (454, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (454, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (455, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (455, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (456, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (457, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (457, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (457, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (458, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (458, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (459, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (459, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (459, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (460, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (460, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (460, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (460, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (461, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (461, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (462, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (462, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (463, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (463, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (463, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (464, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (464, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (465, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (465, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (465, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (465, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (466, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (466, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (466, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (467, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (467, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (467, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (468, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (468, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (469, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (469, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (469, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (469, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (470, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (470, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (470, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (470, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (471, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (471, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (471, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (471, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (472, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (472, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (472, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (472, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (473, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (473, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (473, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (473, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (474, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (475, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (476, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (477, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (478, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (479, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (480, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (481, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (482, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (483, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (483, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (484, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (485, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (486, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (487, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (488, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (489, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (490, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (491, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (492, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (493, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (493, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (493, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (494, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (495, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (496, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (497, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (498, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (499, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (500, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (501, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (502, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (503, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (503, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (503, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (504, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (505, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (506, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (506, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (506, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (506, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (507, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (508, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (508, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (509, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (510, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (510, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (510, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (510, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (511, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (512, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (512, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (512, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (513, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (514, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (514, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (515, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (515, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (515, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (515, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (516, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (516, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (516, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (516, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (517, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (517, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (517, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (518, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (518, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (518, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (518, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (518, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (519, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (519, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (519, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (519, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (520, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (520, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (520, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (520, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (520, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (521, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (521, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (521, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (521, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (522, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (522, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (522, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (522, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (523, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (523, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (523, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (523, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (523, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (524, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (524, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (524, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (524, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (524, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (525, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (525, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (525, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (525, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (526, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (526, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (526, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (526, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (527, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (527, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (527, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (528, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (528, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (528, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (529, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (529, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (529, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (529, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (530, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (530, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (530, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (530, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (531, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (531, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (531, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (532, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (532, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (532, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (533, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (533, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (534, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (534, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (534, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (534, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (534, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (535, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (535, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (535, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (535, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (536, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (536, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (536, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (536, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (537, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (537, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (537, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (538, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (538, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (538, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (539, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (539, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (539, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (539, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (540, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (540, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (540, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (540, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (541, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (541, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (541, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (542, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (542, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (542, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (543, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (543, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (544, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (545, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (546, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (547, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (548, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (549, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (550, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (551, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (552, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (553, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (554, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (554, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (554, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (554, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (555, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (555, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (555, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (555, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (556, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (556, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (556, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (557, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (557, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (558, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (558, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (558, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (558, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (559, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (559, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (559, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (560, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (560, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (561, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (561, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (561, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (561, 5);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (562, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (562, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (562, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (562, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (563, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (563, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (564, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (565, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (566, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (567, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (568, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (569, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (570, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (571, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (572, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (573, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (574, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (575, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (576, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (577, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (577, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (577, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (578, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (579, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (580, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (581, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (582, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (582, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (582, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (583, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (584, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (585, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (586, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (586, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (586, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (587, 0);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (587, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (587, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (587, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (588, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (589, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (590, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (591, 2);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (591, 3);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (591, 4);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (592, 1);
INSERT INTO question_correct_answers (question_id, answer_index) VALUES (593, 4);
(833 rows, 18 ms)
