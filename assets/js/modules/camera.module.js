/**
 * Camera Module - Domtom Connect
 * WebRTC Integrated Camera for Photo and Video Capture
 */

window.CameraModule = {
    stream: null,
    mediaRecorder: null,
    recordedChunks: [],
    facingMode: 'environment', // Default to back camera
    isRecording: false,
    recordingTimer: null,
    recordingStartTime: 0,
    maxDurationMs: 30000, // 30 seconds max for stories/posts

    openCamera: async function(callback) {
        this.onCaptureComplete = callback;

        // Create UI Modal
        let modal = document.getElementById('dtc-camera-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'dtc-camera-modal';
            modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #000; z-index: 999999; display: flex; flex-direction: column;';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div style="display: flex; justify-content: space-between; padding: 20px; position: absolute; top: 0; left: 0; width: 100%; z-index: 10; box-sizing: border-box;">
                <button onclick="window.CameraModule.closeCamera()" style="background: rgba(0,0,0,0.5); border: none; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(5px);">
                    <i class="fas fa-times" style="font-size: 1.2rem;"></i>
                </button>
                <button onclick="window.CameraModule.switchCamera()" style="background: rgba(0,0,0,0.5); border: none; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(5px);">
                    <i class="fas fa-sync-alt" style="font-size: 1.2rem;"></i>
                </button>
            </div>
            
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
                <video id="dtc-camera-video" autoplay playsinline muted style="width: 100%; height: 100%; object-fit: cover;"></video>
                
                <!-- Recording Indicator -->
                <div id="dtc-camera-recording-indicator" style="display: none; position: absolute; top: 80px; background: rgba(239, 68, 68, 0.9); color: white; padding: 4px 12px; border-radius: 100px; font-weight: 800; font-size: 0.85rem; align-items: center; gap: 8px;">
                    <span style="display: block; width: 8px; height: 8px; background: white; border-radius: 50%; animation: dtcPulse 1s infinite;"></span>
                    <span id="dtc-camera-timer">00:00</span>
                </div>
            </div>

            <div style="height: 120px; display: flex; align-items: center; justify-content: center; padding-bottom: 20px; background: #000;">
                <button id="dtc-camera-shutter" style="width: 72px; height: 72px; border-radius: 50%; border: 4px solid white; background: rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; outline: none; padding: 0;">
                    <div id="dtc-camera-shutter-inner" style="width: 54px; height: 54px; border-radius: 50%; background: white; transition: all 0.2s;"></div>
                </button>
            </div>
            
            <style>
                @keyframes dtcPulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
            </style>
            
            <!-- Hidden Canvas for Photo Capture -->
            <canvas id="dtc-camera-canvas" style="display: none;"></canvas>
        `;

        modal.style.display = 'flex';

        this.setupEventListeners();
        await this.startStream();
    },

    startStream: async function() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: this.facingMode },
                audio: true // We request audio for video recording
            });
            
            const videoElement = document.getElementById('dtc-camera-video');
            if (videoElement) {
                videoElement.srcObject = this.stream;
            }
        } catch (err) {
            console.error("Camera access error:", err);
            alert("Impossible d'accéder à la caméra. Vérifiez les permissions de votre navigateur.");
            this.closeCamera();
        }
    },

    switchCamera: async function() {
        this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
        await this.startStream();
    },

    setupEventListeners: function() {
        const shutterBtn = document.getElementById('dtc-camera-shutter');
        let pressTimer;
        let isLongPress = false;

        // Touch / Mouse interactions for Photo vs Video
        const startPress = (e) => {
            if (e.type === 'touchstart') e.preventDefault(); // Prevent double firing
            if (this.isRecording) return;
            
            isLongPress = false;
            pressTimer = setTimeout(() => {
                isLongPress = true;
                this.startRecording();
            }, 500); // 500ms hold to start video
        };

        const endPress = (e) => {
            if (e.type === 'touchend') e.preventDefault();
            clearTimeout(pressTimer);
            
            if (this.isRecording) {
                this.stopRecording();
            } else if (!isLongPress) {
                this.takePhoto();
            }
        };

        shutterBtn.addEventListener('mousedown', startPress);
        shutterBtn.addEventListener('mouseup', endPress);
        shutterBtn.addEventListener('mouseleave', () => { if(this.isRecording) this.stopRecording(); clearTimeout(pressTimer); });
        
        shutterBtn.addEventListener('touchstart', startPress);
        shutterBtn.addEventListener('touchend', endPress);
    },

    takePhoto: function() {
        const video = document.getElementById('dtc-camera-video');
        const canvas = document.getElementById('dtc-camera-canvas');
        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        
        // Mirror if user facing
        if (this.facingMode === 'user') {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
        }
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Visual feedback
        const flash = document.createElement('div');
        flash.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; background:white; z-index:20; opacity:1; transition: opacity 0.5s;';
        document.getElementById('dtc-camera-video').parentElement.appendChild(flash);
        setTimeout(() => flash.style.opacity = '0', 50);
        setTimeout(() => flash.remove(), 500);

        canvas.toBlob((blob) => {
            const file = new File([blob], `photo_dtc_${Date.now()}.jpg`, { type: 'image/jpeg' });
            this.finishCapture(file);
        }, 'image/jpeg', 0.9);
    },

    startRecording: function() {
        if (!this.stream) return;
        this.recordedChunks = [];
        this.isRecording = true;
        
        try {
            // Safari iOS might only support video/mp4, Chrome supports video/webm
            let options = { mimeType: 'video/webm;codecs=vp8,opus' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options = { mimeType: 'video/mp4' }; 
            }
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options = {}; // Fallback to browser default
            }

            this.mediaRecorder = new MediaRecorder(this.stream, options);
            
            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    this.recordedChunks.push(e.data);
                }
            };

            this.mediaRecorder.onstop = () => {
                const mimeType = this.recordedChunks[0]?.type || 'video/mp4';
                const blob = new Blob(this.recordedChunks, { type: mimeType });
                
                // Determine extension based on mimeType
                let ext = 'mp4';
                if (mimeType.includes('webm')) ext = 'webm';

                const file = new File([blob], `video_dtc_${Date.now()}.${ext}`, { type: mimeType });
                this.finishCapture(file);
            };

            this.mediaRecorder.start();

            // UI Updates
            document.getElementById('dtc-camera-shutter-inner').style.background = '#ef4444';
            document.getElementById('dtc-camera-shutter-inner').style.transform = 'scale(0.6)';
            document.getElementById('dtc-camera-shutter-inner').style.borderRadius = '8px';
            document.getElementById('dtc-camera-recording-indicator').style.display = 'flex';
            
            this.recordingStartTime = Date.now();
            this.recordingTimer = setInterval(() => {
                const elapsed = Date.now() - this.recordingStartTime;
                const seconds = Math.floor(elapsed / 1000);
                document.getElementById('dtc-camera-timer').textContent = `00:${seconds.toString().padStart(2, '0')}`;
                
                if (elapsed >= this.maxDurationMs) {
                    this.stopRecording();
                }
            }, 1000);

        } catch(err) {
            console.error("MediaRecorder error:", err);
            alert("L'enregistrement vidéo n'est pas supporté par votre navigateur actuel.");
            this.isRecording = false;
        }
    },

    stopRecording: function() {
        if (!this.isRecording || !this.mediaRecorder) return;
        this.isRecording = false;
        clearInterval(this.recordingTimer);
        this.mediaRecorder.stop();
        
        // Reset UI
        const inner = document.getElementById('dtc-camera-shutter-inner');
        if (inner) {
            inner.style.background = 'white';
            inner.style.transform = 'scale(1)';
            inner.style.borderRadius = '50%';
        }
        const indicator = document.getElementById('dtc-camera-recording-indicator');
        if (indicator) indicator.style.display = 'none';
    },

    finishCapture: function(file) {
        this.closeCamera();
        if (this.onCaptureComplete) {
            this.onCaptureComplete(file);
        }
    },

    closeCamera: function() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        if (this.isRecording) {
            this.stopRecording();
        }
        const modal = document.getElementById('dtc-camera-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
};
