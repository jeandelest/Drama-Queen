const texts = {
  "sync": "Synchronisation en cours",
  "sync.download": "Téléchargement des données...",
  "sync.download.surveyUnits": "Unités enquêtées",
  "sync.download.nomenclatures": "Nomenclatures",
  "sync.download.questionnaires": "Questionnaires",
  "sync.upload": "Envoi des données",
} as const;

const getTranslation = (s: keyof typeof texts) => texts[s] ?? s;

export function useTranslate() {
  return {
    __: getTranslation,
  };
}
