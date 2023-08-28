import {useCallback} from "react";

const texts = {
    'sync.progress': 'Synchronisation en cours',
    'sync.download': 'Téléchargement des données...',
    'sync.surveyUnits': 'Unités enquêtées',
    'sync.nomenclatures': 'Nomenclatures',
    'sync.questionnaires': 'Questionnaires',
} as const

const getTranslation = (s: keyof typeof texts) => texts[s] ?? s

export function useTranslate () {
    return {
        '__': getTranslation
    }
}
