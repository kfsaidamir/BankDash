import React, { createContext, useContext, useState } from 'react';

// Создаем контекст для пользователя
const UserContext = createContext();

// Провайдер контекста пользователя
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Изначально пользователь не авторизован

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Хук для использования контекста пользователя
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
