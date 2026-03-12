import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/theme/ThemeProvider';
import AnimatedPressable from '../../src/components/ui/AnimatedPressable';
import QRCode from 'react-native-qrcode-svg';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useCollectionStore } from '../../src/store/useCollectionStore';
import { useSettingsStore } from '../../src/store/useSettingsStore';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';

import StickerCard from '../../src/components/StickerCard';
import StickerCardLight from '../../src/components/StickerCardLight';
import { getStickerByCode, getTeamById } from '../../src/data/teams';
import { FlashList } from '@shopify/flash-list';
import type { Sticker } from '../../src/types';
import { HORIZONTAL_PADDING } from '../../src/utils/consts';

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
  const [isExporting, setIsExporting] = useState(false);

  const getQuantity = useCollectionStore((s) => s.getQuantity);
  const toggleSticker = useCollectionStore((s) => s.toggleSticker);
  const { soundEnabled, animationsEnabled } = useSettingsStore();

  useFocusEffect(
    useCallback(() => {
      const duplicates = useCollectionStore.getState().getDuplicatesList();
      setQrPayload(JSON.stringify(duplicates));
    }, [])
  );

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (hasScanned) return;
    setHasScanned(true);

    try {
      const scannedCodes: string[] = JSON.parse(data);
      if (Array.isArray(scannedCodes)) {
        const usefulCodes = scannedCodes.filter((code) => getQuantity(code) === 0);

        const mappedStickers = usefulCodes
          .map((c) => getStickerByCode(c))
          .filter((s): s is Sticker => s !== undefined);

        setScannedMatches(mappedStickers);
      }
    } catch (error) {
      console.log('Invalid QR Code');
    }
  };

  const handleExport = async () => {
    const duplicates = useCollectionStore.getState().getDuplicatesList();
    if (duplicates.length === 0) {
      Alert.alert(i18n_t('trade.pdf_title'), i18n_t('album.empty'));
      return;
    }

    setIsExporting(true);

    try {
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert('Erro', 'O compartilhamento não está disponível neste dispositivo.');
        setIsExporting(false);
        return;
      }

      const asset = Asset.fromModule(require('../../assets/images/app-logo.jpeg'));
      await asset.downloadAsync();

      const uri = asset.localUri || asset.uri;
      if (!uri) throw new Error('Could not resolve asset URI');

      const file = new File(uri);
      const base64 = await file.base64();
      const logoBase64 = `data:image/jpeg;base64,${base64}`;

      const stickerItems = duplicates
        .map((code) => {
          const s = getStickerByCode(code);
          return s
            ? `<li><strong>${s.code}</strong> - ${i18n_t(`teams.${s.section}`)}: ${s.name}</li>`
            : '';
        })
        .filter(Boolean)
        .join('');

      const html = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
            <style>
              body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #0F1923; }
              .header { display: flex; align-items: center; margin-bottom: 40px; border-bottom: 2px solid #E2B01F; padding-bottom: 20px; }
              .logo { width: 60px; height: 60px; border-radius: 12px; margin-right: 20px; }
              .title { font-size: 24px; font-weight: bold; color: #0F1923; margin: 0; }
              ul { list-style: none; padding: 0; }
              li { font-size: 16px; padding: 10px 0; border-bottom: 1px solid #f0f0f0; }
              strong { color: #E2B01F; }
            </style>
          </head>
          <body>
            <div class="header">
              <img src="${logoBase64}" class="logo" />
              <h1 class="title">${i18n_t('trade.pdf_title')}</h1>
            </div>
            <ul>
              ${stickerItems}
            </ul>
          </body>
        </html>
      `;

      const { uri: pdfUri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(pdfUri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      Alert.alert('Erro', `Não foi possível gerar o PDF: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const renderShare = () => {
    return (
      <View className="flex-1 items-center justify-center gap-6 p-6">
        <View
          className="rounded-3xl bg-white p-6"
          style={{ elevation: 10, shadowColor: t.gold, shadowOpacity: 0.2, shadowRadius: 20 }}>
          <QRCode value={qrPayload} size={width * 0.65} color="#0F1923" backgroundColor="white" />
        </View>
        <Text className="px-4 text-center text-[15px]" style={{ color: t.textSecondary }}>
          {i18n_t('trade.code_desc')}
        </Text>
        <Text
          className="mt-2 px-6 text-center text-[15px] font-medium"
          style={{ color: t.gold, opacity: 0.9 }}>
          {i18n_t('trade.update_notice')}
        </Text>

        <AnimatedPressable
          onPress={handleExport}
          disabled={isExporting}
          className="mt-6 flex-row items-center gap-3 rounded-2xl px-8 py-4"
          style={{ backgroundColor: t.gold, opacity: isExporting ? 0.7 : 1 }}>
          {isExporting ? (
            <ActivityIndicator size="small" color="#0F1923" />
          ) : (
            <Text className="text-[16px] font-bold text-[#0F1923]">
              {i18n_t('trade.export_btn')}
            </Text>
          )}
        </AnimatedPressable>
      </View>
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
            style={{ backgroundColor: t.gold }}>
            <Text className="font-bold text-[#0F1923]">{i18n_t('trade.scan_btn')}</Text>
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
                className="h-64 w-64 rounded-3xl border-4 border-gold bg-transparent"
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
                  style={{ color: t.owned }}>
                  {i18n_t('trade.matches_found', { count: scannedMatches.length })}
                </Text>

                <FlashList
                  data={scannedMatches}
                  keyExtractor={(item) => item.code}
                  extraData={animationsEnabled}
                  numColumns={5}
                  ItemSeparatorComponent={() => <View className="h-2" />}
                  renderItem={({ item }) => {
                    const team = getTeamById(item.section);
                    const CardComponent = animationsEnabled ? StickerCard : StickerCardLight;
                    return (
                      <View className="flex-1 px-1">
                        <CardComponent
                          sticker={item}
                          flag={team?.flag ?? ''}
                          onPress={() => {}}
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
              style={{ backgroundColor: t.surfaceLight, borderColor: t.border, borderTopWidth: 1 }}>
              <Text className="text-[15px] font-bold" style={{ color: t.text }}>
                Escanear outro amigo
              </Text>
            </AnimatedPressable>
          </View>
        )}
      </View>
    );
  };

  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <View style={{ paddingHorizontal: HORIZONTAL_PADDING }} className="py-2">
        <Text className="text-[18px] font-bold uppercase text-gold">{i18n_t('trade.title')}</Text>
        <Text className="text-[13px] text-text-secondary">{i18n_t('trade.subtitle')}</Text>
      </View>

      <View style={{ paddingHorizontal: HORIZONTAL_PADDING }} className="mb-2 mt-2">
        <View className="flex-row items-center rounded-xl border border-border bg-surface-light p-1">
          <AnimatedPressable
            onPress={() => setActiveTab('share')}
            className="flex-1 items-center justify-center rounded-lg py-2.5"
            style={{ backgroundColor: activeTab === 'share' ? t.gold : 'transparent' }}>
            <Text
              className="text-[14px] font-bold"
              style={{ color: activeTab === 'share' ? '#0F1923' : t.textSecondary }}>
              {i18n_t('trade.tabs.share')}
            </Text>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => setActiveTab('scan')}
            className="flex-1 items-center justify-center rounded-lg py-2.5"
            style={{ backgroundColor: activeTab === 'scan' ? t.gold : 'transparent' }}>
            <Text
              className="text-[14px] font-bold"
              style={{ color: activeTab === 'scan' ? '#0F1923' : t.textSecondary }}>
              {i18n_t('trade.tabs.scan')}
            </Text>
          </AnimatedPressable>
        </View>
      </View>

      {activeTab === 'share' ? renderShare() : renderScan()}
    </View>
  );
}
