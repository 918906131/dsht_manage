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
            .post("api/login", {
              username: this.loginInfo.username,
              password: this.loginInfo.password,
            })
            .then((res) => {
<<<<<<< HEAD
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
=======
              this.$message({
                message: "恭喜你,登录成功",
                type: "success",
                duration: 1000,
                onClose: () => {
                  window.sessionStorage.setItem("token", res.token);
                  this.$router.push("/home");
                },
              });
            });
>>>>>>> b07be9217cd71b2ff74506c7a0145a86f5f586db
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
  height: 100%;
  background: orange;
  background-color: rgba(223, 175, 18, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}
.el_form {
  padding: 30px;
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
</style>