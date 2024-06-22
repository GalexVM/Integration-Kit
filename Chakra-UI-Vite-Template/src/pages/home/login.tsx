import React, { useState, useEffect } from 'react';
import { web3Enable, web3Accounts } from '@polkadot/extension-dapp';
import crypto from 'crypto-browserify';
import { UploadCertificateReact } from './loader';
const Login: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [account, setAccount] = useState<string | null>(null);
  const [fileHash, setFileHash] = useState<string | null>(null);

  useEffect(() => {
    const connectToPolkadot = async () => {
      const extensions = await web3Enable('My React App');
      if (extensions.length === 0) {
        console.log('No extension found');
        return;
      }
      const accounts = await web3Accounts();
      if (accounts.length > 0) {
        setAccount(accounts[0].address);
        setIsLoggedIn(true);
      }
    };

    connectToPolkadot();
  }, []);

  const handleLogin = async () => {
    const accounts = await web3Accounts();
    if (accounts.length > 0) {
      setAccount(accounts[0].address);
      setIsLoggedIn(true);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const data = e.target?.result as ArrayBuffer;
        const hash = crypto.createHash('sha256');
        hash.update(new Uint8Array(data));
        const hashString = hash.digest('hex');
        setFileHash(hashString);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleLoader = () => {
    return (
      <div>
        <UploadCertificateReact />
      </div>
    );
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
    fontFamily: 'Arial, sans-serif'
  };

  const cardStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '300px'
  };

  const buttonStyle = {
    backgroundColor: '#4CAF50', // Green
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    textAlign: 'center' as 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '10px 0',
    cursor: 'pointer',
    borderRadius: '5px'
  };

  const inputStyle = {
    margin: '20px 0',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc'
  };

  return (
    <div style={containerStyle}>
      {isLoggedIn ? (
        <div style={cardStyle}>
          <h2>Welcome</h2>
          <p>Your account address is:</p>
          <p><strong>{account}</strong></p>
          <input type="file" onChange={handleFileUpload} style={inputStyle} />
          {fileHash && (
            <div>
              <h3>File Hash:</h3>
              <p>{fileHash}</p>
            </div>
          )}
          <div>
            <button onClick={handleLoader} style={buttonStyle}>Enviar archivo</button>
          </div>
        </div>
      ) : (
        <div style={cardStyle}>
          <h2>Login</h2>
          <button onClick={handleLogin} style={buttonStyle}>
            Login with Polkadot.js
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
