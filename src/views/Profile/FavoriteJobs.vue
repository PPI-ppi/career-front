<template>
  <div class="favorite-jobs">
    <!-- 空状态 -->
    <div v-if="favoriteList.length === 0" class="empty-state">
      <el-empty description="暂无收藏岗位，快去探索吧！">
        <el-button type="primary" @click="goToExplore">去探索岗位</el-button>
      </el-empty>
    </div>

    <!-- 岗位列表 -->
    <div v-else class="job-list">
      <div
        v-for="job in favoriteList"
        :key="job.id"
        class="job-card"
        @click="goToDetail(job.id)"
      >
        <!-- 第一行：职位标题 -->
        <div class="job-title">{{ job.title }}</div>

        <!-- 第二行：公司名称 + 地点 -->
        <div class="job-company">
          <span class="company-name">{{ job.company }}</span>
          <span class="divider">|</span>
          <span class="job-city">{{ job.city }}</span>
          <span class="divider">|</span>
          <span class="job-experience">{{ job.experience }}</span>
        </div>

        <!-- 第三行：薪资范围（红色高亮） -->
        <div class="job-salary">{{ job.salary }}</div>

        <!-- 第四行：技能/福利标签 -->
        <div class="job-tags">
          <el-tag
            v-for="tag in job.tags"
            :key="tag"
            size="small"
            class="tag-item"
          >
            {{ tag }}
          </el-tag>
        </div>

        <!-- 第五行：发布时间 -->
        <div class="job-time">{{ job.time }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
// ⚠️ 数据导入路径 - 请根据实际项目结构调整
import { allJobs } from '@/mock/data.js'

const router = useRouter()

// ⚠️ 注意：如果 mock 数据中没有 isFavorite 字段，需要手动添加或调整过滤逻辑
// 这里假设数据中已包含 isFavorite 字段，如果没有，需要先在 data.js 中添加
const favoriteList = computed(() => {
  // 过滤出已收藏的岗位 (isFavorite === true)
  return allJobs.filter(job => job.isFavorite === true)
})

// 跳转到岗位详情页
// ⚠️ 路由名称和路径 - 请根据实际路由配置核对
const goToDetail = (id) => {
  router.push(`/position-detail/${id}`)
}

// 跳转到岗位探索页
const goToExplore = () => {
  router.push('/jobs')
}
</script>

<style scoped lang="scss">
.favorite-jobs {
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 600px;
  overflow-y: auto;

  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f5f7fa;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c0c4cc;
    border-radius: 3px;

    &:hover {
      background: #909399;
    }
  }
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.job-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.job-card {
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
    border-color: #409EFF;
  }

  .job-title {
    font-size: 18px;
    font-weight: bold;
    color: #303133;
    margin-bottom: 10px;
  }

  .job-company {
    font-size: 14px;
    color: #909399;
    margin-bottom: 10px;

    .company-name {
      font-weight: 500;
    }

    .divider {
      margin: 0 8px;
      color: #c0c4cc;
    }
  }

  .job-salary {
    font-size: 16px;
    font-weight: bold;
    color: #f56c6c; // 红色高亮
    margin-bottom: 12px;
  }

  .job-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;

    .tag-item {
      background: #f0f9eb;
      border-color: #e1f3d8;
      color: #67c23a;
    }
  }

  .job-time {
    font-size: 12px;
    color: #c0c4cc;
  }
}
</style>