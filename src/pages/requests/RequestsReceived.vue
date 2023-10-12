<template>
  <div>
    <base-dialog
      :show="!!error"
      title="An Error Accoured!"
      @close="handleError"
    >
      <!-- '!!' to convert it into boolean; 'true' -->
      <p>{{ error }}</p>
    </base-dialog>
    <section>
      <base-card>
        <header>
          <h2>Request Received</h2>
        </header>
        <base-spinner v-if="isloading"></base-spinner>
        <ul v-else-if="hasRequests && !isloading">
          <!-- userEmail in actions of requests.js -->
          <RequestItem
            v-for="req in receivedRequests"
            :key="req.id"
            :email="req.userEmail"
            :message="req.message"
          />
        </ul>
        <h3 v-else>You Haven't Received Any Requests Yet!</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import RequestItem from '../../components/requests/RequestItem.vue';
export default {
  components: {
    RequestItem,
  },
  data() {
    return {
      isloading: false,
      error: null,
    };
  },
  computed: {
    receivedRequests() {
      //Requests is getter
      return this.$store.getters['requests/requests'];
    },
    hasRequests() {
      return this.$store.getters['requests/hasRequests'];
    },
  },
  created() {
    this.loadRequests();
  },
  methods: {
    async loadRequests() {
      this.isloading = true;
      try {
        await this.$store.dispatch('requests/fetchRequests');
      } catch (error) {
        this.error = error.message || 'Something Failed!';
      }
      this.isloading = false;
    },
    handleError() {
      this.error = null;
    },
  },
};
</script>

<style scoped>
header {
  text-align: center;
}

ul {
  list-style: none;
  margin: 2rem auto;
  padding: 0;
  max-width: 30rem;
}

h3 {
  text-align: center;
}
</style>
