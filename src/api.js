import request from 'superagent';

export function load() {
  return request
    .get('https://your-api.here/get-annotation-mappings/')
    .then(response => response.body);
}

export function save(state) {
  return request
    .post('https://your-api.here/save-annotation-mappings/')
    .send(state)
    .then(response => response.body);
}
