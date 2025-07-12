// Método para agregar a VideoConsultaService
async shareScreen(): Promise<boolean> {
  try {
    const screenResult = await AgoraRTC.createScreenVideoTrack({});
    let screenVideoTrack: ILocalVideoTrack;
    
    if (Array.isArray(screenResult)) {
      [screenVideoTrack] = screenResult;
    } else {
      screenVideoTrack = screenResult;
    }

    // Guardar video actual y reemplazar con pantalla
    const originalVideo = this.localVideoTrack;
    
    if (originalVideo) {
      await this.client.unpublish([originalVideo]);
      originalVideo.close();
    }

    await this.client.publish([screenVideoTrack]);
    const localDiv = document.getElementById('local-player');
    if (localDiv) {
      screenVideoTrack.play(localDiv);
    }

    this.localVideoTrack = screenVideoTrack;
    console.log('✅ Compartiendo pantalla');
    return true;
  } catch (error) {
    console.error('❌ Error compartiendo pantalla:', error);
    return false;
  }
}
