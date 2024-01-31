import { getPercent } from 'utils';
import {
  CAMPAIGN_WITH_SOUND_KEYWORD,
  EXTERNAL_RESOURCES_BASE_URL,
  EXTERNAL_RESOURCES_CACHE_NAME,
} from 'utils/constants';
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

export const useSpecialResourcesInCache = updateProgress => {
  const { getSpecialResource } = useAPI();
  const refreshGetSpecialResource = useAsyncValue(getSpecialResource);

  const getManifestResources = async () => {
    const { data: manifest, error } = await refreshGetSpecialResource.current(
      `${EXTERNAL_RESOURCES_BASE_URL}/assets-manifest.json`
    );
    return manifest;
  };

  const getAllResourcesFromManifest = async manifest => {
    // Manifest maybe containe /auto at start of each value, we have to replace this by URL of the server that contains these resources
    const transformManifest = Object.entries(manifest).map(([resourceName, resourceUrl]) => {
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

  const clearExternalResources = async () => {
    await caches.delete(EXTERNAL_RESOURCES_CACHE_NAME);
  };

  const getExternalResources = async (needed = false) => {
    if (needed) {
      // retrive all needed data
      const externalManifest = await getManifestResources();
      await getAllResourcesFromManifest(externalManifest);
    } else {
      // clear external cache
      await clearExternalResources();
    }
  };

  return getExternalResources;
};
