// Kelly Identity Setup Script
// Run this in browser console to ensure MAIA recognizes Kelly properly

console.log('🌟 Setting up Kelly Nezat identity for MAIA recognition...');

// Set Kelly's identity data
localStorage.setItem('explorerName', 'Kelly Nezat');
localStorage.setItem('explorerId', 'kelly-nezat');
localStorage.setItem('betaOnboardingComplete', 'true');
localStorage.setItem('kelly-session', 'active');
localStorage.setItem('founder-session', 'kelly-nezat');

// Create proper beta_user data structure
const kellyUserData = {
  id: 'kelly-nezat',
  username: 'Kelly Nezat',
  name: 'Kelly Nezat',
  displayName: 'Kelly Nezat',
  onboarded: true,
  isFounder: true,
  role: 'founder'
};

localStorage.setItem('beta_user', JSON.stringify(kellyUserData));

console.log('✅ Kelly Nezat identity configured successfully!');
console.log('🔄 Please refresh the page to activate the changes.');
console.log('📞 MAIA will now recognize you as Kelly in voice conversations.');

// Show current localStorage data for verification
console.log('\n🔍 Current identity data:');
console.log('Explorer Name:', localStorage.getItem('explorerName'));
console.log('Explorer ID:', localStorage.getItem('explorerId'));
console.log('Beta User:', localStorage.getItem('beta_user'));