// Hardcoded behavior data for each user (for simplicity)
const hardcodedUserBehavior = {
    "nnaveed.bese21seecs@seecs.edu.pk": {
      emailTypingSpeed: 300, // Average time per keystroke in milliseconds
      passwordTypingSpeed: 400,
      mouseMovePatterns: 5 // Number of mouse movements during login
    },
    "hmehdi.bese21seecs@seecs.edu.pk": {
      emailTypingSpeed: 250,
      passwordTypingSpeed: 350,
      mouseMovePatterns: 6
    }
  };
  
  export const validateBehavioralData = (user, behaviorData) => {
    const { mouseMoveData, typingData } = behaviorData;
  
    // Compare the current mouse and typing data with the user's stored behavior
    // For simplicity, we're using the hardcoded values for now
  
    const typingSpeedMatches = checkTypingSpeed(user.email, typingData);
    const mouseMovementMatches = checkMouseMovement(user.email, mouseMoveData);
  
    return typingSpeedMatches && mouseMovementMatches;
  };
  
  // Compare typing speed (hardcoded values based on email and password typing times)
  const checkTypingSpeed = (email, typingData) => {
    const userBehavior = hardcodedUserBehavior[email];
  
    if (!userBehavior) {
      // No behavior data available for this user
      return false;
    }
  
    const emailTypingSpeed = calculateTypingSpeed(typingData.email);
    const passwordTypingSpeed = calculateTypingSpeed(typingData.password);
  
    return (
      emailTypingSpeed === userBehavior.emailTypingSpeed &&
      passwordTypingSpeed === userBehavior.passwordTypingSpeed
    );
  };
  
  // Compare mouse movements (hardcoded number of movements)
  const checkMouseMovement = (email, mouseMoveData) => {
    const userBehavior = hardcodedUserBehavior[email];
  
    if (!userBehavior) {
      // No behavior data available for this user
      return false;
    }
  
    // For simplicity, we check if the number of movements matches
    return mouseMoveData.length === userBehavior.mouseMovePatterns;
  };
  
  // Calculate typing speed based on keystroke timestamps
  const calculateTypingSpeed = (keystrokes) => {
    if (!keystrokes || keystrokes.length < 2) {
      return 0; // Invalid or insufficient data
    }
  
    let totalTime = 0;
    for (let i = 1; i < keystrokes.length; i++) {
      totalTime += keystrokes[i].timestamp - keystrokes[i - 1].timestamp;
    }
    return totalTime / keystrokes.length; // Return average time per keystroke
  };
  