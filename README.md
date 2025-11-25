# Gateman JS

Official JavaScript SDK for Gateman SSO.

## Installation

```bash
npm install @gateman/js
```

## Quick Start

```javascript
import { GatemanSSO } from '@gateman/js';

const gateman = new GatemanSSO({
  appID: 'your-app-id'
});

async function handleLogin() {
  try {
    const result = await gateman.login();
    const { accessToken, encryptedData, refreshToken } = result.payload;
    
    console.log('Access Token:', accessToken);
  } catch (error) {
    console.error('Login failed:', error);
  }
}

document.getElementById('login-btn').addEventListener('click', handleLogin);
```

## Examples

### HTML

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <button id="login-btn">Login</button>

  <script type="module">
    import { GatemanSSO } from '@gateman/js';

    const gateman = new GatemanSSO({
      appID: 'your-app-id'
    });

    document.getElementById('login-btn').addEventListener('click', async () => {
      try {
        const result = await gateman.login();
        const { accessToken, encryptedData, refreshToken } = result.payload;
        
        console.log('Access Token:', accessToken);
      } catch (error) {
        console.error('Login failed:', error);
      }
    });
  </script>
</body>
</html>
```

### React

```jsx
import { GatemanSSO } from '@gateman/js';

const gateman = new GatemanSSO({
  appID: 'your-app-id'
});

function App() {
  async function handleLogin() {
    try {
      const result = await gateman.login();
      const { accessToken, encryptedData, refreshToken } = result.payload;
      
      console.log('Access Token:', accessToken);
    } catch (error) {
      console.error('Login failed:', error);
    }
  }

  return <button onClick={handleLogin}>Login</button>;
}

export default App;
```

## API Reference

### `GatemanSSO`

#### Constructor

```javascript
new GatemanSSO(config)
```

**Parameters:**
- `config.appID` (string, required) - Your Gateman application ID

#### Methods

##### `login()`

Opens authentication popup and returns tokens.

```javascript
const result = await gateman.login();
```

**Returns:**
```javascript
{
  payload: {
    accessToken: string,
    encryptedData: string,
    refreshToken: string
  }
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11.1+
- Edge 79+

## License

MIT
