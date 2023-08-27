export const getDocumentVariables = (filter: string = '--') => {
  return Array.from(document.styleSheets)
    .filter(
      (sheet) =>
        sheet.href === null || sheet.href.startsWith(window.location.origin),
    )
    .reduce(
      (acc, sheet) =>
      (acc = [
        ...acc,
        ...Array.from(sheet.cssRules).reduce(
          (def, rule: any) =>
          (def = rule.selectorText === ':root'
            ? [
              ...def,
              ...Array.from(rule.style).filter((name: any) =>
                name.startsWith(filter)),
            ]
            : def),
          [] as any,
        ),
      ]),
      [] as any,
    );
};

export const getVariableValue = (variable: string) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable);
};
