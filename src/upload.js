const buildUploader = apiUrl => async file => {
  let formData = new FormData;
  formData.append('files', file);
  return fetch(`${apiUrl}/upload`, {
    method: 'POST',
    body: formData
  }).then(
    res => res.json()
  );
}

export default buildUploader;