import { sdk } from '@farcaster/miniapp-sdk';

/**
 * Detects if the app is running in Farcaster vs Base
 * @returns true if running in Farcaster, false if Base or standalone
 */
export const isFarcaster = (): boolean => {
  try {
    // Check if Farcaster SDK context is available
    // In Farcaster, sdk.context will have Farcaster-specific properties
    if (typeof window !== 'undefined') {
      // Check for Farcaster-specific window properties
      if ((window as any).farcaster || (window as any).__FARCASTER__) {
        return true;
      }
      
      // Check user agent for Farcaster
      const ua = navigator.userAgent.toLowerCase();
      if (ua.includes('farcaster') || ua.includes('warpcast')) {
        return true;
      }
      
      // Try to access SDK context (may throw if not in Farcaster)
      try {
        // Check if SDK is available and has context
        if (sdk && typeof sdk.context !== 'undefined') {
          const context = sdk.context;
          // If context exists and has Farcaster-specific properties
          if (context && typeof context === 'object' && 'fid' in context) {
            return true;
          }
        }
      } catch {
        // SDK context not available, likely not in Farcaster
        return false;
      }
    }
    return false;
  } catch {
    return false;
  }
};

/**
 * Gets the current environment name
 */
export const getEnvironment = (): 'farcaster' | 'base' | 'standalone' => {
  if (isFarcaster()) {
    return 'farcaster';
  }
  
  // Check if in Base app
  if (typeof window !== 'undefined') {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('base') || (window as any).base) {
      return 'base';
    }
  }
  
  return 'standalone';
};

