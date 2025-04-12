import React from "react";

class ErrorBoundary extends React.Component<{ children?: React.ReactNode }> {
    state = {
        hasError: false,
    };

    static getDerivedStateFromError() {
        return {
            hasError: true,
        };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex items-center w-full min-h-screen bg-red-400">
                    <div>
                        <h1>Oh noes! A dead unicorn appears!</h1>

                        <img src="/images/dedicorn.png" alt="" />
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export { ErrorBoundary };
