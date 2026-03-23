<template>
  <div class="app-container">
    <!-- 全局导航栏 -->
    <nav class="navbar">
      <div class="navbar-left">
        <span class="logo">AI Career</span>
      </div>
      
      <div class="navbar-center">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/jobs" class="nav-link">岗位探索</router-link>
        <router-link to="/profile" class="nav-link">个人中心</router-link>
      </div>
      
      <div class="navbar-right">
        <template v-if="isLoggedIn">
          <span class="username">{{ userData.name }}</span>
          <el-button type="danger" size="small" @click="handleLogout">退出</el-button>
        </template>
        <template v-else>
          <el-button type="primary" size="small" @click="handleLogin">登录/注册</el-button>
        </template>
      </div>
    </nav>

    <!-- 路由视图 -->
    <router-view />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { userData } from '@/mock/data.js' // ✅ 正确导入

const router = useRouter()
const isLoggedIn = ref(true)

// 使用导入的 userData，不要重复声明
const user = computed(() => isLoggedIn.value ? userData : null)

// 登录处理
const handleLogin = () => {
  router.push('/profile/info')
}

// 退出处理
const handleLogout = () => {
  isLoggedIn.value = false
  router.push('/')
}
</script>

<style scoped lang="scss">
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  height: 60px;
  background: #eff5f8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;

  .navbar-left {
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #409EFF;
      cursor: pointer;
    }
  }

  .navbar-center {
    display: flex;
    gap: 30px;

    .nav-link {
      text-decoration: none;
      color: #606266;
      font-size: 16px;
      transition: color 0.3s;

      &:hover {
        color: #409EFF;
      }

      &.router-link-active {
        color: #409EFF;
        font-weight: bold;
      }
    }
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 10px;

    .username {
      color: #606266;
      font-size: 14px;
    }
  }
}
</style>