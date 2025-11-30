"use client";

import React, { Component, ReactNode } from "react";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center px-4 bg-[#03060f]">
                    <div className="max-w-md w-full space-y-6 text-center">
                        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-8">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h2 className="text-2xl font-bold text-white mb-2">Bir Hata Oluştu</h2>
                            <p className="text-gray-400 mb-6">
                                Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary-500/50 hover:shadow-primary-500/70 hover:scale-105"
                            >
                                Sayfayı Yenile
                            </button>
                        </div>
                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <div className="rounded-xl border border-gray-800 bg-gray-900/50 p-4 text-left">
                                <p className="text-xs font-mono text-red-400 break-all">
                                    {this.state.error.toString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
