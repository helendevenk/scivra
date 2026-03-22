import type { Subject } from "@/shared/types/experiment";

export const SUBJECTS = {
  physics: {
    label: "Physics",
    labelZh: "物理",
    dataAttr: "physics" as const,
    icon: "Atom",
  },
  chemistry: {
    label: "Chemistry",
    labelZh: "化学",
    dataAttr: "chemistry" as const,
    icon: "FlaskConical",
  },
  biology: {
    label: "Biology",
    labelZh: "生物",
    dataAttr: "biology" as const,
    icon: "Dna",
  },
  "earth-science": {
    label: "Earth Science",
    labelZh: "地球科学",
    dataAttr: "earth-science" as const,
    icon: "Globe",
  },
  math: {
    label: "Math",
    labelZh: "数学",
    dataAttr: "math" as const,
    icon: "Calculator",
  },
} as const satisfies Record<Subject, { label: string; labelZh: string; dataAttr: string; icon: string }>;

export const SUBJECT_LIST = Object.keys(SUBJECTS) as Subject[];
