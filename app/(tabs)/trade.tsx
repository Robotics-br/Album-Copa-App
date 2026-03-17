import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme/ThemeProvider';
import AnimatedPressable from '../../src/components/ui/AnimatedPressable';
import QRCode from 'react-native-qrcode-svg';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useCollectionStore } from '../../src/store/useCollectionStore';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import StickerCard from '../../src/components/StickerCard';
import StickerCardLight from '../../src/components/StickerCardLight';
import StickerModal from '../../src/components/StickerModal';
import { generateStickerPdf } from '../../src/utils/pdfGenerator';
import { getStickerByCode, sectionMap } from '../../src/data/sections';
import { FlashList } from '@shopify/flash-list';
import type { Sticker } from '../../src/types';
import { HORIZONTAL_PADDING } from '../../src/utils/consts';
import ScreenHeader from '../../src/components/ScreenHeader';
import { compressDuplicates, decompressDuplicates } from '../../src/utils/qrCompression';
import { AppText as Text } from '../../src/components/ui/AppText';

type TradeTab = 'share' | 'scan';

export default function TradeScreen() {
  const t = useTheme();
  const { t: i18n_t } = useTranslation();
  const { width } = Dimensions.get('window');

  const [activeTab, setActiveTab] = useState<TradeTab>('share');
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedMatches, setScannedMatches] = useState<Sticker[]>([]);
  const [hasScanned, setHasScanned] = useState(false);
  const [qrPayload, setQrPayload] = useState('[]');
  const [exportingType, setExportingType] = useState<'duplicates' | 'missing' | null>(null);
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);

  const getQuantity = useCollectionStore((s) => s.getQuantity);
  const toggleSticker = useCollectionStore((s) => s.toggleSticker);
  const { soundEnabled, animationsEnabled } = useSettingsStore();

  useFocusEffect(
    useCallback(() => {
      const duplicates = useCollectionStore.getState().getDuplicatesList();
      setQrPayload(compressDuplicates(duplicates));

      return () => {
        setHasScanned(false);
        setScannedMatches([]);
      };
    }, [])
  );

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (hasScanned) return;
    setHasScanned(true);

    try {
      const scannedCodes = decompressDuplicates(data);
      if (scannedCodes.length > 0) {
        const usefulCodes = scannedCodes.filter((code) => getQuantity(code) === 0);

        const mappedStickers = usefulCodes
          .map((c) => getStickerByCode(c))
          .filter((s): s is Sticker => s !== undefined);

        setScannedMatches(mappedStickers);
      } else {
        setScannedMatches([]);
      }
    } catch {
      console.log('Invalid QR Code');
    }
  };

  const handleExport = async (type: 'duplicates' | 'missing') => {
    const isMissing = type === 'missing';
    const list = isMissing
      ? useCollectionStore.getState().getMissingList()
      : useCollectionStore.getState().getDuplicatesList();

    if (list.length === 0) {
      Alert.alert(
        i18n_t(isMissing ? 'trade.pdf_missing_title' : 'trade.pdf_duplicates_title'),
        i18n_t('album.empty')
      );
      return;
    }

    setExportingType(type);

    try {
      const collection = useCollectionStore.getState().collection;
      const title = i18n_t(isMissing ? 'trade.pdf_missing_title' : 'trade.pdf_duplicates_title');

      await generateStickerPdf(type, collection, title);
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      Alert.alert('Erro', `Não foi possível gerar o PDF: ${error.message}`);
    } finally {
      setExportingType(null);
    }
  };

  const renderShare = () => {
    return (
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: HORIZONTAL_PADDING,
          paddingBottom: Math.max(insets.bottom, 20),
        }}
        showsVerticalScrollIndicator={false}>
        <View
          className="rounded-3xl bg-white p-6"
          style={{
            elevation: 10,
            shadowColor: t.primary,
            shadowOpacity: 0.2,
            shadowRadius: 20,
          }}>
          <QRCode value={qrPayload} size={width * 0.5} backgroundColor="white" />
        </View>

        <View className="mt-8 items-center gap-3">
          <Text className="px-4 text-center text-[15px]" style={{ color: t.textSecondary }}>
            {i18n_t('trade.code_desc')}
          </Text>
          <Text
            className="px-6 text-center text-[15px] font-medium"
            style={{ color: t.primary, opacity: 0.9 }}>
            {i18n_t('trade.update_notice')}
          </Text>
        </View>

        <View className="mt-8 w-full items-center gap-4">
          <AnimatedPressable
            onPress={() => handleExport('duplicates')}
            disabled={exportingType !== null}
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t.primary,
              borderRadius: 16,
              paddingVertical: 16,
              opacity: exportingType !== null ? 0.7 : 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}>
            {exportingType === 'duplicates' ? (
              <ActivityIndicator size="small" color={t.onPrimary} />
            ) : (
              <Text className="text-[17px] font-bold" style={{ color: t.onPrimary }}>
                {i18n_t('trade.export_btn')}
              </Text>
            )}
          </AnimatedPressable>

          <AnimatedPressable
            onPress={() => handleExport('missing')}
            disabled={exportingType !== null}
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: t.surface,
              borderRadius: 16,
              paddingVertical: 16,
              borderWidth: 1,
              borderColor: t.border,
              opacity: exportingType !== null ? 0.7 : 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 1,
            }}>
            {exportingType === 'missing' ? (
              <ActivityIndicator size="small" color={t.primary} />
            ) : (
              <Text className="text-[17px] font-bold" style={{ color: t.primary }}>
                {i18n_t('trade.export_missing_btn')}
              </Text>
            )}
          </AnimatedPressable>
        </View>
      </ScrollView>
    );
  };

  const renderScan = () => {
    if (!permission) {
      return <View className="flex-1 items-center justify-center" />;
    }

    if (!permission.granted) {
      return (
        <View className="flex-1 items-center justify-center gap-4 p-6">
          <Text className="text-center text-[16px] font-semibold" style={{ color: t.text }}>
            {i18n_t('trade.cam_permission')}
          </Text>
          <AnimatedPressable
            onPress={requestPermission}
            className="rounded-xl px-6 py-3"
            style={{ backgroundColor: t.primary }}>
            <Text className="font-bold" style={{ color: t.onPrimary }}>
              {i18n_t('trade.scan_btn')}
            </Text>
          </AnimatedPressable>
        </View>
      );
    }

    return (
      <View className="flex-1 p-4">
        {!hasScanned ? (
          <View
            className="flex-1 overflow-hidden rounded-3xl border-2"
            style={{ borderColor: t.border }}>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              onBarcodeScanned={handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
            />
            <View className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 items-center justify-center">
              <View
                className="h-64 w-64 rounded-3xl border-4 border-primary bg-transparent"
                style={{ opacity: 0.8 }}
              />
            </View>
          </View>
        ) : (
          <View className="flex-1">
            {scannedMatches.length > 0 ? (
              <View className="flex-1 gap-4">
                <Text
                  className="mt-2 text-center text-[15px] font-semibold"
                  style={{ color: t.primary }}>
                  {i18n_t('trade.matches_found', { count: scannedMatches.length })}
                </Text>

                <FlashList
                  data={scannedMatches}
                  keyExtractor={(item) => item.code}
                  extraData={animationsEnabled}
                  numColumns={5}
                  ItemSeparatorComponent={() => <View className="h-2" />}
                  renderItem={({ item }) => {
                    const section = sectionMap.get(item.section);
                    const CardComponent = animationsEnabled ? StickerCard : StickerCardLight;
                    return (
                      <View className="flex-1 px-1">
                        <CardComponent
                          sticker={item}
                          flag={section?.icon ?? ''}
                          onPress={() => setSelectedSticker(item)}
                          t={t}
                          i18n_t={i18n_t}
                          toggleSticker={toggleSticker}
                          soundEnabled={soundEnabled}
                        />
                      </View>
                    );
                  }}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="text-center text-[15px]" style={{ color: t.textSecondary }}>
                  {i18n_t('trade.no_matches')}
                </Text>
              </View>
            )}

            <AnimatedPressable
              onPress={() => {
                setHasScanned(false);
                setScannedMatches([]);
              }}
              className="mt-4 items-center rounded-xl px-6 py-4"
              style={{ backgroundColor: t.primary, borderColor: t.border, borderTopWidth: 1 }}>
              <Text className="text-[15px] font-bold" style={{ color: t.onPrimary }}>
                {i18n_t('trade.scan_again', 'Escanear outro amigo')}
              </Text>
            </AnimatedPressable>
          </View>
        )}
      </View>
    );
  };

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-bg">
      <ScreenHeader titleKey="trade.title" />

      <View style={{ paddingHorizontal: HORIZONTAL_PADDING }} className="my-3">
        <View className="flex-row items-center rounded-xl border border-border bg-surface p-1">
          <AnimatedPressable
            onPress={() => {
              setActiveTab('share');
              setHasScanned(false);
              setScannedMatches([]);
            }}
            className="flex-1 items-center justify-center rounded-lg py-2.5"
            style={{ backgroundColor: activeTab === 'share' ? t.primary : 'transparent' }}>
            <Text
              className="text-[14px] font-bold"
              style={{ color: activeTab === 'share' ? t.onPrimary : t.textSecondary }}>
              {i18n_t('trade.tabs.share')}
            </Text>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => setActiveTab('scan')}
            className="flex-1 items-center justify-center rounded-lg py-2.5"
            style={{ backgroundColor: activeTab === 'scan' ? t.primary : 'transparent' }}>
            <Text
              className="text-[14px] font-bold"
              style={{ color: activeTab === 'scan' ? t.onPrimary : t.textSecondary }}>
              {i18n_t('trade.tabs.scan')}
            </Text>
          </AnimatedPressable>
        </View>
      </View>

      {activeTab === 'share' ? renderShare() : renderScan()}

      <StickerModal sticker={selectedSticker} onClose={() => setSelectedSticker(null)} />
    </View>
  );
}
