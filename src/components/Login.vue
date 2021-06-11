<template>
  <div class="login_container">
<!--    欢迎页面-->
    <div>
      <span class="welcome">欢迎使用</span>
      <span class="reg"><el-button type="text" style="font-size: 16px">点我注册</el-button></span>
    </div>
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/img/头像.svg" alt="默认头像">
      </div>
<!--      用户名输入-->
      <el-form label-width="0px" class="login_form" ref="login_form_ref" :model="login_form" :rules="login_form_rules">
        <el-form-item prop="username">
          <el-input  placeholder="请输入用户名"
                     prefix-icon="el-icon-user-solid"
                     v-model="login_form.username"></el-input>
        </el-form-item>
<!--      密码输入-->
        <el-form-item prop="password">
          <el-input placeholder="请输入密码"
                    prefix-icon="el-icon-lock"
                    v-model="login_form.password" type="password"></el-input>
        </el-form-item>
<!--        验证码-->
        <el-form-item prop="identify">
          <el-input v-model="login_form.vertify_code" placeholder="验证码" prefix-icon="el-icon-key">
            <template slot="append">
              <div class="login-code" @click="refreshCode" title="看不清？点击切换">
                <identify :identifyCode="identifyCode"></identify>
              </div>
            </template>
          </el-input>
        </el-form-item>
<!--      登陆/reset-->
        <el-form-item class="btns" >
          <el-button type="primary" @click="login_submit">登陆</el-button>
          <el-button type="info" @click="login_ret">重置</el-button>
        </el-form-item>
        <span><el-button type="text" >忘记密码</el-button></span>
      </el-form>

    </div>
  </div>
</template>

<script>
// 引入验证码
import Identify from '../components/Identify'
export default {
  props: [],
  watch: {},
  components: { Identify },
  data () {
    return {
      identifyCodes: 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789',
      identifyCode: '',
      login_form: {
        username: '',
        password: '',
        vertify_code: ''
      },
      login_form_rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, message: '长度不得小于3个字符', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        vertify_code: [{ required: true, message: '请输入验证码', trigger: 'blur' }, { required: true, validator: this.validateCode, change: 'blur' }]
      }
    }
  },
  created () {
    this.refreshCode()
  },
  mounted () {
  },
  methods: {
    login_ret () {
      this.$refs.login_form_ref.resetFields()
    },
    login_submit () {
      this.$refs.login_form_ref.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.login_form)
        if (res.meta.status !== 200) return this.$message.error('验证失败')
        this.$message.success('登陆成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    },
    // 验证码
    randomNum (min, max) {
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 生成随机验证码
    makeCode (o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ]
      }
      // console.log('identifyCode: ' + this.identifyCode)
    },
    // 验证码刷新
    refreshCode () {
      this.identifyCode = ''
      this.makeCode(this.identifyCodes, 4)
    },
    // 验证码输入校验
    validateCode (rule, value, callback) {
      if (value !== this.identifyCode) {
        callback(new Error('验证码验证错误！请输入正确的验证码！'))
      } else {
        callback()
      }
    }
  },
  beforeDestroy () {
  }
}
</script>

<style lang="less" scoped>
.login-code {
  cursor: pointer;
  margin: 0;
}
.login_container{
  background:url("../assets/img/登陆页背景.png");
  height: 100%;
  position: relative;
}
.welcome{
  width: 96px;
  height: 32px;
  position: absolute;
  top: 150px;
  right: 502px;
  left: 842px;
  bottom: 530px;
  font-size: 24px;
}
.reg{
  position: absolute;
  top: 145px;
  right: 270px;
  left: 1106px;
  bottom: 450px;
  font-size: 34px;
  line-height: 22px;
}

.login_box{
  width: 450px;
  height: 350px;
  background-color: #fff;
  position: absolute;
  left: 834px;
  top: 252px;
  right: 270px;
  bottom: 192px;
  .avatar_box{
    height: 90px;
    width: 90px;
    border-radius: 50%;
    box-shadow: 0 0 2px #ffffff;
    background-color: #fff;
    img{
      width: 100%;
      height: 100%;
      background-color: #eee;
      border-radius: 50%;
    }
    margin: -50px auto;
  }
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 60%;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.btns{
  margin: 0 50px;
}
</style>
