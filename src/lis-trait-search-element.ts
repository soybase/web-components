import {LitElement, css, html} from 'lit';
import {customElement} from 'lit/decorators.js';

import {LisPaginatedSearchMixin, PaginatedSearchOptions} from './mixins';


/**
 * The data that will be passed to the search function by the
 * {@link LisTraitSearchElement | `LisTraitSearchElement`} class when a
 * search is performed.
 */
export type TraitSearchData = {
  query: string;
};


/**
 * A single result of a trait search performed by the
 * {@link LisTraitSearchElement | `LisTraitSearchElement`} class.
 */
export type TraitSearchResult = {
  name: string;
  description: string;
};


/**
 * The signature of the function the
 * {@link LisTraitSearchElement | `LisTraitSearchElement`} class requires for
 * performing a trait search.
 *
 * @param query The search term in the input element when the search form was
 * submitted.
 * @param page What page of results the search is for. Will always be 1 when a
 * new search is performed.
 * @param options Optional parameters that aren't required to perform a gene
 * search but may be useful.
 *
 * @returns A {@link !Promise | `Promise`} that resolves to an
 * {@link !Array | `Array`} of {@link TraitSearchResult | `TraitSearchResult`}
 * objects.
 */
export type TraitSearchFunction =
  (query: string, page: number, options: PaginatedSearchOptions) => Promise<Array<TraitSearchResult>>;


/**
 * @htmlElement `<lis-trait-search-element>`
 *
 * A Web Component that provides an interface for performing keyword searches
 * for traits and displaying results in a paginated table. Note that the
 * component saves its state to the URL query string parameters and a search
 * will be automatically performed if the parameters are present when the
 * componnent is loaded. The component uses the
 * {@link mixins!LisPaginatedSearchMixin | `LisPaginatedSearchMixin`} mixin. See
 * the mixin docs for further details.
 *
 * @queryStringParameters
 * - **query:** The text in the query field of the search form.
 * - **page:** What page of results is loaded.
 *
 * @example 
 * {@link !HTMLElement | `HTMLElement`} properties can only be set via
 * JavaScript. This means the {@link searchFunction | `searchFunction`} property
 * must be set on a `<lis-trait-search-element>` tag's instance of the
 * {@link LisTraitSearchElement | `LisTraitSearchElement`} class. For example:
 * ```html
 * <!-- add the Web Component to your HTML -->
 * <lis-trait-search-element id="trait-search"></lis-trait-search-element>
 *
 * <!-- configure the Web Component via JavaScript -->
 * <script type="text/javascript">
 *   // a site-specific function that sends a request to a trait search API
 *   function getTraits(searchText, page, {abortSignal}) {
 *     // returns a Promise that resolves to a search result object
 *   }
 *   // get the trait search element
 *   const searchElement = document.getElementById('trait-search');
 *   // set the element's searchFunction property
 *   searchElement.searchFunction = getTraits;
 * </script>
 * ```
 */
@customElement('lis-trait-search-element')
export class LisTraitSearchElement extends
LisPaginatedSearchMixin(LitElement)<TraitSearchData, TraitSearchResult>() {

  /** @ignore */
  // used by Lit to style the Shadow DOM
  // not necessary but exclusion breaks TypeDoc
  static override styles = css``;

  constructor() {
    super();
    // configure query string parameters
    this.requiredQueryStringParams = ['query'];
    // configure results table
    this.resultAttributes = ['name', 'description'];
    this.tableHeader = {name: 'Name', description: 'Description'};
  }

  /** @ignore */
  // used by LisPaginatedSearchMixin to draw the template
  override renderForm() {
    return html`
      <form>
        <fieldset class="uk-fieldset">
          <legend class="uk-legend">Trait search</legend>
          <div class="uk-margin">
            <input
              name="query"
              class="uk-input"
              type="text"
              placeholder="Input"
              aria-label="Input"
              .value=${this.queryStringController.getParameter('query')}>
          </div>
          <div class="uk-margin">
            <button type="submit" class="uk-button uk-button-primary">Search</button>
          </div>
        </fieldset>
      </form>
    `;
  }

}


declare global {
  interface HTMLElementTagNameMap {
    'lis-trait-search-element': LisTraitSearchElement;
  }
}
