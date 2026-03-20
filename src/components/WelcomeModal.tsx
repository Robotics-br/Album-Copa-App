import React, { useState } from 'react';
import { View, Modal } from 'react-native';
import { AppText as Text } from './ui/AppText';
import { BookOpen, ListPlus, Filter, QrCode, CalendarDays, Settings } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import { useSettingsStore } from '../store/useSettingsStore';
import AnimatedPressable from './ui/AnimatedPressable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function WelcomeModal() {
  const t = useTheme();
  const { t: i18n_t } = useTranslation();
  const { hasSeenOnboarding, completeOnboarding } = useSettingsStore();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(1);

  if (hasSeenOnboarding) return null;

  const totalSteps = 6;

  const getStepIcon = () => {
    const size = 64;
    const color = t.primary;
    switch (step) {
      case 1:
        return <BookOpen size={size} color={color} />;
      case 2:
        return <ListPlus size={size} color={color} />;
      case 3:
        return <Filter size={size} color={color} />;
      case 4:
        return <QrCode size={size} color={color} />;
      case 5:
        return <CalendarDays size={size} color={color} />;
      case 6:
        return <Settings size={size} color={color} />;
      default:
        return <BookOpen size={size} color={color} />;
    }
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <Modal visible={true} transparent animationType="fade" onRequestClose={() => {}}>
      <View
        className="flex-1 justify-center bg-black/80 px-4"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
        <View className="rounded-[24px] border-2 border-primary bg-surface p-6 shadow-xl">
          <View className="mb-4 items-center justify-center p-4">{getStepIcon()}</View>

          <Text className="mb-3 text-center text-[22px] font-black text-text">
            {i18n_t(`onboarding.step${step}_title`)}
          </Text>

          <Text className="mb-8 text-center text-[15px] leading-6 text-text-secondary">
            {i18n_t(`onboarding.step${step}_desc`)}
          </Text>

          <View className="mb-8 flex-row justify-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <View
                key={i}
                className="h-2 rounded-full"
                style={{
                  width: step === i + 1 ? 24 : 8,
                  backgroundColor: step === i + 1 ? t.primary : t.border,
                }}
              />
            ))}
          </View>

          <View className="flex-row items-center gap-3">
            {step > 1 && (
              <AnimatedPressable
                onPress={handleBack}
                className="flex-1 items-center rounded-xl border-2 border-border py-3.5">
                <Text className="text-[15px] font-bold text-text-secondary">
                  {i18n_t('onboarding.btn_back')}
                </Text>
              </AnimatedPressable>
            )}

            <AnimatedPressable
              onPress={handleNext}
              className="flex-[2] items-center rounded-xl bg-primary py-3.5"
              style={{ borderWidth: 2, borderColor: t.primary }}>
              <Text className="text-[15px] font-bold text-on-primary">
                {step === totalSteps
                  ? i18n_t('onboarding.btn_start')
                  : i18n_t('onboarding.btn_next')}
              </Text>
            </AnimatedPressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
