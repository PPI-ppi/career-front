// src/mock/data.js

// 1. 热门岗位 (3 个)
export const hotJobs = [
  {
    id: 1,
    title: '高级前端工程师',
    jobTitle: '高级前端工程师', // 兼容 JobCard.vue
    company: '阿里云',
    companyName: '阿里云', // 兼容 JobCard.vue
    location: '杭州',
    matchRate: 92,
    tags: ['Vue3', 'TypeScript', 'AI']
  },
  {
    id: 2,
    title: 'AI 算法专家',
    jobTitle: 'AI 算法专家',
    company: '达摩院',
    companyName: '达摩院',
    location: '北京',
    matchRate: 85,
    tags: ['Python', 'PyTorch', 'NLP']
  },
  {
    id: 3,
    title: '产品运营经理',
    jobTitle: '产品运营经理',
    company: '淘宝',
    companyName: '淘宝',
    location: '上海',
    matchRate: 78,
    tags: ['数据分析', '用户增长']
  },
  {
    id: 4,
    jobTitle: '产品运营经理',
    companyName: '淘宝',
    location: '上海',
    matchRate: 78,
    salary: '20k - 40k',
    tags: ['数据驱动', '用户增长', 'SQL']
  },
  {
    id: 5,
    jobTitle: '后端架构师 (Go/Java)',
    companyName: '字节跳动',
    location: '深圳',
    matchRate: 88,
    salary: '40k - 70k',
    tags: ['高并发', '微服务', 'K8s']
  },
  {
    id: 6,
    jobTitle: '数据分析科学家',
    companyName: '百度',
    location: '北京',
    matchRate: 95,
    salary: '30k - 55k',
    tags: ['建模', '特征工程', 'PySpark']
  },
  {
    id: 7,
    jobTitle: '全栈开发工程师',
    companyName: '腾讯 · 微信',
    location: '广州',
    matchRate: 82,
    salary: '35k - 65k',
    tags: ['Node.js', 'React', '分布式']
  },
  {
    id: 8,
    jobTitle: '网络安全攻防专家',
    companyName: '奇安信',
    location: '成都',
    matchRate: 90,
    salary: '28k - 50k',
    tags: ['渗透测试', '零信任', '溯源']
  }
];

// 2. 所有岗位列表 (用于搜索)
export const allJobs = [
  {
    id: 1,
    title: '高级前端工程师',
    company: '阿里云',
    salary: '25k-40k',
    city: '杭州',
    isFavorite: true,
    industry: 'it',
    experience: '3-5 年',
    tags: ['五险一金', '弹性工作', '14 薪'],
    time: '3 小时前发布',
    scale: '大厂',
    description: '负责核心前端架构设计与 AI 功能落地。需要精通 Vue 3 生态，有大型项目经验。',
    requirements: [
      '精通 Vue 3 生态，熟悉 Composition API',
      '有 AI 相关项目经验，了解大模型应用',
      '良好的团队协作能力',
      '具备较强的学习能力'
    ],
    remote: true
  },
  {
    id: 2,
    title: 'AI 算法专家',
    company: '达摩院',
    salary: '30k-60k',
    city: '北京',
    isFavorite: true,
    industry: 'it',
    experience: '5 年以上',
    tags: ['Python', 'PyTorch', 'NLP'],
    time: '1 小时前发布',
    scale: '大厂',
    description: '负责 AI 算法研究与落地，参与大模型训练与优化。',
    requirements: [
      '精通 Python 和 PyTorch',
      '有 NLP 或 CV 相关研究经验',
      '发表过顶会论文者优先'
    ],
    remote: false
  },
  {
    id: 3,
    title: '产品运营经理',
    company: '淘宝',
    salary: '15k-25k',
    city: '上海',
    isFavorite: true,
    industry: 'finance',
    experience: '1-3 年',
    tags: ['数据分析', '用户增长'],
    time: '5 小时前发布',
    scale: '大厂',
    description: '负责产品运营策略制定与执行，提升用户活跃度。',
    requirements: [
      '有互联网产品运营经验',
      '熟悉数据分析工具',
      '良好的沟通协调能力'
    ],
    remote: true
  }
];

// 3. 用户数据
export const userData = {
  name: '李伟华',
  avatar: 'https://via.placeholder.com/150',
  isLoggedIn: true,
  skills: {
    certificate: 70,      // 证书
    digital: 75,          // 数字化素养
    teamwork: 80,         // 团队协作
    learning: 90,         // 学习能力
    professional: 85,     // 专业技能
    internship: 65,       // 实习经验
    communication: 80,    // 沟通能力
    pressure: 75,         // 抗压能力
    innovation: 85        // 创新能力
  }
};

// 4. 岗位详情
export const jobDetail = {
  id: 1,
  description: '负责核心前端架构设计与 AI 功能落地。',
  requirements: [
    '精通 Vue 3 生态',
    '有 AI 相关项目经验',
    '良好的团队协作能力'
  ]
};

// 5. AI 报告数据
// src/mock/data.js
export const aiReportData = {
  // Tab 1: 人岗匹配度
  matchingScore: 85, // 总体匹配度百分比
  radarData: [
    { name: '技术能力', max: 100, value: 90 },
    { name: '沟通能力', max: 100, value: 75 },
    { name: '项目经验', max: 100, value: 80 },
    { name: '学习能力', max: 100, value: 85 },
    { name: '团队协作', max: 100, value: 70 },
    { name: '抗压能力', max: 100, value: 65 }
  ],
  skillBreakdown: [
    { skill: 'Python', match: 90, comment: '熟练掌握，可胜任核心开发任务' },
    { skill: 'JavaScript', match: 80, comment: '基础扎实，建议深入学习框架' },
    { skill: '数据分析', match: 75, comment: '具备基本能力，需加强实战项目' }
  ],

  // Tab 2: 职业目标设定与规划
  mapData: [
    { name: '北京', value: 85 },
    { name: '上海', value: 80 },
    { name: '深圳', value: 75 },
    { name: '杭州', value: 70 },
    { name: '广州', value: 65 }
  ],
  wordCloudData: ['AI', '云计算', '大数据', '产品经理', '前端开发', '后端开发', '算法', '机器学习', '深度学习', '区块链'],
  trendData: [
    { year: '2020', demand: 100 },
    { year: '2021', demand: 130 },
    { year: '2022', demand: 180 },
    { year: '2023', demand: 250 },
    { year: '2024', demand: 320 }
  ],
  developmentPath: [
    { stage: '0-1年', goal: '打好基础，完成入门项目', skills: ['HTML/CSS', 'JavaScript'] },
    { stage: '1-3年', goal: '成为初级工程师，参与核心模块开发', skills: ['React/Vue', 'Node.js'] },
    { stage: '3-5年', goal: '晋升中级工程师，独立负责项目', skills: ['微服务', '云原生'] },
    { stage: '5年以上', goal: '成为高级工程师或技术专家', skills: ['架构设计', '性能优化'] }
  ],

  // Tab 3: 行动计划
  actionPlanItems: [
    { title: '提升沟通能力', icon: 'Chat', description: '阅读《非暴力沟通》并实践在团队会议中', deadline: '2024-06-30' },
    { title: '学习 Python', icon: 'Code', description: '完成 Coursera 上的 Python 数据分析课程', deadline: '2024-07-15' },
    { title: '准备面试', icon: 'Document', description: '刷 LeetCode Top 100 题目', deadline: '2024-08-31' },
    { title: '积累项目经验', icon: 'Project', description: '参与开源项目贡献代码', deadline: '2024-09-30' }
  ],

  // Tab 4: 报告导出
  reportCover: 'https://via.placeholder.com/300x200?text=AI+Career+Report',
  reportTitle: '你的专属职业发展报告'
}

