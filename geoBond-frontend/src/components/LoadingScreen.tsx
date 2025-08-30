import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Animated,
    Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const LoadingScreen = () => {
    const pulseAnim = useRef(new Animated.Value(0)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // Pulse animation for the loading indicator
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );

        // Rotation animation for the outer ring
        const rotateAnimation = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
            })
        );

        // Scale animation for the logo
        const scaleAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.8,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        );

        pulseAnimation.start();
        rotateAnimation.start();
        scaleAnimation.start();

        return () => {
            pulseAnimation.stop();
            rotateAnimation.stop();
            scaleAnimation.stop();
        };
    }, []);

    const pulseOpacity = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 1],
    });

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <ImageBackground
            source={require('../../assets/background-map-connections.png')}
            style={styles.backgroundImage}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <BlurView style={styles.blurOverlay} intensity={20} tint="dark">
                    {/* Animated Loading Indicator */}
                    <View style={styles.loadingContainer}>
                        {/* Outer rotating ring */}
                        <Animated.View
                            style={[
                                styles.outerRing,
                                {
                                    transform: [{ rotate: rotateInterpolate }],
                                },
                            ]}
                        >
                            <LinearGradient
                                colors={['#00FFFF', '#FF0080', '#00FFFF']}
                                style={styles.gradientRing}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            />
                        </Animated.View>

                        {/* Inner pulsing circle */}
                        <Animated.View
                            style={[
                                styles.innerCircle,
                                {
                                    opacity: pulseOpacity,
                                    transform: [{ scale: scaleAnim }],
                                },
                            ]}
                        >
                            <LinearGradient
                                colors={['#00FFFF', '#0080FF']}
                                style={styles.innerGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            />
                        </Animated.View>

                        {/* Center logo/icon */}
                        <Animated.View
                            style={[
                                styles.centerIcon,
                                {
                                    transform: [{ scale: scaleAnim }],
                                },
                            ]}
                        >
                            <Text style={styles.logoText}>GB</Text>
                        </Animated.View>
                    </View>

                    {/* App Title */}
                    <Animated.View
                        style={[
                            styles.titleContainer,
                            {
                                opacity: pulseOpacity,
                            },
                        ]}
                    >
                        <Text style={styles.title}>GeoBond</Text>
                        <Text style={styles.subtitle}>Connecting Locations</Text>
                    </Animated.View>

                    {/* Loading dots */}
                    <View style={styles.dotsContainer}>
                        {[0, 1, 2].map((index) => (
                            <Animated.View
                                key={index}
                                style={[
                                    styles.dot,
                                    {
                                        opacity: pulseAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0.3, 1],
                                        }),
                                        transform: [
                                            {
                                                scale: pulseAnim.interpolate({
                                                    inputRange: [0, 0.5, 1],
                                                    outputRange: [0.8, 1.2, 0.8],
                                                }),
                                            },
                                        ],
                                    },
                                ]}
                            />
                        ))}
                    </View>
                </BlurView>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    blurOverlay: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    loadingContainer: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    outerRing: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        padding: 3,
    },
    gradientRing: {
        flex: 1,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    innerCircle: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        padding: 2,
    },
    innerGradient: {
        flex: 1,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerIcon: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0, 255, 255, 0.5)',
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00FFFF',
        textShadowColor: 'rgba(0, 255, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 255, 255, 0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 15,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#E0E0E0',
        textAlign: 'center',
        fontWeight: '300',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 100,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00FFFF',
        marginHorizontal: 4,
        shadowColor: '#00FFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
    },
});

export default LoadingScreen;