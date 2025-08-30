import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants/theme';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: undefined });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <View style={styles.container}>
                    <View style={styles.errorContainer}>
                        <Ionicons name="warning-outline" size={64} color={COLORS.error} />
                        <Text style={styles.title}>Something went wrong</Text>
                        <Text style={styles.message}>
                            We encountered an unexpected error. Please try again.
                        </Text>
                        {__DEV__ && this.state.error && (
                            <Text style={styles.errorDetails}>
                                {this.state.error.message}
                            </Text>
                        )}
                        <TouchableOpacity style={styles.retryButton} onPress={this.handleRetry}>
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
    },
    errorContainer: {
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.xl,
        maxWidth: 400,
        width: '100%',
    },
    title: {
        ...TYPOGRAPHY.h3,
        color: COLORS.textPrimary,
        marginTop: SPACING.lg,
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    message: {
        ...TYPOGRAPHY.body1,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.lg,
        lineHeight: 24,
    },
    errorDetails: {
        ...TYPOGRAPHY.caption,
        color: COLORS.error,
        textAlign: 'center',
        marginBottom: SPACING.lg,
        fontFamily: 'monospace',
        backgroundColor: COLORS.gray100,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.sm,
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
    },
    retryButtonText: {
        ...TYPOGRAPHY.body1,
        color: COLORS.white,
        fontWeight: '600',
    },
});

export default ErrorBoundary;