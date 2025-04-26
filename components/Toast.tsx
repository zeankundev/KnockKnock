import Colors from '@/constants/Colors';
import React from 'react';
import { useState, useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface ToastProps {
    children: React.ReactNode;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ children, duration = 3000 }) => {
    const [isVisible, setIsVisible] = useState(true);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const translateAnim = useState(new Animated.Value(15))[0];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            })
        ]).start();

        const timer = setTimeout(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(translateAnim, {
                    toValue: 10,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start(() => setIsVisible(false));
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, fadeAnim, translateAnim]);

    if (!isVisible) return null;

    return (
        <Animated.View 
            style={[
                styles.toast, 
                { 
                    opacity: fadeAnim,
                    transform: [{ translateY: translateAnim }]
                }
            ]}
        >
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    toast: {
        position: 'absolute',
        bottom: 90,
        right: 20,
        backgroundColor: Colors.default.secondaryBackground,
        padding: 12,
        borderRadius: 10,
        zIndex: 1000,
    },
});

export default Toast;