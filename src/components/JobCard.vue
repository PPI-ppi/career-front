<template>
  <div class="job-card">
    <!-- 岗位标题 -->
    <h3 class="job-title">{{ job.jobTitle }}</h3>
    
    <!-- 公司与薪资 -->
    <div class="job-info">
      <span class="company">{{ job.companyName }}</span>
      <span class="divider">|</span>
      <span class="salary">{{ job.salary }}</span>
    </div>

    <!-- 匹配度展示 -->
    <div class="match-section">
      <div class="match-rate" :style="{ color: getMatchColor(job.matchRate) }">
        {{ job.matchRate }}%
      </div>
      <div class="match-label">人岗匹配度</div>
    </div>

    <!-- 操作按钮 -->
    <el-button type="primary" plain size="small" style="width: 100%; margin-top: 10px;">
      查看岗位画像
    </el-button>
  </div>
</template>

<script setup>
// 定义组件接收的属性 (Props)
// 父组件必须传入一个 job 对象，包含 jobTitle, companyName, salary, matchRate
const props = defineProps({
  job: {
    type: Object,
    required: true,
    default: () => ({
      jobTitle: '未知岗位',
      companyName: '未知公司',
      salary: '面议',
      matchRate: 0
    })
  }
})

// 辅助函数：根据匹配度返回颜色
const getMatchColor = (rate) => {
  if (rate >= 90) return '#67C23A' // 绿色 - 高匹配
  if (rate >= 75) return '#E6A23C' // 橙色 - 中匹配
  return '#F56C6C' // 红色 - 低匹配
}
</script>

<style scoped>
/* 卡片容器样式 */
.job-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 180px; /* 固定高度，整齐排列 */
  transition: all 0.2s ease;

 .job-card.is-active {
  background-color: #ecf5ff;
  border-color: #409EFF;
  position: relative; /* 别忘了这个，否则 before 会乱跑 */
}

.job-card.is-active::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #409EFF;
  border-radius: 4px 0 0 4px;
}
}

/* 鼠标悬停效果 */
.job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #409EFF;
}

/* 标题样式 */
.job-title {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 10px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* 文字过长显示省略号 */
}

/* 信息行样式 */
.job-info {
  font-size: 14px;
  color: #606266;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.divider {
  margin: 0 8px;
  color: #dcdfe6;
}

/* 匹配度区域样式 */
.match-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.match-rate {
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
}

.match-label {
  font-size: 12px;
  color: #909399;
}
</style>