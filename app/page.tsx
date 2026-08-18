"use client";

import { useMemo, useState } from "react";

type AnswerValue = string | string[];
type Answers = Record<string, AnswerValue>;
type Question = {
  id: string;
  eyebrow: string;
  title: string;
  hint?: string;
  type: "text" | "single" | "multi";
  options?: { value: string; label: string; note?: string }[];
  max?: number;
};

type Project = {
  id: string;
  name: string;
  shortName: string;
  category: string;
  accent: string;
  majors: string[];
  interests: string[];
  outcomes: string[];
  tools: string[];
  goals: string[];
  minFoundation: number;
  intensity: number;
  beginnerFriendly: boolean;
  deliverable: string;
  careers: string;
  reason: string;
  articleUrl: string;
  enrollmentUrl: string;
};

const assistantUrl = "https://work.weixin.qq.com/kfid/kfc4d355f594ef81655";
const annualPassUrl = "https://appqjbnn8p01144.h5.xet.pomoho.com/p/t/v1/svip/h5_svip/super_vip/index/s_66c2c15a58df1_uzU3bJgu59?type=15&is_experience_card=0";

const questions: Question[] = [
  {
    id: "school",
    eyebrow: "基础信息",
    title: "你目前就读的学校是？",
    hint: "学校信息仅用于完善测评画像，不影响项目推荐结果。",
    type: "text",
  },
  {
    id: "major",
    eyebrow: "基础信息",
    title: "你的专业更接近哪一类？",
    type: "single",
    options: [
      { value: "cs", label: "计算机、软件工程、信息管理" },
      { value: "ai", label: "人工智能、大数据、数据科学" },
      { value: "math", label: "数学、统计学、自动化、电子信息" },
      { value: "finance", label: "金融、财务、会计、审计" },
      { value: "business", label: "工商管理、市场营销、人力资源" },
      { value: "media", label: "新闻传播、社会学、公共管理" },
      { value: "creative", label: "设计、传媒、新媒体" },
      { value: "other", label: "其他专业" },
    ],
  },
  {
    id: "grade",
    eyebrow: "基础信息",
    title: "你现在是哪个年级？",
    type: "single",
    options: [
      { value: "freshman", label: "大一" },
      { value: "sophomore", label: "大二" },
      { value: "junior", label: "大三" },
      { value: "senior", label: "大四" },
      { value: "postgrad", label: "研究生" },
      { value: "other", label: "已毕业或其他" },
    ],
  },
  {
    id: "foundation",
    eyebrow: "当前基础",
    title: "哪种描述最符合你的编程基础？",
    hint: "这不是技术考试，零基础也可以放心选择。",
    type: "single",
    options: [
      { value: "0", label: "完全没有接触过编程" },
      { value: "1", label: "学过一点，还不能独立完成任务" },
      { value: "2", label: "会用Python或其他语言完成简单任务" },
      { value: "3", label: "能独立完成课程作业或小项目" },
      { value: "4", label: "有比较完整的项目开发经验" },
    ],
  },
  {
    id: "tools",
    eyebrow: "当前基础",
    title: "下面这些工具或技能，你接触过哪些？",
    hint: "可多选，最多选择4项；没有接触过也不会影响完成测评。",
    type: "multi",
    max: 4,
    options: [
      { value: "none", label: "暂时都没有接触过" },
      { value: "excel", label: "Excel或常用办公软件" },
      { value: "python", label: "Python" },
      { value: "sql", label: "SQL或数据库" },
      { value: "bi", label: "BI或数据可视化工具" },
      { value: "aigc", label: "AI对话、AI绘画等AIGC工具" },
      { value: "ml", label: "机器学习或深度学习" },
      { value: "dev", label: "前端、后端或软件开发" },
      { value: "hardware", label: "开发板、机器人或机械臂" },
      { value: "unsure", label: "不确定自己学过的算不算" },
    ],
  },
  {
    id: "interests",
    eyebrow: "兴趣方向",
    title: "如果可以亲手完成一个项目，你最想尝试什么？",
    hint: "最多选择2项，我们会优先考虑你的真实兴趣。",
    type: "multi",
    max: 2,
    options: [
      { value: "ai-code", label: "用AI帮助我编程，做出一个软件" },
      { value: "agent", label: "搭建大模型智能体或AI应用" },
      { value: "data", label: "分析数据，发现业务问题" },
      { value: "bi", label: "制作BI仪表板或数据大屏" },
      { value: "algorithm", label: "训练算法模型，完成预测或识别" },
      { value: "robot", label: "控制机械臂，体验具身智能" },
      { value: "risk", label: "财务、审计或风险数据分析" },
      { value: "hr", label: "人力资源数字化" },
      { value: "opinion", label: "舆情、品牌和传播分析" },
      { value: "video", label: "用AI制作短视频或新媒体内容" },
      { value: "unsure", label: "暂时不确定，希望系统推荐" },
    ],
  },
  {
    id: "goals",
    eyebrow: "发展目标",
    title: "你最希望通过项目实训获得什么？",
    hint: "最多选择2项。",
    type: "multi",
    max: 2,
    options: [
      { value: "career", label: "为实习或求职增加项目经历" },
      { value: "portfolio", label: "获得一份可以展示的项目作品" },
      { value: "skill", label: "提升编程或数据分析技能" },
      { value: "competition", label: "为竞赛或创新创业做准备" },
      { value: "study", label: "为考研复试、保研或升学增加实践经历" },
      { value: "explore", label: "探索适合自己的职业方向" },
      { value: "credential", label: "获得实习证明或行业认证" },
      { value: "interest", label: "单纯对AI、大数据或新技术感兴趣" },
    ],
  },
  {
    id: "outcome",
    eyebrow: "成果偏好",
    title: "实训结束时，你最希望带走哪类成果？",
    type: "single",
    options: [
      { value: "product", label: "一个可以运行的软件或AI产品" },
      { value: "code-report", label: "一套代码和完整的数据分析项目" },
      { value: "dashboard", label: "一张可展示的仪表板或行业认证" },
      { value: "report", label: "一份专业的行业分析报告" },
      { value: "model", label: "一个算法模型或智能硬件项目" },
      { value: "video", label: "一条完整的AIGC短视频作品" },
      { value: "resume", label: "暂时不确定，只要能写进简历即可" },
    ],
  },
  {
    id: "experience",
    eyebrow: "项目经历",
    title: "你现在有能够在简历或面试中展示的项目吗？",
    type: "single",
    options: [
      { value: "0", label: "没有，这是我最想解决的问题" },
      { value: "1", label: "有课程作业，但还不能算完整项目" },
      { value: "2", label: "有项目，但不知道怎样包装和展示" },
      { value: "3", label: "有一个比较完整的项目" },
      { value: "4", label: "有多个项目或竞赛经历" },
    ],
  },
  {
    id: "time",
    eyebrow: "学习安排",
    title: "接下来一个月，你每周大约能投入多少时间？",
    type: "single",
    options: [
      { value: "0", label: "2小时以内" },
      { value: "1", label: "2—4小时" },
      { value: "2", label: "4—6小时" },
      { value: "3", label: "6小时以上" },
      { value: "2", label: "暂时不确定" },
    ],
  },
];

const projects: Project[] = [
  {
    id: "ai-coding", name: "腾讯AI Coding大模型编程", shortName: "AI Coding", category: "AI应用与软件开发", accent: "#635bff",
    majors: ["cs", "ai", "math", "other"], interests: ["ai-code", "agent"], outcomes: ["product", "resume"], tools: ["aigc", "dev"], goals: ["career", "portfolio", "skill", "explore", "interest"],
    minFoundation: 0, intensity: 2, beginnerFriendly: true, deliverable: "独立完成一个可运行的软件项目，并形成项目文档与答辩成果", careers: "AI编程助理、低代码开发、大模型应用开发", reason: "借助CodeBuddy从需求拆解走到软件交付，对零基础友好，也能快速形成可展示作品。",
    articleUrl: "https://mp.weixin.qq.com/s/WaK6j6FiogXW-RZgV_i5Og", enrollmentUrl: "https://gxcdh.xetslk.com/s/3wvBA",
  },
  {
    id: "agent", name: "“模力新生”大模型智能体创新创业", shortName: "大模型智能体", category: "AI应用与软件开发", accent: "#9a5bff",
    majors: ["cs", "ai", "math", "finance", "business", "other"], interests: ["agent", "ai-code"], outcomes: ["product", "resume"], tools: ["aigc", "python", "dev"], goals: ["competition", "portfolio", "skill", "study", "interest"],
    minFoundation: 1, intensity: 3, beginnerFriendly: true, deliverable: "从创意、需求到开发，完成一个具备功能的大模型智能体产品", careers: "AI产品经理助理、大模型应用开发、智能体开发", reason: "适合把创意转化为AI应用，强调产品思维、智能体开发和从0到1落地。",
    articleUrl: "https://mp.weixin.qq.com/s/_mmvGkvUceLzecDZ3BbLLg", enrollmentUrl: "https://gxcdh.xetslk.com/s/2lONZ1",
  },
  {
    id: "generative-dev", name: "AI生成式软件开发", shortName: "AI生成式开发", category: "AI应用与软件开发", accent: "#496bff",
    majors: ["cs", "ai", "business", "other"], interests: ["ai-code", "agent"], outcomes: ["product", "report", "resume"], tools: ["dev", "aigc", "python"], goals: ["career", "portfolio", "skill", "explore"],
    minFoundation: 1, intensity: 3, beginnerFriendly: true, deliverable: "完成需求分析、架构设计、多文件开发、全栈集成与质量保障的工程项目", careers: "AI开发、智能软件开发、AI方向全栈开发", reason: "承接软件需求分析与开发兴趣，适合用AI工具走完从需求到交付的完整工程流程。",
    articleUrl: "https://mp.weixin.qq.com/s/bStAswN-UZ_NDrZM8uy6kQ", enrollmentUrl: "https://gxcdh.xetslk.com/s/zijEv",
  },
  {
    id: "python-analysis", name: "Python数据分析", shortName: "Python数据分析", category: "数据分析与商业智能", accent: "#008d8d",
    majors: ["cs", "ai", "math", "finance", "business", "other"], interests: ["data", "algorithm", "risk"], outcomes: ["code-report", "report", "resume"], tools: ["python", "excel", "sql"], goals: ["career", "portfolio", "skill", "study"],
    minFoundation: 1, intensity: 2, beginnerFriendly: true, deliverable: "使用真实脱敏数据完成代码、分析过程和一份完整项目报告", careers: "数据分析、数据科学助理、业务数据分析", reason: "覆盖数据清洗、分析方法和报告表达，是从基础走向数据岗位的通用项目。",
    articleUrl: "https://mp.weixin.qq.com/s/szAHXPw6w-3sELXxkesjpw", enrollmentUrl: "https://gxcdh.xetslk.com/s/3R7WwL",
  },
  {
    id: "finebi", name: "帆软大数据分析（FCA认证）", shortName: "FineBI + FCA", category: "数据分析与商业智能", accent: "#00a08a",
    majors: ["cs", "ai", "finance", "business", "media", "other"], interests: ["bi", "data"], outcomes: ["dashboard", "code-report", "resume"], tools: ["excel", "bi", "sql"], goals: ["credential", "career", "portfolio", "explore", "skill"],
    minFoundation: 0, intensity: 1, beginnerFriendly: true, deliverable: "完成数据准备、业务分析、FineBI仪表板和项目报告，并参加FCA认证考试", careers: "数据分析实习生、BI助理、数据可视化岗位", reason: "承接业务数据分析与BI可视化兴趣，从工具入门完成仪表板、分析报告和FCA认证。",
    articleUrl: "https://mp.weixin.qq.com/s/PvBAhXsZ4SpwR9dA4Bozcg", enrollmentUrl: "https://gxcdh.xetslk.com/s/3LOnP0",
  },
  {
    id: "finance-bi", name: "帆软·财务大数据分析", shortName: "财务大数据分析", category: "数字化行业应用", accent: "#0a9a6e",
    majors: ["finance", "business", "cs", "ai"], interests: ["risk", "bi", "data"], outcomes: ["dashboard", "report", "resume"], tools: ["excel", "bi"], goals: ["career", "portfolio", "skill"],
    minFoundation: 0, intensity: 2, beginnerFriendly: true, deliverable: "完成财务数据清洗、建模及可视化经营驾驶舱", careers: "财务数据分析、财务BP助理、BI实习生", reason: "把财务专业知识与BI工具结合，适合形成直接对应岗位的复合型成果。",
    articleUrl: "https://mp.weixin.qq.com/s/eb8ad37vSvho3s3Lg8Z7cw", enrollmentUrl: "https://gxcdh.xetslk.com/s/2UrhR7",
  },
  {
    id: "mining", name: "Python数据挖掘", shortName: "Python数据挖掘", category: "算法与智能硬件", accent: "#e06c32",
    majors: ["cs", "ai", "math", "finance"], interests: ["algorithm", "data", "risk"], outcomes: ["model", "code-report", "resume"], tools: ["python", "ml", "sql"], goals: ["skill", "career", "study", "competition", "portfolio"],
    minFoundation: 2, intensity: 3, beginnerFriendly: false, deliverable: "完成机器学习建模、评估优化、代码与数据挖掘报告", careers: "数据挖掘、机器学习算法助理、行业算法岗位", reason: "适合已有Python或数据分析基础、希望进入机器学习和预测建模的同学。",
    articleUrl: "https://mp.weixin.qq.com/s/rqppjPruB51nhatLrRXCKQ", enrollmentUrl: "https://gxcdh.xetslk.com/s/1AR6h3",
  },
  {
    id: "embodied", name: "具身智能（含计算机视觉）", shortName: "具身智能", category: "算法与智能硬件", accent: "#f07b3f",
    majors: ["ai", "cs", "math"], interests: ["robot", "algorithm"], outcomes: ["model", "product", "resume"], tools: ["python", "ml", "hardware"], goals: ["career", "portfolio", "skill", "competition", "interest"],
    minFoundation: 2, intensity: 3, beginnerFriendly: false, deliverable: "完成机械臂控制、智能交互或视觉识别与系统集成项目", careers: "机械臂开发、具身智能、机器人控制", reason: "融合硬件连接、控制、视觉和系统集成，适合想挑战智能硬件项目的同学。",
    articleUrl: "https://mp.weixin.qq.com/s/l1P5FY1fh7a1gfLemm0XAg", enrollmentUrl: "https://gxcdh.xetslk.com/s/1Fmamk",
  },
  {
    id: "opinion", name: "舆情大数据分析", shortName: "舆情大数据", category: "数字化行业应用", accent: "#e15474",
    majors: ["media", "business", "creative", "other"], interests: ["opinion", "data"], outcomes: ["report", "dashboard", "resume"], tools: ["excel", "bi"], goals: ["career", "portfolio", "explore", "skill"],
    minFoundation: 0, intensity: 2, beginnerFriendly: true, deliverable: "使用企业级平台完成舆情监测、研判和专业分析报告", careers: "舆情分析、公关助理、品牌管理、市场研究", reason: "无需编程，能把传播理论、企业工具和真实数据分析结合成职业作品。",
    articleUrl: "https://mp.weixin.qq.com/s/0SYcIVTGeUo0Xfl4uGtE0w", enrollmentUrl: "https://gxcdh.xetslk.com/s/4jaxaY",
  },
  {
    id: "hr", name: "人力资源数字化", shortName: "人力资源数字化", category: "数字化行业应用", accent: "#d65b91",
    majors: ["business", "finance", "other"], interests: ["hr", "data"], outcomes: ["report", "dashboard", "resume"], tools: ["excel", "bi"], goals: ["career", "portfolio", "explore", "skill"],
    minFoundation: 0, intensity: 2, beginnerFriendly: true, deliverable: "围绕HR六大模块完成数字化工具实践和项目报告", careers: "HRIS、人力资源实习生、数字化HRBP助理", reason: "把人力资源岗位知识与数字化工具结合，形成专业直接相关的实战经历。",
    articleUrl: "https://mp.weixin.qq.com/s/QQHtjI_zuR69KBlhhhoJ3w", enrollmentUrl: "https://gxcdh.xetslk.com/s/2LBFdD",
  },
  {
    id: "audit", name: "大数据审计", shortName: "大数据审计", category: "数字化行业应用", accent: "#bf657c",
    majors: ["finance", "cs", "ai", "business"], interests: ["risk", "data"], outcomes: ["report", "code-report", "resume"], tools: ["excel", "sql", "python"], goals: ["career", "portfolio", "skill", "study"],
    minFoundation: 0, intensity: 2, beginnerFriendly: true, deliverable: "完成审计工具实践、异常分析和一份规范的大数据审计报告", careers: "大数据审计、IT审计、风险咨询、合规分析", reason: "适合财会审计与技术专业学生建立数据技术加审计业务的复合能力。",
    articleUrl: "https://mp.weixin.qq.com/s/aRnqzhgbm1lZu8tEWInTOg", enrollmentUrl: "https://gxcdh.xetslk.com/s/48oxbL",
  },
  {
    id: "aigc-video", name: "AIGC短视频实战训练营", shortName: "AIGC短视频", category: "AIGC内容创作", accent: "#ee6a50",
    majors: ["creative", "media", "business", "other"], interests: ["video", "opinion"], outcomes: ["video", "product", "resume"], tools: ["aigc"], goals: ["career", "portfolio", "skill", "explore", "interest"],
    minFoundation: 0, intensity: 1, beginnerFriendly: true, deliverable: "完成选题、AI脚本分镜、画面生成、剪辑包装和发布复盘", careers: "新媒体运营、内容策划、AIGC创作、品牌传播", reason: "全程以出片为目标，零基础也能建立一份完整、直观的新媒体作品。",
    articleUrl: "https://mp.weixin.qq.com/s/D09uVEHv3Tc30Tzjy-U_Yg", enrollmentUrl: "https://gxcdh.xetslk.com/s/3u6UH1",
  },
];

function asList(value: AnswerValue | undefined) {
  return Array.isArray(value) ? value : value ? [value] : [];
}

function scoreProjects(answers: Answers) {
  const major = String(answers.major || "other");
  const foundation = Number(answers.foundation || 0);
  const experience = Number(answers.experience || 0);
  const time = Number(answers.time || 0);
  const interests = asList(answers.interests);
  const goals = asList(answers.goals);
  const tools = asList(answers.tools);
  const outcome = String(answers.outcome || "resume");

  return projects
    .map((project) => {
      let score = 0;
      const interestHits = interests.filter((item) => project.interests.includes(item)).length;
      const unsureInterest = interests.includes("unsure");
      score += interestHits ? Math.min(35, 27 + interestHits * 8) : unsureInterest ? 16 : 4;
      score += project.outcomes.includes(outcome) ? 20 : outcome === "resume" ? 14 : 3;
      score += project.majors.includes(major) ? 15 : 5;

      const gap = Math.max(0, project.minFoundation - foundation);
      let foundationScore = gap === 0 ? 8 : gap === 1 ? 5 : 2;
      if (tools.some((tool) => project.tools.includes(tool))) foundationScore += 2;
      if (tools.includes("none") || tools.includes("unsure")) foundationScore = Math.min(foundationScore, project.beginnerFriendly ? 8 : 4);
      score += Math.min(10, foundationScore);

      const goalHits = goals.filter((goal) => project.goals.includes(goal)).length;
      score += Math.min(10, goalHits * 5 || 2);
      score += time >= project.intensity ? 5 : time === project.intensity - 1 ? 3 : 1;
      score += experience <= 1 && project.beginnerFriendly ? 5 : experience >= 2 && !project.beginnerFriendly ? 5 : 3;

      const raw = Math.round(Math.min(98, Math.max(55, score)));
      const readiness = foundation >= project.minFoundation
        ? "可以直接开始"
        : gap === 1
          ? "适合入门，建议同步补充基础"
          : "建议作为第二阶段进阶项目";
      return { ...project, score: raw, readiness };
    })
    .sort((a, b) => b.score - a.score);
}

const gradeAdvice: Record<string, string> = {
  freshman: "你正处在兴趣探索期，先完成一份能运行、能讲清楚的小项目，比盲目堆知识更重要。",
  sophomore: "现在适合建立第一份完整项目，并逐步确认未来希望深入的技术或行业方向。",
  junior: "这是补齐实习简历项目经历的关键阶段，建议优先选择能形成明确交付物的项目。",
  senior: "建议围绕目标岗位选择项目，重点准备成果展示、项目复盘和面试表达。",
  postgrad: "建议选择有一定深度、能与研究或目标岗位形成连接的项目，并保留完整技术文档。",
  other: "建议以目标岗位为中心选择项目，尽快形成一份可验证、可展示的项目成果。",
};

function optionLabel(questionId: string, value: string) {
  return questions.find((q) => q.id === questionId)?.options?.find((o) => o.value === value)?.label || value;
}

export default function Home() {
  const [stage, setStage] = useState<"intro" | "quiz" | "result">("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [notice, setNotice] = useState("");
  const current = questions[step];
  const results = useMemo(() => scoreProjects(answers), [answers]);

  const isAnswered = () => {
    const value = answers[current.id];
    if (current.type === "text") return typeof value === "string" && value.trim().length >= 2;
    if (current.type === "multi") return Array.isArray(value) && value.length > 0;
    return typeof value === "string" && value.length > 0;
  };

  const choose = (value: string) => {
    setNotice("");
    if (current.type === "multi") {
      const selected = asList(answers[current.id]);
      if (value === "none" || value === "unsure") {
        setAnswers({ ...answers, [current.id]: selected.includes(value) ? [] : [value] });
        return;
      }
      const cleaned = selected.filter((item) => item !== "none" && item !== "unsure");
      if (cleaned.includes(value)) {
        setAnswers({ ...answers, [current.id]: cleaned.filter((item) => item !== value) });
      } else if (!current.max || cleaned.length < current.max) {
        setAnswers({ ...answers, [current.id]: [...cleaned, value] });
      } else {
        setNotice(`最多选择${current.max}项`);
      }
    } else {
      setAnswers({ ...answers, [current.id]: value });
    }
  };

  const next = () => {
    if (!isAnswered()) {
      setNotice(current.type === "text" ? "请填写学校名称后继续" : "请选择一个答案后继续");
      return;
    }
    setNotice("");
    if (step === questions.length - 1) {
      setStage("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStep(step + 1);
    }
  };

  const restart = () => {
    setAnswers({});
    setStep(0);
    setNotice("");
    setStage("intro");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (stage === "intro") {
    return (
      <main className="site-shell intro-page">
        <header className="topbar">
          <div className="brand"><span className="brand-mark">T</span><span>拓尔思智能学院</span></div>
          <a className="assistant-link" href={assistantUrl} target="_blank" rel="noreferrer">联系助教 <span>↗</span></a>
        </header>
        <section className="hero">
          <div className="hero-copy">
            <div className="pill"><span className="pulse" /> 2分钟 · 10道题 · 无需技术考试</div>
            <p className="kicker">大学生 AI × 大数据项目匹配测评</p>
            <h1>找到最适合你的<br/><em>第一个实战项目</em></h1>
            <p className="hero-description">根据你的专业、基础、兴趣和发展目标，从12个企业项目实训中匹配首选项目，并生成一条清晰的成长路径。</p>
            <button className="primary-button hero-button" onClick={() => setStage("quiz")}>开始测评 <span aria-hidden="true">→</span></button>
            <div className="trust-row">
              <span>✓ 零基础可测</span><span>✓ 结果即时生成</span><span>✓ 不做能力淘汰</span>
            </div>
          </div>
          <div className="hero-visual" aria-label="测评将从兴趣、基础、目标和成果偏好四个维度推荐项目">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="core-card">
              <span className="mini-label">你的项目坐标</span>
              <strong>AI应用</strong>
              <div className="score-ring"><span>92<small>%</small></span></div>
              <p>兴趣 × 基础 × 目标</p>
            </div>
            <div className="float-card card-a"><span>01</span><b>兴趣方向</b></div>
            <div className="float-card card-b"><span>02</span><b>当前基础</b></div>
            <div className="float-card card-c"><span>03</span><b>成果偏好</b></div>
            <div className="float-card card-d"><span>04</span><b>发展目标</b></div>
          </div>
        </section>
        <section className="intro-footer">
          <div><strong>12</strong><span>个实训项目</span></div>
          <div><strong>3</strong><span>层推荐结果</span></div>
          <div><strong>1</strong><span>条成长路径</span></div>
          <p>不是判断你“够不够格”，而是帮你找到最容易开始、最可能完成、最符合目标的项目。</p>
        </section>
      </main>
    );
  }

  if (stage === "quiz") {
    const selected = asList(answers[current.id]);
    return (
      <main className="quiz-page">
        <header className="quiz-header">
          <div className="brand"><span className="brand-mark">T</span><span>项目匹配测评</span></div>
          <button className="text-button" onClick={restart}>退出测评</button>
        </header>
        <div className="progress-wrap">
          <div className="progress-meta"><span>测评进度</span><strong>{step + 1} / {questions.length}</strong></div>
          <div className="progress-track"><div style={{ width: `${((step + 1) / questions.length) * 100}%` }} /></div>
        </div>
        <section className="question-card" key={current.id}>
          <span className="question-eyebrow">{current.eyebrow}</span>
          <h1>{current.title}</h1>
          {current.hint && <p className="question-hint">{current.hint}</p>}
          {current.type === "text" ? (
            <label className="school-field">
              <span>学校名称</span>
              <input
                autoFocus
                type="text"
                value={String(answers.school || "")}
                placeholder="请输入学校全称"
                onChange={(event) => { setAnswers({ ...answers, school: event.target.value }); setNotice(""); }}
                onKeyDown={(event) => { if (event.key === "Enter") next(); }}
              />
              <small>例如：中国农业大学</small>
            </label>
          ) : (
            <div className={`options-grid ${current.id === "grade" ? "compact-grid" : ""}`}>
              {current.options?.map((option, index) => {
                const active = current.type === "multi" ? selected.includes(option.value) : answers[current.id] === option.value;
                return (
                  <button key={`${option.value}-${index}`} className={`option-card ${active ? "selected" : ""}`} onClick={() => choose(option.value)} aria-pressed={active}>
                    <span className="option-index">{active ? "✓" : String.fromCharCode(65 + index)}</span>
                    <span className="option-label">{option.label}</span>
                  </button>
                );
              })}
            </div>
          )}
          <div className="question-actions">
            <button className="secondary-button" disabled={step === 0} onClick={() => { setStep(Math.max(0, step - 1)); setNotice(""); }}>← 上一题</button>
            <div className="action-right">
              {notice && <span className="notice" role="alert">{notice}</span>}
              <button className="primary-button" onClick={next}>{step === questions.length - 1 ? "查看结果" : "下一题"} →</button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const [first, second, third] = results;
  const grade = String(answers.grade || "other");
  const interestLabels = asList(answers.interests).map((item) => optionLabel("interests", item)).filter((item) => !item.includes("不确定"));
  const goalLabels = asList(answers.goals).map((item) => optionLabel("goals", item));
  const foundation = Number(answers.foundation || 0);
  const foundationText = foundation <= 1 ? "起步探索型" : foundation === 2 ? "基础实践型" : "进阶挑战型";

  return (
    <main className="result-page">
      <header className="result-header">
        <div className="brand brand-light"><span className="brand-mark">T</span><span>项目匹配报告</span></div>
        <div className="result-header-actions">
          <a className="assistant-link light" href={assistantUrl} target="_blank" rel="noreferrer">联系助教 <span>↗</span></a>
          <button className="text-button light" onClick={restart}>重新测评</button>
        </div>
      </header>
      <section className="result-hero">
        <div className="result-intro">
          <span className="result-kicker">测评完成 · {String(answers.school || "你的学校")}</span>
          <h1>你的首选项目是<br/><em>{first.name}</em></h1>
          <p>{gradeAdvice[grade]}</p>
          <div className="profile-tags">
            <span>{foundationText}</span>
            {interestLabels.slice(0, 2).map((label) => <span key={label}>{label}</span>)}
            {goalLabels.slice(0, 1).map((label) => <span key={label}>{label}</span>)}
          </div>
        </div>
        <div className="match-panel" style={{ "--project-accent": first.accent } as React.CSSProperties}>
          <div className="match-score"><strong>{first.score}</strong><span>%</span></div>
          <p>综合匹配度</p>
          <div className="match-bar"><div style={{ width: `${first.score}%` }} /></div>
          <span className="readiness">● {first.readiness}</span>
        </div>
      </section>

      <section className="report-content">
        <div className="primary-project-card" style={{ "--project-accent": first.accent } as React.CSSProperties}>
          <div className="rank-row"><span className="rank-badge">首选项目</span><span>{first.category}</span></div>
          <h2>{first.name}</h2>
          <p className="project-reason">{first.reason}</p>
          <div className="project-details">
            <div><span>你将完成</span><strong>{first.deliverable}</strong></div>
            <div><span>可衔接方向</span><strong>{first.careers}</strong></div>
          </div>
          <div className="why-fit">
            <span>为什么适合你</span>
            <ul>
              <li>与你选择的兴趣方向和成果偏好高度一致</li>
              <li>{foundation <= first.minFoundation ? "课程路径能够承接你目前的基础，建议按任务逐步完成" : "你目前的基础能够支持项目实践，可以把重点放在成果打磨上"}</li>
              <li>能够形成可展示、可复盘、可写进简历的完整交付物</li>
            </ul>
          </div>
          <a className="primary-button full-button" href={first.articleUrl} target="_blank" rel="noreferrer">查看该项目介绍详情 <span>↗</span></a>
        </div>

        <aside className="path-card">
          <span className="section-label">你的成长路径</span>
          <h3>从第一份作品，到更完整的能力组合</h3>
          {[first, second, third].map((item, index) => (
            <div className="path-item" key={item.id}>
              <span className="path-number">0{index + 1}</span>
              <div><small>{index === 0 ? "现在开始" : index === 1 ? "横向拓展" : "进阶挑战"}</small><strong>{item.shortName}</strong></div>
              {index < 2 && <span className="path-line" />}
            </div>
          ))}
          <p className="path-note">建议先完成首选项目，再根据求职方向和时间安排继续拓展；不需要一次学完所有项目。</p>
        </aside>
      </section>

      <section className="alternatives-section">
        <div className="section-heading"><span className="section-label">更多可能</span><h2>两项同样值得关注的项目</h2></div>
        <div className="alternative-grid">
          {[second, third].map((item, index) => (
            <article className="alternative-card" key={item.id} style={{ "--project-accent": item.accent } as React.CSSProperties}>
              <div className="alternative-top"><span>{index === 0 ? "备选项目" : "成长项目"}</span><strong>{item.score}%</strong></div>
              <h3>{item.name}</h3>
              <p>{item.reason}</p>
              <div className="mini-meta"><span>{item.readiness}</span><span>{item.category}</span></div>
              <a className="project-text-link" href={item.articleUrl} target="_blank" rel="noreferrer">查看项目介绍 <span>↗</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="enrollment-section">
        <div className="section-heading">
          <span className="section-label">报名通道</span>
          <h2>选择适合你的学习方式</h2>
          <p>可以只聚焦首选项目，也可以用年卡在一年内探索全部12个项目。</p>
        </div>
        <div className="enrollment-grid">
          <a className="enrollment-card single-card" href={first.enrollmentUrl} target="_blank" rel="noreferrer">
            <div className="plan-top"><span>单一项目报名</span><span className="plan-arrow">↗</span></div>
            <h3>{first.shortName}</h3>
            <div className="plan-price"><small>¥</small><strong>399</strong><span>元</span></div>
            <div className="plan-duration">畅学一年</div>
            <p>适合目标明确，只想集中学习一个具体方向的同学。</p>
            <span className="plan-action">报名当前项目 <b>→</b></span>
          </a>
          <a className="enrollment-card annual-card" href={annualPassUrl} target="_blank" rel="noreferrer">
            <span className="recommended-badge">更推荐</span>
            <div className="plan-top"><span>12个项目年卡</span><span className="plan-arrow">↗</span></div>
            <h3>全项目畅学计划</h3>
            <div className="plan-price"><small>¥</small><strong>499</strong><span>元</span></div>
            <div className="plan-duration">一年内畅学全部12个项目</div>
            <p>适合探索方向、积累多段项目经历，建立更完整能力组合的同学。</p>
            <span className="plan-action">报名12项目年卡 <b>→</b></span>
          </a>
        </div>
      </section>

      <section className="result-cta">
        <div><span className="section-label">下一步</span><h2>想确认这条路径是否适合你？</h2><p>查看首选项目的课程内容、成果案例和学习安排，或咨询老师进一步确认方向。</p></div>
        <div className="cta-actions"><a className="primary-button" href={assistantUrl} target="_blank" rel="noreferrer">联系助教</a><button className="secondary-button" onClick={() => window.print()}>保存测评报告</button></div>
      </section>
      <footer className="site-footer"><span>拓尔思智能学院 · 联合高校共育产业人才</span><div><a href={assistantUrl} target="_blank" rel="noreferrer">联系助教</a><button onClick={restart}>重新测一次</button></div></footer>
    </main>
  );
}
