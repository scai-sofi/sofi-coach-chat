import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Animated as RNAnimated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

interface ToastAction {
  label: string;
  onPress: () => void;
}

interface ToastData {
  message: string;
  action?: ToastAction;
  duration?: number;
}

interface ToastContextType {
  showToast: (data: ToastData) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const translateY = useRef(new RNAnimated.Value(100)).current;
  const opacity = useRef(new RNAnimated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const insets = useSafeAreaInsets();

  const dismiss = useCallback(() => {
    RNAnimated.parallel([
      RNAnimated.timing(translateY, { toValue: 100, duration: 250, useNativeDriver: true }),
      RNAnimated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => setToast(null));
  }, [translateY, opacity]);

  const showToast = useCallback((data: ToastData) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(data);
    translateY.setValue(100);
    opacity.setValue(0);
    RNAnimated.parallel([
      RNAnimated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true }),
      RNAnimated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
    timerRef.current = setTimeout(() => dismiss(), data.duration ?? 3000);
  }, [translateY, opacity, dismiss]);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <RNAnimated.View
          pointerEvents="box-none"
          style={[
            styles.container,
            { bottom: Math.max(insets.bottom, 16) + 16, transform: [{ translateY }], opacity },
          ]}
        >
          <View style={styles.toast}>
            <View style={styles.messageWrap}>
              <Text style={styles.messageText}>{toast.message}</Text>
            </View>
            {toast.action && (
              <Pressable
                onPress={() => {
                  toast.action?.onPress();
                  if (timerRef.current) clearTimeout(timerRef.current);
                  dismiss();
                }}
              >
                <Text style={styles.actionText}>{toast.action.label}</Text>
              </Pressable>
            )}
          </View>
        </RNAnimated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  toast: {
    backgroundColor: '#0f0f0f',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: 'rgba(10,10,10,0.16)',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 1,
    shadowOpacity: 1,
    elevation: 8,
  },
  messageWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: '#ffffff',
    lineHeight: 20,
  },
  actionText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#32b7d9',
    lineHeight: 20,
  },
});
