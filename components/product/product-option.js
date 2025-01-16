import React from 'react';
import cx from 'classnames';

import { hasObject } from '@lib/helpers';

import RadioGroup from '@components/radio-group';
import RadioItem from '@components/radio-item';
import Swatch from '@components/swatch';

const ProductOption = ({
  option,
  optionSettings,
  position,
  variants,
  activeVariant,
  strictMatch = true,
  hideLabels,
  onChange,
}) => {
  const otherOpts = [
    ...activeVariant.options.slice(0, position),
    ...activeVariant.options.slice(position + 1),
  ];

  // Group colors by 'forOption' field (Color:Value)
  const groupedColors = optionSettings.reduce((acc, setting) => {
    const [optionName, optionValue] = setting.forOption.split(':');
    if (!acc[optionName]) acc[optionName] = {};
    if (!acc[optionName][optionValue]) acc[optionName][optionValue] = [];
    acc[optionName][optionValue] = setting.colors;
    return acc;
  }, {});

  return (
    <div key={position} className={`option is-${option.name.toLowerCase().replace(' ', '-')}`}>
      {!hideLabels && <div className="option--title">{option.name}</div>}

      <RadioGroup
        value={activeVariant?.options.find((opt) => opt.name === option.name)?.value}
        onChange={(value) => {
          changeOption(option.name, value, variants, activeVariant, onChange);
        }}
        className="option--values"
      >
        {option.values.map((value, key) => {
          const currentOpt = [{ name: option.name, value }];
          const optSettings = optionSettings?.find((settings) => {
            const optName = settings.forOption.split(':')[0];
            const optValue = settings.forOption.split(':')[1];
            return optName === option.name && optValue === value;
          });

          const isActive = activeVariant.options.some(
            (opt) => opt.position === option.position && opt.value === value
          );

          const withActiveOptions = [...currentOpt, ...otherOpts];

          // Check if there are matching variants for the option
          const hasVariants = variants.find((variant) =>
            variant.options.every((opt) => hasObject(withActiveOptions, opt))
          );

          const inStock = variants.find((variant) => {
            if (strictMatch) {
              return (
                variant.inStock &&
                variant.options.every((opt) => hasObject(withActiveOptions, opt))
              );
            } else {
              return (
                variant.inStock &&
                variant.options.some((opt) => hasObject(currentOpt, opt))
              );
            }
          });

          // Get all colors for the current option (Color:Value)
          const colors = optSettings?.colors || [];

          // const colors = groupedColors[option.name]?.[value] || [];

          return (
            <RadioItem
              key={key}
              title={`${option.name}: ${value}`}
              value={value}
              className={cx({
                btn: !colors.length,
                'option--swatch': colors.length > 0,
                'is-active': isActive,
                'is-unavailable': !hasVariants,
                'is-soldout': !inStock && hasVariants && !isActive,
              })}
            >

              {/* Render color swatches or text depending on availability of colors */}
              {colors.length > 0 ? (
                colors.map((colors, index) => (
                  <Swatch
                    key={index}
                    label={`Select "${value}" ${option.name} option`}
                    color={colors.hex} // Pass the hex value directly
                  />
                ))
              ) : (
                <>{value}</>
              )}

            </RadioItem>
          );
        })}
      </RadioGroup>
    </div>
  );
};

// Handle option changes
const changeOption = (name, value, variants, activeVariant, changeCallback) => {
  const newOptions = activeVariant.options.map((opt) =>
    opt.name === name ? { ...opt, value } : opt
  );

  const newVariant = variants.find((variant) =>
    variant.options.every((opt) => hasObject(newOptions, opt))
  );

  if (newVariant && changeCallback) {
    changeCallback(newVariant.id);
  }
};

export default ProductOption;
