// Sound Utilities for Prophete Universal

import { getBusinessHoursStatus } from '../getBusinessHoursStatus';
import { speakWithElevenLabs, stopElevenLabsSpeech, ELEVENLABS_VOICES, normalizeTTSPhonetics, unlockElevenLabsAudioIOS } from './elevenlabs';

export const unlockAudioGlobal = () => {
  try {
    unlockElevenLabsAudioIOS();
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      const dummyCtx = new AudioCtx();
      dummyCtx.resume().then(() => dummyCtx.close()).catch(() => {});
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  } catch {
    // Gracefully bypass
  }
};

export const stopAllSpeech = () => {
  try {
    stopElevenLabsSpeech();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // bypass
  }
};

export const playRoomTransitionSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const now = ctx.currentTime;
    const freqs = [261.63, 392.00, 659.25, 783.99]; // C4, G4, E5, G5 harmonic triad
    
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      
      const startTime = now + idx * 0.05;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.1, startTime + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.85);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.9);
    });
  } catch {
    // Gracefully bypass if audio context is blocked by browser policies
  }
};

export const getMiamiTimeGreeting = (): string => {
  try {
    const miamiParts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }).formatToParts(new Date());

    let hour = 0;
    let minute = 0;
    for (const part of miamiParts) {
      if (part.type === 'hour') hour = parseInt(part.value, 10);
      if (part.type === 'minute') minute = parseInt(part.value, 10);
    }

    const totalMinutes = hour * 60 + minute;

    // 5:01 AM (301m) to 12:00 PM (720m) -> Good morning
    // 12:01 PM (721m) to 3:00 PM (900m) -> Good afternoon
    // 3:01 PM (901m) to 8:00 PM (1200m) -> Good evening
    // 8:01 PM to 5:00 AM (0 - 300m, 1201 - 1439m) -> Good night
    if (totalMinutes >= 301 && totalMinutes <= 720) {
      return 'Good morning!';
    } else if (totalMinutes >= 721 && totalMinutes <= 900) {
      return 'Good afternoon!';
    } else if (totalMinutes >= 901 && totalMinutes <= 1200) {
      return 'Good evening!';
    } else {
      return 'Good night!';
    }
  } catch {
    return 'Good day!';
  }
};

export const speakWelcomeMiamiTime = (): boolean => {
  try {
    const miamiTimeString = new Date().toLocaleTimeString('en-US', {
      timeZone: 'America/New_York',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const officeStatus = getBusinessHoursStatus();
    const timeGreeting = getMiamiTimeGreeting();
    
    const part1Text = `Welcome to Prophete Universal LLC, serving South Florida and the Tri-City, covering Dade, Broward, and Palm Beach county. <break time="1.0s" /> The time now is ${miamiTimeString}, E, S, T. <break time="1.0s" /> ${officeStatus}. <break time="1.0s" /> ${timeGreeting}`;

    // Attempt ElevenLabs TTS with Male Greeting Voice (Adam)
    speakWithElevenLabs(part1Text, ELEVENLABS_VOICES.MALE_GREETING).then((res) => {
      if (!res.success && 'speechSynthesis' in window) {
        // Fallback to browser Speech Synthesis with male voice preference if available
        window.speechSynthesis.resume();
        const utt = new SpeechSynthesisUtterance(normalizeTTSPhonetics(part1Text));
        utt.lang = 'en-US';
        utt.rate = 0.93;

        try {
          const voices = window.speechSynthesis.getVoices();
          const maleVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('David') || v.name.includes('Daniel') || v.name.includes('George') || v.name.includes('Male') || v.name.includes('Alex')));
          if (maleVoice) utt.voice = maleVoice;
        } catch {}

        utt.onstart = () => window.dispatchEvent(new CustomEvent('speech-start'));
        utt.onend = () => window.dispatchEvent(new CustomEvent('speech-end'));
        utt.onerror = () => window.dispatchEvent(new CustomEvent('speech-end'));
        window.speechSynthesis.speak(utt);
      }
    });

    return true;
  } catch {
    return false;
  }
};

export const speakRoomAnnouncement = (roomName: string): boolean => {
  try {
    speakWithElevenLabs(roomName).then((res) => {
      if (!res.success && 'speechSynthesis' in window) {
        window.speechSynthesis.resume();
        const utterance = new SpeechSynthesisUtterance(roomName);
        utterance.lang = 'en-US';
        utterance.rate = 1.0; 
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    });
    return true;
  } catch {
    return false;
  }
};
