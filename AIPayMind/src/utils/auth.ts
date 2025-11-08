export const isAuthenticated = (): boolean => {
  const user = localStorage.getItem('paymind_user');
  return !!user;
};
