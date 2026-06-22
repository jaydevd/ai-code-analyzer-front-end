import { api } from "./../../../lib/axios";

const searchRepos = (query:string) => {
  console.log('searchRepos: query: ', query);

  const performSearch = async () => {
    console.log("performSearch - query: ", query);
    const response = await api.get(`/api/github/repos/search/?query=${query}`);
    const data = response.data.data
    return data;
  }

  return performSearch;
}

export default searchRepos;