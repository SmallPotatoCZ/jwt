// 公用函数
function postData(url = ``, data = {}) {
  return fetch(url, {
      method: "POST",
      // mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
      redirect: "follow",
      referrer: "no-referrer",
      body: JSON.stringify(data),
    })
    .then(response => {
      return response.json();
    });
}

function getData(url = ``) {
  return fetch(url, {
      method: "GET",
      // mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
    })
    .then(response => {
      return response.json()
    });
}