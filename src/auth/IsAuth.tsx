const IsAuth = () => {
  const token = localStorage.getItem("token");
  
  //  If token is not present, user is not authenticated
  if (!token) {
    return false;
  }

  // check if the token is expired
  const tokenData = JSON.parse(atob(token.split(".")[1]));
  const currentTime = Math.floor(Date.now() / 1000);
  
  if (tokenData.exp < currentTime) {
    // Token is expired, remove it from localStorage
    localStorage.removeItem("token");
    return false;
  }

  return true;
}
