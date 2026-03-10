import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { MapPin, Users } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import type { Stadium } from '../data/stadiums';

export default function StadiumCard({ stadium }: { stadium: Stadium }) {
  const t = useTheme();
  const [imgError, setImgError] = useState(false);

  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 12,
        padding: 12,
        backgroundColor: t.surface,
      }}>
      <View
        style={{
          width: 90,
          height: 64,
          borderRadius: 8,
          overflow: 'hidden',
          backgroundColor: t.surfaceLight,
          borderWidth: 1,
          borderColor: t.border,
        }}>
        {!imgError ? (
          <Image
            source={{ uri: stadium.image }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={32} color={t.gold} />
          </View>
        )}
      </View>
      <View style={{ flex: 1, justifyContent: 'center', gap: 4 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: t.text }}>{stadium.name}</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <MapPin size={12} color={t.textSecondary} />
            <Text style={{ fontSize: 11, color: t.textSecondary }}>{stadium.city}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Users size={12} color={t.gold} />
            <Text style={{ fontSize: 11, color: t.gold }}>{stadium.capacity}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
