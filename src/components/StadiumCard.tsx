import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { MapPin, Users } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import type { Stadium } from '../data/stadiums';

export default function StadiumCard({ stadium }: { stadium: Stadium }) {
  const t = useTheme();
  const [imgError, setImgError] = useState(false);

  return (
    <View className="flex-row gap-3 bg-surface p-3">
      <View className="border-border h-16 w-[90px] overflow-hidden rounded-lg border bg-surface-light">
        {!imgError ? (
          <Image
            source={{ uri: stadium.image }}
            className="h-full w-full"
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <MapPin size={32} color={t.gold} />
          </View>
        )}
      </View>
      <View className="flex-1 justify-center gap-1">
        <Text className="text-text text-[13px] font-bold">{stadium.name}</Text>
        <View className="flex-row gap-3">
          <View className="flex-row items-center gap-1">
            <MapPin size={12} color={t.textSecondary} />
            <Text className="text-text-secondary text-[11px]">{stadium.city}</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Users size={12} color={t.gold} />
            <Text className="text-[11px] text-gold">{stadium.capacity}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
