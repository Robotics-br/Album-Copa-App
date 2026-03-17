import { Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { sections, getStickersBySection } from '../data/sections';
import { themeMap } from '../theme/themes';
import { LOGO_BASE64 } from './logo_base64';
import i18n from '../i18n';
import type { Section, Sticker, UserCollection } from '../types';

export type PdfExportType = 'duplicates' | 'missing';

export async function generateStickerPdf(
  type: 'duplicates' | 'missing',
  collection: UserCollection,
  translatedTitle: string
) {
  try {
    if (!(await Sharing.isAvailableAsync())) {
      throw new Error('Sharing is not available on this device');
    }

    const isMissingType = type === 'missing';
    const logoBase64 = LOGO_BASE64;

    const sectionsData = sections
      .map((section: Section) => {
        const sectionStickers = getStickersBySection(section.id);

        const sectionItems = sectionStickers
          .filter((s: Sticker) => {
            if (isMissingType) {
              return (collection[s.code] ?? 0) === 0;
            }
            return (collection[s.code] ?? 0) > 1;
          })
          .map((s: Sticker) => ({
            ...s,
            qty: isMissingType ? 1 : (collection[s.code] ?? 0) - 1,
          }));

        const sectionOwned = sectionStickers.filter((s) => (collection[s.code] ?? 0) > 0).length;

        return {
          ...section,
          items: sectionItems,
          owned: sectionOwned,
          total: sectionStickers.length,
        };
      })
      .filter((s: any) => s.items.length > 0);

    if (sectionsData.length === 0) {
      return false; // Indicativo de que está vazio
    }

    const STICKERS_PER_ROW = 10;
    const PAGE_MAX_HEIGHT = Platform.OS === 'android' ? 1030 : 900;
    const MAIN_HEADER_HEIGHT = 100;
    const pages: any[] = [];
    let currentPage: any[] = [];
    let currentHeight = MAIN_HEADER_HEIGHT;

    sectionsData.forEach((section: any) => {
      const rows = Math.ceil(section.items.length / STICKERS_PER_ROW);
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
            const gridHtml = section.items
              .map(
                (s: any) => `
          <div class="sticker-box ${isMissingType ? 'missing' : ''}">
            ${s.code}
            ${!isMissingType && s.qty > 1 ? `<div class="badge">+${s.qty}</div>` : ''}
          </div>
        `
              )
              .join('');

            const nameKey =
              section.id === 'special' || section.id === 'stadiums'
                ? `sections.${section.id}`
                : `teams.${section.id}`;

            return `
        <div class="team-section">
          <div class="team-header">
            <span class="flag">${section.icon}</span>
            <span class="team-name">${i18n.t(nameKey)}</span>
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
          <h1 class="title">${translatedTitle}</h1>
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
        .team-name { font-size: 18px; font-weight: bold; color: ${pdfColors.text}; flex: 1; text-transform: capitalize; }
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
    // Don't await shareAsync to avoid hanging state if the share sheet is dismissed or misbehaves
    Sharing.shareAsync(pdfUri, { UTI: '.pdf', mimeType: 'application/pdf' }).catch((err) => {
      console.error('Sharing error:', err);
    });
    return true;
  } catch (error: any) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
