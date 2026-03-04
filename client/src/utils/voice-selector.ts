/**
 * Voice Selector Utility
 * Ensures consistent female Brazilian Portuguese voice selection across the app
 */

export function getBrazilianFemaleVoice(): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) {
    return null;
  }

  const voices = speechSynthesis.getVoices();
  
  // Priority 1: Explicitly pt-BR female voices
  const ptBrFemale = voices.find(voice => 
    voice.lang === 'pt-BR' && 
    (voice.name.toLowerCase().includes('female') || 
     voice.name.toLowerCase().includes('feminino') ||
     voice.name.toLowerCase().includes('luciana') ||
     voice.name.toLowerCase().includes('francisca'))
  );
  
  if (ptBrFemale) {
    console.log('Selected Brazilian female voice:', ptBrFemale.name);
    return ptBrFemale;
  }

  // Priority 2: Any pt-BR voice (usually defaults to female in most systems)
  const ptBr = voices.find(voice => voice.lang === 'pt-BR');
  if (ptBr) {
    console.log('Selected Brazilian Portuguese voice:', ptBr.name);
    return ptBr;
  }

  // Priority 3: Any Portuguese female voice
  const ptFemale = voices.find(voice => 
    (voice.lang.startsWith('pt') || voice.lang.includes('pt')) &&
    (voice.name.toLowerCase().includes('female') || 
     voice.name.toLowerCase().includes('feminino'))
  );
  
  if (ptFemale) {
    console.log('Selected Portuguese female voice:', ptFemale.name);
    return ptFemale;
  }

  // Priority 4: Any Portuguese voice as last resort
  const pt = voices.find(voice => 
    voice.lang.startsWith('pt') || voice.lang.includes('pt')
  );
  
  if (pt) {
    console.log('Selected Portuguese voice (fallback):', pt.name);
    return pt;
  }

  console.warn('No Portuguese voice found, using default');
  return null;
}

/**
 * Gets a female voice for the specified language/region
 */
function getFemaleVoice(langCode: string): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) {
    return null;
  }

  const voices = speechSynthesis.getVoices();
  
  // Try to find explicitly female voice for the language
  const femaleVoice = voices.find(voice => 
    voice.lang === langCode && 
    (voice.name.toLowerCase().includes('female') || 
     voice.name.toLowerCase().includes('feminino') ||
     voice.name.toLowerCase().includes('woman') ||
     voice.name.toLowerCase().includes('mujer'))
  );
  
  if (femaleVoice) {
    console.log(`Selected ${langCode} female voice:`, femaleVoice.name);
    return femaleVoice;
  }

  // Fallback to any voice for that language
  const anyVoice = voices.find(voice => voice.lang === langCode || voice.lang.startsWith(langCode.split('-')[0]));
  if (anyVoice) {
    console.log(`Selected ${langCode} voice (fallback):`, anyVoice.name);
    return anyVoice;
  }

  return null;
}

/**
 * Creates a properly configured speech utterance for Brazilian Portuguese
 */
export function createBrazilianSpeech(text: string): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR'; // Always Brazilian Portuguese
  utterance.rate = 0.8; // Slightly slower for clarity
  utterance.volume = 0.9;
  utterance.pitch = 1.1; // Slightly higher pitch for more feminine tone
  
  const voice = getBrazilianFemaleVoice();
  if (voice) {
    utterance.voice = voice;
  }
  
  return utterance;
}

/**
 * Creates a properly configured speech utterance for any language
 * Always tries to use female voice when available
 */
export function createSpeech(text: string, language: 'pt' | 'en' | 'es'): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.8; // Slightly slower for clarity
  utterance.volume = 0.9;
  utterance.pitch = 1.1; // Slightly higher pitch for more feminine tone
  
  // Set language and get appropriate female voice
  let langCode: string;
  let voice: SpeechSynthesisVoice | null;
  
  switch(language) {
    case 'pt':
      langCode = 'pt-BR';
      voice = getBrazilianFemaleVoice(); // Use specialized Brazilian selector
      break;
    case 'en':
      langCode = 'en-US';
      voice = getFemaleVoice('en-US');
      break;
    case 'es':
      langCode = 'es-ES';
      voice = getFemaleVoice('es-ES');
      break;
    default:
      langCode = 'pt-BR';
      voice = getBrazilianFemaleVoice();
  }
  
  utterance.lang = langCode;
  if (voice) {
    utterance.voice = voice;
  }
  
  return utterance;
}

/**
 * Debug function to list all available voices
 * Useful for troubleshooting on different devices
 */
export function listAvailableVoices(): void {
  if (!('speechSynthesis' in window)) {
    console.log('Speech synthesis not supported');
    return;
  }

  const voices = speechSynthesis.getVoices();
  console.log('=== Available Voices ===');
  voices.forEach((voice, index) => {
    console.log(`${index + 1}. ${voice.name} (${voice.lang}) ${voice.default ? '[DEFAULT]' : ''}`);
  });
  console.log('========================');
}
