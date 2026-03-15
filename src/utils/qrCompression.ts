import { stickers } from '../data/teams';

// Alfabeto customizado para ser seguro (64 caracteres)
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/**
 * Comprime uma lista de códigos de figurinhas em uma string curta usando bitset.
 * Como o álbum tem um número fixo de figurinhas, podemos representar cada uma com 1 bit.
 */
export function compressDuplicates(duplicateCodes: string[]): string {
  if (duplicateCodes.length === 0) return 'v2:';

  const codesSet = new Set(duplicateCodes);
  let bitString = '';

  // Criamos uma string de bits baseada na ordem global das figurinhas
  for (const sticker of stickers) {
    bitString += codesSet.has(sticker.code) ? '1' : '0';
  }

  // Padding para ser múltiplo de 6
  while (bitString.length % 6 !== 0) {
    bitString += '0';
  }

  // Convertemos grupos de 6 bits para um caractere do nosso alfabeto
  let compressed = 'v2:'; // Prefixo de versão para compatibilidade
  for (let i = 0; i < bitString.length; i += 6) {
    const chunk = bitString.substring(i, i + 6);
    const index = parseInt(chunk, 2);
    compressed += ALPHABET[index];
  }

  return compressed;
}

/**
 * Descomprime a string do QR Code de volta para uma lista de códigos.
 */
export function decompressDuplicates(payload: string): string[] {
  // Fallback para o formato antigo (compatibilidade temporária)
  if (payload.startsWith('[')) {
    try {
      return JSON.parse(payload);
    } catch {
      return [];
    }
  }

  if (!payload.startsWith('v2:')) return [];

  const data = payload.substring(3);
  let bitString = '';

  for (const char of data) {
    const index = ALPHABET.indexOf(char);
    if (index === -1) continue;
    bitString += index.toString(2).padStart(6, '0');
  }

  const resultCodes: string[] = [];
  for (let i = 0; i < stickers.length; i++) {
    if (bitString[i] === '1') {
      resultCodes.push(stickers[i].code);
    }
  }

  return resultCodes;
}
