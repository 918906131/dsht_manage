<template>
  <div id="login">
    <el-form
      :label-position="labelPosition"
      :model="loginInfo"
      class="el_form"
      :rules="rules"
      ref="loginInfo"
    >
      <el-form-item prop="username">
        <el-input
          v-model="loginInfo.username"
          prefix-icon="el-icon-user-solid"
          class="el_input"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginInfo.password"
          prefix-icon="el-icon-lock"
          show-password
          class="el_input"
        ></el-input>
      </el-form-item>
      <el-button class="el_botton" plain @click="submitForm('loginInfo')"
        >登录</el-button
      >
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      labelPosition: "right",
      loginInfo: {
        username: "admin",
        password: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 8 到 22 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
              
        if (valid) {
          this.axios
            .post("/api/login", {
              username: this.loginInfo.username,
              password: this.loginInfo.password,
            })
            .then((res) => {
              console.log(res);
              if(res.data==null){
                console.log(1);
                this.$message({
									message: res.meta.msg,
									type: 'error',
									duration: 1000,
									customClass: 'msg',
								})
								setTimeout(() => {
									sessionStorage.clear()
								})
              }
              else{
                window.sessionStorage.setItem('token', res.data.token)
                window.sessionStorage.setItem('user', res.data.username)
                this.$message({
                  message:res.meta.msg,
									type: 'success',
									duration: 1000,
									customClass: 'msg',
									onClose: () => {
										this.$router.push('/home')
									}
								});
              }
            }); 
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style scoped>
#login {
  position: relative;
  height: 100vh;
  z-index: 21;
  background: orange;
  background-color: rgba(223, 175, 18);
  display: flex;
  justify-content: center;
  align-items: center;
}
.el_form {
  padding: 30px;
  position: relative;
  display: flex;
  width: 300px;
  border-radius: 10px;
  flex-flow: wrap;
  justify-content: center;
  background: white;
}
.el_botton {
  width: 100px;
}
.el_input {
  width: 250px;
}
span {
  font-size: 0.12rem;
  position: absolute;
  bottom: 0.1rem;
  right: 0.2rem;
}
</style>