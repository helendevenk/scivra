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
};
