// Sound Effects System for Executive Skills Assessment
class SoundManager {
    constructor() {
        this.sounds = {};
        this.volume = 0.3;
        this.enabled = true;
        this.baseUrl = 'https://www.soundjay.com/misc/sounds/'; // Fallback - we'll create our own
        
        // Initialize audio context for better browser support
        this.audioContext = null;
        this.initAudioContext();
        
        // Load sound effects
        this.loadSounds();
        
        // Add sound toggle control
        this.createSoundToggle();
    }

    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }

    // Create synthetic sound effects using Web Audio API
    createSound(type, frequency = 440, duration = 0.2) {
        if (!this.audioContext || !this.enabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        
        switch(type) {
            case 'click':
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                break;
                
            case 'progress':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                break;
                
            case 'complete':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime); // C
                oscillator.frequency.setValueAtTime(659, this.audioContext.currentTime + 0.1); // E
                oscillator.frequency.setValueAtTime(784, this.audioContext.currentTime + 0.2); // G
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                duration = 0.6;
                break;
                
            case 'milestone':
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.3);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
                duration = 0.5;
                break;
                
            case 'whoosh':
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                duration = 0.4;
                break;
                
            case 'success':
                // Play a happy chord progression
                this.playChord([523, 659, 784], 0.6); // C major chord
                return;
        }
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playChord(frequencies, duration = 0.5) {
        if (!this.audioContext || !this.enabled) return;
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(this.volume * 0.5, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + duration);
            }, index * 100);
        });
    }

    loadSounds() {
        // For now, we'll use synthetic sounds, but this could be extended to load actual audio files
        this.sounds = {
            click: () => this.createSound('click'),
            progress: () => this.createSound('progress'),
            complete: () => this.createSound('complete'),
            milestone: () => this.createSound('milestone'),
            whoosh: () => this.createSound('whoosh'),
            success: () => this.createSound('success')
        };
    }

    play(soundName) {
        if (this.enabled && this.sounds[soundName]) {
            // Resume audio context if it's suspended (browser requirement)
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
            this.sounds[soundName]();
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    toggle() {
        this.enabled = !this.enabled;
        this.updateSoundToggle();
        
        // Play a test sound when enabling
        if (this.enabled) {
            setTimeout(() => this.play('click'), 100);
        }
    }

    createSoundToggle() {
        const toggle = document.createElement('button');
        toggle.id = 'soundToggle';
        toggle.className = 'fixed top-4 right-4 z-50 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200';
        toggle.innerHTML = '<i class="fas fa-volume-up text-indigo-600"></i>';
        toggle.title = 'Toggle sound effects';
        
        toggle.addEventListener('click', () => this.toggle());
        
        // Add to page when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => document.body.appendChild(toggle));
        } else {
            document.body.appendChild(toggle);
        }
    }

    updateSoundToggle() {
        const toggle = document.getElementById('soundToggle');
        if (toggle) {
            const icon = toggle.querySelector('i');
            if (this.enabled) {
                icon.className = 'fas fa-volume-up text-indigo-600';
                toggle.title = 'Sound ON - Click to disable';
            } else {
                icon.className = 'fas fa-volume-mute text-gray-400';
                toggle.title = 'Sound OFF - Click to enable';
            }
        }
    }
}

// Initialize sound manager
const soundManager = new SoundManager();

// Export for global use
window.soundManager = soundManager;