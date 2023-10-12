import { createRouter, createWebHistory } from 'vue-router';
// Page/Coaches
import CoachDetail from './pages/coaches/CoachDetail.vue';
import CoachesList from './pages/coaches/CoachesList.vue';
import CoachRegistration from './pages/coaches/CoachRegistration.vue';
// Page/Requests
import ContactCoach from './pages/requests/ContactCoach.vue';
import RequestsReceived from './pages/requests/RequestsReceived.vue';
//NotFound
import NotFound from './pages/NotFound.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/coaches' },
    { path: '/coaches', component: CoachesList },
    { path: '/coaches/:id', component: CoachDetail, props: true, //Prop to send data to child
        children: [
            { path: 'contact', component: ContactCoach }, //coaches/c1/contact
        ]},
    { path: '/register', component: CoachRegistration },
    { path: '/requests', component: RequestsReceived },
    { path: '/:notFound(.*)', component: NotFound }, // after domain if anything (some random wrong text entered) it will redirect to homepage.
  ],
});

export default router;
