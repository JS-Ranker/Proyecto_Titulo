import { Component, OnDestroy, OnInit } from '@angular/core';
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalVideoTrack,
  ILocalAudioTrack,
  IRemoteVideoTrack,
  UID,
} from 'agora-rtc-sdk-ng';

@Component({
  selector: 'app-video-consulta',
  templateUrl: './video-consulta.page.html',
  styleUrls: ['./video-consulta.page.scss'],
  standalone: false
})
export class VideoConsultaPage implements OnInit, OnDestroy {
  channelName = '';
  inCall = false;
  isMuted = false;
  isCameraOff = false;
  client: IAgoraRTCClient;
  localAudioTrack: ILocalAudioTrack | null = null;
  localVideoTrack: ILocalVideoTrack | null = null;
  isConnected = false;

  constructor() {
    this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    this.setupRemoteHandlers();
  }

  ngOnInit() {
  }

  setupRemoteHandlers() {
    this.client.on('user-published', async (user, mediaType) => {
      await this.client.subscribe(user, mediaType);
      if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack as IRemoteVideoTrack;
        const remoteDiv = document.getElementById('remote-player');
        if (remoteDiv) remoteVideoTrack.play(remoteDiv);
      }
      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }
    });

    this.client.on('user-unpublished', (user) => {
      const remoteDiv = document.getElementById('remote-player');
      if (remoteDiv) remoteDiv.innerHTML = '';
    });
  }

  async startCall() {
    if (!this.channelName.trim() || this.inCall) return;
    const appId = 'e83d68a7ae864d4a9e920fcaae47fcd5'; // Usa tu App ID de Agora
    try {
      await this.client.join(appId, this.channelName, null, null);

      // Audio
      this.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      // Video
      this.localVideoTrack = await AgoraRTC.createCameraVideoTrack();

      // Renderiza video local
      const localDiv = document.getElementById('local-player');
      if (localDiv && this.localVideoTrack) {
        this.localVideoTrack.play(localDiv);
      }

      await this.client.publish([this.localAudioTrack, this.localVideoTrack]);
      this.inCall = true;
      this.isConnected = true;
    } catch (error) {
      console.error('Error al iniciar la llamada:', error);
    }
  }

  async leaveCall() {
    try {
      this.localAudioTrack?.close();
      this.localVideoTrack?.close();
      await this.client.leave();
      // Limpia los videos
      const remoteDiv = document.getElementById('remote-player');
      if (remoteDiv) remoteDiv.innerHTML = '';
      const localDiv = document.getElementById('local-player');
      if (localDiv) localDiv.innerHTML = '';
      this.inCall = false;
      this.isConnected = false;
    } catch (error) {
      console.error('Error al salir de la llamada:', error);
    }
  }

  toggleMic() {
    if (this.isMuted) {
      this.localAudioTrack?.setEnabled(true);
    } else {
      this.localAudioTrack?.setEnabled(false);
    }
    this.isMuted = !this.isMuted;
  }

  toggleVideo() {
    if (this.isCameraOff) {
      this.localVideoTrack?.setEnabled(true);
    } else {
      this.localVideoTrack?.setEnabled(false);
    }
    this.isCameraOff = !this.isCameraOff;
  }

  ngOnDestroy() {
    if (this.isConnected) {
      this.leaveCall();
    }
  }
}
