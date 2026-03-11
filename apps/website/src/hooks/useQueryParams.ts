export function useQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const globalConfig = (window as any).__PRW_CONFIG || {};

  const id = params.get("id") || globalConfig.companyId || "default";
  const subs = params.get("subs") || globalConfig.subject || "general";

  return { id, subs };
}
