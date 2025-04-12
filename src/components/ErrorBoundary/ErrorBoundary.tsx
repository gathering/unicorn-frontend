import React, { ErrorInfo } from "react";

class ErrorBoundary extends React.Component {
    state = {
        eventId: null,
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

                        {this.state.eventId && (
                            <section>
                                <h2>Error ID: {this.state.eventId}</h2>
                                <p>The unicorn herders have been notified, and will look into the cause.</p>
                            </section>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export { ErrorBoundary };
