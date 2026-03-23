<template>
  <div class="home">
    <!-- 1. 顶部区域 -->
    <header class="home-header">
      <div class="header-content">
        <h1 class="main-title">
          {{ typedText }}<span class="cursor">|</span>
        </h1>
        
        <!-- 搜索框 -->
        <div class="search-box">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索职位、公司、技能..."
            size="large"
            clearable
            @keydown.enter="handleSearch"
            class="search-input"
          />
            
          <el-button 
            type="primary" 
            size="large"
            @click="handleSearch"
            class="search-btn"
          >
            <el-icon><Search /></el-icon>
            搜索
          </el-button>         
         </div>

        <!-- 热门搜索提示 -->
        <div class="hot-search">
          <span class="label">热门搜索：</span>
          <el-tag
            v-for="tag in hotSearchTags"
            :key="tag"
            size="small"
            class="search-tag"
            @click="searchByTag(tag)"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </header>

    <!-- 2. 核心三列布局 -->
    <main class="home-main">
      <!-- 左列：职业分类卡片 -->
      <section class="left-panel category-panel">
        <el-card class="panel-card">
          <template #header>
            <div class="card-header">
              <el-icon><Grid /></el-icon>
              <span>职业分类</span>
            </div>
          </template>
          <div class="category-list">
            <div
              v-for="category in categories"
              :key="category.id"
              :class="['category-item', { active: currentCategory === category.id }]"
              @click="selectCategory(category.id)"
            >
              <el-icon class="category-icon">
                <component :is="category.icon" />
              </el-icon>
              <span class="category-name">{{ category.name }}</span>
              <el-icon class="category-arrow"><ArrowRight /></el-icon>
            </div>
          </div>
        </el-card>
      </section>

      <!-- 中列：双功能入口卡片 -->
      <section class="middle-panel">
        <!-- 卡片 A：探索岗位 -->
        <div class="feature-card explore-card" @click="goToJobs">
          <div class="card-bg" style="background-image: url('https://placehold.co/600x300/667eea/ffffff?text=Explore+Jobs');"></div>
          <div class="card-overlay"></div>
          <div class="card-content">
            <h2 class="card-title">探索岗位</h2>
            <p class="card-desc">海量职位，智能匹配</p>
            <el-button type="primary" size="large" class="card-btn">
              <el-icon><Search /></el-icon>
              立即探索
            </el-button>
          </div>
        </div>

        <!-- 卡片 B：开始测评 -->
        <div class="feature-card assessment-card" @click="goToProfile">
          <div class="card-bg" style="background-image: url('https://placehold.co/600x300/764ba2/ffffff?text=Assessment');"></div>
          <div class="card-overlay"></div>
          <div class="card-content">
            <h2 class="card-title">开始测评</h2>
            <p class="card-desc">AI 评估，精准定位</p>
            <el-button type="success" size="large" class="card-btn">
              <el-icon><Document /></el-icon>
              立即测评
            </el-button>
          </div>
        </div>
      </section>

      <!-- 右列：登录/用户状态卡片 -->
      <section class="right-panel">
        <el-card class="panel-card auth-card">
          <!-- 未登录状态 -->
          <template v-if="!isLoggedIn">
            <div class="login-form">
              <div class="form-header">
                <el-avatar :size="64" icon="UserFilled" class="user-avatar" />
                <span class="welcome-text">欢迎登录</span>
                <span class="sub-text">开启你的 AI 职业之旅</span>
              </div>

              <el-form :model="loginForm" class="main-form">
                <el-form-item>
                  <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" />
                </el-form-item>
                <el-form-item>
                  <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" prefix-icon="Lock" show-password />
                </el-form-item>
                <el-button type="primary" class="submit-btn" @click="handleLogin">登 录</el-button>
              </el-form>

              <div class="form-footer">
                <div class="register-tip">
                  还没有账号？<span class="register-link">立即注册</span>
                </div>
                
                <div class="divider-text">其他登录方式</div>
                
                <div class="social-icons">
                  <div class="icon-item" title="微信登录">
                    <el-icon><ChatDotRound /></el-icon>
                  </div>
                  
                  <div class="icon-item" title="QQ 登录">
                    <el-icon><ChatLineRound /></el-icon>
                  </div>
                  
                  <div class="icon-item" title="联系客服">
                    <el-icon><Service /></el-icon>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- 已登录状态 -->
          <template v-else>
            <div class="user-profile">
              <div class="profile-header">
                <el-avatar :size="70" :src="currentUser.avatar" class="user-avatar-large">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <div class="user-info">
                  <h3 class="user-name">你好，{{ currentUser.name }}!</h3>
                  <p class="user-status">已登录</p>
                </div>
              </div>

              <div class="profile-stats">
                <div class="stat-item">
                  <span class="stat-value">15</span>
                  <span class="stat-label">天</span>
                  <span class="stat-desc">连续打卡</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">8</span>
                  <span class="stat-label">枚</span>
                  <span class="stat-desc">获得徽章</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">75%</span>
                  <span class="stat-label"></span>
                  <span class="stat-desc">完成度</span>
                </div>
              </div>

              <el-button
                type="primary"
                style="width: 100%; margin-top: 15px;"
                @click="goToProfile"
              >
                <el-icon><User /></el-icon>
                进入个人中心
              </el-button>

              <el-button
                type="info"
                plain
                style="width: 100%; margin-top: 10px;"
                @click="handleLogout"
              >
                退出登录
              </el-button>
            </div>
          </template>
        </el-card>
      </section>
    </main>

    <!-- 3. 底部区域：热门岗位推荐 -->
    <section class="hot-jobs-section">
      <div class="bg-bubble bubble-1"></div>
      <div class="bg-bubble bubble-2"></div>
      <div class="bg-bubble bubble-3"></div>

      <div class="section-header">
        <h2 class="section-title">🔥 热门岗位推荐</h2>
        </div>

      <div class="job-grid">
        <JobCard
          v-for="(job, index) in hotJobs"
          :key="job.id"
          :job="formatJobData(job)"
          :class="'job-card-item-' + index" 
        />
      </div>
    </section>

    <!-- 底部信息 -->
    <footer class="home-footer">
      <p>© 2024 AI Career - 智能求职平台</p>
      <p class="footer-links">
        <el-link type="info">公司简介</el-link>
        <span class="divider">|</span>
        <el-link type="info">联系方式</el-link>
        <span class="divider">|</span>
        <el-link type="info">隐私政策</el-link>
        <span class="divider">|</span>
        <el-link type="info">服务条款</el-link>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search,
  User,
  Lock,
  Document,
  Grid,
  ArrowRight,
  ChatDotRound,
  ChatLineRound,
  Service
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { hotJobs, userData } from '@/mock/data.js'
import JobCard from '@/components/JobCard.vue'

const router = useRouter()

const fullText = "AI 驱动你的职业未来"
const typedText = ref("")
const typingSpeed = 150 // 每个字的打字速度（毫秒）

const startTyping = () => {
  let i = 0
  typedText.value = "" // 重置文字
  const timer = setInterval(() => {
    if (i < fullText.length) {
      typedText.value += fullText.charAt(i)
      i++
    } else {
      clearInterval(timer)
    }
  }, typingSpeed)
}

// 搜索相关
const searchKeyword = ref('')
const hotSearchTags = ref(['Java 工程师', '前端开发', '算法专家', '产品经理', '数据分析师', 'AI 工程师'])

// 职业分类
const categories = ref([
  { id: 1, name: '互联网/AI', icon: 'Cpu', active: true },
  { id: 2, name: '电子/电气', icon: 'Switch', active: false },
  { id: 3, name: '产品/运营', icon: 'DataLine', active: false },
  { id: 4, name: '市场/销售', icon: 'ShoppingCart', active: false },
  { id: 5, name: '设计/创意', icon: 'Picture', active: false },
  { id: 6, name: '金融/财务', icon: 'Money', active: false },
  { id: 7, name: '教育/培训', icon: 'Reading', active: false },
  { id: 8, name: '医疗/健康', icon: 'FirstAidKit', active: false }
])
const currentCategory = ref(1)

// 登录状态
const isLoggedIn = ref(false)
const loginLoading = ref(false)

// 登录表单
const loginForm = ref({
  username: '',
  password: ''
})

// 当前用户数据
const currentUser = ref({
  name: '',
  avatar: '',
  tags: ['#前端', '#高薪', '#远程', '#AI', '#创新', '#成长']
})

// 格式化岗位数据
const formatJobData = (job) => ({
  jobTitle: job.title || job.jobTitle,
  companyName: job.company || job.companyName,
  salary: job.salary || '面议',
  city: job.city || job.location,
  matchRate: job.matchRate || 0,
  tags: job.tags || []
})

// 搜索处理
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    ElMessage.info({
    message: '请输入搜索关键词',
    duration: 1500 // 设置为 1.5 秒 (1500ms)，你可以改成 1000, 800 等更短的时间
})
    return
  }
  router.push(`/jobs?keyword=${encodeURIComponent(searchKeyword.value)}`)
}

// 标签搜索
const searchByTag = (tag) => {
  searchKeyword.value = tag
  handleSearch()
}

// 选择分类
const selectCategory = (categoryId) => {
  currentCategory.value = categoryId
  const category = categories.value.find(c => c.id === categoryId)
  console.log('选择分类:', category?.name)
  // 预留跳转或筛选逻辑
  router.push(`/jobs?category=${categoryId}`)
}

// 处理登录
const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  loginLoading.value = true

  // 模拟异步请求
  await new Promise(resolve => setTimeout(resolve, 1000))

  loginLoading.value = false
  isLoggedIn.value = true

  currentUser.value = {
    name: loginForm.value.username,
    avatar: `https://ui-avatars.com/api/?name=${loginForm.value.username}&background=667eea&color=fff`,
    tags: ['#前端', '#高薪', '#远程', '#AI', '#创新', '#成长']
  }

  ElMessage.success('登录成功')
}

// 处理退出
const handleLogout = () => {
  isLoggedIn.value = false
  loginForm.value = {
    username: '',
    password: ''
  }
  currentUser.value = {
    name: '',
    avatar: '',
    tags: []
  }
  ElMessage.success('已退出登录')
}

// 路由跳转
const goToJobs = () => router.push('/jobs')
const goToProfile = () => router.push('/profile/info')

// 生命周期
onMounted(() => {
  startTyping()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const handleResize = () => {
  // 响应式处理
}
</script>

<style scoped lang="scss">
.home {
  min-height: 100vh;
  background: #c4d1f617;
}

// ========== 1. 顶部区域 (修正了布局与层级) ==========
// ========== 1. 顶部区域 ==========
.home-header {
  background: linear-gradient(-45deg, #ff9a9e, #fad0c4, #afcaf4, #b1efbf);
  background-size: 400% 400%;
  animation: gradientBG 8s ease infinite; 
  padding: 5px 40px 100px; 
  color: #ffffff;
  position: relative;
  overflow: hidden;

 &::before { 
    content: "";
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background-image: radial-gradient(circle at 20% 30%, rgba(64, 158, 255, 0.15) 0%, transparent 50%);
    pointer-events: none;
    z-index: 1;
  }

  // 2. 🔥 新增：底部融合渐变层
  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 150px; // 渐变过渡的高度，可以根据视觉效果调整
    /* 这里的 #f4f7fe 是根据你 .home 的 background: #bfcdf62e 计算出的近似底色 */
    background: linear-gradient(to bottom, transparent, #f4f7fe); 
    z-index: 2;
    pointer-events: none;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    position: relative;
    z-index: 3; // 确保文字内容在渐变层之上，不会变淡
  }

  .main-title {
    font-size: 52px;
    font-weight: 800;
    text-align: left;
    margin-bottom: 40px;
    min-height: 70px; 
    .cursor {
      margin-left: 8px;
      color: #409EFF;
      animation: blink 0.8s infinite;
    }
  }

  /* 🌟 搜索框样式块开始 */
/* ========================================================== */
/* 🔍 搜索组件深度美化：更精致、更协调、更有重点 */
/* ========================================================== */
.search-box {
  display: flex;
  align-items: stretch; /* 🌟 关键：确保按钮和输入框高度完美一致 */
  max-width: 1100px;      /* 🌟 稍微加宽，更显大气 */
  margin-bottom: 25px;
  position: relative;
  z-index: 10;

  /* -------------------------- */
  /* A. 左侧输入框：轻盈毛玻璃感 (虚) */
  /* -------------------------- */
  .search-input {
    flex: 1; /* 占满剩余空间 */

    :deep(.el-input__wrapper) {
      /* 1. 核心：轻量毛玻璃质感 (不破坏背景感) */
      background-color: rgba(255, 255, 255, 0.45) !important; 
      backdrop-filter: blur(12px); /* 🌟 核心：模糊后方背景 */
      
      /* 2. 圆角处理：左侧大圆角，右侧直角对接按钮 */
      border-radius: 24px 0 0 24px !important; 
      
      /* 3. 精致细节：极淡的描边与大阴影增加精致感 */
      border: 1px solid rgba(255, 255, 255, 0.4) !important;
      box-shadow: 0 8px 32px rgba(31, 38, 135, 0.05) !important;
      padding-left: 18px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      /* 控制输入框高度 (🌟 如果你用大字号，建议也增高) */
      .el-input__inner {
        height: 56px; 
        font-size: 16px;
        color: #334455;
        font-weight: 500;
        
        /* 占位符文字调淡 */
        &::placeholder {
          color: rgba(51, 68, 85, 0.4);
        }
      }
    }

    /* 4. 聚焦时的发光交互：更通透 */
    :deep(.el-input__wrapper.is-focus) {
      background-color: rgba(255, 255, 255, 0.9) !important; /* 聚焦时变清晰 */
      box-shadow: 0 8px 32px rgba(64, 158, 255, 0.15) !important;
      border-color: rgba(64, 158, 255, 0.5) !important;
    }
  }

  /* -------------------------- */
  /* B. 右侧按钮：坚实渐变色 (实 - 全场焦点) */
  /* -------------------------- */
  .search-btn {
    /* 1. 修改圆角：左侧直角对接输入框，右侧保留大圆角 */
    border-radius: 0 24px 24px 0 !important; 
    
    /* 2. 核心修改：坚实、饱和的渐变色 (钉在界面上) */
    background: linear-gradient(135deg, #77b1f8 0%, #8c97f6 100%) !important;
    color: white !important; /* 🌟 保证文字必须是纯白 */
    
    /* 3. 尺寸与字号优化 */
    padding: 0 45px !important; /* 增加点击区域和视觉分量 */
    font-weight: 700;           /* 🎨 加粗标题 */
    font-size: 18px;            /* 🎨 调大字号 */
    letter-spacing: 1px;        /* 字间距增加精致感 */
    height: auto;               /* 跟随容器高度，确保无缝 */
    border: none !important;
    
    /* 4. 重点：亮蓝色立体投影 (增加点击欲) */
    box-shadow: 4px 6px 15px rgba(64, 158, 255, 0.3) !important;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    cursor: pointer;

    /* 调整图标大小 */
    .el-icon {
      font-size: 20px;
      margin-right: 6px;
      vertical-align: middle;
    }

    /* 5. 悬停时的灵动交互 */
    &:hover {
      filter: brightness(1.1); /* 稍微变亮 */
      transform: translateY(-1px); /* 🎨 轻微上浮，产生交互反馈 */
      box-shadow: 4px 8px 25px rgba(64, 158, 255, 0.4) !important;
    }
    
    /* 按下时的反馈 */
    &:active {
      transform: translateY(1px); /* 轻微按下 */
      filter: brightness(1);
    }
  }
}

  .hot-search {
    display: flex;
    align-items: center;
    gap: 12px;
    .label { font-size: 14px; opacity: 0.8; }
    .search-tag {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      cursor: pointer;
    }
  }
} // 闭合 .home-header
// ========== 2. 核心三列布局 (修正层级遮挡) ==========
.home-main {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  align-items: stretch;     /* 🌟 确保所有网格项（左中右）高度拉伸一致 */
  gap: 24px;
  max-width: 1400px;
  margin: -60px auto 40px; 
  padding: 0 40px;
  position: relative;
  z-index: 10; 

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    margin-top: 20px;
  }
}

// ========== 3. 通用卡片与面板样式 ==========
.panel-card {
  height: 100%;             /* 🌟 关键：让卡片填满整个网格区域的高度 */
  display: flex;            /* 开启 flex 布局以便内部内容分布 */
  flex-direction: column;   
  
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: none;

  // ... 其他代码 ...
  
  // 如果你想让里面的分类列表均匀撑开，可以给列表加这个：
  .category-list {
    flex: 1;                /* 🌟 让列表占据剩余的所有垂直空间 */
    display: flex;
    flex-direction: column;
    justify-content: space-around; /* 或者 space-between，取决于你想要的间距感 */
  }
}

/* 左列：职业分类 */
/* 左列：职业分类美化 */
/* ========================================================== */
/* 🎨 职业分类 (左列) 美化：毛玻璃质感与灵动交互 */
/* ========================================================== */
.category-panel {
  /* 1. 卡片主体材质美化 */
  .panel-card {
    border-radius: 20px !important;
    /* 🌟 修改点：透明度从 0.6 改为 0.92，增加实体感 */
    background: rgba(255, 255, 255, 0.72) !important; 
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.8); /* 边框也稍微白一点 */
    /* 🌟 修改点：阴影稍微加深，让它“压”住背景 */
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08) !important;
    
    
    &:hover {
      box-shadow: 0 16px 50px rgba(64, 158, 255, 0.08); /* 悬停时阴影变深 */
    }

    /* 卡片头部标题美化 */
    :deep(.el-card__header) {
      padding: 22px 25px 15px; /* 增加内边距呼吸空间 */
      border-bottom: 1px solid rgba(0, 0, 0, 0.05); /* 调淡下划线 */

      .card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 18px;          /* 🎨 调大标题：从 16px 改为 18px */
        font-weight: 700;         /* 🎨 加粗标题 */
        color: #334455;           /* 深灰蓝，非纯黑 */

        /* 标题图标美化 */
        i {
          font-size: 20px;
          color: #409EFF;         /* 使用 Header 强调色 */
        }
      }
    }
  }

  /* 2. 职业分类列表通用美化 */
  .category-list {
    display: flex;
    flex-direction: column;
    gap: 6px;                     /* 🎨 调小间距：更紧凑、更有秩序感 */
    padding: 10px 12px 20px;     /* 🎨 底部留呼吸空间 */
  }

  /* 3. 职业分类单项交互美化 */
  .category-item {
    display: flex;
    align-items: center;
    padding: 10px 20px;          /* 🎨 增加点击区域和侧边空间 */
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); /* 🎨 高级缓动：更有弹性 */
    border: 1px solid transparent; /* 预留边框空间 */
    position: relative;
    overflow: hidden;

    /* A. 默认图标颜色微调 */
    .category-icon { 
      font-size: 18px; 
      margin-right: 14px; 
      color: #90a4ae;              /* 🎨 默认态调淡图标：灰蓝色，减少干扰 */
      transition: all 0.3s ease;
    }
    .category-name { 
      flex: 1; 
      font-size: 15px; 
      font-weight: 500;            /* 中等粗细 */
      transition: all 0.3s ease;
    }
    .category-arrow { 
      font-size: 12px; 
      color: #c0c4cc; 
      opacity: 0.5;                /* 🎨 调淡箭头：静态下不明显 */
      transition: all 0.3s ease;
    }

    /* B. 悬停态 (Hover)：灵动反馈 */
    &:hover {
      background: rgba(64, 158, 255, 0.08); /* 浅蓝色半透明背景 */
      color: #409EFF;              /* 文字和图标变蓝 */
      transform: translateX(6px);  /* 🎨 核心修改：整体分类项平滑向右移，更有灵性 */
      
      .category-icon { color: #409EFF; }
      .category-arrow { 
        transform: translateX(3px); /* 箭头多移一点点，增加视觉前推感 */
        opacity: 1;                /* 箭头变清晰 */
      }
    }

    /* C. 激活态 (Active)：呼吸渐变 */
    &.active {
      background: linear-gradient(135deg, #409EFF 0%, #0076FF 100%); /* 🎨 使用渐变色块：替换纯蓝色块，呼应全局配色 */
      color: #ffffff;
      box-shadow: 0 4px 15px rgba(64, 158, 255, 0.3); /* 🎨 激活项微弱外发光，增加呼吸感 */

      /* 激活态文字与图标全部白色 */
      .category-icon, .category-name, .category-arrow { color: #ffffff; opacity: 1; }
      
      /* 🎨 激活态取消位移反馈 */
      &:hover { transform: none; } 
    }
  }
}

.middle-panel {
  display: flex;          /* 🌟 开启布局 */
  flex-direction: column; /* 纵向排列 */
  gap: 20px;              /* 🌟 这里的 gap 代替你之前的 margin-top */
  height: 100%;           /* 填满 Grid 容器高度 */
}

/* 卡片主体材质 */
.feature-card {
  position: relative;
  flex: 1;
  min-height: 200px;
  border-radius: 20px;       /* 🎨 调大圆角：增加柔和感，从 16px 改为 20px */
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s ease; /* 🎨 平滑过渡：增加时长 */
  
  background-color: rgba(255, 255, 255, 0.7) !important; 
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  /* 🌟 修改点：投影增强 */
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06) !important;


  // 去掉背景图 (约第 348 行)
  .card-bg {
    display: none; 
  }

  // 修改遮罩为有色玻璃 (约第 356 行)
  .card-overlay {
    display: block; 
    position: absolute;
    width: 100%;
    height: 100%;
    /* 🎨 关键核心修改：有色玻璃！ */
    /* 我们不使用图片的遮罩，而是直接填充一个非常淡的背景过渡色，让玻璃呈现同色系质感 */
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(175, 202, 244, 0.1) 100%);
  }

  // 修改文字样式 (约第 362 行)
  .card-content {
    position: relative;
    padding: 25px 40px;
    z-index: 1;
    text-align: left;
    /* 🎨 标题：增加文字投影和行高 */
  .card-title {
    font-size: 32px;
    font-weight: 800;
    margin-bottom: 12px;
    text-shadow: none;
    line-height: 1.2;
    max-width: 60%;
    
    /* --- 新增：让标题看起来更有设计感 --- */
    letter-spacing: -1px;  /* 紧凑的字间距更有现代感 */
    display: flex;
    align-items: center;
    
    &::before {
      content: "";
      display: inline-block;
      width: 4px;
      height: 24px;
      margin-right: 12px;
      border-radius: 4px;
      background: currentColor; /* 自动继承标题的颜色 */
      opacity: 0.6;
    }
  }

    /* 🎨 描述文字：调淡并增加行高 */
    .card-desc {
      font-size: 15px;   /* 🎨 调小描述：从 16px 改为 15px */
      opacity: 0.8;
      margin-bottom: 25px;
      line-height: 1.6;
      font-weight: 400; /* 使用普通粗细与标题形成对比 */
      max-width: 60%;
    }

    /* 🎨 修改按钮：不再使用纯色，而是使用渐变边框或半透明色 */
    .card-btn {
      padding: 10px 30px;
      font-size: 14px;
      border-radius: 25px;
      background: rgba(255, 255, 255, 0.8); /* 🎨 半透明白色按钮：增加轻盈感 */
      color: #334455;   /* 按钮文字深灰蓝 */
      border: 1px solid rgba(255, 255, 255, 0.9);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03); /* 按钮轻阴影 */

      &:hover {
        transform: translateY(-2px); /* 悬停向上微动 */
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
      }
    }
  }
}

/* --- 以下是补充的独有样式 --- */

/* A. 探索岗位卡片 (粉橙色系) */
.explore-card {
  /* 标题颜色与之前保持一致 */
  .card-content .card-title {
    color: #a8b6ff;
  }

  /* 核心彩色插图代码 (使用伪元素 after) */
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    right: -20px; /* 🎨 技巧：让插图稍微超出右边界，更灵动 */
    transform: translateY(-50%);
    width: 280px;  /* 🎨 稍微调大图片，占据更多右半部分 */
    height: 280px;
    
    /* 1. 设置插图背景：直接引入自带颜色的彩色图片 */
    background-image: url("@/assets/explore_color.png"); /* 🎨 请确保路径和文件名正确 */
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

    /* 2. 核心：设置透明度蒙版 (实现靠近字越淡) */
    /* 我们用 CSS 写一个径向渐变：圆心在右侧，向左侧过渡到完全透明 */
    /* 在 CSS Mask 中，黑色代表可见，透明代表不可见 */
    -webkit-mask-image: radial-gradient(circle at 80% 50%, black 0%, black 30%, rgba(0, 0, 0, 0) 100%);
    mask-image: radial-gradient(circle at 80% 50%, black 0%, black 30%, rgba(0, 0, 0, 0) 100%);
    
    opacity: 0.8; /* 🎨 技巧：静态下保持较低透明度，作为背景装饰，不抢文字 */
    transition: all 0.5s ease;
    z-index: 0;   /* 🎨 关键：确保在内容文字下方 */
  }

  /* 🎨 悬停效果优化 */
  &:hover {
    background-color: rgba(231, 209, 236, 0.15); 
    border-color: rgba(200, 164, 214, 0.4);
    
    /* 悬停时，图片整体变清晰，并向左微动 */
    &::after {
      opacity: 0.6; /* 🎨 调高悬停透明度 */
      transform: translateY(-50%) translateX(-10px);
    }

    /* 按钮变色 */
    .card-btn {
      background: linear-gradient(135deg, #eaaef9 0%, #fad0c4 100%);
      color: #fff;
      border-color: transparent;
    }
  }
}

/* --- B. 开始测评卡片 (蓝绿色系) --- */
.assessment-card {
  /* 标题颜色与之前保持一致 */
  .card-content .card-title {
    color: #b1efbf;
  }

  /* 核心彩色插图代码 (使用伪元素 after) */
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    right: -20px;
    transform: translateY(-50%);
    width: 280px;
    height: 280px;
    
    /* 1. 设置插图背景 */
    background-image: url("@/assets/assessment_color.png"); /* 🎨 请确保路径和文件名正确 */
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

    /* 2. 核心：透明度蒙版 */
    -webkit-mask-image: radial-gradient(circle at 70% 50%, black 0%, black 40%, rgba(0, 0, 0, 0) 100%);
    mask-image: radial-gradient(circle at 70% 50%, black 0%, black 40%, rgba(0, 0, 0, 0) 100%);
    opacity: 0.8;
    transition: all 0.5s ease;
    z-index: 0;
  }

  /* 🎨 悬停效果优化 */
  &:hover {
    background-color: rgba(72, 187, 98, 0.699);
    border-color: rgba(177, 239, 191, 0.4);

    &::after {
      opacity: 0.6;
      transform: translateY(-50%) translateX(-10px);
    }

    /* 按钮变色 */
    .card-btn {
      background: linear-gradient(135deg, #afcaf4 0%, #b1efbf 100%);
      color: #fff;
      border-color: transparent;
    }
  }
}

/* B. 开始测评卡片 (蓝绿色系) */
.assessment-card {
  /* 标题变色 */
  .card-content .card-title {
    color: #88d098; /* 呼应背景的 #b1efbf */
  }

  /* 悬停时：卡片背景呈现淡淡的蓝绿色 */
  &:hover {
    background-color: rgba(177, 239, 191, 0.15);
    border-color: rgba(177, 239, 191, 0.4);

    .card-btn {
      background: linear-gradient(135deg, #afcaf4 0%, #b1efbf 100%);
      color: #fff;
      border-color: transparent;
    }
  }
}

/* 右列：登录面板 */
/* ========================================================== */
/* 🎨 登录面板美化：AI 科技感 + 毛玻璃材质 */
/* ========================================================== */

/* ========================================================== */
/* 🎨 登录面板美化：AI 科技感 + 毛玻璃材质 */
/* ========================================================== */

.auth-card {
  border-radius: 24px !important;
  background: rgba(255, 255, 255, 0.65) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);

  .login-form {
    padding: 20px;

    /* 顶部标题区域 */
    .form-header {
      text-align: center;
      margin-bottom: 30px;
      
      .user-avatar {
        background: linear-gradient(135deg, #409EFF 0%, #667eea 100%);
        box-shadow: 0 4px 15px rgba(64, 158, 255, 0.3);
        margin-bottom: 12px;
      }
      .welcome-text {
        display: block;
        font-size: 22px;
        font-weight: 700;
        color: #303133;
      }
      .sub-text {
        font-size: 13px;
        color: #909399;
        margin-top: 6px;
      }
    }

    /* 登录按钮 */
    .submit-btn {
      width: 100%;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #409EFF 0%, #0076FF 100%);
      border: none;
      font-weight: 600;
      margin-top: 10px;
      transition: all 0.3s;
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(64, 158, 255, 0.3);
      }
    }

    /* 底部页脚区域 - 解决“混乱”的关键 */
    .form-footer {
      margin-top: 25px;
      display: flex;
      flex-direction: column;
      align-items: center; /* 居中所有内容 */

      .register-tip {
        font-size: 12px; /* 🎨 缩小字号 */
        color: #909399;
        margin-bottom: 20px;
        
        .register-link {
          color: #409EFF;
          font-weight: 500;
          margin-left: 4px;
          cursor: pointer;
          &:hover { text-decoration: underline; }
        }
      }

      .divider-text {
        width: 100%;
        font-size: 12px; /* 🎨 缩小字号 */
        color: #c0c4cc;
        text-align: center;
        margin-bottom: 15px;
        position: relative;
        
        /* 辅助线装饰 */
        &::before, &::after {
          content: "";
          position: absolute;
          top: 50%;
          width: 25%;
          height: 1px;
          background: rgba(0, 0, 0, 0.06);
        }
        &::before { left: 5%; }
        &::after { right: 5%; }
      }

      /* 第三方图标 */
      .social-icons {
        display: flex;
        justify-content: center; /* 🌟 核心：让三个圆圈在登录面板水平居中 */
        gap: 18px;               /* 圆圈之间的间距 */
        width: 100%;             /* 占满宽度以确保居中基准 */
        
        .icon-item {
          width: 38px;           /* 稍微调大一点点，更精致 */
          height: 38px;
          border-radius: 50%;
          background: #fff;
          border: 1px solid rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;   /* 图标垂直居中 */
          justify-content: center; /* 图标水平居中 */
          color: #606266;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          cursor: pointer;
          
          /* 🌟 对内部 Element Plus 图标的微调 */
          .el-icon {
            font-size: 18px; 
          }
          
          &:hover {
            color: #409EFF;
            border-color: #409EFF;
            transform: translateY(-3px) scale(1.1); /* 悬停时轻微上浮 */
            background: rgba(64, 158, 255, 0.04);
            box-shadow: 0 4px 10px rgba(64, 158, 255, 0.1);
          }
        }
      }
    }
  }
}

/* 旋转光效动画 */
@keyframes rotateLight {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 旋转光效动画 */
@keyframes rotateLight {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

// ========== 4. 动画定义 ==========
@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ========================================================== */
/* 🔥 5. 热门岗位推荐深度美化：精致网格与高级质感 */
/* ========================================================== */
/* ========================================================== */
/* 🔥 5. 热门岗位推荐美化：方案一 - “浮雕白”卡片 */
/* ========================================================== */
.hot-jobs-section {
  max-width: 1400px;
  margin: 60px auto 100px; /* 🌟 增加上下间距，拉开层级呼吸感 */
  padding: 0 40px;
  position: relative;
  z-index: 5;

  /* A. 标题区域美化 (保持之前的高级感) */
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px; 
    padding-left: 10px;
    border-left: 4px solid #409EFF; 
    
    .section-title { 
      font-size: 26px; font-weight: 800; color: #334455; letter-spacing: 1px;
    }

    :deep(.el-link) {
      font-size: 15px; font-weight: 600; color: rgba(51, 68, 85, 0.6); transition: all 0.3s;
      .el-icon { font-size: 14px; margin-left: 5px; transition: transform 0.3s ease; }
      &:hover { color: #409EFF; .el-icon { transform: translateX(4px); } }
    }
  }

  /* B. 网格布局 */
  .job-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px; 
    
    @media (max-width: 1200px) { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: 768px) { grid-template-columns: 1fr; }
  }

  /* C. 🌟 核心修改：自定义 JobCard 样式 */
  :deep(.job-card) {
    border-radius: 20px !important;
    
    /* 1. 🎨 背景微调：纯白实体，拒绝通透，增加分量感 */
    background: #ffffff !important; 
    
    /* 2. 🎨 边框微调：使用极淡的灰蓝色，比纯白描边更有细节 */
    border: 1px solid rgba(64, 158, 255, 0.08) !important; 
    
    /* 3. 🌟 投影微调：双重阴影 (一个实阴影增加厚度，一个散阴影增加氛围) */
    box-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.03), /* 散阴影 */
      0 2px 4px rgba(64, 158, 255, 0.02) !important; /* 微弱蓝色实阴影，增加厚度 */
      
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    overflow: hidden;
    position: relative;

    /* 4. 🌟 交互反馈美化 (Hover) */
    &:hover {
      transform: translateY(-8px); /* 向上浮起 */
      
      /* 悬停时投影变深、变散，产生强烈的“离地”感 */
      box-shadow: 0 20px 50px rgba(64, 158, 255, 0.12) !important; 
      
      /* 悬停时增加蓝色发光描边 */
      border-color: rgba(64, 158, 255, 0.4) !important; 
    }

    /* 5. 🎨 可选：给卡片顶部加一条极细的渐变彩色光条，增加 AI 科技感 */
    &::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 3px;
      background: linear-gradient(90deg, #409EFF, #67C23A);
      opacity: 0; /* 默认隐藏 */
      transition: opacity 0.3s;
    }
    &:hover::before { opacity: 0.8; } /* 悬停时显示 */
  }
}

.home-footer {
  padding: 5px;
  text-align: center;
  color: #909399;
  border-top: 1px solid #e4e7ed;
  background: #fff;
}
</style>