<template>
  <div class="report-export-page">
    <div class="export-section">
      <h2>生成并下载你的专属报告</h2>
      
      <!-- 报告预览区 -->
      <div class="report-preview">
        <img :src="reportData.reportCover" alt="报告封面" />
        <div class="report-title">{{ reportData.reportTitle }}</div>
      </div>

      <!-- 操作按钮区 -->
      <div class="export-actions">
        <el-button type="primary" @click="handlePolish" :loading="polishing">
          智能润色
        </el-button>
        <el-button type="info" @click="handleEdit">
          编辑
        </el-button>
        <el-button type="success" @click="handleDownload" :loading="downloadLoading">
          下载为 PDF
        </el-button>
      </div>

      <!-- 状态反馈区 -->
      <div v-if="downloadLoading" class="status-message loading">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>正在生成报告...</span>
      </div>
      
      <div v-else-if="downloadSuccess" class="status-message success">
        <el-icon><Check /></el-icon>
        <span>报告已成功下载！</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading, Check } from '@element-plus/icons-vue'

// 1. 定义组件接收的数据 (Props)
// 父组件会把 aiReportData 传进来
const props = defineProps({
  reportData: {
    type: Object,
    required: true,
    default: () => ({
      reportCover: 'https://via.placeholder.com/300x200?text=Report',
      reportTitle: '专属职业发展报告'
    })
  }
})

// 2. 定义状态变量
const polishing = ref(false)
const downloadLoading = ref(false)
const downloadSuccess = ref(false)

// 3. 定义事件方法
const handlePolish = () => {
  polishing.value = true
  ElMessage.info('正在使用大模型对报告进行智能润色...')
  
  // 模拟润色过程 (实际项目中这里会调用 API)
  setTimeout(() => {
    polishing.value = false
    ElMessage.success('报告润色完成！')
  }, 1500)
}

const handleEdit = () => {
  ElMessage.info('进入报告编辑模式...')
  // 这里可以添加跳转逻辑或打开弹窗逻辑
  // router.push('/edit-report') 
}

const handleDownload = () => {
  downloadLoading.value = true
  downloadSuccess.value = false
  
  // 模拟下载过程 (实际项目中这里会调用后端下载接口)
  setTimeout(() => {
    downloadLoading.value = false
    downloadSuccess.value = true
    
    ElMessage.success('下载已开始')
    
    // 3秒后隐藏成功提示
    setTimeout(() => {
      downloadSuccess.value = false
    }, 3000)
  }, 2000)
}
</script>

<style scoped lang="scss">
.report-export-page {
  padding: 20px;
  // 如果需要全屏居中，可以取消下面这行的注释
  // display: flex;
  // justify-content: center;
  // align-items: flex-start;
}

.export-section {
  padding: 40px;
  border: 1px dashed #dcdfe6;
  border-radius: 8px;
  background: white;
  max-width: 800px;
  margin: 0 auto; // 让卡片居中
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

  h2 {
    margin: 0 0 30px 0;
    color: #303133;
    font-size: 24px;
    text-align: center;
  }
}

.report-preview {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;

  img {
    width: 300px;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .report-title {
    margin-top: 15px;
    font-size: 18px;
    font-weight: bold;
    color: #303133;
  }
}

.export-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
}

.status-message {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &.loading {
    color: #409EFF;
  }

  &.success {
    color: #67c23a;
  }
}
</style>