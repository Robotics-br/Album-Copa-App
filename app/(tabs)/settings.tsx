import React from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Volume2, VolumeX, Eye, Trash2 } from 'lucide-react-native';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import { useCollectionStore } from '../../src/store/useCollectionStore';
import Toggle from '../../src/components/ui/Toggle';
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
  const { style, seniorMode, soundEnabled, setStyle, toggleSeniorMode, toggleSound } = useSettingsStore();
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
      ],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['top']}>
      <View style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: t.gold, textTransform: 'uppercase' }}>
          AJUSTES
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16 }}>
        {/* Estilo visual */}
        <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 16, overflow: 'hidden' }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: t.textSecondary, padding: 12, paddingBottom: 0, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Estilo visual
          </Text>
          <Text style={{ fontSize: 11, color: t.textSecondary, paddingHorizontal: 12, paddingTop: 4, paddingBottom: 12 }}>
            Temas inspirados em jogos populares
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingBottom: 16 }}>
            {styleOptions.map(({ id, label }) => {
              const active = style === id;
              return (
                <Pressable
                  key={id}
                  onPress={() => setStyle(id)}
                  style={{
                    width: '47%',
                    paddingVertical: 10,
                    paddingHorizontal: 8,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: active ? t.gold : t.border,
                    backgroundColor: active ? `${t.gold}25` : t.surfaceLight,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: active ? t.gold : t.text }}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Acessibilidade */}
        <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: t.border, borderRadius: 16, overflow: 'hidden' }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: t.textSecondary, padding: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Acessibilidade
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderTopColor: t.border }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Eye size={20} color={t.text} />
              <View>
                <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>Modo Sênior</Text>
                <Text style={{ fontSize: 11, color: t.textSecondary }}>Botões e textos maiores</Text>
              </View>
            </View>
            <Toggle value={seniorMode} onValueChange={toggleSeniorMode} />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderTopColor: t.border }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {soundEnabled ? <Volume2 size={20} color={t.text} /> : <VolumeX size={20} color={t.text} />}
              <View>
                <Text style={{ fontSize: 15, fontWeight: '500', color: t.text }}>Som</Text>
                <Text style={{ fontSize: 11, color: t.textSecondary }}>Sons ao coletar figurinhas</Text>
              </View>
            </View>
            <Toggle value={soundEnabled} onValueChange={toggleSound} />
          </View>
        </View>

        {/* Perigo */}
        <View style={{ backgroundColor: t.surface, borderWidth: 1, borderColor: 'rgba(229,57,53,0.3)', borderRadius: 16, overflow: 'hidden' }}>
          <Pressable
            onPress={handleReset}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 }}
          >
            <Trash2 size={20} color="#E53935" />
            <View>
              <Text style={{ fontSize: 15, fontWeight: '500', color: '#E53935' }}>Apagar tudo</Text>
              <Text style={{ fontSize: 11, color: t.textSecondary }}>Remove todas as figurinhas</Text>
            </View>
          </Pressable>
        </View>

        {/* Sobre */}
        <View style={{ alignItems: 'center', paddingVertical: 24 }}>
          <Text style={{ fontSize: 13, color: t.textSecondary }}>Minha Copa 2026</Text>
          <Text style={{ fontSize: 11, color: t.textSecondary, opacity: 0.7, marginTop: 4 }}>v1.0.0 • by Robotics</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
