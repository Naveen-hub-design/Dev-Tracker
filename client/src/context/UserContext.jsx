import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [githubUser, setGithubUser] = useState(() => {
    return localStorage.getItem('devtrack_github_user') || '';
  });
  const [leetcodeUser, setLeetcodeUser] = useState(() => {
    return localStorage.getItem('devtrack_leetcode_user') || '';
  });

  useEffect(() => {
    if (githubUser) {
      localStorage.setItem('devtrack_github_user', githubUser);
    } else {
      localStorage.removeItem('devtrack_github_user');
    }
  }, [githubUser]);

  useEffect(() => {
    if (leetcodeUser) {
      localStorage.setItem('devtrack_leetcode_user', leetcodeUser);
    } else {
      localStorage.removeItem('devtrack_leetcode_user');
    }
  }, [leetcodeUser]);

  return (
    <UserContext.Provider value={{ githubUser, setGithubUser, leetcodeUser, setLeetcodeUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
