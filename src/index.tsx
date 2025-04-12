import setupLocatorUI from "@locator/runtime";
import "@reach/dialog/styles.css";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./context/Auth";
import "./index.css";
import { routeConfig } from "./routeConfig";

if (import.meta.env.MODE === "development") {
    setupLocatorUI();
}

const router = createBrowserRouter(routeConfig);

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <UserProvider>
        <RouterProvider router={router} />
    </UserProvider>
);
