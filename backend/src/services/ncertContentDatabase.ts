import { NCERTDocument, Subject } from '../types';

/**
 * Comprehensive NCERT Content Database
 * Covering Classes 1-10 across all subjects
 * Each document contains realistic NCERT-style educational content
 */

export class NCERTContentDatabase {
  private static documents: NCERTDocument[] = [];

  static getAllDocuments(): NCERTDocument[] {
    if (this.documents.length === 0) {
      this.documents = this.generateAllContent();
    }
    return this.documents;
  }

  static getDocumentsBySubject(subject: Subject): NCERTDocument[] {
    return this.getAllDocuments().filter(doc => doc.subject === subject);
  }

  static getDocumentsByClass(classNum: number): NCERTDocument[] {
    return this.getAllDocuments().filter(doc => doc.class === classNum);
  }

  private static generateAllContent(): NCERTDocument[] {
    return [
      ...this.generateMathsContent(),
      ...this.generateScienceContent(),
      ...this.generateHistoryContent(),
      ...this.generateGeographyContent(),
      ...this.generateEnglishContent(),
    ];
  }

  // MATHEMATICS CONTENT
  private static generateMathsContent(): NCERTDocument[] {
    return [
      // Class 1-2: Basic Mathematics
      {
        id: 'math_class1_numbers',
        subject: 'maths',
        class: 1,
        chapter: 'Numbers 1 to 10',
        content: `Numbers help us count things. We use numbers every day to count toys, fruits, and friends.
        Let's learn to count from 1 to 10: One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten.
        We can write numbers using digits: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10. Each number tells us how many things we have.
        For example, if you have 3 apples, you write the number 3. We can count forward and backward.
        Counting forward: 1, 2, 3, 4, 5... Counting backward: 5, 4, 3, 2, 1. Numbers also have shapes we need to learn to write correctly.`,
      },
      {
        id: 'math_class1_shapes',
        subject: 'maths',
        class: 1,
        chapter: 'Shapes and Space',
        content: `Shapes are all around us. Common shapes include circle, square, triangle, and rectangle.
        A circle is round like a ball or the sun. A square has 4 equal sides and 4 corners. A triangle has 3 sides and 3 corners.
        A rectangle is like a square but two sides are longer. We can find shapes in our classroom - the door is a rectangle,
        the clock is a circle, the sandwich might be a triangle. Learning shapes helps us understand the world better.`,
      },

      // Class 3-4: Elementary Mathematics
      {
        id: 'math_class3_multiplication',
        subject: 'maths',
        class: 3,
        chapter: 'Multiplication Tables',
        content: `Multiplication is repeated addition. When we multiply 3 × 4, we are adding 3 four times: 3 + 3 + 3 + 3 = 12.
        Learning multiplication tables makes calculations faster. The 2 times table: 2×1=2, 2×2=4, 2×3=6, 2×4=8, 2×5=10.
        The 5 times table is easy - the last digit is always 0 or 5: 5×1=5, 5×2=10, 5×3=15, 5×4=20, 5×5=25.
        Multiplication facts help solve real-world problems. If one pencil costs 5 rupees, how much do 4 pencils cost? 5 × 4 = 20 rupees.
        Practice tables daily to become fast at multiplication.`,
      },
      {
        id: 'math_class4_fractions_intro',
        subject: 'maths',
        class: 4,
        chapter: 'Introduction to Fractions',
        content: `A fraction represents part of a whole. When we cut a pizza into 4 equal pieces and take 1 piece, we have 1/4 (one-fourth) of the pizza.
        The top number (numerator) shows how many parts we have. The bottom number (denominator) shows total equal parts.
        In 3/4, we have 3 parts out of 4 equal parts. Half means 1/2 - dividing something into 2 equal parts.
        Quarter means 1/4 - dividing into 4 equal parts. We use fractions in daily life - half an hour, quarter kg of sugar.
        Fractions can be shown using pictures, number lines, and objects.`,
      },

      // Class 5-6: Middle School Math
      {
        id: 'math_class5_place_value',
        subject: 'maths',
        class: 5,
        chapter: 'Large Numbers and Place Value',
        content: `Our number system is based on place value. Each position in a number has a different value.
        In the number 45,678: 8 is in ones place (8×1=8), 7 in tens place (7×10=70), 6 in hundreds place (6×100=600),
        5 in thousands place (5×1000=5000), 4 in ten-thousands place (4×10000=40000).
        We can write numbers in expanded form: 45,678 = 40,000 + 5,000 + 600 + 70 + 8.
        Indian system uses lakhs and crores: 1 lakh = 1,00,000 and 1 crore = 1,00,00,000.
        International system uses millions and billions. Understanding place value helps in all arithmetic operations.`,
      },
      {
        id: 'math_class6_integers',
        subject: 'maths',
        class: 6,
        chapter: 'Integers and Number Line',
        content: `Integers include positive numbers, negative numbers, and zero: ...-3, -2, -1, 0, 1, 2, 3...
        Positive integers are greater than zero (+1, +2, +3). Negative integers are less than zero (-1, -2, -3).
        We use negative numbers for temperature below zero, bank debts, depths below sea level.
        Number line helps visualize integers. Zero is in the middle, positive numbers to the right, negative to the left.
        Adding integers: When signs are same, add and keep the sign. When signs differ, subtract and take sign of larger number.
        Example: 5 + (-3) = 2, -5 + (-3) = -8. Subtracting means adding the opposite: 5 - 3 = 5 + (-3) = 2.`,
      },

      // Class 7-8: Advanced Middle School
      {
        id: 'math_class7_rational_numbers',
        subject: 'maths',
        class: 7,
        chapter: 'Rational Numbers',
        content: `Rational numbers are numbers that can be expressed as p/q where p and q are integers and q ≠ 0.
        Examples: 1/2, -3/4, 5 (which is 5/1), 0 (which is 0/1). Every integer is a rational number.
        Rational numbers can be positive, negative, or zero. They can be proper fractions (numerator < denominator),
        improper fractions (numerator ≥ denominator), or mixed numbers (whole number + fraction).
        We can add, subtract, multiply, and divide rational numbers. To add/subtract: make denominators same, then add/subtract numerators.
        To multiply: multiply numerators and multiply denominators. To divide: multiply by reciprocal.
        Example: (1/2) + (1/3) = 3/6 + 2/6 = 5/6. Rational numbers help us work with parts and proportions accurately.`,
      },
      {
        id: 'math_class8_linear_equations',
        subject: 'maths',
        class: 8,
        chapter: 'Linear Equations in One Variable',
        content: `A linear equation is an equation where the highest power of variable is 1. Example: 2x + 3 = 7.
        To solve linear equations, we isolate the variable on one side. Use opposite operations: if added, subtract; if multiplied, divide.
        Solving 2x + 3 = 7: Subtract 3 from both sides: 2x = 4. Divide both sides by 2: x = 2. Check: 2(2) + 3 = 7 ✓
        Linear equations can have one solution, no solution, or infinite solutions. Applications include age problems,
        distance-time problems, and money problems. Example: Father's age is 3 times son's age. Sum of ages is 48. Find ages.
        Let son's age = x, father's age = 3x. Equation: x + 3x = 48, so 4x = 48, x = 12. Son is 12, father is 36.`,
      },

      // Class 9-10: High School Math
      {
        id: 'math_class9_polynomials',
        subject: 'maths',
        class: 9,
        chapter: 'Polynomials',
        content: `A polynomial is an algebraic expression with one or more terms. Examples: 3x², 2x² + 5x - 3, x³ - 4x + 7.
        Parts of a polynomial: Coefficient (number part), Variable (letter part), Degree (highest power of variable).
        Types by number of terms: Monomial (1 term): 5x², Binomial (2 terms): x + 3, Trinomial (3 terms): x² + 2x + 1.
        Types by degree: Linear (degree 1): 2x + 1, Quadratic (degree 2): x² + 3x + 2, Cubic (degree 3): x³ + x² + 1.
        Polynomial operations: Addition/subtraction - combine like terms. Multiplication - use distributive property.
        Factorization: Breaking polynomial into products. Example: x² + 5x + 6 = (x + 2)(x + 3).
        Remainder Theorem: When p(x) is divided by (x - a), remainder is p(a). Used to find factors quickly.`,
      },
      {
        id: 'math_class10_quadratic_equations',
        subject: 'maths',
        class: 10,
        chapter: 'Quadratic Equations',
        content: `A quadratic equation has the form ax² + bx + c = 0 where a ≠ 0. Example: x² - 5x + 6 = 0.
        Methods to solve: 1) Factorization: Factor and set each factor to zero. x² - 5x + 6 = (x-2)(x-3) = 0, so x = 2 or x = 3.
        2) Quadratic Formula: x = [-b ± √(b² - 4ac)] / 2a. Works for all quadratic equations.
        3) Completing the square: Rearrange to make perfect square trinomial.
        Discriminant (D = b² - 4ac) tells us about solutions: If D > 0: two real distinct roots. If D = 0: two equal roots. If D < 0: no real roots.
        Applications: Projectile motion, area problems, profit-loss calculations, physics problems.
        Example: A ball thrown up returns to ground in 4 seconds. Find maximum height reached using h = ut - ½gt².`,
      },
    ];
  }

  // SCIENCE CONTENT
  private static generateScienceContent(): NCERTDocument[] {
    return [
      // Class 1-2: Basic Science
      {
        id: 'science_class1_living_nonliving',
        subject: 'science',
        class: 1,
        chapter: 'Living and Non-living Things',
        content: `Everything around us can be living or non-living. Living things can move, grow, eat, breathe, and have babies.
        Examples of living things: plants, animals, birds, insects, fish, humans. Non-living things cannot move on their own, grow, or eat.
        Examples of non-living things: rocks, water, air, toys, books, chairs. Living things need food, water, and air to stay alive.
        Plants are living things that make their own food. Animals are living things that move to find food.
        Humans are also living things - we grow from babies to adults. Non-living things like stones do not change or grow.`,
      },

      // Class 3-4: Elementary Science
      {
        id: 'science_class3_plants',
        subject: 'science',
        class: 3,
        chapter: 'Parts of Plants',
        content: `Plants have different parts and each part has a special job. The main parts are roots, stem, leaves, flowers, and fruits.
        Roots grow under the ground. They hold the plant firmly in soil and absorb water and minerals from soil.
        Stem supports the plant and carries water from roots to leaves. It also takes food from leaves to other parts.
        Leaves are green because of chlorophyll. They make food for the plant using sunlight, water, and air.
        Flowers are colorful and attract insects. After pollination, flowers turn into fruits.
        Fruits contain seeds. When seeds fall on soil with water, they grow into new plants. This is how plants reproduce.`,
      },

      // Class 5-6: Middle School Science
      {
        id: 'science_class6_photosynthesis',
        subject: 'science',
        class: 6,
        chapter: 'Photosynthesis - Food Making by Plants',
        content: `Photosynthesis is the process by which green plants make their own food. The word means 'making with light'.
        Plants need three things for photosynthesis: 1) Sunlight (provides energy), 2) Water (absorbed by roots), 3) Carbon dioxide (from air through stomata).
        The process occurs in leaves, specifically in chloroplasts containing chlorophyll (the green pigment).
        Chemical equation: 6CO₂ + 6H₂O + Sunlight → C₆H₁₂O₆ (glucose) + 6O₂. Plants absorb carbon dioxide and release oxygen.
        The glucose produced is used for plant growth and stored as starch in various plant parts.
        Photosynthesis is crucial for life on Earth - it provides food for all living beings and oxygen for breathing.
        Without photosynthesis, there would be no food chains, no oxygen, and no life as we know it.`,
      },
      {
        id: 'science_class6_body_movements',
        subject: 'science',
        class: 6,
        chapter: 'Body Movements',
        content: `Animals and humans move in different ways - walk, run, jump, fly, swim. Movement is possible because of bones and muscles.
        The skeleton is the framework of bones that supports our body. Humans have 206 bones. Bones are hard and strong.
        Joints are places where two bones meet and allow movement. Types of joints: Ball and socket joint (shoulder, hip) - moves in all directions.
        Hinge joint (knee, elbow) - moves back and forth like a door. Pivot joint (neck) - allows rotation.
        Muscles are attached to bones and help them move. When muscles contract, bones move. Muscles work in pairs.
        Different animals move differently based on their body structure: Birds fly using wings. Fish swim using fins and tail.
        Snakes crawl using scales. Earthworms move using muscles. Understanding body movement helps prevent injuries.`,
      },

      // Class 7-8: Advanced Middle School Science
      {
        id: 'science_class8_force_pressure',
        subject: 'science',
        class: 8,
        chapter: 'Force and Pressure',
        content: `Force is a push or pull that can change the state of rest or motion of an object. Force has magnitude and direction - it's a vector quantity.
        SI unit of force is Newton (N), named after Sir Isaac Newton. 1 Newton is the force needed to accelerate 1 kg mass by 1 m/s².
        Types of forces: Contact forces (require touch) - muscular force, friction, normal force. Non-contact forces (act at distance) - gravitational, magnetic, electrostatic.
        Effects of force: Can change speed of object, change direction of motion, change shape of object, can start or stop motion.
        Friction opposes motion between surfaces. It can be useful (walking, brakes) or wasteful (reduces machine efficiency).
        Pressure is force per unit area: P = F/A. SI unit is Pascal (Pa) or N/m². Pressure decreases as area increases for same force.
        Applications: Sharp knife cuts easily (less area, more pressure). Wide building foundation (more area, less pressure). Atmospheric pressure is about 101,325 Pa at sea level.`,
      },

      // Class 9-10: High School Science
      {
        id: 'science_class9_atoms_molecules',
        subject: 'science',
        class: 9,
        chapter: 'Atoms and Molecules',
        content: `Matter is made up of tiny particles called atoms. An atom is the smallest particle of an element that retains its properties.
        John Dalton proposed atomic theory: All matter is made of atoms. Atoms are indivisible. Atoms of same element are identical.
        Atoms combine to form molecules. A molecule is the smallest particle of a substance that can exist independently.
        For example, oxygen exists as O₂ (two oxygen atoms bonded together), water as H₂O (two hydrogen, one oxygen).
        Atomic mass is the mass of an atom. Atomic number is number of protons. Mass number is protons + neutrons.
        Chemical formula shows types and numbers of atoms: H₂SO₄ has 2 hydrogen, 1 sulfur, 4 oxygen atoms.
        Mole concept: 1 mole = 6.022 × 10²³ particles (Avogadro's number). Used to count atoms and molecules.
        Molecular mass is sum of atomic masses of all atoms in molecule. Molar mass is mass of 1 mole of substance in grams.`,
      },
      {
        id: 'science_class10_electricity',
        subject: 'science',
        class: 10,
        chapter: 'Electricity',
        content: `Electric current is the flow of electric charge. In conductors, current is flow of electrons. Unit is Ampere (A).
        Current (I) = Charge (Q) / Time (t). If 1 Coulomb charge flows in 1 second, current is 1 Ampere.
        Potential difference (voltage) is work done to move unit charge between two points. Unit is Volt (V). 1V = 1J/C.
        Ohm's Law: V = IR where V is voltage, I is current, R is resistance. Resistance opposes current flow. Unit is Ohm (Ω).
        Resistance depends on: length (R ∝ l), area (R ∝ 1/A), material (resistivity ρ), temperature.
        Series circuit: Same current flows, voltages add up, R_total = R₁ + R₂ + R₃. If one device fails, all stop.
        Parallel circuit: Same voltage, currents add up, 1/R_total = 1/R₁ + 1/R₂ + 1/R₃. Devices work independently.
        Electric power P = VI = I²R = V²/R. Unit is Watt (W). Electric energy = Power × Time. Unit is kilowatt-hour (kWh).
        Heating effect: When current flows through resistor, heat is produced. Used in heaters, irons, bulbs.`,
      },
    ];
  }

  // HISTORY CONTENT
  private static generateHistoryContent(): NCERTDocument[] {
    return [
      {
        id: 'history_class6_early_humans',
        subject: 'history',
        class: 6,
        chapter: 'Early Humans',
        content: `Early humans lived thousands of years ago. They were hunters and gatherers who moved from place to place in search of food.
        Stone Age is divided into Paleolithic (Old Stone Age), Mesolithic (Middle Stone Age), and Neolithic (New Stone Age).
        In Paleolithic age, humans used simple stone tools for hunting and cutting. They lived in caves and ate raw food.
        Discovery of fire was a major achievement - it provided warmth, protection, and cooked food.
        In Neolithic age, agriculture began. Humans learned to grow crops and domesticate animals. This led to settled life.
        People started living in permanent houses and villages. Invention of wheel and pottery improved life significantly.`,
      },
      {
        id: 'history_class7_delhi_sultanate',
        subject: 'history',
        class: 7,
        chapter: 'The Delhi Sultanate',
        content: `The Delhi Sultanate was established in 1206 CE when Qutb-ud-din Aibak became the first Sultan of Delhi.
        Five dynasties ruled: Slave Dynasty (1206-1290), Khilji Dynasty (1290-1320), Tughlaq Dynasty (1320-1414), Sayyid Dynasty (1414-1451), Lodi Dynasty (1451-1526).
        Qutb-ud-din Aibak built Qutub Minar in Delhi. Iltutmish strengthened the Sultanate and introduced silver tanka coin.
        Alauddin Khilji defended India against Mongol invasions and implemented market control policies for price regulation.
        Muhammad bin Tughlaq was known for bold experiments - shifting capital from Delhi to Daulatabad, introducing token currency.
        The Sultanate brought new administrative practices, Persian influenced culture, and Indo-Islamic architecture.`,
      },
      {
        id: 'history_class8_british_rule',
        subject: 'history',
        class: 8,
        chapter: 'British Rule in India',
        content: `British East India Company came to India for trade in 1600 but gradually became a ruling power.
        Battle of Plassey (1757): Robert Clive defeated Siraj-ud-Daulah, marking beginning of British political control.
        Battle of Buxar (1764) further strengthened British position. They got Diwani rights (right to collect revenue) of Bengal, Bihar, Orissa.
        Policies that impacted India: Permanent Settlement (1793) - zamindars collected revenue. Subsidiary Alliance - Indian rulers paid for British army.
        Doctrine of Lapse - if ruler had no heir, kingdom went to British. Economic exploitation: Raw materials taken from India, finished goods sold back at high prices.
        This destroyed Indian industries, especially textile. Famines became frequent due to British policies.
        Despite hardships, British rule also brought railways, telegraph, modern education, and legal systems to India.`,
      },
      {
        id: 'history_class9_french_revolution',
        subject: 'history',
        class: 9,
        chapter: 'The French Revolution',
        content: `The French Revolution (1789) was a major event that changed France and influenced the world.
        Causes: Absolute monarchy, financial crisis, social inequality, influence of philosophers. French society had three estates: 
        First Estate (clergy), Second Estate (nobility) - both had privileges and paid no taxes. Third Estate (common people) - paid all taxes but had no privileges.
        King Louis XVI faced financial crisis due to wars and extravagant spending. He called Estates-General meeting in 1789.
        Third Estate formed National Assembly and took Tennis Court Oath to frame a constitution. Fall of Bastille (July 14, 1789) marks the beginning of revolution.
        Declaration of Rights of Man and Citizen proclaimed liberty, equality, fraternity. France became a republic in 1792. King Louis XVI was executed in 1793.
        Reign of Terror under Robespierre saw mass executions. Napoleon Bonaparte rose to power in 1799, becoming Emperor in 1804.
        Impact: Ended monarchy, established ideas of liberty and democracy, inspired independence movements worldwide, promoted nationalism.`,
      },
      {
        id: 'history_class10_nationalism_india',
        subject: 'history',
        class: 10,
        chapter: 'Nationalism in India',
        content: `Indian nationalism grew during British rule as people united to fight for independence.
        Early phase (1885-1905): Indian National Congress formed in 1885. Leaders like Dadabhai Naoroji demanded more Indian participation in government.
        Swadeshi Movement (1905-1911): Started against partition of Bengal. People boycotted British goods and used Indian products.
        Gandhi returned from South Africa in 1915 and introduced Satyagraha - non-violent resistance based on truth and peaceful protests.
        Non-Cooperation Movement (1920-1922): Gandhi led nationwide protest against Rowlatt Act and Jallianwala Bagh massacre.
        Civil Disobedience Movement (1930): Started with Dandi March - Gandhi walked 240 miles to make salt, breaking British salt law.
        Quit India Movement (1942): "Do or Die" - demand for immediate British withdrawal. Mass arrests but strengthened independence resolve.
        Role of various groups: Workers went on strikes. Peasants protested against high taxes. Tribals fought forest laws.
        Women participated actively in protests and picketing. India finally gained independence on August 15, 1947.`,
      },
    ];
  }

  // GEOGRAPHY CONTENT
  private static generateGeographyContent(): NCERTDocument[] {
    return [
      {
        id: 'geo_class6_earth_globe',
        subject: 'geography',
        class: 6,
        chapter: 'The Earth in the Solar System',
        content: `Earth is one of eight planets in our Solar System revolving around the Sun. The Sun is a star that provides light and heat.
        Planets in order from Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. Earth is the third planet from Sun.
        Earth is called Blue Planet because 71% of its surface is covered with water. It's the only planet with life.
        Earth has one natural satellite - the Moon. Moon revolves around Earth and reflects sunlight.
        Earth is slightly flattened at poles and bulges at equator - this shape is called Geoid. Earth rotates on its axis (24 hours) causing day and night.
        Earth revolves around Sun (365.25 days) causing seasons. Tilt of Earth's axis (23.5°) is responsible for changing seasons.`,
      },
      {
        id: 'geo_class7_environment',
        subject: 'geography',
        class: 7,
        chapter: 'Environment',
        content: `Environment is everything around us - living and non-living things. Components of environment: Natural (land, water, air, plants, animals) and Human-made (buildings, roads, bridges).
        Lithosphere (land) provides us with forests, grasslands, minerals. Hydrosphere (water) includes oceans, rivers, lakes - essential for life.
        Atmosphere (air) has gases like oxygen for breathing, nitrogen for plants. Protects from harmful sun rays.
        Biosphere is the narrow zone where land, water, and air interact, making life possible. All living beings are part of biosphere.
        Ecosystem is interaction between living organisms and environment. Food chain shows energy flow: Plants → Herbivores → Carnivores.
        Environmental issues: Pollution (air, water, soil), deforestation, global warming, ozone depletion. Conservation is necessary for sustainable development.`,
      },
      {
        id: 'geo_class8_resources',
        subject: 'geography',
        class: 8,
        chapter: 'Resources',
        content: `Resources are things that satisfy our needs. Classification by origin: Biotic (from living beings - forests, animals) and Abiotic (non-living - minerals, rocks).
        By distribution: Ubiquitous (found everywhere - air, water) and Localized (found in specific areas - minerals, copper).
        By development: Potential resources (exist but not yet used - wind energy in many areas). Developed resources (already in use - petroleum).
        By exhaustibility: Renewable (can be renewed - solar, wind, water) and Non-renewable (limited stock - fossil fuels, minerals).
        Conservation of resources is crucial because: Resources are limited. Growing population increases demand. Future generations need resources too.
        Methods: Reduce consumption, Reuse items, Recycle materials. Use renewable energy. Prevent wastage. Sustainable development balances present needs with future availability.`,
      },
      {
        id: 'geo_class9_india_location',
        subject: 'geography',
        class: 9,
        chapter: 'India - Size and Location',
        content: `India is located in Northern and Eastern Hemisphere. Extends from 8°4'N to 37°6'N latitude and 68°7'E to 97°25'E longitude.
        Total area: 3.28 million sq km - 7th largest country in world. Land boundary: 15,200 km. Coastline: 7,516.6 km including islands.
        India has 28 states and 8 Union Territories. New Delhi is the capital. Tropic of Cancer (23°30'N) passes through middle of India.
        Borders: Pakistan and Afghanistan in northwest, China, Nepal, Bhutan in north, Myanmar and Bangladesh in east. Sri Lanka separated by Palk Strait.
        India's strategic location: Central position between East and West Asia. Trans-Indian Ocean routes connect India with Europe, Africa, West Asia, East Asia.
        Time: Indian Standard Time (IST) is 5:30 hours ahead of GMT. Based on 82°30'E longitude passing through Mirzapur, Uttar Pradesh.
        India has great diversity in climate, vegetation, soil, culture, language, religion due to its vast size and location.`,
      },
      {
        id: 'geo_class10_agriculture',
        subject: 'geography',
        class: 10,
        chapter: 'Agriculture',
        content: `Agriculture is the backbone of Indian economy, employing about 54% of population. India has diverse agro-climatic conditions.
        Types of farming: Subsistence (for own consumption - primitive, intensive). Commercial (for sale - plantation, horticulture).
        Major crops: Rice (kharif crop, needs high temperature, high humidity, rainfall - grown in plains, deltas). Wheat (rabi crop, cool growing season, bright sunshine - Punjab, Haryana, UP).
        Sugarcane (tropical, sub-tropical crop, hot humid climate, 75-100 cm rainfall - UP, Maharashtra). Cotton (kharif crop, high temperature, light rainfall, 210 frost-free days - Maharashtra, Gujarat).
        Cropping seasons: Kharif (sown in June-July, harvested in September-October - rice, cotton, jowar). Rabi (sown in October-December, harvested in April-May - wheat, barley, peas).
        Zaid (summer crops between rabi and kharif - watermelon, cucumber, vegetables).
        Green Revolution (1960s-1970s): Use of HYV seeds, chemical fertilizers, pesticides increased wheat and rice production significantly. Punjab, Haryana, western UP benefited most.
        Problems: Small landholdings, lack of capital, outdated technology, dependence on monsoon, soil degradation, farmer suicides due to debt.`,
      },
    ];
  }

  // ENGLISH CONTENT
  private static generateEnglishContent(): NCERTDocument[] {
    return [
      {
        id: 'english_class6_grammar_basics',
        subject: 'english',
        class: 6,
        chapter: 'Parts of Speech',
        content: `Parts of speech are categories of words based on their function in a sentence. There are eight main parts of speech.
        Noun: Names of person, place, thing, or idea. Examples: boy, Delhi, book, happiness. Types: Common noun (general), Proper noun (specific), Abstract noun (feelings), Collective noun (group).
        Pronoun: Replaces noun to avoid repetition. Examples: he, she, it, they, we. Types: Personal, Possessive, Demonstrative, Interrogative, Relative.
        Verb: Shows action or state of being. Examples: run, eat, is, was. Types: Action verb, Helping verb, Linking verb. Verb forms: base, past, past participle, present participle.
        Adjective: Describes or modifies noun. Examples: beautiful, large, five, red. Answers: what kind, which one, how many. Degrees: positive, comparative, superlative.
        Adverb: Modifies verb, adjective, or another adverb. Examples: quickly, very, here, tomorrow. Types: manner, place, time, frequency, degree.
        Preposition: Shows relationship between noun and other words. Examples: in, on, at, by, with, from. Always followed by object.
        Conjunction: Joins words, phrases, or clauses. Examples: and, but, or, because, although. Types: coordinating, subordinating, correlative.
        Interjection: Expresses strong emotion. Examples: Oh! Wow! Alas! Hurray! Usually followed by exclamation mark.`,
      },
      {
        id: 'english_class7_comprehension',
        subject: 'english',
        class: 7,
        chapter: 'Reading Comprehension',
        content: `Reading comprehension is the ability to understand, analyze, and interpret what you read. It's essential for learning.
        Strategies for better comprehension: Preview the text - look at title, headings, pictures before reading. Make predictions about content.
        Active reading: Ask questions while reading. Make mental connections. Visualize what you read. Take notes or underline key points.
        Find main idea: What is the passage mostly about? Look at first and last paragraphs, topic sentences. Identify supporting details that explain main idea.
        Understand vocabulary: Use context clues - words around unknown word give hints. Look for prefix, root, suffix. Use dictionary if needed.
        Different types of questions: Literal (answers directly in text), Inferential (read between lines), Applied (use info in new situation).
        Making inferences: Use text clues + your knowledge to conclude something not directly stated. Drawing conclusions: Combine facts to form logical judgment.
        Summarizing: Retelling main points in your own words, keeping it brief. Helps check understanding and remember better.`,
      },
      {
        id: 'english_class8_writing_skills',
        subject: 'english',
        class: 8,
        chapter: 'Writing Skills - Essays and Letters',
        content: `Good writing communicates ideas clearly and effectively. Different formats serve different purposes.
        Essay writing: Introduction (hook reader, state topic, thesis statement), Body paragraphs (one idea per paragraph, topic sentence, supporting details, examples), Conclusion (summarize main points, restate thesis, final thought).
        Types of essays: Narrative (tells story), Descriptive (creates picture with words), Expository (explains or informs), Argumentative (persuades with reasons).
        Letter writing: Format includes sender's address, date, receiver's address, salutation, body, closing, signature.
        Formal letters: Used for official purposes - complaint, application, enquiry. Use formal language, be clear and brief, stick to purpose.
        Informal letters: To friends, family. Can be chatty and personal. Share news, feelings, experiences. Still follow basic format.
        Story writing: Interesting beginning, clear plot, characters with personality, conflict and resolution, descriptive language, satisfying ending.
        Writing process: Brainstorming (generate ideas), Drafting (write first version), Revising (improve content, organization), Editing (fix grammar, spelling), Publishing (final clean copy).`,
      },
      {
        id: 'english_class9_literature',
        subject: 'english',
        class: 9,
        chapter: 'Literary Devices and Analysis',
        content: `Literary devices are techniques writers use to create special effects and convey meaning more powerfully.
        Simile: Comparison using 'like' or 'as'. Example: Her smile is like sunshine. Makes descriptions vivid.
        Metaphor: Direct comparison without 'like' or 'as'. Example: Life is a journey. Creates strong imagery.
        Personification: Giving human qualities to non-human things. Example: The wind whispered through trees. Makes abstract concrete.
        Alliteration: Repetition of beginning consonant sounds. Example: Peter Piper picked. Creates rhythm and emphasis.
        Hyperbole: Extreme exaggeration for effect. Example: I've told you a million times. Emphasizes point dramatically.
        Imagery: Descriptive language appealing to senses (sight, sound, smell, taste, touch). Creates mental pictures.
        Symbolism: Object representing something beyond literal meaning. Example: Dove symbolizes peace. Adds deeper layers of meaning.
        Irony: Contrast between what's expected and what actually happens. Types: verbal (saying opposite of meaning), situational (opposite outcome), dramatic (audience knows more than characters).
        Analyzing literature: Identify theme (central message). Examine characters (traits, motivations, development). Note setting (time, place, atmosphere). Recognize conflict (internal, external). Understand plot structure (exposition, rising action, climax, falling action, resolution).`,
      },
      {
        id: 'english_class10_advanced_grammar',
        subject: 'english',
        class: 10,
        chapter: 'Advanced Grammar - Clauses and Modals',
        content: `Understanding complex sentence structures improves both reading and writing skills.
        Clause: Group of words with subject and verb. Independent clause: Can stand alone as complete sentence. Dependent clause: Cannot stand alone, depends on independent clause.
        Types of dependent clauses: Noun clause (functions as noun) - "What he said is true". Adjective clause (modifies noun) - "The book that I read was interesting". Adverb clause (modifies verb) - "I left because I was tired".
        Relative clauses: Introduced by relative pronouns (who, whom, whose, which, that). Defining (essential info, no commas) - "The man who called is my uncle". Non-defining (extra info, uses commas) - "My uncle, who lives in Delhi, called".
        Modal verbs: Auxiliary verbs expressing possibility, probability, necessity, ability, permission, obligation. 
        Can/Could: ability, permission. "I can swim." "Could you help me?"
        May/Might: possibility, permission. "It may rain." "Might I come in?"
        Must: strong obligation, certainty. "You must obey rules." "She must be sick."
        Should/Ought to: advice, expectation. "You should study." "It ought to work."
        Will/Would: future, willingness, request. "I will come." "Would you like tea?"
        Voice: Active (subject does action) - "Ram wrote letter." Passive (subject receives action) - "Letter was written by Ram." Use passive when doer unknown or unimportant.`,
      },
    ];
  }
}
