/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { QueryDispatcher } from 'Util/Request';
import { ProductListQuery } from 'Query';
import {
    appendPage,
    updateProductListItems,
    updateLoadStatus
} from 'Store/ProductList';
import { showNotification } from 'Store/Notification';
import { updateNoMatch } from 'Store/NoMatch';

/**
 * Product List Dispatcher
 * @class ProductListDispatcher
 * @extends QueryDispatcher
 */
export class ProductListDispatcher extends QueryDispatcher {
    constructor() {
        super('ProductList', 2628000);
    }

    onSuccess(data, dispatch, options) {
        const { products: { items } } = data;
        const { args: { currentPage }, isNext } = options;

        if (isNext) return dispatch(appendPage(items, currentPage));
        return dispatch(updateProductListItems(items, currentPage));
    }

    onError(error, dispatch) {
        dispatch(showNotification('error', 'Error fetching Product List!', error));
        dispatch(updateNoMatch(true));
    }

    prepareRequest(options, dispatch) {
        if (!options.isNext) dispatch(updateLoadStatus(true));
        return ProductListQuery.getQuery(options);
    }
}

export default new ProductListDispatcher();
