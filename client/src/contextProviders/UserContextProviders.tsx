import React, {createContext} from 'react';
import { gql, useQuery } from '@apollo/client';

const USER = gql`
  query GetActualUser {
    actualUser {
      id,
    }
  }
`;

interface UserContextType {
  user: any,
  refetchUser?: () => void,
  error?: any
}

export const UserContext = createContext<UserContextType>({user:{}});

const UserContextProvider = ({children}:any) => {
  const { data, error, refetch } = useQuery(USER);
  
  const userContext = {
    user: data?.actualUser,
    error,
    refetchUser: refetch
  }

  return <UserContext.Provider value={userContext}>{children}</UserContext.Provider>;
};

export default UserContextProvider