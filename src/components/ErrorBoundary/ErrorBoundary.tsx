import React from "react";

class ErrorBoundary extends React.Component {
    render() {
        return (
            <div className="flex items-center w-full min-h-screen bg-red-400">
                <div>
                    <h1>Oh noes! A dead unicorn appears!</h1>

                    <img src="/images/dedicorn.png" alt="" />
                </div>
            </div>
        );
    }
}

export { ErrorBoundary };
