<template>
  <div class="personal-info-report">
    <el-row :gutter="20" class="row-first">
      <el-col :span="16">
        <el-card class="glass-card header-card">
          <div class="user-profile">
            <el-avatar :size="70" :src="avatarUrl" class="user-avatar" />
            <div class="user-text">
              <div class="name-row">
                <h2>{{ userInfo.name || '默认用户' }}</h2>
                <el-tag size="small" class="status-tag">分析已就绪</el-tag>
              </div>
              <p class="sub-info">
                <el-icon><School /></el-icon> {{ userInfo.school || '未提供学校信息' }}
                <el-divider direction="vertical" />
                <el-icon><Message /></el-icon> {{ userInfo.email || '未提供邮箱' }}
              </p>
            </div>
            <el-button class="re-edit-btn" @click="$emit('re-edit')">重新编辑经历</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="glass-card score-card">
          <div class="score-container">
            <span class="label">综合评分</span>
            <div class="big-score">{{ competitivenessScore }}</div>
            <el-tag size="small" class="score-tag">超越 92% 同类人才</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="row-second">
      <el-col :span="8">
        <el-card class="glass-card detail-card">
          <template #header><div class="card-header">学习技能完整度</div></template>
          <div class="progress-box">
            <el-progress 
              type="circle" 
              :percentage="85" 
              :width="140"
              :stroke-width="12"
              color="#70a1ff" 
            />
            <p class="chart-tip">简历信息覆盖率良好</p>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="glass-card detail-card">
          <template #header><div class="card-header">核心竞争力模型 (九维)</div></template>
          <div v-show="!loading" ref="radarRef" class="chart-container"></div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card class="glass-card detail-card">
          <template #header><div class="card-header">技能词云</div></template>
          <div v-show="!loading" ref="wordCloudRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="row-third">
      <el-col :span="24">
        <el-card class="glass-card ai-report-card">
          <template #header>
            <div class="card-header">
              <el-icon><MagicStick /></el-icon> AI 深度诊断报告
            </div>
          </template>
          <div class="report-content-grid">
            <div class="report-item">
              <h4>核心优势</h4>
              <p>您的技术栈在 <strong>Vue3</strong> 和 <strong>自动化工程</strong> 领域有深厚积累。雷达图显示您的“技术广度”已达到行业领先水平。</p>
            </div>
            <div class="report-item">
              <h4>提分建议</h4>
              <p>当前“项目量化”维度仍有提升空间。建议在经历中增加具体的 <strong>性能指标</strong> 或 <strong>业务增长数据</strong>，这将直接提升您的综合评分。</p>
            </div>
            <div class="report-item">
              <h4>职业展望</h4>
              <p>匹配度最高的岗位方向为：<strong>高级前端架构师</strong>。建议关注具有高并发业务背景的项目机会。</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps, defineEmits, nextTick } from 'vue'
import { School, Message, MagicStick } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const props = defineProps(['userInfo'])
const emit = defineEmits(['re-edit'])

// 🌟 1. 补全缺失的响应式变量声明
const loading = ref(true) 
const radarRef = ref(null)
const wordCloudRef = ref(null)
const competitivenessScore = ref(88)
const aiSuggestions = ref('')

// 🌟 2. 声明图表实例变量（防止 ReferenceError）
let radarInstance = null
let wordCloudInstance = null

const avatarUrl = 'https://ui-avatars.com/api/?name=User&background=ebf5ff&color=70a1ff'

// 模拟获取数据
const mockFetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      competitivenessScore.value = 88
      aiSuggestions.value = "根据您的经历分析，您在技术架构方面表现卓越..." 
      loading.value = false // 现在 loading 已定义，不会报错了
      resolve()
    }, 800)
  })
}

// 🌟 3. 补全缺失的适配函数
const handleResize = () => {
  radarInstance?.resize()
  wordCloudInstance?.resize()
}

onMounted(async () => {
  await mockFetchData()
  await nextTick()
  
  // 延迟执行以确保容器宽高已由浏览器计算完毕
  setTimeout(() => {
    initRadarChart()
    initWordCloud()
    window.addEventListener('resize', handleResize)
  }, 150) 
})

// 🌟 4. 这里的销毁和注销很重要
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  radarInstance?.dispose()
  wordCloudInstance?.dispose()
})

const initRadarChart = () => {
  if (!radarRef.value) return
  if (radarInstance) radarInstance.dispose()
  
  // 修正：只初始化一次并赋值给变量
  radarInstance = echarts.init(radarRef.value)
  radarInstance.setOption({
    radar: {
      indicator: [
        { name: '技术广度', max: 100 }, { name: '业务理解', max: 100 },
        { name: '领导力', max: 100 }, { name: '项目经验', max: 100 },
        { name: '学历', max: 100 }, { name: '稳定性', max: 100 },
        { name: '沟通力', max: 100 }, { name: '创新力', max: 100 },
        { name: '执行力', max: 100 }
      ],
      radius: '60%',
      axisName: { color: '#475569', fontWeight: 'bold', fontSize: 12 },
      axisLine: { lineStyle: { color: 'rgba(112, 161, 255, 0.5)' } },
      splitLine: { lineStyle: { color: 'rgba(112, 161, 255, 0.4)' } },
      splitArea: { areaStyle: { color: ['rgba(255, 255, 255, 0.05)', 'rgba(112, 161, 255, 0.1)'] } }
    },
    series: [{
      type: 'radar',
      data: [{
        value: [85, 72, 60, 90, 88, 75, 80, 70, 85],
        areaStyle: { color: 'rgba(112, 161, 255, 0.25)' },
        lineStyle: { color: '#70a1ff', width: 2.5 },
        itemStyle: { color: '#70a1ff' }
      }]
    }]
  })
}

const initWordCloud = () => {
  if (!wordCloudRef.value) return
  if (wordCloudInstance) wordCloudInstance.dispose()
  
  wordCloudInstance = echarts.init(wordCloudRef.value)
  const colorPalette = ['#70a1ff', '#8798de', '#a1c4fd', '#7bed9f'];
  const data = [
    { name: 'Vue3', value: 50 }, { name: 'TS', value: 40 }, 
    { name: 'AI', value: 35 }, { name: 'Echarts', value: 30 }
  ]
  
  wordCloudInstance.setOption({
    series: [{
      type: 'graph', 
      layout: 'force',
      roam: true, 
      draggable: true, 
      force: { repulsion: 60, edgeLength: 40 },
      data: data.map((i, index) => ({ 
        name: i.name, 
        symbolSize: i.value, 
        itemStyle: { 
          color: colorPalette[index % colorPalette.length],
          shadowBlur: 10,
          shadowColor: 'rgba(112, 161, 255, 0.2)' 
        } 
      })),
      label: { show: true, fontSize: 12, color: '#475569', fontWeight: 'bold' }
    }]
  })
}
</script>

<style scoped lang="scss">
.personal-info-report {
  display: flex; flex-direction: column; gap: 20px; padding: 10px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.45) !important;
  backdrop-filter: blur(15px);
  border-radius: 20px;
  /* 🌟 边框改为淡蓝色 */
  border: 1px solid rgba(112, 161, 255, 0.15) !important;
  box-shadow: 0 8px 32px rgba(112, 161, 255, 0.05);
  height: 100%;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.55) !important;
    border-color: rgba(112, 161, 255, 0.3) !important;
  }

  :deep(.el-card__header) {
    border-bottom: 1px solid rgba(112, 161, 255, 0.1) !important;
  }
}

.row-first {
  .user-profile {
    display: flex; align-items: center; gap: 24px; height: 100px;
    .user-text { 
      flex: 1; 
      h2 { margin: 0; color: #1e293b; } 
      .sub-info { color: #64748b; font-size: 14px; margin-top: 5px; } 
    }
    
    /* 🌟 Tag 颜色修改 */
    :deep(.status-tag) {
      background: rgba(112, 161, 255, 0.1) !important;
      color: #70a1ff !important;
      border: 1px solid rgba(112, 161, 255, 0.2) !important;
    }

    /* 🌟 按钮颜色修改 */
    .re-edit-btn {
      margin-left: auto; background: transparent; 
      border: 1px solid rgba(112, 161, 255, 0.3); color: #70a1ff;
      &:hover { background: rgba(112, 161, 255, 0.05); }
    }
  }

  .score-card {
    .score-container {
      display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100px;
      .label { font-size: 12px; color: #94a3b8; }
      /* 🌟 分数改用淡蓝渐变 */
      .big-score { 
        font-size: 48px; font-weight: 800; 
        background: linear-gradient(135deg, #0e3378 0%, #bdc3fc 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        line-height: 1; margin: 5px 0; 
      }
      :deep(.el-tag) { background: rgba(112, 161, 255, 0.05) !important; color: #70a1ff !important; border: none; }
    }
  }
}

/* 找到对应的词云容器样式 */
/* 请找到这部分样式，并加上注释了“🌟”的两行 */
.row-second {
  .detail-card {
    height: 320px;
    /* 1. 确保卡片本身不出现滚动条 */
    overflow: hidden !important; 

    /* 2. 🌟 关键：强制覆盖 Element Plus 卡片内部容器的溢出设置 */
    :deep(.el-card__body) {
      height: 270px; 
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;    
      justify-content: center; 
      padding: 0; 
      overflow: hidden !important; /* 🌟 加上这一行，干掉内层滚动条 */
    }

    .chart-container { 
      width: 100%; 
      height: 240px; 
      flex: 1;
      /* 3. 确保 ECharts 容器也不会因为微小溢出产生滚动 */
      overflow: hidden; 
    }
  }
}

.row-third {
  .ai-report-card {
    .card-header { 
      display: flex; align-items: center; gap: 8px; font-weight: bold; color: #70a1ff; 
    }
    .report-content-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; padding: 10px 0;
      .report-item {
        h4 { 
          margin: 0 0 10px 0; color: #1e293b; font-size: 15px; 
          border-left: 3px solid #70a1ff; padding-left: 10px; 
        }
        p { margin: 0; font-size: 13px; color: #334155; line-height: 1.6; }
      }
    }
  }
}
</style>