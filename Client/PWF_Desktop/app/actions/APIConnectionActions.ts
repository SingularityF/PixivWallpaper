export function updateAPIURL(APIURL: string) {
  return {
    type: 'API_LOADED',
    data: APIURL
  };
}
