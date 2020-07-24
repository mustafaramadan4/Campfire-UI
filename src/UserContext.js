import React from 'react';

const UserContext = React.createContext({
  // temporarily setting the default value to true to avoid any sign-in access issues
  signedIn: true,
});

export default UserContext;
