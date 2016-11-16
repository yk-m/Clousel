import Request from 'superagent'


export function fetch(url, query, success, failure){
  Request
    .get(url)
    .query(query)
    .set('Accept', 'application/json')
    .end((err, res) => {
      if (!res.ok) {
        failure(res)
        return
      }
      success(res)
    })
}


export function post(url, data, success, failure){
  Request
    .post(url)
    .send(data)
    .set('Accept', 'application/json')
    .end((err, res) => {
      if (!res.ok) {
        failure(res)
        return
      }
      success(res)
    })
}


export function patch(url, data, success, failure){
  Request
    .patch(url)
    .send(data)
    .set('Accept', 'application/json')
    .end((err, res) => {
      if (!res.ok) {
        failure(res)
        return
      }
      success(res)
    })
}


export function del(url, success, failure){
  Request
    .del(url)
    .end((err, res) => {
      if (!res.ok) {
        failure(res)
        return
      }
      success(res)
    })
}
