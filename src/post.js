async function post(action, textObj) {
  let raw = '';
  if (action === 'create') {
    raw = JSON.stringify({ password: textObj.password, text: textObj.text });
  } else if (action === 'save') {
    raw = JSON.stringify({ id: textObj.id, password: textObj.password, text: textObj.text });
  } else if (action === 'pull' || action === 'destroy') {
    raw = JSON.stringify({ id: textObj.id, password: textObj.password });
  } else {
    throw (new Error('未知的操作'));
  }

  const options = { method: 'POST', body: raw, headers: { 'Content-Type': 'application/json' } };
  const data = await fetch(`${import.meta.env.VITE_API_URL}/instance/${action}`, options);
  const response = await data.json();
  if (data.ok) {
    if (action === 'create') {
      return { id: response.id };
    }
    if (action === 'pull') {
      return { text: response.text };
    }
    return { id: response.id };
  }
  if (Object.prototype.hasOwnProperty.call(response, 'error')) {
    throw (new Error(response.error));
  }
  throw (new Error('未知错误'));
}

export default post;
