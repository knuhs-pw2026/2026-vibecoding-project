/**
 * Study SoundGuard - Adaptive Volume Controller
 * Real-time dynamic noise masking algorithm with Attack/Release smoothing,
 * ear safety limiter, frequency-adaptive response, and acoustic feedback protection.
 */

class AdaptiveController {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;

    // Core Adaptive Parameters
    this.isEnabled = true;               // Adaptive mode on/off
    this.thresholdDb = 48.0;             // Ambient noise baseline threshold (dB SPL)
    this.baseVolume = 0.20;              // Minimum resting volume (0.05 to 0.50)
    this.maxVolume = 0.80;               // Ear-protection maximum volume clamp (0.50 to 1.0)
    this.sensitivity = 1.6;              // Gain escalation factor (0.5x to 3.0x)

    // Dynamic Filtering Constants (in seconds)
    this.attackTime = 0.18;              // Rapid response to mask sudden loud bursts (~180ms)
    this.releaseTime = 2.4;              // Smooth decay back to base volume (~2.4s)
    this.hysteresisDb = 1.2;             // Jitter prevention deadband (dB)

    // State Variables
    this.currentOutputVolume = this.baseVolume;
    this.targetVolume = this.baseVolume;
    this.lastProcessedTime = performance.now();
    this.frequencyAdaptive = true;       // Frequency-weighted masking response
    this.headphoneMode = true;           // True: Headphone, False: Laptop Speakers

    // Stats for UI
    this.lastDb = 35.0;
    this.dbDelta = 0.0;
    this.isMaskingActive = false;
  }

  /**
   * Updates configuration settings
   */
  updateConfig(config = {}) {
    if (config.thresholdDb !== undefined) this.thresholdDb = parseFloat(config.thresholdDb);
    if (config.baseVolume !== undefined) this.baseVolume = parseFloat(config.baseVolume);
    if (config.maxVolume !== undefined) this.maxVolume = parseFloat(config.maxVolume);
    if (config.sensitivity !== undefined) this.sensitivity = parseFloat(config.sensitivity);
    if (config.attackTime !== undefined) this.attackTime = parseFloat(config.attackTime);
    if (config.releaseTime !== undefined) this.releaseTime = parseFloat(config.releaseTime);
    if (config.frequencyAdaptive !== undefined) this.frequencyAdaptive = !!config.frequencyAdaptive;
    if (config.headphoneMode !== undefined) {
      this.headphoneMode = !!config.headphoneMode;
      if (this.audioEngine) {
        this.audioEngine.speakerMode = !this.headphoneMode;
      }
    }
    if (config.isEnabled !== undefined) this.isEnabled = !!config.isEnabled;
  }

  /**
   * Main DSP update loop tick called every animation frame / audio cycle
   */
  process(measuredDb, bands = { low: 0, mid: 0, high: 0 }) {
    const now = performance.now();
    const dt = Math.max(0.001, (now - this.lastProcessedTime) / 1000); // delta time in seconds
    this.lastProcessedTime = now;
    this.lastDb = measuredDb;

    // If adaptive mode is disabled or audio is not playing, hold base volume
    if (!this.isEnabled || !this.audioEngine.isPlaying) {
      this.targetVolume = this.baseVolume;
      this.currentOutputVolume = this.baseVolume;
      this.isMaskingActive = false;
      this.dbDelta = 0;
      if (this.audioEngine.isPlaying) {
        this.audioEngine.setMaskingVolume(this.baseVolume, 0.1);
      }
      return {
        outputVolume: this.currentOutputVolume,
        targetVolume: this.targetVolume,
        isMaskingActive: false,
        dbDelta: 0
      };
    }

    // Calculate decibel excess above user threshold
    const effectiveThreshold = this.thresholdDb;
    const dbExcess = measuredDb - effectiveThreshold;

    if (dbExcess > this.hysteresisDb) {
      // Noise exceeds threshold: calculate masking escalation
      // Masking formula: Boost volume proportionally to the excess dB and sensitivity
      // e.g. +10dB excess with sensitivity 1.5 -> +15% volume increase
      let dbFactor = (dbExcess / 30.0) * (this.sensitivity * 0.45);

      // Frequency adaptive weighting
      if (this.frequencyAdaptive) {
        // High frequency sharp sounds (clicking, whispering) require higher masking volume
        const highWeight = (bands.high / 100) * 0.15;
        const midWeight = (bands.mid / 100) * 0.10;
        dbFactor += highWeight + midWeight;
      }

      const calculatedTarget = this.baseVolume + dbFactor;

      // Clamp within safe user boundaries
      this.targetVolume = Math.min(this.maxVolume, Math.max(this.baseVolume, calculatedTarget));
      this.isMaskingActive = true;
      this.dbDelta = Math.round(dbExcess * 10) / 10;
    } else {
      // Ambient noise is quiet or below threshold
      this.targetVolume = this.baseVolume;
      this.isMaskingActive = false;
      this.dbDelta = 0;
    }

    // Apply Asymmetric Attack / Release Filter
    // Attack: quick volume rise when target > current
    // Release: gentle volume decay when target <= current
    let timeConstant;
    if (this.targetVolume > this.currentOutputVolume) {
      timeConstant = this.attackTime;
    } else {
      timeConstant = this.releaseTime;
    }

    // Exponential smoothing: alpha = 1 - e^(-dt / tau)
    const alpha = 1.0 - Math.exp(-dt / timeConstant);
    this.currentOutputVolume += alpha * (this.targetVolume - this.currentOutputVolume);

    // Hard safety clamp
    this.currentOutputVolume = Math.min(this.maxVolume, Math.max(this.baseVolume, this.currentOutputVolume));

    // Send updated volume to the Web Audio Master Gain
    this.audioEngine.setMaskingVolume(this.currentOutputVolume, 0.05);

    return {
      outputVolume: Math.round(this.currentOutputVolume * 100) / 100,
      targetVolume: Math.round(this.targetVolume * 100) / 100,
      isMaskingActive: this.isMaskingActive,
      dbDelta: this.dbDelta
    };
  }

  /**
   * Resets adaptive state
   */
  reset() {
    this.currentOutputVolume = this.baseVolume;
    this.targetVolume = this.baseVolume;
    this.isMaskingActive = false;
    this.dbDelta = 0;
  }
}

// Export class
window.AdaptiveController = AdaptiveController;
