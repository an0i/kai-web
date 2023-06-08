export default function fetchClick(todo, payload, cb, eh, fin) {
  const options = { method: 'POST', body: payload, headers: { 'Content-Type': 'application/json' } };
  fetch(`${import.meta.env.VITE_API_URL}/instance/${todo}`, options)
    .then((res) => {
      if (res.ok) {
        res.json().then(cb, eh);
      } else {
        res.text().then((e) => { throw new Error(e); }).catch(eh);
      }
    }, eh)
    .finally(fin);
}
