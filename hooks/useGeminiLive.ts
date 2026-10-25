import { useEffect, useRef, useState, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';
import { createBlob, decode, decodeAudioData } from '../services/audioUtils';
import { Page } from '../types';
import { PAGE_CONTENT, TAX_INFO_2026 } from '../constants';

const API_KEY = process.env.API_KEY || '';

interface UseGeminiLiveProps {
  onPageChange: (page: Page) => void;
  currentPage: Page;
  onScrollToSection: (sectionId: string) => void;
}


export const useGeminiLive = ({ onPageChange, currentPage, onScrollToSection }: UseGeminiLiveProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for audio and session management
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  // Timeout ref for 20-second auto-disconnect on no response
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      console.log("No response for 20 seconds. Pandora auto-disconnecting...");
      disconnect();
    }, 20000);
  }, []);

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  // Tool Declarations
  const navigateTool: FunctionDeclaration = {
    name: 'navigateToPage',
    description: 'Navigates the user to a specific page on the website (e.g., HOME, ABOUT_US, LIFE_INSURANCE, TAX_SERVICES, APPLICATIONS, CONTACT).',
    parameters: {
      type: Type.OBJECT,
      properties: {
        pageName: {
          type: Type.STRING,
          description: 'The page to navigate to.',
          enum: Object.values(Page)
        }
      },
      required: ['pageName']
    }
  };

  const scrollTool: FunctionDeclaration = {
    name: 'scrollToSection',
    description: 'Scrolls to a specific section on the current page (useful for tours on the Home page).',
    parameters: {
      type: Type.OBJECT,
      properties: {
        sectionId: {
          type: Type.STRING,
          description: 'The ID of the section to scroll to.',
          enum: ['services', 'mission', 'life-insurance', 'tax-services']
        }
      },
      required: ['sectionId']
    }
  };

  const connect = async () => {
    if (!API_KEY) {
      setError("API Key not found");
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      
      // Setup Audio
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const outputNode = outputAudioContextRef.current.createGain();
      outputNode.connect(outputAudioContextRef.current.destination);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } // Kore is a female voice
          },
          tools: [{ functionDeclarations: [navigateTool, scrollTool] }],
          systemInstruction: `You are Pandora, the official Executive Receptionist, Site Showcase Guide, and AI Assistant for Prophete Universal LLC.

          Your Persona:
          - Name: Pandora.
          - Tone: Warm, poised, unhurried, highly professional female executive receptionist and hostess.
          - Leadership & Ethos: Prophete Universal LLC was established by Rolin Prophete with the mission: "Protecting Family Wealth, Health and Property. And creating an environment of Security Assurance."

          Capabilities:
          - You can navigate the visitor across the website synchronized with your showcase by calling 'navigateToPage' with page names:
            'HOME', 'ABOUT_US', 'LIFE_INSURANCE', 'TAX_SERVICES', 'AUTO_INSURANCE', 'HOME_INSURANCE', 'APPLICATIONS', 'CLIENT_WISHLIST', 'GAME_ROOM', 'CONTACT', 'SCHEDULE_CALL'.

          Synchronized 9-Room Site Showcase Sequence:
          1. Call navigateToPage('HOME'): Welcome the visitor to Prophete Universal! Share core ethos: "Protecting Your Family, Your Property, and Preserving Your Health and Wealth."
          2. Call navigateToPage('ABOUT_US'): Highlight Executive Director Rolin Prophete, his leadership, integrity, and year-round family commitment.
          3. Call navigateToPage('LIFE_INSURANCE'): Explain Living Benefits, receiving cash payouts while alive if diagnosed with critical, chronic, or terminal illnesses, plus IUL and annuities.
          4. Call navigateToPage('TAX_SERVICES'): Explain maximum tax refunds with zero long waiting lines, 2026 Corporate Transparency Act BOI filings, and IRS electronic mandates.
          5. Call navigateToPage('HOME_INSURANCE'): Asset Protection, Home, Condo, Florida Flood, Renter, and Auto insurance across top national carriers.
          6. Call navigateToPage('APPLICATIONS'): Application Forms Portal, guide visitors through New Client Tax Intake, Insurance Applications, and Call Back Requests.
          7. Call navigateToPage('CLIENT_WISHLIST'): Client Wishlist Room, explain how client goals, aspirations, and custom service requests go directly to Rolin Prophete and leadership.
          8. Call navigateToPage('GAME_ROOM'): Waiting Lobby & Retro Arcade, invite visitors to relax, play classic arcade games, and unwind while waiting for Mr. Prophete or after submitting forms.
          9. Call navigateToPage('CONTACT'): Receptionist Wrap-Up, Thank visitors warmly, give phone (786-877-7635) and Miami address (11996 N. Miami Ave), ask if they want to leave a message, schedule with Rolin, or fill out a form. Remind them: "Health is Wealth!"

          Inactivity & Interruption Rules:
          - Always remain polite, articulate, and welcoming.
          - CRITICAL: If the visitor interrupts or speaks while you are talking, STOP talking immediately.
          - If there is 20 seconds of silence without user response, automatically disconnect.
          - If you ever don't know an answer, say: "Thanks for visiting Prophete Universal. Remember, Health is Wealth. Goodbye!"`,
        },
        callbacks: {
          onopen: () => {
            console.log("Gemini Live Connected");
            setIsActive(true);
            resetInactivityTimer();
            
            // Setup input stream
            if (!inputAudioContextRef.current || !streamRef.current) return;
            const source = inputAudioContextRef.current.createMediaStreamSource(streamRef.current);
            const processor = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const blob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: blob }));
            };

            source.connect(processor);
            processor.connect(inputAudioContextRef.current.destination);

            // Trigger Greeting
            sessionPromise.then(session => session.sendRealtimeInput({
                text: `The user has just connected to the website. Please say exactly this greeting and do not add or omit anything: "Welcome to Prophete Universal tax and insurance services. I am Pandora, your tour guide. Would you like me to show you around our rooms and introduce Executive Director Rolin Prophete?"`
            }));
          },
          onmessage: async (msg: LiveServerMessage) => {
            resetInactivityTimer();

            // Handle Tool Calls
            if (msg.toolCall) {
              for (const fc of msg.toolCall.functionCalls) {
                if (fc.name === 'navigateToPage') {
                   const targetPage = fc.args['pageName'] as Page;
                   onPageChange(targetPage);
                   sessionPromise.then(session => session.sendToolResponse({
                     functionResponses: { id: fc.id, name: fc.name, response: { result: "Navigated" } }
                   }));
                } else if (fc.name === 'scrollToSection') {
                   const sectionId = fc.args['sectionId'] as string;
                   onScrollToSection(sectionId);
                   sessionPromise.then(session => session.sendToolResponse({
                     functionResponses: { id: fc.id, name: fc.name, response: { result: "Scrolled" } }
                   }));
                }
              }
            }

            // Handle Audio Output
            const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              setIsSpeaking(true);
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) {
                  setIsSpeaking(false);
                  resetInactivityTimer();
                }
              });

              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onclose: () => {
            clearInactivityTimer();
            setIsActive(false);
            setIsSpeaking(false);
          },
          onerror: (err) => {
            console.error("Gemini Error", err);
            clearInactivityTimer();
            setError(err.message || "Connection error");
            setIsActive(false);
          }
        }
      });
      
      sessionPromiseRef.current = sessionPromise;

    } catch (e) {
      console.error(e);
      clearInactivityTimer();
      setError("Failed to start session");
    }
  };

  const disconnect = () => {
    clearInactivityTimer();
    if (sessionPromiseRef.current) {
        sessionPromiseRef.current.then(session => session.close());
    }
    
    streamRef.current?.getTracks().forEach(t => t.stop());
    inputAudioContextRef.current?.close();
    outputAudioContextRef.current?.close();
    
    setIsActive(false);
    setIsSpeaking(false);
  };

  const sendPageContext = (page: Page) => {
    if (!isActive || !sessionPromiseRef.current) return;
    
    const content = PAGE_CONTENT[page];
    const prompt = `System Update: User is now on the ${content.title} page.
    Details: ${content.details}`;

    sessionPromiseRef.current.then(session => {
        session.sendRealtimeInput({
            text: prompt
        });
    });
  };

  return { connect, disconnect, isActive, isSpeaking, sendPageContext, error };
};