const useGoogleSignIn = () => {
  const url = `${import.meta.env.VITE_API_URL}/auth/google/authorize/`;
  window.location.href = url;
}

export default useGoogleSignIn;
