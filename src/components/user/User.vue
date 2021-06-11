<template>
  <div>
<!--    面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
<!--卡片视图-->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @change="getUserList"
          >
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
<!--      用户列表区域-->
      <el-table
        border
        stripe
        :data="userlist"
        style="width: 100%">
        <el-table-column
          label="#"
          type="index">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="role_name"
          label="角色">
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" circle size="middle" @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" circle size="middle" @click="deleteUserById(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="设置" placement="top" :enterable="false">
              <el-button type="info" icon="el-icon-s-tools" circle size="middle"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
<!--     添加用户-->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="30%"
        @close="handleClose"
        >
        <el-form :model="addRuleForm" :rules="addRules" ref="addRuleFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addRuleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="addRuleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="密码强度">
            <password-strength v-model="addRuleForm.password"></password-strength>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input type="email" v-model="addRuleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="addRuleForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addConfirm">确 定</el-button>
    </span>
        </template>
      </el-dialog>
<!--      修改用户-->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="30%"
      >
        <el-form :model="editForm" :rules="addRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input type="email" v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
    <span class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="editConfirm">确 定</el-button>
    </span>
        </template>
      </el-dialog>
<!--      分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import PasswordStrength from '../PasswordStrength'
export default {
  props: [],
  watch: {},
  data () {
    // 邮箱验证
    const validateEmail = (rule, value, callback) => {
      if (value !== '') {
        const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (!reg.test(value)) {
          callback(new Error('请输入有效的邮箱'))
        }
        callback()
      }
    }
    // 手机验证
    const validateMobilePhone = (rule, value, callback) => {
      if (value !== '') {
        const reg = /^1[3456789]\d{9}$/
        if (!reg.test(value)) {
          callback(new Error('请输入有效的手机号码'))
        }
        callback()
      }
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 1
      },
      userlist: [],
      total: 0,
      name: 'users',
      dialogVisible: false,
      editDialogVisible: false,
      // 添加表单内容
      addRuleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改表单内容
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 添加规则
      addRules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度限制在3-10个字符之间', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobilePhone, trigger: 'blur' }]
      },
      // 验证规则
      editRules: {}
    }
  },
  created () {
    this.getUserList()
  },
  mounted () {
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取失败')
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 修改用户状态
    async userStateChanged (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('修改失败')
      }
      return this.$message.success('更新成功')
    },
    handleClose () {
      this.$refs.addRuleFormRef.resetFields()
    },
    // 添加用户提交表单
    addConfirm () {
      this.$refs.addRuleFormRef.validate(async valid => {
        if (!valid) return this.message.error('数据填写错误')
        const { data: res } = await this.$http.post('users', this.addRuleForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加失败')
        }
        this.$message.success('添加成功')
        this.dialogVisible = false
        this.getUserList()
      })
    },
    // 提交编辑表单
    editConfirm () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.message.error('数据填写错误')
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.meta.status !== 201) {
          this.$message.error('修改失败')
        }
        this.$message.success('修改成功')
        this.editDialogVisible = false
        this.getUserList()
      })
    },
    // 修改表单
    async showEditDialog (id) {
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }
      this.editForm = res.data
      this.dialogVisible = false
    },
    // 删除用户
    deleteUserById (id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('users/' + id)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        setTimeout(() => {
          this.getUserList()
        }, 400)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 修改页面大小
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 修改页码数
    handleCurrentChange (newNum) {
      this.queryInfo.pagenum = newNum
      this.getUserList()
    }
  },
  components: { PasswordStrength },
  beforeDestroy () {
  }
}
</script>

<style lang='less' scoped>
.el-icon-check:before {
  content: "\e6da";
}

</style>
