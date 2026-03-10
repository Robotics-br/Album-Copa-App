import { createAudioPlayer } from 'expo-audio';

// Instanciamos os players globalmente para não criar um novo a cada chamada
export const addStickerPlayer = createAudioPlayer(require('../../assets/sounds/add_sticker.mp3'));
export const removeStickerPlayer = createAudioPlayer(
  require('../../assets/sounds/remove_sticker.mp3')
);

export async function playStickerCollectedSound() {
  try {
    addStickerPlayer.seekTo(0);
    addStickerPlayer.play();
  } catch (error) {
    console.warn('Erro ao reproduzir som de coleta:', error);
  }
}

export async function playStickerRemovedSound() {
  try {
    removeStickerPlayer.seekTo(0);
    removeStickerPlayer.play();
  } catch (error) {
    console.warn('Erro ao reproduzir som de remoção:', error);
  }
}

export async function playDuplicateSetSound() {
  // TODO: reproduzir som de repetida via expo-audio
}

export async function playErrorSound() {
  // TODO: reproduzir som de erro via expo-audio
}
