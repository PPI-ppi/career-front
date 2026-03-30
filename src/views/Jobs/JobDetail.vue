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
        <div v-if="loading" class="skeleton">
          <el-skeleton :rows="8" animated />
        </div>
        <div v-else-if="!job" class="empty-state">
          <!-- 已在上面处理 -->
        </div>
        <div v-else class="requirements">
          <ul>
            <li v-for="(req, index) in job.requirements" :key="index">
              {{ req }}
            </li>
          </ul>
        </div>
      </el-card>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, Star, StarFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import rawData from '@/assets/data.json'

onMounted(async () => {
  loading.value = true
  // 模拟一点延迟效果
  await new Promise(resolve => setTimeout(resolve, 300))

  // 注意：route.params.id 是字符串，JSON 里的 id 可能是数字，需要 parseInt
  const targetId = parseInt(route.params.id)
  const foundItem = rawData.find((item, index) => (item.id || index + 1) === targetId)

  if (foundItem) {
    // 关键步骤：映射字段，否则模板里的 {{ job.title }} 会因为找不到字段而空白
    job.value = {
      id: targetId,
      title: foundItem.job_title,      // 对应 JSON 的 job_title
      company: foundItem.company_name, // 对应 JSON 的 company_name
      salary: foundItem.min_salary ? `${foundItem.min_salary/1000}k-${foundItem.max_salary/1000}k` : '面议',
      city: foundItem.city || '杭州',
      description: foundItem.job_details, // 对应 JSON 的 job_details
      requirements: [] // 画像先置空
      
    }
    isFavorited.value = favorites.value.includes(targetId)
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
</style>