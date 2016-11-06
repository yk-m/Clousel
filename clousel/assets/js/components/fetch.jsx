import Request from 'superagent'


export default function (url, query, success, failure){
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
