<template>
  <Page class="page" :actionBarHidden="true">
    <FlexboxLayout class="page">
      <StackLayout class="form">
        <Label class="header" text="Catena"></Label>

        <StackLayout class="input-field">
          <TextField
            class="input"
            hint="Email"
            keyboardType="email"
            autocorrect="false"
            autocapitalizationType="none"
            v-model.trim="form.email"
            returnKeyType="next"
            @returnPress="focusPassword()"
          ></TextField>
          <StackLayout class="hr-light"></StackLayout>
        </StackLayout>

        <StackLayout class="input-field">
          <TextField
            ref="password"
            class="input"
            hint="Password"
            secure="true"
            v-model.trim="form.password"
            :returnKeyType="isLoggingIn ? 'done' : 'next'"
            @returnPress="focusConfirmPassword()"
          ></TextField>
          <StackLayout class="hr-light"></StackLayout>
        </StackLayout>

        <StackLayout v-if="!isLoggingIn" class="input-field">
          <TextField
            ref="confirmPassword"
            class="input"
            hint="Confirm password"
            secure="true"
            v-model.trim="form.confirmPassword"
            returnKeyType="done"
          ></TextField>
          <StackLayout class="hr-light"></StackLayout>
        </StackLayout>

        <Button :text="formattedString3" @tap="submit()" class="btn btn-primary m-t-20"></Button>
        <!-- <Label
          v-if="isLoggingIn"
          text="Forgot your password?"
          class="login-label"
          @tap="forgotPassword()"
        ></Label>-->
      </StackLayout>

      <Label class="login-label sign-up-label" @tap="toggleForm()">
        <FormattedString>
          <Span :text="formattedString1" :class="boldOrNot"></Span>
          <Span :text="formattedString2" class="bold"></Span>
        </FormattedString>
      </Label>
    </FlexboxLayout>
  </Page>
</template>
<script>
import { mapActions } from 'vuex';
import Home from './Home';

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: 'test@email.com',
        password: 'password',
        confirmPassword: ''
      },
      isLoggingIn: true,
      busy: false
    };
  },
  computed: {
    formattedString1() {
      return this.isLoggingIn ? "Don't have an account? " : 'Back to Login';
    },
    formattedString2() {
      return this.isLoggingIn ? 'Sign up' : '';
    },
    formattedString3() {
      return this.isLoggingIn ? 'Log In' : 'Sign Up';
    },
    boldOrNot() {
      return this.isLoggingIn ? '' : 'bold';
    }
  },
  methods: {
    ...mapActions(['authenticate']),
    toggleForm() {
      this.isLoggingIn = !this.isLoggingIn;
    },
    login() {
      if (this.busy) return;
      this.busy = true;
      this.authenticate(this.form)
        .then((success) => {
          this.busy = false;
          if (!success) {
            console.error('Could not login');
            return;
          }

          this.$navigateTo(Home);
        })
        .catch(({ message }) => {
          this.busy = false;
            console.error('Could not login');
        });
    },
    signup() {
      console.log('signup');
    },
    submit() {
      if (this.isLoggingIn) {
        this.login();
      } else {
        this.signup();
      }
    },
    forgotPassword() {

    },
    focusConfirmPassword() {
      if (!this.isLoggingIn) {
        this.$refs.confirmPassword.nativeView.focus();
      }
    },
    focusPassword() {
      this.$refs.password.nativeView.focus();
    }
  }
};
</script>
<style scoped>
.page {
  align-items: center;
  flex-direction: column;
}
.form {
  margin-left: 30;
  margin-right: 30;
  flex-grow: 2;
  vertical-align: middle;
}

.logo {
  margin-bottom: 12;
  height: 90;
  font-weight: bold;
}
.header {
  horizontal-align: center;
  font-size: 25;
  font-weight: 600;
  margin-bottom: 70;
  text-align: center;
  color: #42b882;
}

.input-field {
  margin-bottom: 25;
}
.input {
  font-size: 18;
  placeholder-color: #a8a8a8;
}

.btn-primary {
  height: 50;
  margin: 30 5 15 5;
  background-color: #42b882;
  border-radius: 5;
  font-size: 20;
  font-weight: 600;
}
.login-label {
  horizontal-align: center;
  color: #a8a8a8;
  font-size: 16;
}
.sign-up-label {
  margin-bottom: 20;
}
.bold {
  color: #000000;
}
</style>
