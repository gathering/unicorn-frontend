import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { View } from "../components/View";
import { useLogin } from "../context/Auth";

const Auth = () => {
    const { search } = useLocation();
    const s = useMemo(() => new URLSearchParams(search), [search]);
    const navigate = useNavigate();

    const authorizationCode = useMemo(() => {
        if (!s.has("code")) {
            return null;
        }

        return s.get("code");
    }, [s]);

    useLogin(authorizationCode);

    if (!s.has("code")) {
        navigate("/", { replace: true });
    }

    return <View>Logging in</View>;
};

export default Auth;
