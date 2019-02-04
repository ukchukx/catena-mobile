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
            autocapitalizationType="none"
            :autocorrect="false"
            v-model.trim="form.email"
            returnKeyType="next"
            @returnPress="focusPassword()"
          ></TextField>
          <StackLayout class="hr-light"></StackLayout>
        </StackLayout>

        <StackLayout class="input-field">
          <GridLayout columns="*, 70" rows="auto">
            <TextField
              col="0"
              ref="password"
              class="input"
              hint="Password"
              :autocorrect="false"
              :secure="!showPassword"
              v-model.trim="form.password"
              returnKeyType="done"
              @returnPress="onTap()"
            ></TextField>
            <Button
              @tap="togglePasswordVisibility()"
              class="btn-show"
              col="1"
              :text="showButtonText"
            />
          </GridLayout>
          <StackLayout class="hr-light"></StackLayout>
        </StackLayout>

        <Button
          :isEnabled="canUseButton"
          :text="formattedString3"
          @tap="onTap()"
          :class="buttonClasses"
        ></Button>
        <!-- <Label
          v-if="isLoggingIn"
          text="Forgot your password?"
          class="login-label"
          @tap="forgotPassword()"
        ></Label>-->
        <ActivityIndicator :busy="busy"/>
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
import Toast from '@/mixins/Toast';
import Home from './Home';

export default {
  name: 'Login',
  mixins: [Toast],
  data() {
    return {
      form: {
        email: 'test@email.com',
        password: 'password'
      },
      isLoggingIn: true,
      busy: false,
      showPassword: false
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
    },
    formOk() {
      const { email, password } = this.form;
      return /^\w+\.*\w*@\w+\.\w+/.test(email) && password.length >= 6;
    },
    canUseButton() {
      return this.formOk && !this.busy;
    },
    buttonClasses() {
      const base = 'btn m-t-20';
      return this.formOk ? `${base} btn-primary` : base;
    },
    showButtonText() {
      return this.showPassword ? 'Hide' : 'Show';
    }
  },
  methods: {
    ...mapActions(['authenticate', 'signup']),
    toggleForm() {
      this.isLoggingIn = !this.isLoggingIn;
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    login() {
      if (this.busy) return;
      this.busy = true;
      this.authenticate(this.form)
        .then((success) => {
          this.busy = false;
          if (!success) {
            this.showToast('Could not login');
            return;
          }

          this.$navigateTo(Home);
        })
        .catch(({ message = 'Could not login' }) => {
          this.busy = false;
          this.showToast(message);
        });
    },
    register() {
      if (this.busy) return;
      this.busy = true;
      this.signup(this.form)
        .then((success) => {
          this.busy = false;
          if (!success) {
            this.showToast('Could not signup');
            return;
          }

          this.$navigateTo(Home);
        })
        .catch(({ message }) => {
          this.busy = false;
          if (message === 'Validation failed') message = 'Email already used';
          this.showToast(message);
        });
    },
    onTap() {
      if (this.isLoggingIn) {
        this.login();
      } else {
        this.register();
      }
    },
    forgotPassword() {

    },
    focusPassword() {
      this.$refs.password.nativeView.focus();
    }
  }
};
</script>
<style scoped lang="scss">
@import "../app-variables";

.page {
  align-items: center;
  flex-direction: column;

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
    color: $accent;
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
    background-color: $accent;
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

  .btn-show {
    background-color: #ffffff;
  }
}
</style>
