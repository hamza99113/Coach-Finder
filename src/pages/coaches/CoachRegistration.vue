<template>
  <section>
    <base-card>
      <h2>Register as a Coach Now!</h2>
      <CoachForm @save-data="saveData"/>
    </base-card>
  </section>
</template>

<script>
import CoachForm from '../../components/coaches/CoachForm.vue';
export default {
  components: {
    CoachForm,
  },
  methods: {
    saveData(formData){
        this.$store.dispatch('coaches/registerCoach', formData);
        // this.$router.push('/coaches');
        this.$router.replace('/coaches'); // 'replace()' We cant come back to page where we came from
    }
  },
};
</script>
