import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/user/User'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      redirect: '/welcome',
      component: Home,
      children: [
        { path: '/welcome', component: Welcome },
        { name: 'users', path: '/users', component: User }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const nextRouter = ['/sss']
  const isLogin = localStorage.getItem('token')
  if (nextRouter.indexOf(to.name) >= 0 && !isLogin) {
    next({
      path: '/login',
      // 将跳转的路由path作为参数，登录成功后跳转到该路由
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
  if (to.name === 'login') {
    if (isLogin) {
      console.log('已登录')
      router.push({ path: '/temp/index' })
    }
  }
})
export default router
