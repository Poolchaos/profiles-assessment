export class ValueService {
  
  public static async bindBindableValues(htmlString: string, viewModel: any): Promise<any> {
    for(let prop in viewModel) {
      if(viewModel.hasOwnProperty(prop) && typeof viewModel[prop] !== 'function') {
        let bindableExpressionBraces = new RegExp('\\${' + prop + '}', 'g');
        let bindableExpressionString = new RegExp('"' + prop + '"', 'g');
        if(htmlString.match(bindableExpressionBraces)) {
          htmlString = htmlString.replace(bindableExpressionBraces, viewModel[prop]);
        }
        if(htmlString.match(bindableExpressionString)) {
          htmlString = htmlString.replace(bindableExpressionString, viewModel[prop]);
        }
      }
    }
    return htmlString;
  }

  public static async tryAddValueBinding(action: string, prop: string, el: HTMLElement, value: any, attr: string): Promise<any> {
    try {
      if(action.includes('(') && action.includes(')')) {
        return false;
      }
      if(prop === action) {
        el.setAttribute(attr, value);
        return true;
      }
      return false;
    } catch(e) {}
  }
}