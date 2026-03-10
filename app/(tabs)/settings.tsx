import React from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Volume2, VolumeX, Eye, Trash2 } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import { useCollectionStore } from '../../src/store/useCollectionStore';
import Toggle from '../../src/components/ui/Toggle';
import AnimatedPressable from '../../src/components/ui/AnimatedPressable';
import type { ThemeStyle } from '../../src/types';

const styleOptions: { id: ThemeStyle; label: string }[] = [
  { id: 'original-dark', label: 'Original escuro' },
  { id: 'original-light', label: 'Original claro' },
  { id: 'minecraft', label: 'Minecraft' },
  { id: 'fortnite', label: 'Fortnite' },
  { id: 'mario', label: 'Mario' },
  { id: 'gta', label: 'GTA' },
  { id: 'freefire', label: 'Free Fire' },
  { id: 'genshin', label: 'Genshin Impact' },
  { id: 'roblox', label: 'Roblox' },
  { id: 'lego', label: 'Lego' },
];

export default function SettingsScreen() {
  const t = useTheme();
  const { style, seniorMode, soundEnabled, setStyle, toggleSeniorMode, toggleSound } =
    useSettingsStore();
  const resetCollection = useCollectionStore((s) => s.reset);

  const handleReset = () => {
    Alert.alert(
      'Apagar tudo',
      'Tem certeza que deseja apagar todas as figurinhas? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: () => resetCollection(),
        },
      ]
    );
  };

  return (
    <SafeAreaView className="bg-bg flex-1" edges={['top']}>
      <View className="px-3 py-2">
        <Text className="text-[14px] font-bold uppercase text-gold">AJUSTES</Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View className="border-border overflow-hidden rounded-2xl border bg-surface">
          <Text className="text-text-secondary p-3 pb-0 text-[12px] font-semibold uppercase tracking-widest">
            Estilo visual
          </Text>
          <Text className="text-text-secondary px-3 pb-3 pt-1 text-[11px]">
            Temas inspirados em jogos populares
          </Text>
          <View className="flex-row flex-wrap gap-2 px-4 pb-4">
            {styleOptions.map(({ id, label }) => {
              const active = style === id;
              return (
                <AnimatedPressable
                  key={id}
                  onPress={() => setStyle(id)}
                  className="w-[47%] items-center rounded-xl border-2 px-2 py-2.5"
                  style={{
                    borderColor: active ? t.gold : t.border,
                    backgroundColor: active ? `${t.gold}25` : t.surfaceLight,
                  }}>
                  <Text
                    className="text-[12px] font-semibold"
                    style={{ color: active ? t.gold : t.text }}>
                    {label}
                  </Text>
                </AnimatedPressable>
              );
            })}
          </View>
        </View>

        <View className="border-border overflow-hidden rounded-2xl border bg-surface">
          <Text className="text-text-secondary p-3 text-[12px] font-semibold uppercase tracking-widest">
            Acessibilidade
          </Text>

          <View className="border-border flex-row items-center justify-between border-t px-4 py-3.5">
            <View className="flex-row items-center gap-3">
              <Eye size={20} color={t.text} />
              <View>
                <Text className="text-text text-[15px] font-medium">Modo Sênior</Text>
                <Text className="text-text-secondary text-[11px]">Botões e textos maiores</Text>
              </View>
            </View>
            <Toggle value={seniorMode} onValueChange={toggleSeniorMode} />
          </View>

          <View className="border-border flex-row items-center justify-between border-t px-4 py-3.5">
            <View className="flex-row items-center gap-3">
              {soundEnabled ? (
                <Volume2 size={20} color={t.text} />
              ) : (
                <VolumeX size={20} color={t.text} />
              )}
              <View>
                <Text className="text-text text-[15px] font-medium">Som</Text>
                <Text className="text-text-secondary text-[11px]">Sons ao coletar figurinhas</Text>
              </View>
            </View>
            <Toggle value={soundEnabled} onValueChange={toggleSound} />
          </View>
        </View>

        <View className="overflow-hidden rounded-2xl border border-red-500/30 bg-surface">
          <Pressable
            onPress={handleReset}
            className="flex-row items-center gap-3 p-4 active:opacity-50">
            <Trash2 size={20} color="#E53935" />
            <View>
              <Text className="text-[15px] font-medium text-[#E53935]">Apagar tudo</Text>
              <Text className="text-text-secondary text-[11px]">Remove todas as figurinhas</Text>
            </View>
          </Pressable>
        </View>

        <View className="items-center py-6">
          <Text className="text-text-secondary text-[13px]">Minha Copa 2026</Text>
          <Text className="text-text-secondary mt-1 text-[11px] opacity-70">
            v1.0.0 • by Robotics
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
