import { getPercent } from 'utils';
import { CAMPAIGN_WITH_SOUND_KEYWORD, EXTERNAL_RESOURCES_BASE_URL } from 'utils/constants';
import { useAPI, useAsyncValue } from 'utils/hook';

export const usePutResourcesInCache = updateProgress => {
  const { getRequiredNomenclatures, getNomenclature } = useAPI();

  const refreshGetRequiredNomenclatures = useAsyncValue(getRequiredNomenclatures);
  const refreshGetNomenclature = useAsyncValue(getNomenclature);

  const putResourcesInCache = async questionnaireId => {
    const ressourcesFailed = [];
    const { data, error: mainError } = await refreshGetRequiredNomenclatures.current(
      questionnaireId
    );
    if (!mainError) {
      updateProgress(0);
      await (data || []).reduce(async (previousPromise, resourceId) => {
        await previousPromise;
        const putResource = async () => {
          const { error, status, statusText } = await refreshGetNomenclature.current(resourceId);
          if (error) {
            if ([400, 403, 404, 500].includes(status)) {
              ressourcesFailed.push(resourceId);
            } else {
              throw new Error(statusText);
            }
          }
        };

        return putResource();
      }, Promise.resolve());
      updateProgress(100);
      return { success: ressourcesFailed.length === 0, ressourcesFailed };
    } else {
      return { success: false, ressourcesFailed };
    }
  };

  const putAllResourcesInCache = async questionnaireIds => {
    const questionnaireIdsSuccess = [];
    let i = 0;
    updateProgress(0);
    await (questionnaireIds || []).reduce(async (previousPromise, questionnaireId) => {
      await previousPromise;
      const putAllResources = async () => {
        const { success } = await putResourcesInCache(questionnaireId);
        if (success) questionnaireIdsSuccess.push(questionnaireId);
      };

      i += 1;
      updateProgress(getPercent(i, questionnaireIds.length));
      return putAllResources();
    }, Promise.resolve());
    return questionnaireIdsSuccess;
  };

  return putAllResourcesInCache;
};

/**
 * Return true if one of campaign contains CAMPAIGN_WITH_SOUND_KEYWORD (see constants)
 */
export const areExternalResourcesNeeded = (listOfCampaigns = []) => {
  for (let campaign of listOfCampaigns) {
    if ((campaign?.id || '').toLowerCase().includes(CAMPAIGN_WITH_SOUND_KEYWORD)) {
      return true;
    }
  }
  return false;
};

/**
 * getExternalQuestionnaireFiltered
 * @param {*} listOfCampaigns ex: [{ "id": "toto-2" }]
 * @param {*} listOfExternalQuestionnaires ex: [{ "id": "toto-2", "cacheName": "cache-toto-2" }, { "id": "toto-3", "cacheName": "cache-toto-3" }]
 * @returns {} { needed: [{ "id": "toto-2", "cacheName": "cache-toto-2" }], noNeeded: [{ "id": "toto-3", "cacheName": "cache-toto-3" }]}
 */
export const getExternalQuestionnaireFiltered = (
  listOfCampaigns = [],
  listOfExternalQuestionnaires = []
) => {
  const campaignIds = listOfCampaigns.map(({ id }) => id);

  return {
    needed: listOfExternalQuestionnaires.filter(({ id }) => campaignIds.includes(id)),
    noNeeded: listOfExternalQuestionnaires.filter(({ id }) => !campaignIds.includes(id)),
  };
};

export const useSpecialResourcesInCache = updateProgress => {
  const { getSpecialResource } = useAPI();
  const refreshGetSpecialResource = useAsyncValue(getSpecialResource);

  const getExternalQuestionnaires = async () => {
    const { data: questionnaireData, error } = await refreshGetSpecialResource.current(
      `${EXTERNAL_RESOURCES_BASE_URL}/gide-questionnaires.json`
    );
    return questionnaireData.questionnaires;
  };

  const getManifestResources = async questionnaireId => {
    const { data: manifest, error } = await refreshGetSpecialResource.current(
      `${EXTERNAL_RESOURCES_BASE_URL}/${questionnaireId}/assets-manifest.json`
    );
    return manifest;
  };

  const getAllResourcesFromManifest = async manifest => {
    // Manifest maybe containe /auto at start of each value, we have to replace this by URL of the server that contains these resources
    const transformManifest = Object.entries(manifest).map(([resourceName, resourceUrl]) => {
      // TODO: maybe we need to replace by something like  `${EXTERNAL_RESOURCES_BASE_URL}/${questionnaireId}/`
      return [resourceName, `${resourceUrl.replace('auto/', `${EXTERNAL_RESOURCES_BASE_URL}/`)}`];
    });
    let i = 0;
    updateProgress(0);
    await (transformManifest || []).reduce(async (previousPromise, [, resourceUrl]) => {
      await previousPromise;
      const putExternalResourceInCache = async () => {
        await refreshGetSpecialResource.current(resourceUrl);
      };

      i += 1;
      updateProgress(getPercent(i, transformManifest.length));
      return putExternalResourceInCache();
    }, Promise.resolve());
  };

  const getExternalResources = async listOfCampaigns => {
    const allExternalQuestionnaires = await getExternalQuestionnaires();

    const { needed = [], noNeeded = [] } = getExternalQuestionnaireFiltered(
      listOfCampaigns,
      allExternalQuestionnaires
    );

    // (1) Retrive all needed external questionnaire's resources : all questionnaire described by needed list
    await needed.reduce(async (previousPromise, { id }) => {
      await previousPromise;
      const getAllResourcesForOneQuestionnaire = async () => {
        const externalManifest = await getManifestResources(id);
        await getAllResourcesFromManifest(externalManifest);
      };
      return getAllResourcesForOneQuestionnaire();
    }, Promise.resolve());

    // (2) Delete cache for all no needed questionnaire : all questionnaire described by noNeeded list
    await noNeeded.reduce(async (previousPromise, { cacheName }) => {
      await previousPromise;
      const clearExternalResources = async () => {
        await caches.delete(cacheName);
      };
      return clearExternalResources();
    }, Promise.resolve());
  };

  return getExternalResources;
};
