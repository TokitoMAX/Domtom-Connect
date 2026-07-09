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

    initUI: function() {
        let modal = document.getElementById('dtc-camera-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'dtc-camera-modal';
            modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: #000; z-index: 999999; display: flex; flex-direction: column;';
            document.body.appendChild(modal);
            
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
                
                <!-- EDITOR VIEW (Hidden by default) -->
                <div id="dtc-camera-editor" style="display: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #000; z-index: 100; flex-direction: column;">
                    <!-- Header -->
                    <div style="display: flex; justify-content: space-between; padding: 20px; z-index: 10; background: linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%); position: absolute; top:0; left:0; right:0;">
                        <button onclick="window.CameraModule.closeEditor()" style="background: transparent; border: none; color: white; font-size: 1.5rem; cursor: pointer; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <div style="display: flex; gap: 15px;">
                            <button onclick="window.CameraModule.addTextOverlay()" style="background: transparent; border: none; color: white; font-size: 1.5rem; cursor: pointer; text-shadow: 0 1px 3px rgba(0,0,0,0.5);">
                                <i class="fas fa-font"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Media Container -->
                    <div id="dtc-editor-media-container" style="flex: 1; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; background: #000;">
                        <!-- Media inserted here dynamically -->
                        
                        <!-- Text Overlay Layer -->
                        <div id="dtc-editor-text-layer" style="position: absolute; inset: 0; pointer-events: none; display: flex; align-items: center; justify-content: center; z-index: 5;">
                        </div>
                    </div>
                    
                    <!-- Footer / Validate -->
                    <div style="padding: 20px; padding-bottom: max(20px, env(safe-area-inset-bottom)); background: #000; display: flex; justify-content: flex-end; align-items: center;">
                        <button onclick="window.CameraModule.validateAndSend()" style="background: #10b981; color: white; border: none; padding: 14px 32px; border-radius: 100px; font-weight: 800; font-size: 1.1rem; cursor: pointer; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4); display: flex; align-items: center; gap: 10px;">
                            Suivant <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                    
                    <!-- Text Input Overlay -->
                    <div id="dtc-editor-text-input-overlay" style="display: none; position: absolute; inset: 0; background: rgba(0,0,0,0.7); z-index: 100; flex-direction: column; align-items: center; justify-content: center; padding: 20px;">
                        <input type="text" id="dtc-editor-text-input" placeholder="Tapez votre texte..." style="background: transparent; border: none; color: white; font-size: 2rem; font-weight: 800; text-align: center; width: 100%; outline: none; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">
                        <button onclick="window.CameraModule.saveTextOverlay()" style="margin-top: 20px; background: white; color: black; border: none; padding: 10px 24px; border-radius: 20px; font-weight: 700; cursor: pointer;">Terminé</button>
                    </div>
                </div>
            `;
        }
        return modal;
    },

    editFile: function(file, callback) {
        this.onCaptureComplete = callback;
        const modal = this.initUI();
        modal.style.display = 'flex';
        this.openEditor(file, file.type.includes('video'));
    },

    openCamera: async function(callback) {
        this.onCaptureComplete = callback;
        const modal = this.initUI();
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
            this.openEditor(file, false);
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
                this.openEditor(file, true);
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
    },

    // --- EDITOR LOGIC ---
    currentFile: null,
    overlayText: "",

    openEditor: function(file, isVideo) {
        this.currentFile = file;
        this.overlayText = "";
        
        // Hide Camera UI, Show Editor UI
        document.getElementById('dtc-camera-video').parentElement.style.display = 'none';
        document.getElementById('dtc-camera-shutter').parentElement.style.display = 'none';
        
        const editor = document.getElementById('dtc-camera-editor');
        const mediaContainer = document.getElementById('dtc-editor-media-container');
        const textLayer = document.getElementById('dtc-editor-text-layer');
        textLayer.innerHTML = ''; // Reset text
        
        // Clean previous media
        const existingMedia = mediaContainer.querySelector('img, video');
        if (existingMedia) existingMedia.remove();

        const fileUrl = URL.createObjectURL(file);

        if (isVideo) {
            const videoEl = document.createElement('video');
            videoEl.src = fileUrl;
            videoEl.autoplay = true;
            videoEl.loop = true;
            videoEl.muted = false;
            videoEl.playsInline = true;
            videoEl.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
            mediaContainer.insertBefore(videoEl, textLayer);
        } else {
            const imgEl = document.createElement('img');
            imgEl.src = fileUrl;
            imgEl.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';
            mediaContainer.insertBefore(imgEl, textLayer);
        }

        editor.style.display = 'flex';
    },

    closeEditor: function() {
        // Go back to camera preview
        document.getElementById('dtc-camera-editor').style.display = 'none';
        document.getElementById('dtc-camera-video').parentElement.style.display = 'flex';
        document.getElementById('dtc-camera-shutter').parentElement.style.display = 'flex';
        this.currentFile = null;
    },

    addTextOverlay: function() {
        const inputOverlay = document.getElementById('dtc-editor-text-input-overlay');
        const input = document.getElementById('dtc-editor-text-input');
        input.value = this.overlayText;
        inputOverlay.style.display = 'flex';
        input.focus();
    },

    saveTextOverlay: function() {
        const inputOverlay = document.getElementById('dtc-editor-text-input-overlay');
        const input = document.getElementById('dtc-editor-text-input');
        const textLayer = document.getElementById('dtc-editor-text-layer');
        
        this.overlayText = input.value.trim();
        inputOverlay.style.display = 'none';
        
        if (this.overlayText) {
            textLayer.innerHTML = `<div style="color: white; font-size: 2.5rem; font-weight: 800; text-align: center; text-shadow: 0 2px 10px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.8); background: rgba(0,0,0,0.3); padding: 10px 20px; border-radius: 12px;">${this.overlayText}</div>`;
        } else {
            textLayer.innerHTML = '';
        }
    },

    validateAndSend: function() {
        // If it's a photo and has text, we can easily burn it to canvas
        // For MVP, if it's a video, we just send the raw video (text overlay is hard to burn without ffmpeg)
        // If it's an image, we can burn the text.
        
        const isVideo = this.currentFile.type.includes('video');
        
        if (!isVideo && this.overlayText) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                // Draw text
                ctx.fillStyle = 'white';
                ctx.font = '800 ' + (canvas.width * 0.08) + 'px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Add shadow
                ctx.shadowColor = 'rgba(0,0,0,0.8)';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 2;
                
                // Background box
                const textWidth = ctx.measureText(this.overlayText).width;
                const boxHeight = canvas.width * 0.12;
                ctx.fillStyle = 'rgba(0,0,0,0.3)';
                ctx.fillRect((canvas.width - textWidth)/2 - 20, canvas.height/2 - boxHeight/2, textWidth + 40, boxHeight);
                
                ctx.fillStyle = 'white';
                ctx.fillText(this.overlayText, canvas.width / 2, canvas.height / 2);
                
                canvas.toBlob((blob) => {
                    const finalFile = new File([blob], this.currentFile.name, { type: 'image/jpeg' });
                    this.finishCapture(finalFile);
                }, 'image/jpeg', 0.9);
            };
            img.src = URL.createObjectURL(this.currentFile);
        } else {
            // Send original file (video, or image without text)
            this.finishCapture(this.currentFile);
        }
    }
};
