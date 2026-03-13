import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { X, Minus, Plus } from 'lucide-react-native';
import { useTranslation, Trans } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { useCollectionStore } from '../store/useCollectionStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getTeamById } from '../data/teams';
import { lightTap } from '../utils/haptics';
import AnimatedPressable from './ui/AnimatedPressable';
import type { Sticker } from '../types';

interface StickerModalProps {
  sticker: Sticker | null;
  onClose: () => void;
}

export default function StickerModal({ sticker, onClose }: StickerModalProps) {
  const t = useTheme();
  const { t: i18n_t } = useTranslation();
  const { getQuantity, setQuantity } = useCollectionStore();
  const insets = useSafeAreaInsets();
  const [duplicates, setDuplicates] = useState(0);

  useEffect(() => {
    if (sticker) {
      setDuplicates(Math.max(0, getQuantity(sticker.code) - 1));
    }
  }, [sticker, getQuantity]);

  if (!sticker) return null;
  const team = getTeamById(sticker.section);

  const handleSave = () => {
    const newTotal = duplicates + 1; // 1 no álbum + as repetidas
    setQuantity(sticker.code, newTotal);
    onClose();
  };

  const handleRemove = () => {
    setQuantity(sticker.code, 0);
    onClose();
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          className="rounded-t-[24px] border-t border-border bg-surface p-6"
          style={{ paddingBottom: Math.max(24, 16 + insets.bottom) }}>
          <AnimatedPressable
            onPress={() => {
              lightTap();
              onClose();
            }}
            scaleDown={0.85}
            className="absolute right-4 top-4 h-8 w-8 items-center justify-center rounded-full border-2 border-border bg-surface-light">
            <X size={20} color={t.textSecondary} />
          </AnimatedPressable>

          <View className="mb-6 flex-row items-center gap-3">
            <Text className="text-[32px]">{team?.flag}</Text>
            <View>
              <Text className="mb-1 text-[13px] font-bold uppercase text-gold">
                {team ? i18n_t(`teams.${team.id}`) : ''}
              </Text>
              <View className="flex-row items-center gap-2">
                <Text className="text-[18px] font-bold text-text">{sticker.name}</Text>
                <Text className="text-[13px] text-text-secondary">
                  {team ? i18n_t(`teams.${team.id}`) : ''} · {sticker.code}
                </Text>
              </View>
            </View>
          </View>

          <Text className="mb-4 text-center text-[15px] font-medium text-text">
            <Trans i18nKey="stickerModal.question1">
              Quantas figurinhas <Text className="text-[17px] font-bold text-gold">repetidas</Text>{' '}
              você tem?
            </Trans>
          </Text>

          <View className="mb-4 flex-row items-center justify-center gap-6">
            <AnimatedPressable
              onPress={() => {
                lightTap();
                setDuplicates(Math.max(0, duplicates - 1));
              }}
              scaleDown={0.88}
              className="h-[52px] w-[52px] items-center justify-center rounded-full border-2 border-border bg-surface-light">
              <Minus size={22} color={t.gold} />
            </AnimatedPressable>
            <Text className="min-w-[60px] text-center text-[32px] font-bold text-gold">
              {duplicates}
            </Text>
            <AnimatedPressable
              onPress={() => {
                lightTap();
                setDuplicates(duplicates + 1);
              }}
              scaleDown={0.88}
              className="h-[52px] w-[52px] items-center justify-center rounded-full border-2 border-border bg-surface-light">
              <Plus size={22} color={t.gold} />
            </AnimatedPressable>
          </View>

          <View className="mb-5 flex-row justify-center gap-2">
            {[0, 1, 2, 3, 5].map((n) => (
              <AnimatedPressable
                key={n}
                onPress={() => {
                  lightTap();
                  setDuplicates(n);
                }}
                scaleDown={0.88}
                className="h-11 w-11 items-center justify-center rounded-xl border-2"
                style={{
                  backgroundColor: duplicates === n ? t.gold : t.surfaceLight,
                  borderColor: duplicates === n ? t.gold : t.border,
                }}>
                <Text
                  className="text-[15px] font-semibold"
                  style={{ color: duplicates === n ? '#0F1923' : t.textSecondary }}>
                  {n}
                </Text>
              </AnimatedPressable>
            ))}
          </View>

          <AnimatedPressable
            onPress={handleSave}
            className="mb-3 items-center rounded-xl bg-gold py-3.5">
            <Text className="text-[15px] font-bold text-[#0F1923]">
              {i18n_t('stickerModal.saveRepeated')}
            </Text>
          </AnimatedPressable>

          <AnimatedPressable
            onPress={handleRemove}
            className="items-center rounded-xl border border-red-500/30 bg-red-500/10 py-3.5">
            <Text className="text-[15px] font-bold text-red-500">
              {i18n_t('stickerModal.removeFromAlbum')}
            </Text>
          </AnimatedPressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
