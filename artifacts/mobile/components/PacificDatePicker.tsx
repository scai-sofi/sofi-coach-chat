import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, ScrollView } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeIn, SlideInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Fonts } from '@/constants/fonts';
import Svg, { Path } from 'react-native-svg';

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const YEAR_RANGE_START = 2021;
const YEAR_RANGE_END = 2035;
const YEAR_ROW_HEIGHT = 48;

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function ChevronDown({ color, size = 12 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <Path d="M3 4.5L6 7.5L9 4.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function CheckMark({ color }: { color: string }) {
  return (
    <Svg width={16} height={12} viewBox="0 0 16 12" fill="none">
      <Path d="M1 6L6 11L15 1" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
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
  const [pickerMode, setPickerMode] = useState<'calendar' | 'year' | 'month'>('calendar');
  const yearScrollRef = useRef<ScrollView>(null);
  const monthScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (visible) {
      setPickerMode('calendar');
      setViewYear(date.getFullYear());
      setViewMonth(date.getMonth());
      setSelectedDate(date);
    }
  }, [visible]);

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

  const years = useMemo(() => {
    const list: number[] = [];
    for (let y = YEAR_RANGE_START; y <= YEAR_RANGE_END; y++) {
      list.push(y);
    }
    return list;
  }, []);

  useEffect(() => {
    if (pickerMode === 'year' && yearScrollRef.current) {
      const idx = viewYear - YEAR_RANGE_START;
      const offset = Math.max(0, (idx * YEAR_ROW_HEIGHT) - (YEAR_ROW_HEIGHT * 3));
      setTimeout(() => {
        yearScrollRef.current?.scrollTo({ y: offset, animated: false });
      }, 50);
    }
    if (pickerMode === 'month' && monthScrollRef.current) {
      const offset = Math.max(0, (viewMonth * YEAR_ROW_HEIGHT) - (YEAR_ROW_HEIGHT * 3));
      setTimeout(() => {
        monthScrollRef.current?.scrollTo({ y: offset, animated: false });
      }, 50);
    }
  }, [pickerMode, viewYear, viewMonth]);

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

  const handleYearSelect = (year: number) => {
    setViewYear(year);
    const maxDay = getDaysInMonth(year, viewMonth);
    const clampedDay = Math.min(selectedDate.getDate(), maxDay);
    setSelectedDate(new Date(year, viewMonth, clampedDay));
    setPickerMode('calendar');
  };

  const handleMonthSelect = (month: number) => {
    setViewMonth(month);
    const maxDay = getDaysInMonth(viewYear, month);
    const clampedDay = Math.min(selectedDate.getDate(), maxDay);
    setSelectedDate(new Date(viewYear, month, clampedDay));
    setPickerMode('calendar');
  };

  const handleConfirm = () => {
    onSelect(selectedDate);
    onClose();
  };

  if (!visible) return null;

  const isCalendar = pickerMode === 'calendar';
  const isYearMode = pickerMode === 'year';
  const isMonthMode = pickerMode === 'month';

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
              {!isCalendar ? (
                <Pressable onPress={() => setPickerMode('calendar')} hitSlop={12}>
                  <Feather name="chevron-left" size={24} color={colors.contentPrimary} />
                </Pressable>
              ) : (
                <View style={{ width: 24 }} />
              )}
              <Text style={[s.titleText, { color: colors.contentPrimary }]}>{title}</Text>
              {isCalendar ? (
                <Pressable onPress={onClose} hitSlop={12}>
                  <Feather name="x" size={24} color={colors.contentPrimary} />
                </Pressable>
              ) : (
                <View style={{ width: 24 }} />
              )}
            </View>
            {subtitle && (
              <Text style={[s.subtitleText, { color: colors.contentPrimary }]}>{subtitle}</Text>
            )}
          </View>

          <View style={s.controls}>
            <Pressable
              onPress={() => setPickerMode(isMonthMode ? 'calendar' : 'month')}
              style={[
                s.pillControl,
                {
                  borderColor: isMonthMode ? colors.contentPrimary : colors.surfaceEdge,
                  borderWidth: isMonthMode ? 1.5 : 1,
                },
              ]}
              hitSlop={8}
            >
              <Text style={[s.pillText, { color: colors.contentPrimary }]}>{MONTH_SHORT[viewMonth]}</Text>
              <View style={s.chevronWrap}>
                <ChevronDown color={colors.contentPrimary} />
              </View>
            </Pressable>

            <Pressable
              onPress={() => setPickerMode(isYearMode ? 'calendar' : 'year')}
              style={[
                s.pillControl,
                {
                  borderColor: isYearMode ? colors.contentPrimary : colors.surfaceEdge,
                  borderWidth: isYearMode ? 1.5 : 1,
                },
              ]}
              hitSlop={8}
            >
              <Text style={[s.pillText, { color: colors.contentPrimary }]}>{viewYear}</Text>
              <View style={s.chevronWrap}>
                <ChevronDown color={colors.contentPrimary} />
              </View>
            </Pressable>
          </View>

          {isCalendar && (
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
          )}

          {isYearMode && (
            <ScrollView
              ref={yearScrollRef}
              style={s.yearList}
              contentContainerStyle={s.yearListContent}
              showsVerticalScrollIndicator={false}
            >
              {years.map((year) => {
                const isCurrentYear = year === viewYear;
                return (
                  <Pressable
                    key={year}
                    onPress={() => handleYearSelect(year)}
                    style={s.yearRow}
                  >
                    <Text
                      style={[
                        s.yearText,
                        { color: colors.contentPrimary },
                      ]}
                    >
                      {year}
                    </Text>
                    {isCurrentYear && (
                      <CheckMark color={colors.contentPrimary} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          {isMonthMode && (
            <ScrollView
              ref={monthScrollRef}
              style={s.yearList}
              contentContainerStyle={s.yearListContent}
              showsVerticalScrollIndicator={false}
            >
              {MONTH_NAMES.map((name, idx) => {
                const isCurrentMonth = idx === viewMonth;
                return (
                  <Pressable
                    key={idx}
                    onPress={() => handleMonthSelect(idx)}
                    style={s.yearRow}
                  >
                    <Text
                      style={[
                        s.yearText,
                        { color: colors.contentPrimary },
                      ]}
                    >
                      {name}
                    </Text>
                    {isCurrentMonth && (
                      <CheckMark color={colors.contentPrimary} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

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
  chevronWrap: {
    paddingTop: 2,
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
  yearList: {
    maxHeight: 476,
    paddingHorizontal: 16,
  },
  yearListContent: {
    paddingBottom: 8,
  },
  yearRow: {
    height: YEAR_ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  yearText: {
    fontSize: 16,
    fontFamily: Fonts.medium,
    lineHeight: 20,
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
