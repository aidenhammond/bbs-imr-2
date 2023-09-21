// ArrayBuffer to Base64 encoding
function bufferToBase64(buffer: ArrayBuffer) {
    const byteArray = new Uint8Array(buffer);
    const byteString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
    return btoa(byteString);
  }

  export async function storeToken(token: string) {
    // Generate a random encryption key
    const key = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
  
    // Convert the token to a Uint8Array
    const tokenBytes = new TextEncoder().encode(token);
  
    // Generate a random IV
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
    // Encrypt the token using the encryption key and IV
    const encryptedBytes = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      tokenBytes
    );
  
    // Combine the IV and the encrypted bytes
    const combinedBytes = new Uint8Array(12 + encryptedBytes.byteLength);
    combinedBytes.set(iv);
    combinedBytes.set(new Uint8Array(encryptedBytes), 12);
  
    // Convert the combined bytes (IV + encrypted token) to a base64-encoded string
    const encryptedToken = bufferToBase64(combinedBytes);
  
    // Store the encrypted token in local storage
    localStorage.setItem("encryptedToken", encryptedToken);
  
    const keyJson = await window.crypto.subtle.exportKey("jwk", key);
  
    // Store the encryption key in session storage
    sessionStorage.setItem("encryptionKey", JSON.stringify(keyJson));
  }

  export async function retrieveToken() {
    // Get the encrypted token from local storage
    const encryptedToken = localStorage.getItem('encryptedToken');
  
    // Get the encryption key from session storage
    const encryptionKeyString = sessionStorage.getItem('encryptionKey');
  
    if (encryptedToken && encryptionKeyString) {
      const keyJson = JSON.parse(encryptionKeyString);
  
      // Import the key back into a CryptoKey object
      const key = await window.crypto.subtle.importKey(
        'jwk', // The format of the key
        keyJson, // The key in JSON format
        { name: 'AES-GCM' }, // The algorithm options
        false, // Whether the key is extractable
        ['decrypt'] // The allowed key usages
      );
  
      // Convert the encrypted token from Base64 to ArrayBuffer
      const encryptedBytes = base64ToBuffer(encryptedToken);
  
      // Get the original IV from the encrypted token
      const iv = encryptedBytes.slice(0, 12);
  
      // Decrypt the token using the encryption key and the original IV
      const decryptedBytes = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        encryptedBytes.slice(12) // Slice the encrypted bytes to exclude the IV
      );
  
      // Convert the decrypted bytes back to a string
      const token = new TextDecoder().decode(decryptedBytes);
      return token;
    } else {
      throw new Error('Token or encryption key not found');
    }
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
