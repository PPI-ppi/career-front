<template>
  <div class="ai-report-container">
    <div class="ai-report-content">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick" class="glass-tabs">
        <el-tab-pane label="人岗匹配度" name="matching">
          <div class="matching-section fade-in">
            
            <section class="overview-section">
              <el-row :gutter="24">
                <el-col :xs="24" :sm="24" :md="10" :lg="9">
                  <div class="card glass-card gauge-card accent-blue">
                    <h3 class="card-title">
                      <el-icon><Histogram /></el-icon>总体匹配度
                    </h3>
                    <div class="gauge-wrapper">
                      <div ref="gaugeRef" class="gauge-chart"></div>
                      <div class="gauge-score">
                        <span class="score-value">{{ overallScore }}</span>
                        <span class="score-label">分</span>
                      </div>
                    </div>
                    <div class="score-level-badge" :class="getScoreLevelClass(overallScore)">
                      {{ getScoreLevel(overallScore) }}
                    </div>
                  </div>
                </el-col>

                <el-col :xs="24" :sm="24" :md="14" :lg="15">
                  <div class="card glass-card summary-card accent-green">
                    <h3 class="card-title">
                      <el-icon><ChatDotRound /></el-icon>
                      AI 深度简评
                    </h3>
                    <div v-if="aiSummary" class="summary-content markdown-body">
                      {{ aiSummary }}
                    </div>
                    <div v-else class="summary-loading">
                      <el-skeleton :rows="5" animated />
                    </div>
                  </div>
                </el-col>
              </el-row>
            </section>

            <section class="skills-section">
              <div class="card glass-card">
                <h3 class="card-title">
                  <el-icon><Checked /></el-icon>
                  能力维度详细拆解
                </h3>
                <div v-if="skillDetails.length > 0" class="skills-list">
                  <div 
                    v-for="(skill, index) in skillDetails" 
                    :key="index" 
                    class="skill-item-wrapper"
                  >
                    <div class="skill-header">
                      <div class="skill-name-group">
                        <span class="skill-index">{{ index + 1 }}</span>
                        <span class="skill-name">{{ skill.name }}</span>
                      </div>
                      <span class="skill-score" :class="getScoreClass(skill.score)">
                        {{ skill.score }}<span class="unit">分</span>
                      </span>
                    </div>
                    <div class="skill-progress">
                      <el-progress 
                        :percentage="skill.score" 
                        :stroke-width="10"
                        :show-text="false"
                        :color="getProgressColor(skill.score)"
                        class="custom-progress"
                      />
                    </div>
                    <div class="skill-comment-box">
                      <el-icon class="comment-icon"><ChatLineRound /></el-icon>
                      <span class="comment-text">{{ skill.comment }}</span>
                    </div>
                  </div>
                </div>
                <div v-else class="skills-loading">
                  <el-skeleton :rows="6" animated class="custom-skeleton" />
                </div>
              </div>
            </section>

            <section class="analysis-section">
              <div class="card glass-card">
                <h3 class="card-title">
                  <el-icon><Document /></el-icon>
                  匹配度深度诊断
                </h3>
                <div v-if="detailedAnalysis" class="analysis-content markdown-body">
                  <div class="analysis-text" v-html="formatAnalysisText(detailedAnalysis)"></div>
                </div>
                <div v-else class="analysis-loading">
                  <el-skeleton :rows="8" animated />
                </div>
              </div>
            </section>

          </div>
        </el-tab-pane>

        <el-tab-pane label="职业目标设定与规划" name="planning">
          <div class="planning-section fade-in">
            
              <section class="insight-section">
              <el-row :gutter="24">
                
                <el-col :xs="24" :sm="24" :md="12" :lg="12">
                  <div class="card glass-card map-card accent-blue">
                    <h3 class="card-title">
                      <el-icon><Location /></el-icon>
                      理想发展城市分布画像
                    </h3>
                    <div v-if="mapLoaded" ref="mapRef" class="map-chart chart-container"></div>
                    <div v-else class="chart-loading">
                      <el-skeleton-item variant="image" class="skeleton-chart" />
                      <p class="loading-text">正在绘制城市图谱...</p>
                    </div>
                  </div>
                </el-col>

                <el-col :xs="24" :sm="24" :md="12" :lg="12">
                  <div class="right-column-container">
                    
                    <div class="card glass-card salary-card accent-green">
                      <h3 class="card-title">
                        <el-icon><Money /></el-icon>
                        未来 5 年薪资潜力预测
                      </h3>
                      <div v-if="salaryForecast.length > 0" ref="salaryRef" class="salary-chart chart-container"></div>
                      <div v-else class="chart-loading">
                        <el-skeleton :rows="4" animated />
                      </div>
                    </div>

                    <div class="card glass-card demand-card accent-orange">
                      <h3 class="card-title">
                        <el-icon><TrendCharts /></el-icon>
                        岗位需求趋势洞察
                      </h3>
                      <div v-if="jobDemandTrend.length > 0" ref="demandRef" class="demand-chart chart-container"></div>
                      <div v-else class="chart-loading">
                        <el-skeleton :rows="4" animated />
                      </div>
                    </div>

                  </div>
                </el-col>
              </el-row>
            </section>

            <section class="path-section">
              <div class="card glass-card path-card accent-blue">
                <h3 class="card-title">
                  <el-icon><Guide /></el-icon>
                  专属职业发展里程碑路径
                </h3>
                <div v-if="careerPathLoaded" ref="pathRef" class="path-container">
                  <div class="path-placeholder glass-inner">
                    <el-icon class="placeholder-icon"><Finished /></el-icon>
                    <p class="status-text">专属里程碑路径已生成</p>
                    <span class="status-hint">（交互式时间轴组件将在下一版本上线，敬请期待）</span>
                  </div>
                </div>
                <div v-else class="path-loading">
                  <el-skeleton-item variant="rect" class="skeleton-rect" />
                  <p class="loading-hint">正在通过大模型生成专属发展路径...</p>
                </div>
              </div>
            </section>

          </div>
 </el-tab-pane> </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { 
  ChatDotRound, ChatLineRound, Document, Location, Money, TrendCharts, Guide, Finished,Histogram,Checked,Loading // 补全引用
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus' // 用于展示网络错误

// ==================== 状态变量 ====================
const activeTab = ref('matching')

// 核心数据变量
const overallScore = ref(0)
const aiSummary = ref('')
const skillDetails = ref([])
const detailedAnalysis = ref('')

// 规划页面数据变量
const expectedCities = ref([])
const salaryForecast = ref([])
const jobDemandTrend = ref([])
const mapLoaded = ref(false)
const careerPathLoaded = ref(false)

// 图表 DOM 引用
const gaugeRef = ref(null)
const mapRef = ref(null)
const salaryRef = ref(null)
const demandRef = ref(null)

// 图表实例
let gaugeInstance = null
let mapInstance = null
let salaryInstance = null
let demandInstance = null

// 🌟 美化点: 定义全局配色方案 (淡蓝绿系)
const themeColors = {
  primary: '#5098f9',
  secondary: '#6bd089',
  orange: '#e89e5a',
  background: '#ffffff',
  text: '#3c4e68',
  subText: '#94a3b8',
  border: 'rgba(29, 48, 130, 0.08)' // 玻璃卡片描边
}

// ==================== 1. 中国地图 GeoJSON 数据加载 (无需手动下载文件) ====================
const loadMapData = async () => {
  if (echarts.getMap('china')) return true;

  try {
    // 使用阿里云 DataV 稳定的在线 GeoJSON 地址
    const mapUrl = 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json';
    const response = await fetch(mapUrl);
    if (!response.ok) throw new Error('网络请求失败');
    const geoJson = await response.json();
    echarts.registerMap('china', geoJson);
    return true;
  } catch (error) {
    console.error('❌ 地图加载失败:', error);
    ElMessage.error('地图数据加载失败，将切换至Fallback模式。');
    return false;
  }
};

// ==================== 2. 模拟数据获取函数 ====================
const mockFetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // === Tab 1 数据 ===
      overallScore.value = 87
      aiSummary.value = '根据您的简历和岗位需求深度分析，您展现出扎实的技术功底与项目经验，人岗匹配契合度极高。您在 Python 核心开发、自动化工程及数据可视化（ECharts）领域表现卓越。建议持续优化“项目量化指标”及“团队管理敏捷方法”，以冲击架构师及专家岗位。'
      skillDetails.value = [
        { name: 'Python 核心开发', score: 92, comment: '精通核心语法与工程落地' },
        { name: 'Vue3 & TS 框架', score: 85, comment: '掌握主流方案，可独立构建' },
        { name: '数据可视化 (ECharts)', score: 88, comment: '图表高级定制能力较强' },
        { name: '跨部门沟通协作', score: 72, comment: '良好，建议提升主动汇报机制' },
        { name: '敏捷项目管理', score: 65, comment: '需补全项目全周期管理意识' }
      ]
      detailedAnalysis.value = `
        <h4 style="color: #3c4e68; font-size: 16px; margin-top: 0;">📊 核心能力综合评估</h4>
        <p>评估结论：技术广度与工程实践能力在行业中处于前 <strong>15%</strong> 水平。雷达图能力分布健康。</p>
        <p>您的最大闪光点在于：<strong>将业务需求迅速转化为工程落地</strong> 的能力。</p>
        <div style="background: rgba(80, 152, 249, 0.05); padding: 15px; border-radius: 8px; border: 1px dashed rgba(80, 152, 249, 0.3); color: #3c4e68; font-size: 13.5px; line-height: 1.8; margin-top: 15px;">
          <strong>💡 深度提分建议：</strong><br>
          当前评估中唯一的相对短板在于“量化成果展示”。在后续简历及沟通中，应强化例如「通过XXX优化将响应时间提升 40%」或「自动化重构使研发成本降低 25%」等具体指标，这将显著提升综合评分。
        </div>
      `

      // === Tab 2 数据 ===
      expectedCities.value = [
        { name: '北京', value: 100 },
        { name: '上海', value: 90 },
        { name: '深圳', value: 95 },
        { name: '杭州', value: 85 }
      ]

      salaryForecast.value = [
        { year: 2026, value: 18, reason: '入门级，核心工程能力建设' },
        { year: 2027, value: 25, reason: '微服务架构/技术选型 + 核心骨干' },
        { year: 2028, value: 35, reason: '独立负责系统架构 + 技术栈广度拓展' },
        { year: 2029, value: 45, reason: '晋升技术专家/团队Leader级别' },
        { year: 2030, value: 60, reason: '架构师/技术总监，行业影响力' }
      ]

      jobDemandTrend.value = [
        { year: 2026, value: 75, reason: '市场平稳，基础岗位需求稳定' },
        { year: 2027, value: 85, reason: '行业数字化/国产化替代加速' },
        { year: 2028, value: 95, reason: 'AI 深度应用落地 + 人才缺口扩大' },
        { year: 2029, value: 90, reason: '市场回归理性，高端人才依然紧缺' },
        { year: 2030, value: 88, reason: '复合型、专家型人才持续热门' }
      ]

      mapLoaded.value = true
      careerPathLoaded.value = true

      resolve()
    }, 1200)
  })
}

// ==================== 3. 辅助函数 ====================
const getScoreLevel = (score) => {
  if (score >= 90) return '🏅 卓越匹配'
  if (score >= 80) return '🚀 高度匹配'
  if (score >= 70) return '👍 良好匹配'
  if (score >= 60) return '⚠️ 基本匹配'
  return '❌ 匹配度较低'
}

// 🌟 美化点: 根据分数返回 Badge 样式类
const getScoreLevelClass = (score) => {
  if (score >= 80) return 'badge-success'
  if (score >= 70) return 'badge-warning'
  return 'badge-danger'
}

const getScoreClass = (score) => {
  if (score >= 85) return 'score-excellent'
  if (score >= 70) return 'score-good'
  return 'score-warning'
}

// 🌟 美化点: 使用新的配色系统
const getProgressColor = (score) => {
  if (score >= 85) return themeColors.secondary; // 绿色
  if (score >= 70) return themeColors.primary;   // 蓝色
  return themeColors.orange;                      // 橙色
}

const formatAnalysisText = (text) => text

// ==================== 4. ECharts 初始化方法 (深度美化) ====================

// 🅰️ 人岗匹配 Tab 1

// 1. 仪表盘 - 升级为更通透的 LinearGradient
const initGaugeChart = () => {
  if (!gaugeRef.value) return
  if (gaugeInstance) gaugeInstance.dispose()
  gaugeInstance = echarts.init(gaugeRef.value)
  gaugeInstance.setOption({
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      radius: '85%',
      center: ['50%', '55%'],
      progress: {
        show: true,
        width: 18,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#a1c4fd' }, 
            { offset: 0.5, color: '#c2e9fb' },
            { offset: 1, color: themeColors.primary }
          ]),
          shadowBlur: 10,
          shadowColor: 'rgba(80, 152, 249, 0.4)'
        }
      },
      pointer: { show: false },
      axisLine: { lineStyle: { width: 18, color: [[1, 'rgba(80, 152, 249, 0.08)']] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      title: { show: false },
      detail: { show: false },
      data: [{ value: overallScore.value }]
    }]
  })
}

watch(overallScore, (newVal) => {
  if (gaugeInstance) {
    gaugeInstance.setOption({ series: [{ data: [{ value: newVal }] }] })
  }
})

// 🅱️ 职业规划 Tab 2

// 2. 地图初始化 - 升级为科技感效果
const initMapChart = async () => {
  if (!mapRef.value) return
  const isLoaded = await loadMapData();
  
  if (!isLoaded) {
    mapRef.value.innerHTML = `
      <div class="map-fallback glass-inner">
        <el-icon class="fallback-icon spin-fast"><Location /></el-icon>
        <p>地图 GeoJSON 数据网络加载失败</p>
        <span class="fallback-hint">请检查网络或防火墙设置</span>
      </div>
    `;
    return;
  }

  if (mapInstance) mapInstance.dispose()
  mapInstance = echarts.init(mapRef.value)
  
  const mapOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: themeColors.border,
      borderWidth: 1,
      padding: [10, 15],
      textStyle: { color: themeColors.text, fontSize: 13 },
      formatter: '<b>{b}</b><br/>职业理想度：<b style="color:#5098f9; font-size:15px">{c}</b>'
    },
    geo: {
      map: 'china',
      roam: true,
      zoom: 1.1,
      center: [105, 36],
      label: { show: true, color: 'rgba(60, 78, 104, 0.5)', fontSize: 10 },
      itemStyle: {
        areaColor: 'rgba(255, 255, 255, 0.2)',
        borderColor: 'rgba(60, 78, 104, 0.12)',
        borderWidth: 1
      },
      emphasis: {
        itemStyle: { areaColor: 'rgba(80, 152, 249, 0.1)', shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.1)' },
        label: { color: themeColors.text }
      }
    },
    series: [
      {
        name: '期望城市',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: expectedCities.value.map(city => {
          const cityCoords = {
            '北京': [116.407526, 39.90403],
            '上海': [121.473701, 31.230416],
            '深圳': [114.057868, 22.543099],
            '杭州': [120.15507, 30.274084]
          }
          return {
            name: city.name,
            value: [...(cityCoords[city.name] || [105, 36]), city.value]
          }
        }).filter(item => item.value.length === 3), // 过滤无效城市
        symbolSize: 16,
        showEffectOn: 'render',
        rippleEffect: { brushType: 'stroke', scale: 3, color: '#f87171' },
        label: {
          formatter: '{b}',
          position: 'right',
          show: true,
          color: themeColors.primary,
          fontSize: 12,
          fontWeight: 'bold'
        },
        itemStyle: {
          color: '#f87171',
          shadowBlur: 10,
          shadowColor: 'rgba(248, 113, 113, 0.5)'
        },
        zlevel: 1
      }
    ]
  }
  
  mapInstance.setOption(mapOption)
}

// 🌟 美化点: 定义精致的 Tooltip 构造器
const getHtmlTooltip = (title, label, value, color, reason) => {
  return `
    <div class="custom-tooltip markdown-body" style="padding:15px; min-width:200px">
      <div style="font-size:14px; font-weight:700; color:#3c4e68; border-bottom:1px solid rgba(0,0,0,0.06); padding-bottom:8px; margin-bottom:10px">${title}</div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px">
        <span style="font-size:13px; color:#94a3b8">${label}：</span>
        <b style="font-size:17px; color:${color}">${value}</b>
      </div>
      <div style="display:flex; gap:8px; background:rgba(60, 78, 104, 0.04); padding:10px; border-radius:8px; font-size:12.5px; line-height:1.6; color:#606266">
        <span style="font-size:14px">💡</span>
        <span>${reason}</span>
      </div>
    </div>
  `
}

// 3. 薪资潜力预测折线图 - 升级为淡绿色系
const initSalaryChart = () => {
  if (!salaryRef.value) return
  if (salaryInstance) salaryInstance.dispose()
  
  salaryInstance = echarts.init(salaryRef.value)
  const salaryData = salaryForecast.value;
  
  salaryInstance.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: themeColors.border,
      borderWidth: 1,
      padding: 0, // Tooltip内边距由内部div控制
      formatter: (params) => {
        const d = params[0].data
        return getHtmlTooltip(`${d.year}年`, '预计月薪', `${d.value}k`, themeColors.secondary, d.reason)
      }
    },
    grid: { left: '12%', right: '8%', top: '20%', bottom: '15%', containLabel: false },
    xAxis: { 
      type: 'category', 
      data: salaryData.map(item => item.year), 
      axisLine: { lineStyle: { color: 'rgba(60, 78, 104, 0.1)' } }, 
      axisLabel: { color: themeColors.subText, fontSize: 11 } 
    },
    yAxis: { 
      type: 'value', 
      name: '月薪 (k)', 
      nameTextStyle: { color: themeColors.subText, padding: [0, 0, 0, 30] },
      axisLine: { show: false }, 
      axisLabel: { color: themeColors.subText, fontSize: 11 }, 
      splitLine: { lineStyle: { color: 'rgba(60, 78, 104, 0.03)', type: 'solid' } } 
    },
    series: [{
      type: 'line',
      data: salaryData.map(item => ({ value: item.value, year: item.year, reason: item.reason })),
      smooth: true, 
      symbol: 'circle', 
      symbolSize: 8,
      showSymbol: false,
      lineStyle: { color: themeColors.secondary, width: 3 },
      itemStyle: { color: themeColors.secondary, borderColor: '#fff', borderWidth: 2, shadowBlur: 10 },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(107, 208, 137, 0.2)' }, { offset: 1, color: 'rgba(107, 208, 137, 0.02)' }]) }
    }]
  })
}

// 4. 岗位需求趋势折线图 - 升级为淡蓝色系
const initDemandChart = () => {
  if (!demandRef.value) return
  if (demandInstance) demandInstance.dispose()
  
  demandInstance = echarts.init(demandRef.value)
  const demandData = jobDemandTrend.value;
  
  demandInstance.setOption({
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: themeColors.border,
      borderWidth: 1,
      padding: 0,
      formatter: (params) => {
        const d = params[0].data
        let demandLevel = '平稳', demandColor = themeColors.primary;
        if (d.value >= 90) { demandLevel = '高需求🚀'; demandColor = '#f87171' }
        else if (d.value >= 80) { demandLevel = '较高✅'; demandColor = themeColors.secondary }
        else if (d.value >= 70) { demandLevel = '中等'; demandColor = themeColors.primary }
        
        return getHtmlTooltip(`${d.year}年`, '需求状态', demandLevel, demandColor, d.reason)
      }
    },
    grid: { left: '12%', right: '8%', top: '20%', bottom: '15%', containLabel: false },
    xAxis: { 
      type: 'category', 
      data: demandData.map(item => item.year), 
      axisLine: { lineStyle: { color: 'rgba(60, 78, 104, 0.1)' } }, 
      axisLabel: { color: themeColors.subText, fontSize: 11 } 
    },
    yAxis: { 
      type: 'value', 
      name: '需求指数', 
      nameTextStyle: { color: themeColors.subText, padding: [0, 0, 0, 40] },
      min: 50, max: 100, 
      axisLine: { show: false }, 
      axisLabel: { color: themeColors.subText, fontSize: 11 }, 
      splitLine: { lineStyle: { color: 'rgba(60, 78, 104, 0.03)', type: 'solid' } } 
    },
    series: [{
      type: 'line',
      data: demandData.map(item => ({ value: item.value, year: item.year, reason: item.reason })),
      smooth: true, symbol: 'circle', symbolSize: 8, showSymbol: false,
      lineStyle: { color: themeColors.primary, width: 3 },
      itemStyle: { color: themeColors.primary, borderColor: '#fff', borderWidth: 2, shadowBlur: 10 },
      areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(80, 152, 249, 0.2)' }, { offset: 1, color: 'rgba(80, 152, 249, 0.02)' }]) }
    }]
  })
}

// 初始化所有图表
const initAllCharts = () => {
  nextTick(() => {
    if (activeTab.value === 'matching') {
      initGaugeChart()
    } else if (activeTab.value === 'planning') {
      if (mapLoaded.value && mapRef.value) { initMapChart() }
      if (salaryForecast.value.length > 0 && salaryRef.value) { initSalaryChart() }
      if (jobDemandTrend.value.length > 0 && demandRef.value) { initDemandChart() }
    }
  })
}

// 🌟 美化点: 精准控制图表重绘
watch(overallScore, () => activeTab.value === 'matching' && initGaugeChart())

watch([mapLoaded, activeTab], async ([loaded, tab]) => {
  if (loaded && tab === 'planning' && mapRef.value) {
    await nextTick()
    initMapChart()
  }
})

watch(
  [() => salaryForecast.value.length, () => jobDemandTrend.value.length, activeTab], 
  ([salaryLen, demandLen, tab]) => {
    if (tab === 'planning' && salaryLen > 0 && demandLen > 0) {
      nextTick(() => {
        if (salaryRef.value) initSalaryChart()
        if (demandRef.value) initDemandChart()
      })
    }
  }
)

// 处理标签切换
const handleTabClick = (tab) => {
  nextTick(() => {
    // 切换时清理实例，防止布局塌陷
    gaugeInstance?.dispose()
    mapInstance?.dispose()
    salaryInstance?.dispose()
    demandInstance?.dispose()
    
    if (tab.name === 'matching') {
      initGaugeChart()
    } else if (tab.name === 'planning') {
      if (mapLoaded.value && mapRef.value) { initMapChart() }
      if (salaryForecast.value.length > 0 && salaryRef.value) { initSalaryChart() }
      if (jobDemandTrend.value.length > 0 && demandRef.value) { initDemandChart() }
    }
  })
}

// 窗口大小变化处理
const handleResize = () => {
  gaugeInstance?.resize()
  mapInstance?.resize()
  salaryInstance?.resize()
  demandInstance?.resize()
}

// ==================== 5. 生命周期 ====================
onMounted(async () => {
  // 1. 预加载地图数据，防止闪烁
  loadMapData();
  
  // 2. 获取业务数据
  await mockFetchData();
  
  // 3. 初始化图表
  initAllCharts();
  
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  gaugeInstance?.dispose()
  mapInstance?.dispose()
  salaryInstance?.dispose()
  demandInstance?.dispose()
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped lang="scss">
/* 🌟 美化点 1: 通用布局容器 (弥散渐变背景) */
.ai-report-container {
  padding: 10px;
  background-color: #f6f8ff;
  /* 荧光紫 + 亮白 */
  background-image: 
    radial-gradient(at 100% 100%, rgba(188, 216, 249, 0.2) 0px, transparent 50%),
    radial-gradient(at 10% 0%, rgba(253, 253, 249, 0.6) 0px, transparent 40%);
  min-height: calc(100vh - 60px);
  overflow-x: hidden;
}

.ai-report-content {
  max-width: 1400px; /* 控制最大宽度更显高级 */
  margin: 0 auto;
}

/* 🌟 美化点 2: 玻璃Tabs 样式 */
.el-tabs {
  background: transparent;
  
  :deep(.el-tabs__header) {
    margin-bottom: 24px;
    background: rgba(255, 255, 255, 0.3) !important;
    backdrop-filter: blur(20px) !important;
    padding: 2px 10px;
    border-radius: 14px;
    border: 1px solid rgba(29, 48, 130, 0.05) !important;
    box-shadow: 0 4px 16px rgba(29, 48, 130, 0.03);
  }
  
  :deep(.el-tabs__nav-wrap::after) { display: none; }
  :deep(.el-tabs__active-bar) {
    height: 3px; border-radius: 3px; background: linear-gradient(135deg, #a1c4fd 0%, #5098f9 100%);
  }
  :deep(.el-tabs__item) {
    height: 50px; font-weight: 600; font-size: 15px; color: #64748b;
    &.is-active { color: #1e293b !important; }
  }
}

// ==================== 🌟 美化点 3: 核心玻璃卡片通用样式 ====================
.glass-card {
  background: rgba(255, 255, 255, 0.4) !important; /* 降低不透明度 */
  backdrop-filter: blur(20px) !important;        /* 毛玻璃效果 */
  border-radius: 20px !important;                 /* 大圆角 */
  padding: 24px;
  /* 🌟 精致的描边 & 阴影 */
  border: 1px solid rgba(29, 48, 130, 0.08) !important; 
  box-shadow: 0 8px 32px rgba(29, 48, 130, 0.04);
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    box-shadow: 0 12px 48px rgba(29, 48, 130, 0.06);
    background: rgba(255, 255, 255, 0.55) !important;
  }

  /* 卡片主色调缀饰 (卡片标题左侧图标) */
  &.accent-blue { .card-title .el-icon { color: #5098f9; } }
  &.accent-green { .card-title .el-icon { color: #6bd089; } }
  &.accent-orange { .card-title .el-icon { color: #e89e5a; } }
  
  .card-title {
    margin: 0 0 20px 0;
    font-size: 16px;
    font-weight: 700; /* 加粗标题 */
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 10px;
    
    .el-icon { font-size: 19px; }
  }
}

/* 🌟 美化点 4: Markdown 文本通用样式 (简评、详细分析) */
:deep(.markdown-body) {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', Arial, sans-serif;
  line-height: 1.8;
  color: #3c4e68;
  font-size: 14px;
  
  strong { color: #1e293b; font-weight: 700; }
}

/* 🌟 美化点 5: ECharts 容器基础样式 (增加交互感) */
.chart-container {
  cursor: grab;
  &:active { cursor: grabbing; }
}

// ==================== Tab 1:Matching 样式美化 ====================
.overview-section { margin-bottom: 24px; }

/* 总体匹配度仪表盘卡片 */
.gauge-card {
  text-align: center;
  min-height: 350px;
  padding-bottom: 15px;
  .gauge-wrapper { position: relative; width: 100%; }
  .gauge-chart { width: 100%; height: 230px; margin: 0 auto; }
  .gauge-score {
    position: absolute; left: 50%; bottom: 20px; transform: translateX(-50%);
    display: flex; align-items: baseline; gap: 2px;
    
    .score-value {
      font-size: 50px; font-weight: 800; /* 更重 */
      background: linear-gradient(135deg, #a1c4fd 0%, #5098f9 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      line-height: 1.1;
    }
    .score-label { font-size: 14px; color: #94a3b8; font-weight: 600; }
  }
  
  /* 🌟 评分等级 Badge 美化 */
  .score-level-badge {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 10px;
    font-size: 13.5px;
    font-weight: 700;
    color: #fff;
    margin-top: -10px;
    letter-spacing: 0.5px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);

    &.badge-success { background: linear-gradient(135deg, #87dd9a 0%, #6bd089 100%); }
    &.badge-warning { background: linear-gradient(135deg, #fcd37e 0%, #e89e5a 100%); }
    &.badge-danger { background: linear-gradient(135deg, #f87a71 0%, #f44c4c 100%); }
  }
}

/* AI 深度简评卡片 */
.summary-card {
  min-height: 350px;
  .summary-content {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 12px;
    padding: 20px;
    border: 1px solid rgba(107, 208, 137, 0.08); /* 配色accent-green */
    transition: all 0.2s;
    &:hover { background: rgba(255, 255, 255, 0.45); border-color: rgba(107, 208, 137, 0.2); }
  }
}

/* 能力详细拆解区 */
.skills-section { 
  margin-bottom: 32px; /* 同样增加第二行底部的间距 */
}
.skills-list { display: flex; flex-direction: column; gap: 10px; }
.skill-item-wrapper {
  background: rgba(255, 255, 255, 0.3);
  padding: 18px 20px;
  border-radius: 12px;
  border: 1px solid rgba(60, 78, 104, 0.03);
  transition: all 0.2s;
  
  &:hover { background: rgba(255, 255, 255, 0.45); border-color: rgba(60, 78, 104, 0.08); transform: translateY(-1px); }
  
  .skill-header {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;
    .skill-name-group {
      display: flex; align-items: center; gap: 10px;
      .skill-index { font-size: 13px; font-weight: 700; color: #94a3b8; background: #e2e8f0; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; border-radius: 6px; }
      .skill-name { font-size: 14.5px; font-weight: 700; color: #3c4e68; }
    }
    .skill-score {
      font-size: 16px; font-weight: 800; display: flex; align-items: baseline; gap: 1px;
      .unit { font-size: 12px; font-weight: 600; color: #94a3b8; }
      /* 配色方案从 getProgressColor 获取 */
      &.score-excellent { color: #6bd089; }
      &.score-good { color: #5098f9; }
      &.score-warning { color: #e89e5a; }
    }
  }
  
  /* 🌟 优化 Element 进度条 */
  .custom-progress :deep(.el-progress-bar__outer) {
    background-color: rgba(60, 78, 104, 0.05) !important;
  }
  .custom-progress :deep(.el-progress-bar__inner) {
    border-radius: 10px; transition: all 0.4s ease;
    background: linear-gradient(90deg, #c2e9fb 0%, #5098f9 100%); /* 默认淡蓝色 */
  }

  .skill-comment-box {
    margin-top: 10px; padding-top: 10px; border-top: 1px dashed rgba(60, 78, 104, 0.05);
    display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: #64748b;
    .comment-icon { color: #94a3b8; }
    .comment-text { flex: 1; }
  }
}

/* 人岗诊断区 */
.analysis-section {
  .markdown-body {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 14px;
    padding: 24px;
    border: 1px solid rgba(29, 48, 130, 0.05);
  }
}

// ==================== Tab 2: Planning 样式美化 ====================
.planning-section {
  .insight-section {
    margin-bottom: 24px;
    
    :deep(.el-row) { align-items: stretch; } // 确保等高
    .el-col { display: flex; flex-direction: column; }

    /* 左侧城市地图卡片美化 */
    .map-card {
      height: 100%; flex: 1; margin-bottom: 0;
      .map-chart { width: 100%; height: 100%; min-height: 400px; flex: 1; border-radius: 14px; }
      .chart-loading { min-height: 400px; }
    }

    /* 右侧上下排列美化 */
    .right-column-container {
      display: flex; flex-direction: column; gap: 24px; height: 100%; width: 100%;
      .salary-card, .demand-card { flex: 1; margin-bottom: 0; height: 100%; }
    }

    /* 统一图表容器大小 */
    .salary-chart, .demand-chart { width: 100%; height: 100%; min-height: 180px; flex: 1; }
    .chart-loading { min-height: 180px; display: flex; flex-direction: column; justify-content: center; }
  }

  // 发展路径预留区
  .path-section {
    .path-card {
      min-height: 220px;
      .path-container {
        min-height: 180px; display: flex; align-items: center; justify-content: center;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 14px; border: 2px dashed rgba(60, 78, 104, 0.08); padding: 24px;
        
        .path-placeholder {
          text-align: center; color: #94a3b8; padding: 20px; border-radius: 10px;
          .placeholder-icon {
            font-size: 50px; color: #6bd089; margin-bottom: 12px;
            animation: bounceIn 0.8s;
          }
          .status-text { margin: 0 0 8px 0; font-size: 16px; font-weight: 700; color: #3c4e68; }
          .status-hint { font-size: 12.5px; color: #cbd5e1; }
        }
      }
      .path-loading { text-align: center; }
    }
  }
}

// ==================== 🌟 统一骨架屏 & 加载样式美化 ====================
.summary-loading, .skills-loading, .analysis-loading, .chart-loading, .path-loading {
  :deep(.el-skeleton__item) { background-color: rgba(60, 78, 104, 0.04) !important; border-radius: 6px; }
}

.custom-skeleton {
  :deep(.el-skeleton__paragraph) { margin-top: 15px; }
}

/* 地图Fallback 美化 */
.map-fallback {
  width: 100%; height: 100%; min-height: 400px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: #203d66;
  
  .fallback-icon { font-size: 50px; margin-bottom: 15px; color: #fcc200; }
  p { margin: 0; font-weight: 600; font-size: 15px; color: #64748b; }
  .fallback-hint { font-size: 12px; margin-top: 4px; color: #cbd5e1; }
}

/* 地图卡片的骨架图特殊处理 */
.chart-loading {
  .skeleton-chart { width: 100%; height: 350px; }
  .loading-text { font-size: 13px; color: #94a3b8; margin-top: 10px; display: flex; align-items: center; gap: 5px; justify-content: center; }
  .skeleton-rect { width: 100%; height: 160px; }
  .loading-hint { color: #cbd5e1; font-size: 13px; margin-top: 12px; }
}

/* 🌟 内嵌玻璃背景块，增加层次感 */
.glass-inner {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(0,0,0,0.02);
}

// ==================== ECharts 动画配置 (Index) ====================
/* 顺滑入场动画 */
.fade-in { animation: fadeInScale 0.6s cubic-bezier(0.4, 0, 0.2, 1); }

@keyframes fadeInScale {
  from { opacity: 0; transform: scale(0.98) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes bounceIn {
  from { opacity: 0; transform: scale(0.3); }
  to { opacity: 1; transform: scale(1); }
}

.spin-fast { animation: rotate 2s linear infinite; }
@keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

// ==================== 响应式适配微调 ====================
@media (max-width: 768px) {
  .glass-card { padding: 16px; border-radius: 14px !important; }
      .matching-section {
        display: flex;
        flex-direction: column;
        gap: 24px; /* 强制所有 section 之间保持 24px 的间距 */
      }
}
</style>