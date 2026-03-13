import React, { useState } from 'react';
import { View, Text, Image, Pressable, Modal, Dimensions } from 'react-native';
import { MapPin, Users, Calendar, ChevronDown, ChevronUp, X } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import type { Stadium } from '../data/stadiums';
import Animated, { FadeInDown, Layout, FadeIn, FadeOut } from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function StadiumCard({ stadium }: { stadium: Stadium }) {
  const t = useTheme();
  const { t: i18n_t } = useTranslation();
  const [imgError, setImgError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Internationalized values
  const translatedName = i18n_t(`stadiums.data.${stadium.id}.name`, { defaultValue: stadium.name });
  const translatedDesc = i18n_t(stadium.descriptionKey, { defaultValue: '' });
  const hasDescription = translatedDesc.length > 0;

  // Handle local vs remote image
  const imageSource = typeof stadium.image === 'string' ? { uri: stadium.image } : stadium.image;

  return (
    <Animated.View layout={Layout.springify()} className="overflow-hidden bg-surface">
      <View className="flex-row gap-3 p-3">
        {/* Stadium Image Thumbnail */}
        <Pressable
          onPress={() => !imgError && setShowImageModal(true)}
          className="h-16 w-[95px] overflow-hidden rounded-lg border border-border bg-surface-light active:opacity-80">
          {!imgError ? (
            <Image
              source={imageSource}
              className="h-full w-full"
              resizeMode="cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <MapPin size={32} color={t.gold} />
            </View>
          )}
        </Pressable>

        {/* Info Content - Clickable to Expand */}
        <Pressable
          onPress={() => hasDescription && setExpanded(!expanded)}
          className="flex-1 justify-center gap-1 active:opacity-70">
          <View className="flex-row items-center justify-between">
            <Text className="flex-1 text-[13px] font-bold text-text" numberOfLines={1}>
              {translatedName}
            </Text>
            {hasDescription && (
              <View className="ml-2">
                {expanded ? (
                  <ChevronUp size={16} color={t.gold} />
                ) : (
                  <ChevronDown size={16} color={t.textSecondary} />
                )}
              </View>
            )}
          </View>

          <View className="flex-row flex-wrap gap-x-3 gap-y-1">
            <View className="flex-row items-center gap-1">
              <MapPin size={11} color={t.textSecondary} />
              <Text className="text-[11px] text-text-secondary">{stadium.city}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Users size={11} color={t.gold} />
              <Text className="text-[11px] text-gold">{stadium.capacity}</Text>
            </View>
            {stadium.opened && (
              <View className="flex-row items-center gap-1">
                <Calendar size={11} color={t.textSecondary} />
                <Text className="text-[11px] text-text-secondary">
                  {i18n_t('stadiums.opened', { year: stadium.opened })}
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      </View>

      {expanded && hasDescription && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          className="border-border/10 bg-surface-light/30 border-t px-4 pb-4 pt-2">
          <Text className="text-[12px] leading-[18px] text-text-secondary">{translatedDesc}</Text>
        </Animated.View>
      )}

      {/* Full Screen Image Modal */}
      <Modal
        visible={showImageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}>
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.9)' }}
          onPress={() => setShowImageModal(false)}
          className="items-center justify-center p-4">
          <Animated.View
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
            className="w-full shadow-2xl">
            <View className="absolute right-0 top-[-50] z-50">
              <X color="white" size={32} />
            </View>

            <Image
              source={imageSource}
              style={{
                width: SCREEN_WIDTH - 40,
                height: (SCREEN_WIDTH - 40) * 0.7,
                borderRadius: 16,
              }}
              resizeMode="contain"
            />

            <View className="mt-4 items-center">
              <Text className="text-center text-[18px] font-bold text-white">{translatedName}</Text>
              <Text className="text-center text-[14px] text-gray-400">
                {stadium.city}, {stadium.country}
              </Text>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    </Animated.View>
  );
}
