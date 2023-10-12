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
      <CoachFilter @change-filter="setFilters" />
    </section>
    <section>
      <base-card>
        <div class="controls">
          <!-- <button>Refresh</button>
          <router-link to="/register">Register as a Coach</router-link> -->
          <base-button mode="outline" @click="loadCoaches(true)">Refresh</base-button>
          <base-button v-if="!isCoach && !isLoading" link to="/register"
            >Register as a Coach</base-button
          >
        </div>
        <div v-if="isLoading">
          <BaseSpinner />
        </div>
        <ul v-else-if="hasCoaches">
          <!-- <li v-for="coach in fileredCoaches" :key="coach.id">
          {{ coach.firstName }}
        </li> -->

          <CoachItem
            v-for="coach in fileredCoaches"
            :key="coach.id"
            :id="coach.id"
            :first-name="coach.firstName"
            :last-name="coach.lastName"
            :rate="coach.hourlyRate"
            :areas="coach.areas"
          />
        </ul>
        <h3 v-else>No Coaches Found.</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import CoachItem from '../../components/coaches/CoachItem.vue';
import CoachFilter from '../../components/coaches/CoachFilter.vue';
import BaseSpinner from '../../components/ui/BaseSpinner.vue';
// import BaseSpinner from '../../components/ui/BaseSpinner.vue';

export default {
  components: {
    CoachItem,
    CoachFilter,
    BaseSpinner,
    // BaseSpinner
  },
  data() {
    return {
      isLoading: false,
      error: null,
      activeFilters: {
        frontend: true,
        backend: true,
        career: true,
      },
    };
  },
  computed: {
    fileredCoaches() {
      // return this.$store.getters['coaches/coaches'];
      const coaches = this.$store.getters['coaches/coaches'];
      return coaches.filter((coach) => {
        if (this.activeFilters.frontend && coach.areas.includes('frontend')) {
          return true;
        }
        if (this.activeFilters.backend && coach.areas.includes('backend')) {
          return true;
        }
        if (this.activeFilters.career && coach.areas.includes('career')) {
          return true;
        }
        return false;
      });
    },
    hasCoaches() {
      return !this.isLoading && this.$store.getters['coaches/hasCoaches'];
    },
    isCoach() {
      return this.$store.getters['coaches/isCoach'];
    },
  },
  created() {
    this.loadCoaches();
  },
  methods: {
    setFilters(updatedFilters) {
      this.activeFilters = updatedFilters;
    },
    async loadCoaches(refresh = false) {
      this.isLoading = true;
      try {
        await this.$store.dispatch('coaches/loadCoaches', {
          forceRefresh: refresh,
        });
      } catch (error) {
        this.error = error.message || 'Something Went Wrong!';
      }
      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    },
  },
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
