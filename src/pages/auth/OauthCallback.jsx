import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../appwriteConfig";
import { AuthStore } from "../../stores/auth.store";

const OAuthCallback = () => {
  const { login } = AuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const appwriteUser = await account.get();

        const res = await login({ email: appwriteUser.email }, navigate);

        console.log({ res });

        if (res) navigate("/");
      } catch (err) {
        console.error("OAuth callback error", err);
        navigate("/login");
      }
    })();
  }, []);

  return (
    <p style={{ textAlign: "center", marginTop: "2rem" }}>
      Hisobingizga kirilmoqda...
    </p>
  );
};

export default OAuthCallback;
