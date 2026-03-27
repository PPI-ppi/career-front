<template>
  <div class="favorite-jobs">
    <div v-if="favoriteList.length === 0" class="empty-state">
      <el-empty description="暂无收藏岗位，快去探索吧！">
        <el-button type="primary" @click="goToExplore">去探索岗位</el-button>
      </el-empty>
    </div>

    <div v-else class="job-list">
      <div
        v-for="job in favoriteList"
        :key="job.id"
        class="job-card"
        @click="goToDetail(job.id)"
      >
        <div class="company-logo">
          {{ job.company ? job.company.charAt(0) : '岗' }}
        </div>

        <div class="job-info">
          <div class="info-top">
            <span class="job-title">{{ job.title }}</span>
            <span class="job-salary">{{ job.salary }}</span>
          </div>

          <div class="job-company-row">
            <span class="company-name">{{ job.company }}</span>
            <span class="divider">|</span>
            <span class="job-city">{{ job.city }}</span>
            <span class="divider">|</span>
            <span class="job-experience">{{ job.experience }}</span>
          </div>

          <div class="job-tags">
            <el-tag
              v-for="tag in job.tags"
              :key="tag"
              size="small"
              effect="plain"
              class="custom-tag"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 模拟数据（保持您原有的数据结构）
const favoriteList = ref([
  {
    id: 1,
    title: '前端开发工程师',
    company: '阿里巴巴',
    city: '杭州',
    experience: '3-5年',
    salary: '25k-45k',
    tags: ['Vue3', 'TypeScript', '大前端']
  },
  {
    id: 2,
    title: '高级 UI 设计师',
    company: '腾讯',
    city: '深圳',
    experience: '5-10年',
    salary: '30k-50k',
    tags: ['B端设计', '交互', '设计系统']
  }
])

const goToExplore = () => {
  router.push('/job-explorer')
}

const goToDetail = (id) => {
  console.log('跳转至详情:', id)
}
</script>

<style scoped lang="scss">
.favorite-jobs {
  height: 100%;
  padding: 10px;
  overflow-y: auto;

  /* 自定义滚动条 */
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
}

.job-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.job-card {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #f1f5f9;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(148, 163, 184, 0.1);
    border-color: #3b82f6;
  }

  /* 左侧 Logo 占位：同步图三样式 */
  .company-logo {
    flex-shrink: 0;
    width: 54px;
    height: 54px;
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
    color: #3b82f6;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    border: 1px solid #e0e7ff;
  }

  .job-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;

    .info-top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .job-title {
        font-size: 17px;
        font-weight: 700;
        color: #1e293b;
      }

      .job-salary {
        font-size: 16px;
        font-weight: 700;
        color: #ef4444; /* 醒目的红色薪资 */
      }
    }

    .job-company-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #64748b;

      .divider {
        color: #e2e8f0;
      }
      .company-name {
        color: #475569;
        font-weight: 500;
      }
    }

    .job-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;

      .custom-tag {
        background: #f8fafc !important;
        border: 1px solid #e2e8f0 !important;
        color: #64748b !important;
        border-radius: 6px;
        font-weight: 400;
      }
    }
  }
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}
</style>