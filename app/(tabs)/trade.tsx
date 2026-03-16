import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
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
import { themeMap } from '../../src/theme/themes';
import { LOGO_BASE64 } from '../../src/utils/logo_base64';
import StickerCard from '../../src/components/StickerCard';
import StickerCardLight from '../../src/components/StickerCardLight';
import StickerModal from '../../src/components/StickerModal';
import {
  sections,
  getStickerByCode,
  getStickersBySection,
  sectionMap,
} from '../../src/data/sections';
import { FlashList } from '@shopify/flash-list';
import type { Section, Sticker } from '../../src/types';
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
  const [isExporting, setIsExporting] = useState(false);
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

  const handleExport = async () => {
    const duplicatesList = useCollectionStore.getState().getDuplicatesList();
    if (duplicatesList.length === 0) {
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

      const logoBase64 = LOGO_BASE64;

      const collection = useCollectionStore.getState().collection;
      const sectionsWithDuplicates = sections
        .map((section: Section) => {
          const sectionStickers = getStickersBySection(section.id);
          const sectionDuplicates = sectionStickers
            .filter((s: Sticker) => (collection[s.code] ?? 0) > 1)
            .map((s: Sticker) => ({ ...s, qty: (collection[s.code] ?? 0) - 1 }));

          const sectionOwned = sectionStickers.filter((s) => (collection[s.code] ?? 0) > 0).length;

          return {
            ...section,
            duplicates: sectionDuplicates,
            owned: sectionOwned,
            total: sectionStickers.length,
          };
        })
        .filter((s: any) => s.duplicates.length > 0);

      const STICKERS_PER_ROW = 10;
      const PAGE_MAX_HEIGHT = Platform.OS === 'android' ? 1030 : 900;
      const MAIN_HEADER_HEIGHT = 100;
      const pages: any[] = [];
      let currentPage: any[] = [];
      let currentHeight = MAIN_HEADER_HEIGHT;

      sectionsWithDuplicates.forEach((section: any) => {
        const rows = Math.ceil(section.duplicates.length / STICKERS_PER_ROW);
        const sectionHeight = 50 + rows * 65 + 20;

        if (currentHeight + sectionHeight > PAGE_MAX_HEIGHT && currentPage.length > 0) {
          pages.push(currentPage);
          currentPage = [section];
          currentHeight = MAIN_HEADER_HEIGHT + sectionHeight;
        } else {
          currentPage.push(section);
          currentHeight += sectionHeight;
        }
      });

      if (currentPage.length > 0) {
        pages.push(currentPage);
      }

      const pdfTheme = themeMap['original-light'];
      const pdfColors = {
        bg: '#ffffff',
        text: pdfTheme.text,
        textSecondary: pdfTheme.textSecondary,
        border: pdfTheme.border,
        primary: pdfTheme.primary,
        owned: pdfTheme.owned,
        duplicate: pdfTheme.duplicate,
        missingStickerBg: pdfTheme.missingStickerBg,
        ownedStickerTextColor: '#000000',
      };

      const pagesHtml = pages
        .map((pageSections: any[]) => {
          const pageContent = pageSections
            .map((section: any) => {
              const gridHtml = section.duplicates
                .map(
                  (s: any) => `
            <div class="sticker-box">
              ${s.code}
              ${s.qty > 1 ? `<div class="badge">+${s.qty}</div>` : ''}
            </div>
          `
                )
                .join('');

              const isSpecial = section.id === 'special' || section.id === 'stadiums';
              const nameKey = isSpecial ? `sections.${section.id}` : `teams.${section.id}`;

              return `
          <div class="team-section">
            <div class="team-header">
              <span class="flag">${section.icon}</span>
              <span class="team-name">${i18n_t(nameKey)}</span>
              <span class="team-count">${section.owned}/${section.total}</span>
            </div>
            <div class="grid">
              ${gridHtml}
            </div>
          </div>
        `;
            })
            .join('');

          return `
        <div class="page">
          <div class="header-content">
            <img src="${logoBase64}" class="logo" />
            <h1 class="title">${i18n_t('trade.pdf_title')}</h1>
          </div>
          <div class="page-body">
            ${pageContent}
          </div>
        </div>
      `;
        })
        .join('');

      const html = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            @page { 
              margin: 5mm 10mm 5mm 10mm; 
            }
            body { 
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
              margin: 0;
              padding: 0; 
              color: ${pdfColors.text}; 
              background-color: ${pdfColors.bg};
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .page {
              padding-bottom: 10px;
            }
            .page + .page {
              page-break-before: always; 
            }

            .header-content { 
              display: block; 
              width: 100%;
              padding-bottom: 10px;
              margin-bottom: 15px;
              border-bottom: 3px solid ${pdfColors.primary};
              text-align: left;
            }
            .logo { 
              width: 60px; 
              height: 60px; 
              border-radius: 12px; 
              margin-right: 15px;
              display: inline-block;
              vertical-align: middle;
            }
            .title { 
              font-size: 26px; 
              font-weight: bold; 
              color: ${pdfColors.primary}; 
              margin: 0; 
              line-height: 1.2; 
              display: inline-block;
              vertical-align: middle;
            }
            
            .team-section { 
              width: 100%;
              margin-bottom: 30px;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .team-header { 
              display: flex; 
              align-items: center; 
              gap: 12px; 
              margin-bottom: 15px; 
              padding-bottom: 10px;
              border-bottom: 1px solid ${pdfColors.border};
            }
            .flag { font-size: 22px; margin-right: 12px; }
            .team-name { font-size: 18px; font-weight: bold; color: ${pdfColors.text}; flex: 1; }
            .team-count { font-size: 15px; color: ${pdfColors.textSecondary}; font-weight: 500; }
            
            .grid { 
              display: flex; 
              flex-wrap: wrap; 
              gap: 12px; 
              max-width: 670px;
            }
            .sticker-box {
              width: 52px;
              height: 52px;
              border: 2px solid ${pdfColors.owned};
              background-color: ${pdfColors.owned};
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 11px;
              font-weight: bold;
              color: #ffffff;
              position: relative;
            }
            .badge {
              position: absolute;
              top: -8px;
              right: -8px;
              background-color: ${pdfColors.duplicate};
              color: ${pdfColors.ownedStickerTextColor};
              border-radius: 12px;
              padding: 2px 6px;
              font-size: 9px;
              border: 1.5px solid #ffffff;
              box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
          </style>
        </head>
        <body>
          ${pagesHtml}
        </body>
      </html>
    `;

      const { uri: pdfUri } = await Print.printToFileAsync({ html });

      setIsExporting(false);

      await Sharing.shareAsync(pdfUri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      Alert.alert('Erro', `Não foi possível gerar o PDF: ${error.message}`);
      setIsExporting(false);
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
          paddingTop: 10,
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
          <QRCode value={qrPayload} size={width * 0.65} backgroundColor="white" />
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

        <AnimatedPressable
          onPress={handleExport}
          disabled={isExporting}
          className="mt-8 flex-row items-center gap-3 rounded-2xl px-12 py-4 shadow-sm"
          style={{ backgroundColor: t.primary, opacity: isExporting ? 0.7 : 1 }}>
          {isExporting ? (
            <ActivityIndicator size="small" color={t.onPrimary} />
          ) : (
            <Text className="text-[17px] font-bold" style={{ color: t.onPrimary }}>
              {i18n_t('trade.export_btn')}
            </Text>
          )}
        </AnimatedPressable>
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
    <View className="flex-1 bg-bg" style={{ paddingTop: insets.top }}>
      <ScreenHeader titleKey="trade.title" />

      <View style={{ paddingHorizontal: HORIZONTAL_PADDING }} className="mb-2 mt-2">
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
