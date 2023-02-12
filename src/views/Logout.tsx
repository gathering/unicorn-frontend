import { useUserDispatch } from "../context/Auth";
import { Link } from "../components/Link";

export const Logout = () => {
    const dispatch = useUserDispatch();

    dispatch({ type: "LOGOUT" });

    return (
        <p className="m-4">
            You've been logged out.
            <Link to="/">Go back to the front page</Link>
        </p>
    );
};
