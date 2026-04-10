import React, { useRef, useEffect } from 'react';
import { StyleSheet, Animated as RNAnimated } from 'react-native';
import { renderContent } from './MarkdownRenderer';

export function StreamingContent({ content }: { content: string }) {
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(6)).current;

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      RNAnimated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <RNAnimated.View style={[styles.aiContent, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {renderContent(content)}
    </RNAnimated.View>
  );
}

export function SoftReveal({ delay = 0, children }: { delay?: number; children: React.ReactNode }) {
  const opacity = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      RNAnimated.spring(opacity, { toValue: 1, tension: 50, friction: 18, useNativeDriver: true }).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [opacity, delay]);

  return (
    <RNAnimated.View style={{ opacity }}>
      {children}
    </RNAnimated.View>
  );
}

export function FadeInView({ delay = 0, duration = 300, children }: { delay?: number; duration?: number; children: React.ReactNode }) {
  const opacity = useRef(new RNAnimated.Value(0)).current;
  const translateY = useRef(new RNAnimated.Value(8)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      RNAnimated.parallel([
        RNAnimated.timing(opacity, { toValue: 1, duration, useNativeDriver: true }),
        RNAnimated.timing(translateY, { toValue: 0, duration, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [opacity, translateY, delay, duration]);

  return (
    <RNAnimated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </RNAnimated.View>
  );
}

export function AnimatedSlot({ animate, delay = 100, duration = 300, soft = false, children }: {
  animate: boolean; delay?: number; duration?: number; soft?: boolean; children: React.ReactNode;
}) {
  if (!animate) return <>{children}</>;
  return soft
    ? <SoftReveal delay={delay}>{children}</SoftReveal>
    : <FadeInView delay={delay} duration={duration}>{children}</FadeInView>;
}

const styles = StyleSheet.create({
  aiContent: { gap: 8 },
});
