// Device Fingerprinting Utility
export function generateDeviceFingerprint() {
  // Check if window object is available (i.e., we are in a browser environment)
  if (typeof window === 'undefined') {
    // If no window object, we are in a server-side environment, return a default or placeholder value
    return 'server-side-fingerprint';
  }

  const screenData = {
    width: window.screen.width,
    height: window.screen.height,
    colorDepth: window.screen.colorDepth,
    pixelRatio: window.devicePixelRatio,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };

  const navigatorData = {
    userAgent: navigator.userAgent,
    language: navigator.language || navigator.userLanguage,
    platform: navigator.platform,
    plugins: Array.from(navigator.plugins)
      .map((plugin) => plugin.name)
      .join(","),
    cookiesEnabled: navigator.cookieEnabled,
  };

  const localStorageData = {
    localStorage:
      typeof localStorage !== "undefined" && localStorage
        ? "Available"
        : "Not Available",
    sessionStorage:
      typeof sessionStorage !== "undefined" && sessionStorage
        ? "Available"
        : "Not Available",
  };

  // Combine all the data into a unique fingerprint string
  const fingerprintString = `${screenData.width}-${screenData.height}-${screenData.colorDepth}-${screenData.pixelRatio}-${screenData.timezone}-${navigatorData.userAgent}-${navigatorData.language}-${navigatorData.platform}-${navigatorData.plugins}-${navigatorData.cookiesEnabled}-${localStorageData.localStorage}-${localStorageData.sessionStorage}`;

  // Create a hash (you can use any hashing function or library like SHA256 for better uniqueness)
  return hashFingerprint(fingerprintString);
}

// Simple hash function using a basic hash method
function hashFingerprint(fingerprintString) {
  let hash = 0;
  for (let i = 0; i < fingerprintString.length; i++) {
    const character = fingerprintString.charCodeAt(i);
    hash = (hash << 5) - hash + character;
    hash |= 0; // Convert to 32-bit integer
  }
  return hash.toString(16); // Return the hash in hexadecimal format
}

