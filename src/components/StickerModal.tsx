import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { X, Minus, Plus } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useCollectionStore } from '../store/useCollectionStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { getTeamById } from '../data/teams';
import { lightTap, successNotification, errorNotification } from '../utils/haptics';
import { playStickerCollectedSound, playStickerRemovedSound } from '../utils/sounds';
import AnimatedPressable from './ui/AnimatedPressable';
import type { Sticker } from '../types';

interface StickerModalProps {
  sticker: Sticker | null;
  onClose: () => void;
}

export default function StickerModal({ sticker, onClose }: StickerModalProps) {
  const t = useTheme();
  const { getQuantity, setQuantity } = useCollectionStore();
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const [qty, setQty] = useState(0);

  useEffect(() => {
    if (sticker) setQty(getQuantity(sticker.code));
  }, [sticker, getQuantity]);

  if (!sticker) return null;
  const team = getTeamById(sticker.section);

  const handleSave = () => {
    const prevQty = getQuantity(sticker.code);
    setQuantity(sticker.code, qty);

    if (qty > 0 && prevQty === 0) {
      if (soundEnabled) playStickerCollectedSound();
    } else if (qty === 0 && prevQty > 0) {
      if (soundEnabled) playStickerRemovedSound();
    }

    if (qty > 1) successNotification();
    else if (qty === 0) errorNotification();
    else lightTap();

    onClose();
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="border-border rounded-t-[24px] border-t bg-surface p-6 pb-10">
          <AnimatedPressable
            onPress={onClose}
            scaleDown={0.85}
            className="absolute right-4 top-4 h-8 w-8 items-center justify-center rounded-full bg-surface-light">
            <X size={20} color={t.textSecondary} />
          </AnimatedPressable>

          <View className="mb-6 flex-row items-center gap-3">
            <Text className="text-[32px]">{team?.flag}</Text>
            <View>
              <Text className="text-text text-[18px] font-bold">{sticker.name}</Text>
              <Text className="text-text-secondary text-[13px]">
                {team?.name} · {sticker.code}
              </Text>
            </View>
          </View>

          <Text className="text-text-secondary mb-4 text-center text-[13px]">
            Quantas figurinhas você tem?
          </Text>

          <View className="mb-4 flex-row items-center justify-center gap-6">
            <AnimatedPressable
              onPress={() => {
                lightTap();
                setQty(Math.max(0, qty - 1));
              }}
              scaleDown={0.88}
              className="border-border h-[52px] w-[52px] items-center justify-center rounded-full border-2 bg-surface-light">
              <Minus size={22} color={t.gold} />
            </AnimatedPressable>
            <Text className="min-w-[60px] text-center text-[32px] font-bold text-gold">{qty}</Text>
            <AnimatedPressable
              onPress={() => {
                lightTap();
                setQty(qty + 1);
              }}
              scaleDown={0.88}
              className="border-border h-[52px] w-[52px] items-center justify-center rounded-full border-2 bg-surface-light">
              <Plus size={22} color={t.gold} />
            </AnimatedPressable>
          </View>

          <View className="mb-5 flex-row justify-center gap-2">
            {[0, 1, 2, 3, 5].map((n) => (
              <AnimatedPressable
                key={n}
                onPress={() => {
                  lightTap();
                  setQty(n);
                }}
                scaleDown={0.88}
                className="h-11 w-11 items-center justify-center rounded-xl border-2"
                style={{
                  backgroundColor: qty === n ? t.gold : t.surfaceLight,
                  borderColor: qty === n ? t.gold : t.border,
                }}>
                <Text
                  className="text-[15px] font-semibold"
                  style={{ color: qty === n ? '#0F1923' : t.textSecondary }}>
                  {n}
                </Text>
              </AnimatedPressable>
            ))}
          </View>

          <AnimatedPressable
            onPress={handleSave}
            className="items-center rounded-xl bg-gold py-3.5">
            <Text className="text-[15px] font-bold text-[#0F1923]">Salvar</Text>
          </AnimatedPressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
