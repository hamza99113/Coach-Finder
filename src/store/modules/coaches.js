export default {
  namespaced: true,
  state() {
    return {
      lastFetch: null,

      // userIsCoach: false, //Alternative Approach
      coaches: [
        // {
        //   id: 'c1',
        //   firstName: 'Maximilian',
        //   lastName: 'Schwarzmüller',
        //   areas: ['frontend', 'backend', 'career'],
        //   description:
        //     "I'm Maximilian and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
        //   hourlyRate: 30,
        // },
        // {
        //   id: 'c2',
        //   firstName: 'Julie',
        //   lastName: 'Jones',
        //   areas: ['frontend', 'career'],
        //   description:
        //     'I am Julie and as a senior developer in a big tech company, I can help you get your first job or progress in your current role.',
        //   hourlyRate: 45,
        // },
      ],
    };
  },
  mutations: {
    registerCoach(state, payload) {
      state.coaches.push(payload);
    },
    setCoach(state, payload) {
      state.coaches = payload;
    },
    setFetchTimestamp(state){
      state.lastFetch = new Date().getTime(); 
    },
  },
  actions: {
    //We can name it 'payload' or something else of our choice
    async registerCoach(context, formData) {
      const userId = context.rootGetters.userId;
      const coachData = {
        firstName: formData.first,
        lastName: formData.last,
        description: formData.desc,
        hourlyRate: formData.rate,
        areas: formData.areas,
      };

      //.Then() will execute fetch() only once; when the code in .Then() is executed.
      const response = await fetch(
        `https://coach-finder-b287d-default-rtdb.firebaseio.com/coaches/${userId}.json`,
        {
          method: 'PUT',
          body: JSON.stringify(coachData),
        }
      );

      //const responseData = await response.json(); // fetch data in json format and automatically convert it into javascript object for user usage.

      if (!response.ok) {
        // error ...
      }

      // context.commit('registerCoach', coachData);
      context.commit('registerCoach', {
        ...coachData,
        id: userId,
      });
    },

    //payload is used to tell me that i do have to fetch again, which overrides this 'getter.shouldUpdate'
    async loadCoaches(context, payload) {
      if(!payload.forceRefresh && !context.getters.shouldUpdate){
        return;
      }


      //Getting Coaches Data From Firebase; 'GET' Http request
      const response = await fetch(
        `https://coach-finder-b287d-default-rtdb.firebaseio.com/coaches.json`
      );

      //Storing Fetched Data into responseData; fetched form is an 'Object'
      const responseData = await response.json(); // fetch data in json format and automatically convert it into javascript object for user usage.
      
      //Error Handling
      if (!response.ok) {
        const error = new Error(
          responseData.message || 'Faild to Fetch Coach Data!'
        );
        throw error;
      }

      //To transform to needed format
      const coaches = [];
      for (const key in responseData) {
        const coach = {
          id: key, //c3: the id in firebase
          //Named accordingly stored in Firebase
          firstName: responseData[key].firstName,
          lastName: responseData[key].lastName,
          description: responseData[key].description,
          hourlyRate: responseData[key].hourlyRate,
          areas: responseData[key].areas,
        };
        coaches.push(coach);
      }
      context.commit('setCoach', coaches);
      context.commit('setFetchTimestamp');
    },
  },
  getters: {
    // Getters name can be different from states defined in state()
    coaches(state) {
      return state.coaches; // It will get the 'coaches' in state()
    },
    // Used in CoachesList.vue
    hasCoaches(state) {
      return state.coaches && state.coaches.length > 0;
    },
    isCoach(state, getters, rootState, rootGetters) {
      const coaches = getters.coaches;
      const userId = rootGetters.userId;
      return coaches.some((coach) => coach.id === userId); //'some()' return true if some coaches fulfil the criteria; //if true we are already a coach
    },
    shouldUpdate(state){
      const lastFetch = state.lastFetch;
      if(!lastFetch){
        return true;
      }
      const currentTimestamp = new Date().getTime(); //Time when we use the getter
      return (currentTimestamp - lastFetch) / 1000 > 60; //Return true if morethan a minute age
    }
  },
};
