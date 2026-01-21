import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans text-gray-800">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-lg w-full border-l-4 border-red-500">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Algo deu errado</h1>
                        <p className="mb-4 text-gray-600">Ocorreu um erro inesperado que impediu o carregamento do sistema.</p>

                        <div className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-40 mb-6 font-mono border border-gray-200">
                            <p className="font-bold text-red-800">{this.state.error?.toString()}</p>
                            {this.state.errorInfo && (
                                <pre className="text-xs text-gray-500 mt-2">{this.state.errorInfo.componentStack}</pre>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Recarregar Página
                            </button>
                            <a
                                href="/"
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                Voltar ao Início
                            </a>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
