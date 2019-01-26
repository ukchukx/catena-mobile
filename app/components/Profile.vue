<template>
  <FlexboxLayout>
    <StackLayout class="form">
      <StackLayout class="input-field">
        <Label text="Email" class="input-label"></Label>
        <Label :text="user.email"></Label>
        <StackLayout class="hr-light"></StackLayout>
      </StackLayout>

      <StackLayout class="input-field">
        <Label text="Username" class="input-label"></Label>
        <GridLayout columns="*, 100" rows="auto">
          <TextField
            col="0"
            ref="username"
            class="input"
            hint="Username"
            v-model="updateForm.username"
            returnKeyType="done"
            @returnPress="onUsernameTap()"
          ></TextField>
          <Button
            :isEnabled="updateFormOk"
            @tap="onUsernameTap()"
            class="btn-show"
            col="1"
            text="Update"
          />
        </GridLayout>
        <StackLayout class="hr-light"></StackLayout>
      </StackLayout>

      <StackLayout class="input-field">
        <Label text="Current password" class="input-label"></Label>
        <GridLayout columns="*, 70" rows="auto">
          <TextField
            col="0"
            ref="curPassword"
            class="input"
            :autocorrect="false"
            autocapitalizationType="none"
            :secure="!showCurrentPassword"
            hint="Current password"
            v-model.trim="passwordForm.password"
            returnKeyType="next"
            @returnPress="focusPassword()"
          ></TextField>
          <Button
            @tap="toggleCurrentPassword()"
            class="btn-show"
            col="1"
            :text="showCurrentButtonText"
          />
        </GridLayout>
        <StackLayout class="hr-light"></StackLayout>
      </StackLayout>

      <StackLayout class="input-field">
        <Label text="New password" class="input-label"></Label>
        <GridLayout columns="*, 70" rows="auto">
          <TextField
            col="0"
            ref="newPassword"
            class="input"
            :autocorrect="false"
            autocapitalizationType="none"
            :secure="!showPassword"
            hint="New password"
            v-model.trim="passwordForm.new_password"
            returnKeyType="done"
            @returnPress="onChangePassword()"
          ></TextField>
          <Button @tap="togglePassword()" class="btn-show" col="1" :text="showButtonText"/>
        </GridLayout>
        <StackLayout class="hr-light"></StackLayout>
      </StackLayout>

      <Button :isEnabled="canUseButton" text="Change password" @tap="onChangePassword()"></Button>
      <ActivityIndicator :busy="busy"/>
    </StackLayout>
  </FlexboxLayout>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import Toast from '@/mixins/Toast';
import Home from './Home';

export default {
  name: 'Login',
  mixins: [Toast],
  data() {
    return {
      updateForm: {
        username: ''
      },
      passwordForm: {
        password: '',
        new_password: ''
      },
      username: '',
      isLoggingIn: true,
      busy: false,
      showCurrentPassword: false,
      showPassword: false
    };
  },
  computed: {
    ...mapGetters(['user']),
    updateFormOk() {
      const { username } = this.updateForm;
      return !!username && this.user.username !== username;
    },
    passwordFormOk() {
      const { password, new_password } = this.passwordForm;
      return password !== new_password &&
        new_password.length >= 6 &&
        password.length >= 6;
    },
    canUseButton() {
      return this.passwordFormOk && !this.busy;
    },
    buttonClasses() {
      const base = 'btn m-t-20';
      return this.passwordFormOk ? `${base} btn-primary` : base;
    },
    showCurrentButtonText() {
      return this.showCurrentPassword ? 'Hide' : 'Show';
    },
    showButtonText() {
      return this.showPassword ? 'Hide' : 'Show';
    }
  },
  watch: {
    user: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val) return;
        const { username = '' } = val;
        this.updateForm.username = username;
      }
    }
  },
  methods: {
    ...mapActions(['updateProfile', 'changePassword']),
    toggleForm() {
      this.isLoggingIn = !this.isLoggingIn;
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    toggleCurrentPassword() {
      this.showCurrentPassword = !this.showCurrentPassword;
    },
    onUsernameTap() {
      if (this.busy || !this.updateFormOk) return;
      this.busy = true;

      this.$refs.username.nativeView.dismissSoftInput();
      this.updateForm.username = this.updateForm.username.trim();

      this.updateProfile(this.updateForm)
        .then((success) => {
          this.busy = false;
          if (success) {
            this.showToast('Username updated');
            return;
          }
          this.showToast('Could not update username', true);
        })
        .catch(({ message = 'Could not update username' }) => {
          this.busy = false;
          this.showToast(message, true);
        });
    },
    onChangePassword() {
      if (this.busy || !this.passwordFormOk) return;
      this.busy = true;

      this.$refs.curPassword.nativeView.dismissSoftInput();
      this.$refs.newPassword.nativeView.dismissSoftInput();

      this.changePassword(this.passwordForm)
        .then((success) => {
          this.busy = false;
          if (success) {
            this.showToast('Password changed');
            this.passwordForm.password = '';
            this.passwordForm.new_password = '';
            return;
          }
          this.showToast('Could not change password', true);
        })
        .catch(({ message = 'Could not change password' }) => {
          this.busy = false;
          this.showToast(message, true)
        });
    },
    focusPassword() {
      this.$refs.newPassword.nativeView.focus();
    }
  }
};
</script>
<style scoped>
FlexboxLayout {
  align-items: center;
  flex-direction: column;
}

.form {
  margin-left: 10;
  margin-right: 10;
  flex-grow: 2;
  vertical-align: middle;
}

.input-label {
  margin-bottom: 15;
}

.input {
  font-size: 18;
  placeholder-color: #a8a8a8;
}

.login-label {
  horizontal-align: center;
  color: #a8a8a8;
  font-size: 16;
}

.btn-show {
  background-color: #ffffff;
}
</style>
