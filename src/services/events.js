const token = 'Bearer 6c4ca91f6cb756afda74324ba398d089cb9b13c08cd8fa02109479282f140016';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': token,
}
const url = 'https://api.linode.com/v4';

export const getEvents = () => {
  return fetch(
    `${url}/account/events`,
    {
      method: 'GET',
      headers,

    }
  )
    .then(response => response.json())
}