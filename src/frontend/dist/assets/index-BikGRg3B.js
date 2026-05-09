import { a2 as useInternetIdentity, p as Principal, ah as JSON_KEY_PRINCIPAL, ai as base32Decode, aj as base32Encode, ak as getCrc32 } from "./index-CgYOV5jf.js";
function useAuth() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const principal = (identity == null ? void 0 : identity.getPrincipal()) ?? null;
  const isAuthenticated = loginStatus === "success" && principal !== null && !principal.isAnonymous();
  const isLoading = loginStatus === "logging-in";
  const handleLogin = async () => {
    await login();
  };
  const handleLogout = () => {
    clear();
  };
  return {
    isAuthenticated,
    principal,
    login: handleLogin,
    logout: handleLogout,
    isLoading
  };
}
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  JSON_KEY_PRINCIPAL,
  Principal,
  base32Decode,
  base32Encode,
  getCrc32
}, Symbol.toStringTag, { value: "Module" }));
export {
  index as i,
  useAuth as u
};
