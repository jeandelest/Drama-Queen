import {
  COMP_TYPE_CHECK_BOX_BOOLEAN,
  COMP_TYPE_CHECK_BOX_GROUP,
  COMP_TYPE_INPUT_NUMBER,
  COMP_TYPE_LOOP,
  COMP_TYPE_SEQUENCE,
  COMP_TYPE_SUBSEQUENCE,
  COMP_TYPE_TABLE,
  COMP_TYPE_TEXTAREA,
} from 'utils/constants';

export const extractComponentFromTableLine = line => {
  if (Array.isArray(line))
    return line.reduce((result, cell) => {
      if (typeof cell === 'object' && 'componentType' in cell) return [...result, cell];
      return result;
    }, []);
  return [];
};

export const extractComponentFromTable = component => {
  const { componentType } = component;
  if (COMP_TYPE_TABLE !== componentType) return [component];
  const { body } = component;
  if (Array.isArray(body)) {
    return body.reduce((result, line) => {
      return [...result, ...extractComponentFromTableLine(line)];
    }, []);
  }
  return [];
};

/**
 * TODO: remove this code when this issue of Lunatic will be treated : https://github.com/InseeFr/Lunatic/issues/771
 */
export const componentHasResponse = component => {
  if (component === undefined) return false;

  // check for missingResponse
  if (![undefined, null, {}].includes(component?.missingResponse?.value)) return true;

  const { componentType } = component;
  switch (componentType) {
    case COMP_TYPE_TABLE:
      const tableComponents = extractComponentFromTable(component);
      return tableComponents.reduce((result, comp) => {
        return componentHasResponse(comp) || result;
      }, false);
    case COMP_TYPE_CHECK_BOX_GROUP:
    case COMP_TYPE_INPUT_NUMBER:
    case COMP_TYPE_CHECK_BOX_BOOLEAN:
    case COMP_TYPE_TEXTAREA:
      return component.value !== null;
    case COMP_TYPE_LOOP:
    case COMP_TYPE_SUBSEQUENCE:
    case COMP_TYPE_SEQUENCE:
      return true;
    default:
      return !!component.value;
  }
};
