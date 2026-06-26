import { installGithubApp } from "../api/installGithubApp";

const useInstallGithubApp = () =>{
  
  const install = async () => {
    try {

      const response = await installGithubApp();
      const url = response.data?.url || response.data?.data?.url;

      window.location.replace(url);

      return url;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return install;

}

export default useInstallGithubApp;
