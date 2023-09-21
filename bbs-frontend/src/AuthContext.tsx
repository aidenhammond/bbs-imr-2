import React, { createContext, useState, useContext, useEffect } from 'react';
import { retrieveToken, storeToken } from './components/Security';
const backend_url = `http://localhost:8000`;

interface AuthState {
  isLoggedIn: boolean;
  role_id: number;
  setRoleId: (id: number) => void;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState>({
  isLoggedIn: false,
  role_id: 1,
  setRoleId: ()=>{},
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role_id, setRoleId] = useState(1);

  useEffect(() => {
    async function attemptLogin() {
      autoLogin();
      // Check for an existing token and update the state accordingly
      try{
        const token = await retrieveToken();
        setIsLoggedIn(!!token);
      }
      catch (error: any) {
        setIsLoggedIn(false);
      }
    }
    attemptLogin();
  }, []);

  const login = async (token: string) => {
    storeToken(token);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      const token = await retrieveToken();
      sessionStorage.removeItem('encryptionKey');
      localStorage.removeItem('encryptedToken');
      setRoleId(1);
      setIsLoggedIn(false);
      if (!token) return;
      const response = await fetch("http://localhost:8000/user/token", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            'Authorization': token,
        },
      });
    }
    catch(err){
      console.log("Logout failed. " + err)
    }
    
  };

  async function autoLoginUser(token: string) {
    const response = await fetch(`${backend_url}/auto-login`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        'credentials': 'include',
        'Authorization': token,
      }
    });
    if (response.ok) {
      // Handle successful login
      storeToken(token);
      login(token);
      let json = await response.json();
      if (json.role_id) {
        setRoleId(json.role_id);
      }
      else {
        console.log("No role id. " + json);
        console.log("Status: " + response.status)
      }
    } else {
      console.log("Auto login failed");
      console.log(await response.json())
      // TODO: Handle failed login
    }
  }

  async function autoLogin() {
    const token = localStorage.getItem("encryptedToken");
  
    if (token) {
      const keyJson = sessionStorage.getItem("encryptionKey");
      const key = keyJson ? JSON.parse(keyJson) : null;
      //console.log('Key JSON:', keyJson); // Add this line to debug the key JSON
      if (key) {
        try {
          const cryptoKey = await importEncryptionKey(key);
          //console.log(cryptoKey)
          const decryptedToken = await decryptToken(cryptoKey, token);
          console.log("waiting fetch from autologinuser")
          //console.log(decryptedToken)
          await autoLoginUser(decryptedToken);
        } catch (err: any) {
          console.error("Auto login error:", err, err.message);
          // TODO: Handle login error
        }
      }
    } else {
      console.log("no token! :-)");
    }
  }

  async function importEncryptionKey(key: JsonWebKey) {
    return await window.crypto.subtle.importKey(
      "jwk",
      key,
      { name: "AES-GCM" },
      false,
      ["decrypt"]
    );
  }
  
  async function decryptToken(cryptoKey: CryptoKey, token: string) {
    const encryptedBytes = base64ToBuffer(token);
    const decryptedBytes = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: encryptedBytes.slice(0, 12),
      },
      cryptoKey,
      encryptedBytes.slice(12)
    );
    return new TextDecoder().decode(decryptedBytes);
  }
  
  
  
  
  // Base64 to ArrayBuffer decoding
  function base64ToBuffer(base64: string) {
    const byteString = atob(base64);
    const byteArray = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteArray[i] = byteString.charCodeAt(i);
    }
    return byteArray.buffer;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, role_id, setRoleId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);