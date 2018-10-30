import React from 'react';
import isEqual from 'lodash.isequal';
import Checkbox from '../../Checkbox';

function SingleItem(params) {
  const { item, index, ...restOfParams } = params;
  const { itemToString } = params;
  const itemText = itemToString(item);

  if (!item.id) {
    return (
      <>
        <span>{itemText}</span>
        <ul>
          {getNestedItems({
            ...restOfParams,
            items: item.options,
            path: `${params.path}-${index}`,
          })}
        </ul>
      </>
    );
  } else if (item.options && item.options.length) {
    const { selectedItem } = params;
    const isChecked =
      selectedItem.filter(selected => isEqual(selected, item)).length > 0;

    return (
      <>
        <div>
          <Checkbox
            id={item.id}
            name={itemText}
            checked={isChecked}
            readOnly={true}
            tabIndex="-1"
          />
          <span onClick={restOfParams.toggleExpandedItem(item.id)}>
            {itemText}
          </span>
        </div>
        {params.expandedIds.indexOf(item.id) >= 0 && (
          <ul>
            {getNestedItems({
              ...restOfParams,
              items: item.options,
              ids: `${params.ids}-${index}`,
            })}
          </ul>
        )}
      </>
    );
  } else {
    const { selectedItem } = params;
    const isChecked =
      selectedItem.filter(selected => isEqual(selected, item)).length > 0;

    return (
      <Checkbox
        id={item.id}
        name={itemText}
        checked={isChecked}
        labelText={itemText}
        readOnly={true}
        tabIndex="-1"
      />
    );
  }
}

export default function getNestedItems(params) {
  const {
    items,
    sortItems,
    filterItems,
    getItemProps,
    itemToString,
    selectedItems,
    inputValue,
    compareItems,
    locale,
  } = params;

  return sortItems(filterItems(items, { itemToString, inputValue }), {
    selectedItems,
    itemToString,
    compareItems,
    locale,
  }).map((item, index) => {
    const itemProps = getItemProps({ item });

    return (
      <li key={itemProps.id} {...itemProps}>
        <SingleItem item={item} index={index} {...params} />
      </li>
    );
  });
}
