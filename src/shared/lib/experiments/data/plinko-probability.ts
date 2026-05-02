import type { Experiment } from "@/shared/types/experiment";

export const plinkoProbability: Experiment = {
  id: "plinko-probability",
  slug: "plinko-probability-statistics",
  title: "Plinko Probability",
  subtitle: "Discover the normal distribution through random processes",
  description:
    "Drop balls through a Plinko board and watch the binomial distribution emerge. Explore probability, standard deviation, and the Central Limit Theorem in an intuitive visual experiment.",
  thumbnail: "/imgs/experiments/kinematics-graphs.png",

  standards: {
    ngss: [],
    gcse: [],
    ap: ["SP-5.C", "SP-5.D"],
  },
  primaryStandard: "general",
  category: "mechanics",
  subject: "math",
  gradeLevel: "9-12",
  tags: ["probability", "statistics", "normal distribution", "binomial distribution", "Central Limit Theorem", "standard deviation"],
  difficulty: "beginner",

  parameters: [
    { id: "num_rows", label: "Number of Rows", unit: "", min: 1, max: 12, default: 6, step: 1, tier: "free" },
    { id: "num_balls", label: "Balls to Drop", unit: "", min: 1, max: 100, default: 10, step: 1, tier: "free" },
    { id: "prob_right", label: "Probability Right", unit: "%", min: 10, max: 90, default: 50, step: 5, tier: "pro" },
  ],

  formulas: [
    { latex: "P(k) = \\binom{n}{k} p^k (1-p)^{n-k}", description: "Binomial distribution" },
    { latex: "\\mu = np,\\; \\sigma = \\sqrt{np(1-p)}", description: "Mean and standard deviation" },
  ],

  theory:
    "At each peg, a ball has equal probability of going left or right. After n rows, the number of right-bounces follows a binomial distribution. With many rows and equal probability, the distribution approximates a normal (Gaussian) curve — the Central Limit Theorem in action. Standard deviation σ = √(np(1-p)) measures spread. This underlies all statistical inference, from polls to quantum measurements.",
  instructions:
    "Set the number of rows and drop balls. Watch the histogram fill up. Drop many balls (100+) to see the normal distribution emerge clearly. Change the right-probability from 50% to see how skewed distributions arise.",
  challenges: [
    { id: "pp-c1", question: "With 6 rows and p=0.5, which bin is most likely? How many ways can a ball reach it?", hint: "Middle bin (3 rights out of 6); C(6,3) = 20 paths", tier: "free" },
    { id: "pp-c2", question: "What happens to the distribution width as you increase rows from 4 to 12?", hint: "σ = √(np(1-p)) grows as √n — distribution spreads but also gets taller", tier: "free" },
    { id: "pp-c3", question: "With p=0.7 (biased peg), where does the peak shift and why?", hint: "Mean = np = 6×0.7 = 4.2 — peak shifts right toward 4 bins", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["curve-fitting", "calculus-grapher"],

  seoTitle: "Plinko Probability — Normal Distribution Simulation | Math Lab",
  seoKeywords: ["plinko", "probability", "normal distribution", "binomial distribution", "statistics simulation"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Probability, Normal Distribution, Binomial Distribution" },

  contentSections: {
    whatIsIt:
      "Plinko Probability turns the famous game-show board into a rigorous statistics laboratory. Each ball dropped through the board hits a series of pegs, bouncing left or right at each one independently. After traveling through all the rows, the ball lands in one of the bins at the bottom, and the histogram of where many balls land reveals the underlying probability distribution. When each peg has an equal 50/50 chance of sending the ball left or right, the number of right-bounces out of n rows follows a binomial distribution. The critical insight — the Central Limit Theorem in action — is that this binomial distribution increasingly resembles a normal (Gaussian, bell-shaped) curve as the number of rows grows. This happens because the final bin position is the sum of many small independent random steps, and the CLT says that sums of independent random variables tend toward a normal distribution regardless of the individual step distribution. The mean of the distribution is μ = n × p (where p is the probability of going right) and the standard deviation is σ = √(n × p × (1-p)). Plinko makes these abstract formulas physically visible: you can literally watch the bell curve assemble itself one ball at a time, and you can see how changing the bias (prob_right) skews the histogram away from the center.",
    parameterExplanations: {
      num_rows:
        "Sets the number of peg rows the ball passes through, from 1 to 12 (default 6). Each row adds one independent random bounce. More rows produce more possible landing bins and a distribution that more closely approximates a continuous normal curve. With only 1 row there are just 2 possible outcomes (left or right); with 12 rows there are 13 possible bins and the bell shape is clearly visible after dropping enough balls.",
      num_balls:
        "Controls how many balls are dropped in a single simulation run, from 1 to 100 (default 10). Dropping more balls fills the histogram more completely, reducing random fluctuations and making the theoretical distribution shape easier to see. With only 10 balls the histogram is noisy and irregular; with 100 balls the bell curve emerges clearly. This directly demonstrates the law of large numbers: empirical frequencies converge to theoretical probabilities as sample size grows.",
      prob_right:
        "Sets the probability that a ball bounces right at each peg, from 10% to 90% (default 50%). At 50% the board is symmetric and the distribution peaks in the center. Reducing or increasing prob_right shifts the peak toward the left or right bins respectively, producing a skewed distribution. This shows how a biased random process translates into a shifted distribution — connecting to real-world applications like biased coins, genetic inheritance, or quality control testing.",
    },
    misconceptions: [
      {
        wrong:
          "Past balls influence where the next ball will land — if many balls fell right recently, the next is more likely to go left.",
        correct:
          "Each peg encounter is fully independent of every other. There is no memory in the board. This is the gambler's fallacy: the belief that random outcomes must 'balance out' in the short run. In reality, the probability at each peg is exactly prob_right on every bounce regardless of what previous balls did. The long-run distribution converges to the expected shape not because individual outcomes compensate, but because the law of large numbers averages out over many trials.",
      },
      {
        wrong:
          "All bins are equally likely because the ball makes random choices at every peg.",
        correct:
          "The choices are random, but the number of different paths leading to each bin varies enormously. The center bin can be reached by many different sequences of lefts and rights (e.g., C(6,3) = 20 paths for a 6-row board), while the extreme bins can only be reached by one path each (all right or all left). More paths to a bin means higher probability — exactly the logic of Pascal's triangle and the binomial coefficients.",
      },
      {
        wrong:
          "Increasing the number of rows makes the distribution narrower because there are more pegs to average over.",
        correct:
          "More rows make the distribution wider, not narrower. Standard deviation grows as √(n × p × (1-p)), which increases with n. However, if you normalize by dividing by n (looking at the fraction of right-bounces rather than the count), the normalized distribution does become narrower as n increases. The absolute spread grows; the relative spread shrinks. This is an important distinction in understanding the CLT.",
      },
      {
        wrong:
          "The normal distribution that emerges is exact for any number of rows.",
        correct:
          "The binomial distribution only approximates a normal distribution, and the approximation improves as n (number of rows) increases and as p stays near 0.5. For small n or extreme p values (near 10% or 90%), the distribution is visibly discrete and asymmetric rather than bell-shaped. The simulation makes this visible: compare the histogram at 2 rows vs. 12 rows, or at prob_right 50% vs. 20%.",
      },
    ],
    teacherUseCases: [
      "CLT emergence demo: set num_rows to 6, prob_right to 50%, and drop balls progressively — first 5, then 20, then 100. After each batch, ask students to describe the histogram shape. Students observe the bell curve solidifying as num_balls increases, connecting the law of large numbers to the visual evidence.",
      "Standard deviation scaling: keep prob_right at 50% and num_balls at 100. Run with num_rows at 3, then 6, then 12. Students calculate the theoretical σ = √(n × 0.5 × 0.5) for each and compare to the histogram spread. This concretizes the √n scaling relationship before introducing formal variance formulas.",
      "Symmetry-breaking with bias: start at prob_right 50% with num_rows 6 and num_balls 100 to establish a symmetric baseline. Then shift prob_right to 30% and run again. Students compare the peak location to the theoretical mean μ = n × p = 6 × 0.3 = 1.8 (approximately bin 2). This connects binomial mean formula to a visual result.",
      "Empirical vs. theoretical probability: with num_rows 6 and prob_right 50%, drop num_balls 100 and record the fraction of balls in the center bin. Compare to the theoretical probability P(3 rights) = C(6,3)/2^6 = 20/64 ≈ 31.25%. Repeat with a fresh run to show variation, reinforcing that empirical probability fluctuates around the theoretical value.",
      "Gambler's fallacy discussion: drop 10 balls and note the uneven histogram. Ask students whether they expect the next ball to 'correct' the imbalance. Then drop 90 more balls and show the distribution averaging out — not because any ball compensated, but because large samples dominate small-sample noise. This directly addresses the independence misconception.",
    ],
    faq: [
      {
        question: "Why does the histogram look like a bell curve even though each bounce is just a random left-or-right?",
        answer:
          "The final bin position is the sum of many independent random steps, each taking value 0 (left) or 1 (right). The Central Limit Theorem states that the sum of a large number of independent, identically distributed random variables tends toward a normal distribution regardless of the shape of the individual variable's distribution. With 6 or more rows, the binomial distribution of total right-bounces is already a reasonable approximation to a Gaussian bell curve centered at n × p with standard deviation √(n × p × (1-p)).",
      },
      {
        question: "What is the relationship between Plinko and Pascal's triangle?",
        answer:
          "The number of paths from the top peg to each bottom bin is given by the binomial coefficients, which form Pascal's triangle. For a board with n rows, the k-th bin (counting from zero) has C(n,k) paths leading to it. Because each path is equally likely (when prob_right = 50%), the relative probabilities of the bins are proportional to the corresponding row of Pascal's triangle — a direct geometric connection between combinatorics and probability.",
      },
      {
        question: "What happens if I set prob_right to 50% but the histogram is still asymmetric after 100 balls?",
        answer:
          "With prob_right exactly 50%, the theoretical distribution is symmetric, but any finite sample will typically show some asymmetry due to random variation. With 100 balls and 6 rows, the standard error on each bin count is large enough to produce noticeable left-right imbalance in many individual runs. This is not a flaw — it is exactly what random sampling looks like. Running the simulation multiple times and comparing shows how the average of many runs converges to the symmetric theoretical shape.",
      },
      {
        question: "How does the standard deviation formula relate to what I see in the simulation?",
        answer:
          "The formula σ = √(n × p × (1-p)) predicts the spread of the landing distribution. With n = 6 rows and p = 0.5, σ = √(6 × 0.5 × 0.5) ≈ 1.22 bins. This means roughly 68% of balls should land within about 1.2 bins of the center bin in either direction, and about 95% within 2.4 bins. You can verify this by counting the fraction of balls in the central bins after dropping 100 balls. The formula also shows why increasing rows widens the distribution: σ grows with √n.",
      },
      {
        question: "Is Plinko probability the same as a normal distribution?",
        answer:
          "Not exactly — Plinko follows a binomial distribution, which is discrete (balls can only land in whole-numbered bins). The normal distribution is continuous. However, the binomial distribution converges toward the normal distribution as the number of rows increases, especially when prob_right is near 50%. For practical purposes at 10 or more rows, the binomial and normal distributions are often nearly indistinguishable when plotted, which is why the normal distribution is so widely useful as an approximation in statistics.",
      },
      {
        question: "How does changing prob_right connect to real-world probability problems?",
        answer:
          "Setting prob_right away from 50% models any binary random process with unequal probabilities: a biased coin, an allele with 30% transmission probability, a manufacturing process where 20% of items are defective, or a medical test with a known false-positive rate. The shift in the histogram peak to μ = n × p and the change in spread to σ = √(n × p × (1-p)) illustrate how the binomial distribution generalizes beyond the fair-coin case, making it applicable across biology, quality control, genetics, and opinion polling.",
      },
    ],
  },
};
