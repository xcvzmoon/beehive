import { eventHandler, handleCors } from 'h3';

export default eventHandler((event) => {
  handleCors(event, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  });
});
