import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeIn, SlideInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

interface PacificDatePickerProps {
  visible: boolean;
  date: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  minDate?: Date;
}

export function PacificDatePicker({
  visible,
  date,
  onSelect,
  onClose,
  title = 'Select date',
  subtitle,
  minDate,
}: PacificDatePickerProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [viewYear, setViewYear] = useState(date.getFullYear());
  const [viewMonth, setViewMonth] = useState(date.getMonth());
  const [selectedDate, setSelectedDate] = useState(date);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const effectiveMin = useMemo(() => {
    if (!minDate) return today;
    const m = new Date(minDate);
    m.setHours(0, 0, 0, 0);
    return m > today ? m : today;
  }, [minDate, today]);

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const rows: (number | null)[][] = [];
    let currentRow: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      currentRow.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      currentRow.push(day);
      if (currentRow.length === 7) {
        rows.push(currentRow);
        currentRow = [];
      }
    }

    if (currentRow.length > 0) {
      while (currentRow.length < 7) currentRow.push(null);
      rows.push(currentRow);
    }

    return rows;
  }, [viewYear, viewMonth]);

  const isDisabled = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    return d < effectiveMin;
  };

  const isSelected = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getFullYear() === viewYear
    );
  };

  const isToday = (day: number) => {
    return (
      today.getDate() === day &&
      today.getMonth() === viewMonth &&
      today.getFullYear() === viewYear
    );
  };

  const handleDayPress = (day: number) => {
    if (isDisabled(day)) return;
    const newDate = new Date(viewYear, viewMonth, day);
    setSelectedDate(newDate);
  };

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedDate);
    onClose();
  };

  const canGoPrev = useMemo(() => {
    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    const lastDayOfPrev = getDaysInMonth(prevYear, prevMonth);
    const d = new Date(prevYear, prevMonth, lastDayOfPrev);
    return d >= effectiveMin;
  }, [viewMonth, viewYear, effectiveMin]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="none" visible={visible} onRequestClose={onClose}>
      <View style={s.overlay}>
        <Pressable style={s.scrim} onPress={onClose} />
        <Animated.View
          entering={SlideInDown.duration(350).springify().damping(20).stiffness(150)}
          style={[s.sheet, { backgroundColor: colors.surfaceBase }]}
        >
          <View style={s.dragHandleWrap}>
            <View style={[s.dragHandle, { backgroundColor: colors.contentDimmed }]} />
          </View>

          <View style={s.titleArea}>
            <View style={s.titleRow}>
              <Pressable onPress={onClose} hitSlop={12}>
                <Feather name="chevron-left" size={24} color={colors.contentPrimary} />
              </Pressable>
              <Text style={[s.titleText, { color: colors.contentPrimary }]}>{title}</Text>
              <View style={{ width: 24 }} />
            </View>
            {subtitle && (
              <Text style={[s.subtitleText, { color: colors.contentPrimary }]}>{subtitle}</Text>
            )}
          </View>

          <View style={s.controls}>
            <Pressable
              onPress={goToPrevMonth}
              style={[s.pillControl, { borderColor: colors.surfaceEdge, opacity: canGoPrev ? 1 : 0.4 }]}
              disabled={!canGoPrev}
              hitSlop={8}
            >
              <Text style={[s.pillText, { color: colors.contentPrimary }]}>{MONTH_SHORT[viewMonth]}</Text>
              <Feather name="chevron-left" size={12} color={colors.contentPrimary} />
            </Pressable>

            <Pressable
              onPress={goToNextMonth}
              style={[s.pillControl, { borderColor: colors.surfaceEdge }]}
              hitSlop={8}
            >
              <Text style={[s.pillText, { color: colors.contentPrimary }]}>{viewYear}</Text>
              <Feather name="chevron-right" size={12} color={colors.contentPrimary} />
            </Pressable>
          </View>

          <View style={s.calendar}>
            <View style={s.weekRow}>
              {DAYS_OF_WEEK.map((d, i) => (
                <View key={i} style={s.dayHeaderCell}>
                  <Text style={[s.dayHeaderText, { color: colors.contentSecondary }]}>{d}</Text>
                </View>
              ))}
            </View>

            {calendarDays.map((row, ri) => (
              <View key={ri} style={s.weekRow}>
                {row.map((day, di) => {
                  if (day === null) {
                    return <View key={di} style={s.dayCell} />;
                  }
                  const disabled = isDisabled(day);
                  const selected = isSelected(day);
                  const todayDay = isToday(day);

                  return (
                    <View key={di} style={s.dayCell}>
                      <Pressable
                        onPress={() => handleDayPress(day)}
                        disabled={disabled}
                        style={[
                          s.dayButton,
                          selected && { backgroundColor: colors.contentPrimary },
                          todayDay && !selected && { borderWidth: 1.5, borderColor: colors.contentPrimary },
                        ]}
                      >
                        <Text
                          style={[
                            s.dayText,
                            { color: disabled ? '#dbdad7' : selected ? colors.surfaceBase : '#5c5b5a' },
                            selected && { fontFamily: Fonts.bold },
                          ]}
                        >
                          {day}
                        </Text>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>

          <View style={[s.footer, { paddingBottom: insets.bottom || 16 }]}>
            <Pressable
              style={[s.confirmBtn, { backgroundColor: colors.contentPrimary }]}
              onPress={handleConfirm}
            >
              <Text style={[s.confirmText, { color: colors.surfaceBase }]}>Confirm</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10,10,10,0.5)',
  },
  sheet: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
  },
  dragHandleWrap: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 8,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 4,
  },
  titleArea: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleText: {
    flex: 1,
    fontSize: 20,
    fontFamily: Fonts.medium,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  subtitleText: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    lineHeight: 20,
    paddingLeft: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  pillControl: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 32,
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 8,
    gap: 4,
  },
  pillText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    lineHeight: 20,
  },
  calendar: {
    paddingHorizontal: 16,
    gap: 4,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayHeaderCell: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayHeaderText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    textAlign: 'center',
    letterSpacing: 0.1,
    lineHeight: 16,
  },
  dayCell: {
    flex: 1,
    height: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    lineHeight: 20,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  confirmBtn: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    letterSpacing: -0.2,
  },
});
