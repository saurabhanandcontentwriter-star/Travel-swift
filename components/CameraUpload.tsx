import React, { useRef, useEffect, useState } from 'react';

interface CameraUploadProps {
    onCapture: (imageDataUrl: string) => void;
    onClose: () => void;
}

const CameraUpload: React.FC<CameraUploadProps> = ({ onCapture, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
                setStream(mediaStream);
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError("Could not access the camera. Please check permissions and ensure you are on a secure (HTTPS) connection.");
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []); // Run only once

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            
            if (context) {
                // Set canvas dimensions to match video
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // Draw the current video frame to the canvas
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                
                // Get the image data as a base64 string
                const imageDataUrl = canvas.toDataURL('image/jpeg');
                
                onCapture(imageDataUrl);
            }
        }
    };

    return (
        <div className="camera-modal-overlay" role="dialog" aria-modal="true">
            <div className="camera-modal">
                <h3 className="camera-modal-title">Upload Profile Picture</h3>
                {error ? (
                    <div className="camera-error">{error}</div>
                ) : (
                    <div className="camera-feed-container">
                        <video ref={videoRef} className="camera-feed" autoPlay playsInline muted />
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>
                )}
                <div className="camera-actions">
                    <button onClick={handleCapture} className="capture-btn" disabled={!!error}>
                        Take Picture
                    </button>
                    <button onClick={onClose} className="cancel-capture-btn">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CameraUpload;