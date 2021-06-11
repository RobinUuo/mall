<template>
  <el-container class="home_container">
<!--    标题栏-->
    <el-header>
      <img src="../assets/img/电商.svg" alt="">
      <span>电商管理系统</span>
      <el-button type="info" @click="logout">注销</el-button>
    </el-header>
<!--    内容区-->
    <el-container>
<!--      侧边栏-->
      <el-aside width="200px">
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :router="true"
          :default-active="activePath"
        >
          <!--          一级菜单-->
          <el-submenu :index="'/' + item.path" v-for="item in menulist" :key="item.id">
            <!--          一级菜单模版区-->
            <template slot="title">
              <!--          一级菜单图标-->
              <i class="el-icon-location"></i>
              <!--          一级菜单文本-->
              <span>{{item.authName}}</span>
            </template>
            <!--          二级菜单-->
              <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
                <template slot="title">
                  <!--          2级菜单图标-->
                  <i class="el-icon-menu"></i>
                  <!--          2级菜单文本-->
                  <span>{{subItem.authName}}</span>
                </template>
              </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  props: [],
  watch: {},
  data () {
    return {
      menulist: [],
      activePath: '',
      name: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  mounted () {
  },
  methods: {
    logout () {
      this.$message.success('退出成功')
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    }
  },
  components: {},
  beforeDestroy () {
  }

}
</script>

<style lang='less' scoped>
.home_container{
  height: 100%;
}
.el-header{
  padding: 0;
  margin: 0;
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 20px;
  >img{
    height: 80%;
    margin-left: 0;
  }
}
.el-menu{
  width: 200px;
}
.el-submenu{
  width: 200px;
}
.el-aside{
  background-color: #333744;
}
.el-container{
  background-color: azure;
}
</style>
