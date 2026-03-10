import React from 'react';
import { View, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import StickerCard from './StickerCard';
import type { Sticker } from '../types';

const COLUMNS = 5;
const SCREEN_WIDTH = Dimensions.get('window').width;
const GAP = 6;
const ITEM_WIDTH = (SCREEN_WIDTH - 16 - GAP * (COLUMNS - 1)) / COLUMNS;

interface StickerGridProps {
  stickers: Sticker[];
  onLongPress: (sticker: Sticker) => void;
}

export default function StickerGrid({ stickers, onLongPress }: StickerGridProps) {
  return (
    <View style={{ paddingHorizontal: 8 }}>
      <FlashList
        data={stickers}
        numColumns={COLUMNS}
        keyExtractor={(item) => String(item.id)}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={{ width: ITEM_WIDTH, marginBottom: GAP, marginRight: GAP }}>
            <StickerCard sticker={item} onLongPress={onLongPress} />
          </View>
        )}
      />
    </View>
  );
}
