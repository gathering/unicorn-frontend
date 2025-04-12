import { Link } from "../components/Link";
import { useUserDispatch } from "../context/Auth";

export const Logout = () => {
    const dispatch = useUserDispatch();

    dispatch({ type: "LOGOUT" });

    return (
        <p className="m-4">
            You&apos;ve been logged out.
            <Link to="/">Go back to the front page</Link>
        </p>
    );
};
