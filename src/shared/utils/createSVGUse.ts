const createSVGUse = (id: string): SVGUseElement => {
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${id}`);
  return use;
};

export const changeFill = (svg: SVGSVGElement, color: string): void => {
  svg.setAttribute('fill', color);
};

export const changeStroke = (svg: SVGSVGElement, color: string): void => {
  svg.setAttribute('stroke', color);
};

export default createSVGUse;
