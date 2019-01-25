<script>
import * as Toast from 'nativescript-toast';

export default {
  name: 'Toast',
  methods: {
    showToast(message, long = false) {
      const toast = long ? Toast.makeText(message, 'long') : Toast.makeText(message);
      toast.show();
    }
  }
}
</script>
