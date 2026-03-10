import React, { useState, useEffect } from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { X, Minus, Plus } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useCollectionStore } from '../store/useCollectionStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { getTeamById } from '../data/teams';
import { lightTap, successNotification, errorNotification } from '../utils/haptics';
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
    if (sticker) setQty(getQuantity(sticker.id));
  }, [sticker, getQuantity]);

  if (!sticker) return null;
  const team = getTeamById(sticker.teamId);

  const handleSave = () => {
    setQuantity(sticker.id, qty);
    if (qty > 1) successNotification();
    else if (qty === 0) errorNotification();
    else lightTap();
    onClose();
  };

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: t.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderTopWidth: 1,
            borderColor: t.border,
            padding: 24,
            paddingBottom: 40,
          }}
        >
          <Pressable
            onPress={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: t.surfaceLight,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} color={t.textSecondary} />
          </Pressable>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Text style={{ fontSize: 32 }}>{team?.flag}</Text>
            <View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: t.text }}>{sticker.name}</Text>
              <Text style={{ fontSize: 13, color: t.textSecondary }}>{team?.name} · #{sticker.id}</Text>
            </View>
          </View>

          <Text style={{ fontSize: 13, color: t.textSecondary, textAlign: 'center', marginBottom: 16 }}>
            Quantas figurinhas você tem?
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 16 }}>
            <Pressable
              onPress={() => { lightTap(); setQty(Math.max(0, qty - 1)); }}
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: t.surfaceLight,
                borderWidth: 2,
                borderColor: t.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Minus size={22} color={t.gold} />
            </Pressable>
            <Text style={{ fontSize: 32, fontWeight: '700', color: t.gold, minWidth: 60, textAlign: 'center' }}>
              {qty}
            </Text>
            <Pressable
              onPress={() => { lightTap(); setQty(qty + 1); }}
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: t.surfaceLight,
                borderWidth: 2,
                borderColor: t.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={22} color={t.gold} />
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
            {[0, 1, 2, 3, 5].map((n) => (
              <Pressable
                key={n}
                onPress={() => { lightTap(); setQty(n); }}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: qty === n ? t.gold : t.surfaceLight,
                  borderWidth: 2,
                  borderColor: qty === n ? t.gold : t.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 15, fontWeight: '600', color: qty === n ? '#0F1923' : t.textSecondary }}>
                  {n}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable
            onPress={handleSave}
            style={{
              backgroundColor: t.gold,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F1923' }}>Salvar</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
