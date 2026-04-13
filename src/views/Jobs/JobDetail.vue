<template>
  <div class="job-detail">
    <!-- 顶部导航栏 -->
    <header class="header">
      <h1>岗位详情</h1>
      <div class="actions">
        <el-button type="text" @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <el-button type="text" @click="toggleFavorite">
          <el-icon :class="{ 'filled': isFavorited }">
            <StarFilled v-if="isFavorited" />
            <Star v-else />
          </el-icon>
        </el-button>
      </div>
    </header>

    <!-- 主体内容区 -->
    <main class="main-content">
      <!-- 岗位基本信息 -->
      <el-card class="card">
        <div class="job-header">
          <h2>{{ job?.title || '加载中...' }}</h2>
          <div class="job-meta">
            <span>{{ job?.company }}</span>
            <span class="divider">|</span>
            <span>{{ job?.city }}</span>
            <span class="divider">|</span>
            <span class="salary">{{ job?.salary }}</span>
          </div>
        </div>
      </el-card>

      <!-- 岗位介绍 -->
      <el-card class="card">
        <template #header>
          <span>岗位介绍</span>
        </template>
        <div v-if="loading" class="skeleton">
          <el-skeleton :rows="6" animated />
        </div>
        <div v-else-if="!job" class="empty-state">
          <el-empty description="未找到该职位">
            <el-button type="primary" @click="goBack">返回列表</el-button>
          </el-empty>
        </div>
        <div v-else class="description">
          <p>{{ job.description || '暂无详细描述' }}</p>
        </div>
      </el-card>

      <!-- 岗位要求画像 -->
      <el-card class="card">
        <template #header>
          <span>岗位要求画像</span>
        </template>
        <div class="graph-wrapper">
          <div ref="graphContainer" class="graph-canvas"></div>
          <el-button class="reset-btn" @click="resetView" circle icon="Refresh" />
        </div>
      </el-card>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted,nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Star, StarFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import rawData from '@/assets/data.json'
import ForceGraph from 'force-graph'
import neo4j from 'neo4j-driver'
import * as d3 from 'd3';
import { mockGraphData } from '@/assets/mockGraph.js'

// --- 1. 引用和状态 ---
const graphContainer = ref(null)
let graphInstance = null

// --- 2. Neo4j 连接配置 ---
// 这里等同学发地址后，替换成 'bolt://xxx.cpolar.top:xxx'
const NEO4J_URL = 'bolt://localhost:7687' 
const driver = neo4j.driver(NEO4J_URL, neo4j.auth.basic('', ''))

const NODE_CONFIG = {
  Job: { color: '#6fb1fc', size: 10 },        // 中心岗位：蓝色，最大
  Skill: { color: '#f79767', size: 7 },      // 技能：橙色，中等
  Requirement: { color: '#57c7e3', size: 6 }, // 要求：青色
  Default: { color: '#d3d3d3', size: 5 }      // 其他：灰色
};

// --- 3. 初始化图谱函数 ---
const initGraph = async () => {

  // JobDetail.vue 约 160 行 initGraph 函数内
const LEVEL_COLORS = {
  1: '#FF8C00', // 第一级：深橙色，突出中心岗位
  2: '#E6E6FA', // 第二级：深天蓝色，与第一级有明显色差
};

// 第三级：随机彩色池（淡雅色系，保证文字清晰）
const THIRD_LEVEL_COLORS = ['#7fb8ee', '#76d7ea', '#8de3c0', '#b6e39a', '#f3d999', '#f7a8a8'];  if (!graphContainer.value || !job.value) return;

  const nameMap = {
    "软件测试": "软件测试工程师（专项方向）",
    "C/C++": "C++",
    "前端开发": "前端开发工程师",
    "Java": "Java开发工程师", 
    "硬件测试": "硬件测试工程师",
    "测试工程师": "测试工程师（软件方向）",
    // 你可以根据需要继续在这里添加剩下的岗位映射
  };

  // 2. 获取最终用于查询的字符串
  // 如果在 map 里找到了就用映射后的，没找到就直接用原标题
  const searchTitle = nameMap[job.value.title] || job.value.title;

  if (graphInstance) graphInstance._destructor();

  // 2. 初始化实例（不依赖外部 d3 变量）
graphInstance = ForceGraph()(graphContainer.value)
.nodeCanvasObject((node, ctx, globalScale) => {
  const label = node.name;
  const nodeRadius = node.val;

  // 1. 绘制圆形背景
  ctx.beginPath();
  ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
  ctx.fillStyle = node.color;
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.5 / globalScale;
  ctx.stroke();

  // 2. 文字配置
  const fontSize = 11; // 稍微调小字号，增加容错
  ctx.font = `500 ${fontSize}px Sans-Serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#001f3f';

  // 3. 💡 智能换行逻辑
  if (label.length > 6) { 
    // 如果超过6个字，拆成两行
    const mid = Math.ceil(label.length / 2);
    const line1 = label.substring(0, mid);
    const line2 = label.substring(mid);
    
    ctx.fillText(line1, node.x, node.y - fontSize * 0.6);
    ctx.fillText(line2, node.x, node.y + fontSize * 0.6);
  } else {
    // 短文本单行显示
    ctx.fillText(label, node.x, node.y);
  }
})
    .linkDirectionalArrowLength(3)
    .linkDirectionalArrowRelPos(1)
    // .linkColor(() => '#E4E7ED');
    .d3Force('charge', d3.forceManyBody().strength(-2500))  // 💡 减弱排斥力（从 -1000 改为 -300），让节点聚拢
    .d3Force('link', d3.forceLink().distance(d => 120 + d.source.val + d.target.val))
    .d3Force('collide', d3.forceCollide(node => node.val + 15)) // 💡 防止球体重叠
    .d3Force('center', d3.forceCenter(0, 0))             // 💡 增加中心引力，确保整体在原点附近
    .d3VelocityDecay(0.2)
    

  try {
    const session = driver.session();
    // 使用模糊匹配，增加查询范围
    const cypher = `
      MATCH (j:Job)-[r*1..2]-(m) 
      WHERE j.title = $jobTitle OR j.name CONTAINS $jobTitle
      RETURN j,r,m LIMIT 300
    `;
    const result = await session.run(cypher, { jobTitle: searchTitle });

    const nodes = [];
    const links = [];

    result.records.forEach(record => {
      ['j', 'm'].forEach(key => {
        const node = record.get(key);
        if (!node) return;

        const id = node.identity.toString();
        if (!nodes.find(n => n.id === id)) {
          const label = node.labels[0] || 'Default';
      const labelText = node.properties.title || node.properties.name || label;
      // 💡 判断是否为中心岗位
      const isCenterNode = (node.properties.title === job.value.title || node.properties.name === job.value.title);
      const config = NODE_CONFIG[label] || NODE_CONFIG.Default;

      // 💡 动态计算半径：保证球体能装下文字
      const charCount = labelText.length;
      const dynamicRadius = isCenterNode 
        ? Math.max(20, charCount * 5.5) 
        : Math.max(12, charCount * 4.5);

      // 💡 确定层级 (Level)
      let level = 3; 
      if (isCenterNode) {
        level = 1;
      } else if (node.labels.includes('Ability')) { 
        // 假设你的 Neo4j 中第二级节点带有 'Ability' 标签，如果没有，可以根据关系距离判断
        level = 2;
      }

      // 💡 分配颜色
      let finalColor;
      if (level === 1) {
        finalColor = LEVEL_COLORS[1];
      } else if (level === 2) {
        finalColor = LEVEL_COLORS[2];
      } else {
        // 第三层：根据 ID 取模随机分配彩色
        finalColor = THIRD_LEVEL_COLORS[parseInt(id) % THIRD_LEVEL_COLORS.length];
      }

      // ✅ 确保这里只有一个干净的 nodes.push，没有重复的 fx/fy
      nodes.push({
        id: id,
        name: labelText,
        color: finalColor,
        val: dynamicRadius, 
        fx: null,
        fy: null
          });
        }
      });

      // 解析关系连线（保持不变）
      const rel = record.get('r');
      if (rel) {
        if (Array.isArray(rel)) {
          rel.forEach(r => links.push({ source: r.start.toString(), target: r.end.toString() }));
        } else {
          links.push({ source: rel.start.toString(), target: rel.end.toString() });
        }
      }
    });

    if (nodes.length > 0) {
      graphInstance.graphData({ nodes, links });
      
      // 💡 视觉聚焦：在数据加载后强制相机对焦
      setTimeout(() => {
        graphInstance.centerAt(0, 0, 500); // 移动到原点
        graphInstance.zoom(0.5, 500);        // 放大到 3 倍，解决“太小”的问题
      }, 500);
    } else {
      console.warn("未查找到数据，查询词为:", job.value.title);
    }

    session.close();
  } catch (err) {
    console.error('Neo4j 连通或查询失败:', err);
  }
};

// 在页面挂载后启动
onMounted(async () => {
  await nextTick()
  initGraph()
})

const resetView = () => graphInstance.zoomToFit(400)

onMounted(async () => {
  loading.value = true
  await new Promise(resolve => setTimeout(resolve, 300))

  const targetId = parseInt(route.params.id)
  // 从导入的 rawData 中寻找
  const foundItem = rawData.find((item, index) => (item.id || index + 1) === targetId)

  if (foundItem) {
    job.value = {
      id: targetId,
      title: foundItem.job_title,      // 对应 JSON 的 job_title
      company: foundItem.company_name, // 对应 JSON 的 company_name
      // 薪资计算处理
      salary: foundItem.min_salary ? `${foundItem.min_salary/1000}k-${foundItem.max_salary/1000}k` : '面议',
      city: foundItem.location || '杭州', // 💡 修正：JSON 字段是 location
      description: foundItem.job_details, // 💡 修正：JSON 字段是 job_details
    }
    isFavorited.value = favorites.value.includes(targetId)
    
    // 确保数据加载后再初始化图谱
    nextTick(() => {
      initGraph()
    })
  }
  loading.value = false
})

const router = useRouter()
const route = useRoute()

// 加载状态
const loading = ref(true)

// 当前职位数据
const job = ref(null)

// 是否已收藏
const isFavorited = ref(false)

// 模拟用户收藏列表（实际项目中应使用 Pinia 或 localStorage）
const favorites = ref(JSON.parse(localStorage.getItem('user_favorites') || '[]'))
// 获取职位 ID
const jobId = computed(() => route.params.id)

// 加载职位数据
onMounted(async () => {
  // 模拟加载延迟
  await new Promise(resolve => setTimeout(resolve, 500))

  const foundJob = allJobs.find(j => j.id === parseInt(jobId.value))
  job.value = foundJob
  loading.value = false

  // 判断是否已收藏
  if (foundJob && favorites.value.includes(foundJob.id)) {
    isFavorited.value = true
  }
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 2. 修改点击收藏的逻辑
const toggleFavorite = () => {
  if (job.value) {
    const id = parseInt(jobId.value)
    const index = favorites.value.indexOf(id)
    
    if (index > -1) {
      // 如果已收藏，则移除
      favorites.value.splice(index, 1)
      isFavorited.value = false
      ElMessage.success('已取消收藏')
    } else {
      // 如果未收藏，则添加
      favorites.value.push(id)
      isFavorited.value = true
      ElMessage.success('已收藏')
    }
    
    // 🌟 关键：同步到本地存储
    localStorage.setItem('user_favorites', JSON.stringify(favorites.value))
  }
}
</script>

<style scoped lang="scss">

/* --- 全局背景：呼应首页的浅蓝色调 --- */
.job-detail {
  background: linear-gradient(135deg, #f5faff 0%, #ffffff 100%);
  min-height: 100vh;
}

/* --- 1. 毛玻璃导航栏 --- */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  padding: 12px 60px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  
  h1 { font-size: 18px; font-weight: 700; color: #334455; }
}

/* --- 2. 布局：双栏呼吸感 --- */
.main-content {
  display: grid;
  grid-template-columns: 1fr 380px; /* 🌟 7:3 比例 */
  gap: 30px;
  max-width: 1400px;
  margin: 40px auto;
  padding: 0 60px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
    padding: 20px;
  }
}

/* --- 3. 核心卡片组件 (Glass Card) --- */
.glass-card {
  background: #ffffff;
  border-radius: 24px; /* 🌟 大圆角更亲和 */
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.8);
  margin-bottom: 24px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 15px 50px rgba(0, 0, 0, 0.06);
  }
}

/* --- 4. 岗位标题与薪资 --- */
.job-main-info {
  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 { font-size: 32px; font-weight: 800; color: #1a1a1a; margin: 0; }
    .salary { 
      font-size: 28px; 
      font-weight: 800; 
      color: #f77c38; /* 🌟 珊瑚橙，呼应你的匹配度颜色 */
    }
  }

  .job-tags {
    margin-bottom: 24px;
    .el-tag { margin-right: 10px; border: none; background: #f0f7ff; color: #409eff; }
  }

  .job-meta {
    font-size: 15px;
    color: #8899aa;
    display: flex;
    align-items: center;
    .company-name { font-weight: 700; color: #409eff; }
    .divider { width: 1px; height: 14px; background: #ddd; margin: 0 15px; }
  }
}

/* --- 5. 详情内容区 --- */
.section-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #334455;
  display: flex;
  align-items: center;
  &::before {
    content: ""; width: 4px; height: 20px; background: #409eff;
    border-radius: 2px; margin-right: 12px;
  }
}

.description-content {
  line-height: 2;
  color: #556677;
  font-size: 16px;
  white-space: pre-line;
}

/* --- 6. 右侧画像与按钮 --- */
.portrait-card {
  position: sticky;
  top: 100px; /* 随滚动悬浮 */
  background: linear-gradient(135deg, #ffffff 0%, #f9fcff 100%);

  .req-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    color: #556677;
    .check-icon { color: #67C23A; font-size: 18px; }
  }

  .apply-btn {
    width: 100%;
    height: 54px;
    border-radius: 16px;
    font-size: 18px;
    font-weight: 700;
    margin-top: 20px;
    background: linear-gradient(90deg, #409EFF, #66b1ff);
    box-shadow: 0 8px 20px rgba(64, 158, 255, 0.3);
    border: none;
    &:hover { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(64, 158, 255, 0.4); }
  }
}
/* --- 1. 全屏布局基础 --- */
.job-detail {
  width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 顶部导航栏：增加阴影和内边距 */
.header {
  background: #ffffff;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;

  .header-left {
    display: flex;
    align-items: center;
    gap: 15px;
    h1 {
      margin: 0;
      font-size: 20px;
      color: #303133;
      font-weight: 600;
    }
  }

  .actions {
    display: flex;
    gap: 15px;
    
    .filled {
      color: #F56C6C;
    }
  }
}

/* --- 2. 主体内容区：取消宽度限制 --- */
.main-content {
  flex: 1;
  padding: 24px 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* 确保在大屏幕下内容也不会缩在一起 */
  width: 100%; 
  box-sizing: border-box;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: transform 0.3s ease;
}

/* --- 3. UI 细节增强：标题栏渐变与薪资 --- */
.job-main-card {
  /* 线性渐变背景，增加高级感 */
  background: linear-gradient(120deg, #ffffff 0%, #f0f7ff 100%);
  padding: 10px;
}

.job-header {
  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    h2 {
      font-size: 28px;
      margin: 0;
      color: #303133;
    }

    .salary {
      font-size: 26px;
      color: #F56C6C; /* 薪资高亮 */
      font-weight: bold;
    }
  }

  .job-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 15px;
    color: #606266;

    .divider {
      color: #dcdfe6;
      margin: 0 5px;
    }
    
    .company-tag {
      font-weight: 600;
      color: #409EFF;
    }
  }
}

/* --- 4. 卡片标题：增加蓝色左装饰条 --- */
:deep(.el-card__header) {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f2f5;
  
  span {
    font-size: 18px;
    font-weight: bold;
    color: #303133;
    position: relative;
    padding-left: 15px;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 18px;
      background: #409EFF; /* 蓝色装饰条 */
      border-radius: 2px;
    }
  }
}

/* --- 5. 列表样式：打钩图标与间距 --- */
.description {
  line-height: 1.8;
  color: #444;
  font-size: 16px;
  white-space: pre-line;
}

.requirements ul {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #f5f7fa;
    color: #606266;
    font-size: 15px;

    /* 模拟打钩图标（如果没有引入图标组件，可以用伪元素实现） */
    &::before {
      content: "✓";
      color: #67C23A;
      font-weight: bold;
      font-size: 16px;
    }

    &:last-child {
      border-bottom: none;
    }
  }
}

.skeleton, .empty-state {
  padding: 40px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .header {
    padding: 10px 15px;
  }
  
  .job-header .title-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .main-content {
    padding: 15px;
  }
}

.graph-wrapper {
  position: relative;
  width: 100%;
  height: 500px; /* 设定固定高度 */
  background: #fdfdfd;
  border-radius: 8px;
  border: 1px solid #f0f2f5;
  overflow: hidden;
}

.graph-canvas {
  width: 100%;
  height: 600px; /* 必须有明确高度，否则背景看不见 */
  /* 设置径向渐变，营造空间感 */
  background: radial-gradient(circle at center, #fefcce2d 0%, #e9f2fc99 100%) !important;
  position: relative;
  overflow: hidden;
}

/* 确保内部生成的 canvas 是透明的，否则会挡住上面的渐变 */
:deep(.graph-canvas canvas) {
  background-color: transparent !important;
}

.reset-btn {
  position: absolute;
  right: 15px;
  bottom: 15px;
  z-index: 10;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

/* 兼容 Element Plus 卡片内部间距 */
:deep(.el-card__body) {
  padding: 15px;
}
</style>