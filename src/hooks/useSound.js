import { useState, useEffect, useCallback } from 'react';
import { soundEngine } from '../utils/soundEngine';

/**
 * Dependency Inversion hook for audio feedback.
 * Decouples presentation components from the raw SoundEngine Web Audio singleton.
 * Supports mocking, test environments, and centralized preference reactivity.
 */
export function useSound() {
  const [isSoundOn, setIsSoundOn] = useState(() => soundEngine.isEnabled());

  useEffect(() => {
    setIsSoundOn(soundEngine.isEnabled());
  }, []);

  const toggleSound = useCallback(() => {
    const nextState = soundEngine.toggle();
    setIsSoundOn(nextState);
    return nextState;
  }, []);

  const playClick = useCallback(() => {
    soundEngine.playClick();
  }, []);

  const playTabSwitch = useCallback(() => {
    soundEngine.playTabSwitch();
  }, []);

  const playSuccess = useCallback(() => {
    soundEngine.playSuccess();
  }, []);

  const playModalOpen = useCallback(() => {
    soundEngine.playModalOpen();
  }, []);

  const playWarp = useCallback(() => {
    soundEngine.playWarp();
  }, []);

  const playMeteor = useCallback(() => {
    soundEngine.playMeteor();
  }, []);

  const playSupernova = useCallback(() => {
    soundEngine.playSupernova();
  }, []);

  return {
    isSoundOn,
    toggleSound,
    playClick,
    playTabSwitch,
    playSuccess,
    playModalOpen,
    playWarp,
    playMeteor,
    playSupernova,
  };
}
