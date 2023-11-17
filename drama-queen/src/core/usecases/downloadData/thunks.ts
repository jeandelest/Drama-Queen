import { Thunks } from "core/setup";
import { actions, name } from "./state";
import { QueenApi } from "core/ports/QueenApi";

export const thunks = {
  start:
    () =>
    async (...args) => {
      const [dispatch, getState, { queenApi }] = args;

      {
        const state = getState()[name];

        if (state.stateDescription === "running") {
          return;
        }
      }

      dispatch(actions.running());

      /**
       * Pre-requis
       */
      const campaigns = await queenApi.getCampaigns();

      const campaignsIds = campaigns.map(({ id }) => id) ?? [];
      const questionnaireIds = [
        ...new Set(
          campaigns.map(({ questionnaireIds }) => questionnaireIds).flat() ?? []
        ),
      ];

      /*
       * SurveyUnit
       */

      const prSurveyUnit = campaignsIds.map((campaignId) =>
        queenApi
          .getSurveyUnitsIdsAndQuestionnaireIdsByCampaign(campaignId)
          .then((arrayOfIds) =>
            Promise.all(arrayOfIds.map(({ id }) => queenApi.getSurveyUnit(id)))
          )
      );

      const surveyUnitsArrays = (await Promise.all(prSurveyUnit)).flat();
      console.log(surveyUnitsArrays);

      /*
       * Survey
       */

      const questionnaire = await Promise.all(
        questionnaireIds.map((questionnaireId) =>
          queenApi.getQuestionnaire(questionnaireId)
        )
      );

      console.log(questionnaire);
      /*
       * Nomenclature
       */

      const suggestersNames = deduplicate(
        questionnaire
          .map((q) => q.suggesters)
          .flat()
          .map((suggester) => suggester?.name)
      );

      // const nomenclatures = await Promise.all(
      //   suggestersNames.map((nomenclatureId) =>
      //     queenApi.getNomenclature(nomenclatureId)
      //   )
      // );

      console.log("ok");
      for (const progress of [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]) {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        dispatch(
          actions.progressNomenclature({
            nomenclatureProgress: progress,
          })
        );
        dispatch(
          actions.progressSurvey({
            surveyProgress: progress,
          })
        );
        dispatch(
          actions.progressSurveyUnit({
            surveyUnitProgress: progress,
          })
        );
      }

      dispatch(actions.completed());
    },
} satisfies Thunks;

/**
 * Remove undefined values from an array and remove duplicates
 */
function deduplicate<T>(items: (T | undefined)[]): T[] {
  return [...new Set(items.filter((data) => !!data))] as T[];
}
