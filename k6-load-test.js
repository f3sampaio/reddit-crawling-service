import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 50, // number of virtual users
  duration: '30s', // test duration
};

export default function () {
  const url = 'http://localhost:3000/subreddit-info';
  const payload = JSON.stringify({ subreddit: 'javascript' });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'body has name': (r) => JSON.parse(r.body).name === 'javascript',
  });

  sleep(1);
} 