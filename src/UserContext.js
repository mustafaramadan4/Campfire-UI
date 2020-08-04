import React from 'react';

const UserContext = React.createContext({
  signedIn: false,
  email: '',
});

export default UserContext;
