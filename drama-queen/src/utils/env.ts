export const getEnvVar = <K extends keyof ImportMetaEnv>(
  key: K
): ImportMetaEnv[K] => (window as any)?._env_?.[key] ?? import.meta.env[key];
