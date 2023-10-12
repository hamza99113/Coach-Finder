export default {
  namespaced: true,
  state() {
    return {
      requests: [],
    };
  },
  mutations: {
    addRequest(state, payload) {
      state.requests.push(payload);
    },
    setRequests(state, payload) {
      state.requests = payload;
    }
  },
  actions: {
    async contactCoach(context, payload) {
      const newRequest = {
        // coachId: payload.coachId,
        userEmail: payload.email,
        message: payload.message,
      };
      const response = await fetch(`https://coach-finder-b287d-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`,{
        method: 'POST',
        body: JSON.stringify(newRequest)
      });
      const responseData = await response.json();
      if(!response.ok){
        const error = new Error(responseData.message || 'Failed to Send Request!'); //  If the responseData object has a message property, that message is used as the error message. If there is no message property in responseData, a default error message, "Failed to Send Request!", is used.
        throw error;
      }
      console.log(responseData);
      newRequest.id = responseData.name;
      newRequest.coachId = payload.coachId,


      context.commit('addRequest', newRequest);
    },
    async fetchRequests(context){
      const coachId = context.rootGetters.userId;
      const response = await fetch(`https://coach-finder-b287d-default-rtdb.firebaseio.com/requests/${coachId}.json`);
      const responseData = await response.json();

      if(!response.ok){
        const error = new Error(responseData.message || 'Failed to Fetch Request!');
        throw error;
      }

      const requests = [];
      for(const key in responseData){
        const request = {
          id: key,
          coachId: coachId,
          userEmail: responseData[key].userEmail,
          message: responseData[key].message
        };
        requests.push(request);
      }
      context.commit('setRequests', requests);
    }
  },
  getters: {
    requests(state, getters, rootState, rootGetters) {
      //return state.requests;
      const coachId = rootGetters.userId;
      return state.requests.filter((req) => req.coachId === coachId);
    },
    hasRequests(state, getters) {
      // return state.requests && state.requests.length > 0;
      return getters.requests && getters.requests.length > 0;
    },
  },
};
