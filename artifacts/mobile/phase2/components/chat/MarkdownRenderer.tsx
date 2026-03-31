import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Fonts } from '../../constants/fonts';

type ContentBlock =
  | { type: 'text'; text: string; paragraphGap: boolean }
  | { type: 'bullet'; text: string; paragraphGap: boolean }
  | { type: 'header'; text: string }
  | { type: 'divider' };

function normalizeLine(raw: string): string {
  let line = raw.trim();

  line = line.replace(/\*{3}(.+?)\*{3}/g, '**$1**');
  line = line.replace(/_{3}(.+?)_{3}/g, '**$1**');
  line = line.replace(/_{2}(.+?)_{2}/g, '**$1**');

  line = line.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  line = line.replace(/`([^`]+)`/g, '$1');

  return line;
}

function classifyLine(line: string): { isHeader: boolean; isList: boolean; isRule: boolean; displayText: string } {
  const hashMatch = line.match(/^#{1,6}\s+(.*)/);
  if (hashMatch) {
    const content = hashMatch[1].trim();
    return { isHeader: true, isList: false, isRule: false, displayText: `**${content.replace(/^\*\*|\*\*$/g, '')}**` };
  }

  const blockquoteMatch = line.match(/^>\s?(.*)/);
  const effective = blockquoteMatch ? blockquoteMatch[1] : line;

  const isRule = /^[-*_]{3,}\s*$/.test(effective);
  if (isRule) return { isHeader: false, isList: false, isRule: true, displayText: effective };

  const isNumbered = /^\d+\.\s/.test(effective);
  const isStandaloneBold = /^\*\*[^*]+\*\*[:\s]*$/.test(effective);

  const isBullet = effective.startsWith('•') || effective.startsWith('- ') || effective === '-' || /^\*\s+/.test(effective);

  let promotedHeader = false;
  if (!isStandaloneBold && isBullet) {
    const stripped = effective.replace(/^[•\-\*]\s*/, '');
    if (/^\*\*[^*]+\*\*[:\s]*$/.test(stripped)) {
      promotedHeader = true;
    }
  }

  const isHeader = isStandaloneBold || promotedHeader;
  const isList = !isHeader && (isBullet || isNumbered);

  let displayText = effective;
  if (promotedHeader) {
    displayText = effective.replace(/^[•\-\*]\s*/, '');
  }
  if (isList && /^\*\s+/.test(displayText)) {
    displayText = '• ' + displayText.replace(/^\*\s+/, '');
  }

  return { isHeader, isList, isRule: false, displayText };
}

function parseContentBlocks(content: string): ContentBlock[] {
  const lines = content.split('\n');
  const blocks: ContentBlock[] = [];
  let prevWasBullet = false;
  let prevWasBlank = false;
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];

    if (/^`{3}/.test(rawLine.trim())) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) {
      const codeLine = rawLine.replace(/\t/g, '  ');
      blocks.push({ type: 'text', text: codeLine, paragraphGap: false });
      prevWasBlank = false;
      prevWasBullet = false;
      continue;
    }

    const normalized = normalizeLine(rawLine.replace(/^\s+/, ''));

    if (normalized === '') {
      if (blocks.length > 0) prevWasBlank = true;
      continue;
    }

    const { isHeader, isList, isRule, displayText: classified } = classifyLine(normalized);

    if (isRule) {
      prevWasBlank = true;
      prevWasBullet = false;
      continue;
    }

    const paragraphGap = blocks.length > 0 && !isHeader && (
      prevWasBlank
      || (isList && !prevWasBullet)
      || (!isList && prevWasBullet)
    );

    let displayText = classified;
    if (displayText.startsWith('- ')) {
      displayText = '• ' + displayText.slice(2);
    }
    if (/^\d+\.\s/.test(displayText) && isList) {
      displayText = displayText.replace(/^\d+\.\s*/, '• ');
    }
    displayText = displayText.replace(/^(•\s*){2,}/, '• ');

    if (isHeader) {
      if (!displayText.startsWith('**')) {
        displayText = `**${displayText}**`;
      }
      const hasNonHeaderContent = blocks.some(b => b.type !== 'header' && b.type !== 'divider');
      if (hasNonHeaderContent) {
        blocks.push({ type: 'divider' });
      }
      blocks.push({ type: 'header', text: displayText });
    } else if (isList) {
      blocks.push({ type: 'bullet', text: displayText, paragraphGap });
    } else {
      blocks.push({ type: 'text', text: displayText, paragraphGap });
    }

    prevWasBullet = isList;
    prevWasBlank = false;
  }

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === 'bullet' && /^\*\*[^*]+\*\*[:\s]*$/.test(b.text.replace(/^•\s*/, ''))) {
      const headerText = b.text.replace(/^•\s*/, '');
      const hasNonHeaderContent = blocks.slice(0, i).some(bl => bl.type !== 'header' && bl.type !== 'divider');
      if (hasNonHeaderContent) {
        blocks.splice(i, 1, { type: 'divider' }, { type: 'header', text: headerText });
        i++;
      } else {
        blocks[i] = { type: 'header', text: headerText };
      }
    }
  }

  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type !== 'header') continue;
    let next = i + 1;
    while (next < blocks.length && blocks[next].type === 'divider') next++;
    if (next < blocks.length && blocks[next].type === 'header') {
      const headerBlock = blocks[i] as { type: 'header'; text: string };
      blocks[i] = { type: 'text', text: headerBlock.text, paragraphGap: false };
      if (next === i + 2 && blocks[i + 1].type === 'divider') {
        blocks.splice(i + 1, 1);
      }
    }
  }

  return blocks;
}

export function formatInlineStyles(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const inlineRegex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;
  let keyIdx = 0;

  while ((match = inlineRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<Text key={keyIdx++}>{text.slice(lastIndex, match.index)}</Text>);
    }
    parts.push(
      <Text key={keyIdx++} style={{ fontFamily: Fonts.medium, lineHeight: 20 }}>
        {match[1]}
      </Text>
    );
    lastIndex = match.index + match[0].length;
  }

  const remaining = text.slice(lastIndex);
  if (remaining) {
    const cleaned = remaining.replace(/\*+/g, '');
    if (cleaned) parts.push(<Text key={keyIdx++}>{cleaned}</Text>);
  }

  return parts.length > 0 ? parts : [<Text key={0}>{text}</Text>];
}

function BlockDivider() {
  const { colors } = useTheme();
  return <View style={[styles.divider, { backgroundColor: colors.surfaceEdge }]} />;
}

function TextBlock({ block }: { block: Extract<ContentBlock, { type: 'text' }> }) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.aiText, { color: colors.contentPrimary }, block.paragraphGap && { marginTop: 8 }]}>
      {formatInlineStyles(block.text)}
    </Text>
  );
}

function BulletBlock({ block }: { block: Extract<ContentBlock, { type: 'bullet' }> }) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.aiText, styles.bulletText, { color: colors.contentPrimary }, block.paragraphGap && { marginTop: 8 }]}>
      {formatInlineStyles(block.text)}
    </Text>
  );
}

function HeaderBlock({ block }: { block: Extract<ContentBlock, { type: 'header' }> }) {
  const { colors } = useTheme();
  return (
    <Text style={[styles.aiText, styles.headerText, { color: colors.contentPrimary }]}>
      {formatInlineStyles(block.text)}
    </Text>
  );
}

function renderBlock(block: ContentBlock, index: number): React.ReactNode {
  switch (block.type) {
    case 'divider':
      return <BlockDivider key={`div-${index}`} />;
    case 'header':
      return <HeaderBlock key={`hdr-${index}`} block={block} />;
    case 'bullet':
      return <BulletBlock key={`blt-${index}`} block={block} />;
    case 'text':
      return <TextBlock key={`txt-${index}`} block={block} />;
    default:
      return null;
  }
}

export function renderContent(content: string): React.ReactNode[] {
  const blocks = parseContentBlocks(content);
  return blocks.map((block, i) => renderBlock(block, i));
}

export { parseContentBlocks };

const styles = StyleSheet.create({
  divider: {
    height: 0.75,
    marginVertical: 16,
  },
  aiText: { fontSize: 16, fontFamily: Fonts.regular, lineHeight: 20, paddingHorizontal: 4 },
  headerText: { fontSize: 18, fontFamily: Fonts.medium, letterSpacing: -0.2, lineHeight: 24 },
  bulletText: {},
});
