import React from 'react';
import { Gear } from 'phosphor-react';
import { getSwatch } from '../../lib/helpers';

export default {
  title: 'Option Settings',
  name: 'productOptionSettings',
  type: 'object',
  icon: () => <Gear />,
  fields: [
    {
      title: 'Which option is this for?',
      name: 'forOption',
      type: 'string',
      options: {
        list: [{ title: 'All', value: '' }],
        from: 'options',
        fromData: { title: 'name' },
        joinWith: 'values',
      },
    },
    {
      title: 'Color Swatch',
      name: 'color',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'solidColor' }] }],
      validation: (Rule) => Rule.max(5).required(0),
    },
  ],
  preview: {
    select: {
      color: 'color',
      forOption: 'forOption',
    },
    prepare({ color, forOption }) {
      const option = forOption ? forOption.split(':') : null;

      // Ensure `color` is an array
      const swatches = Array.isArray(color)
        ? color.map((c) => getSwatch(c?.color?.hex?.toUpperCase()))
        : [];

      return {
        title:
          option && option.length > 1
            ? `${option[0]}: ${option[1]}`
            : 'All Variants',
        media: swatches.length > 0 ? swatches[0] : null, // Use the first swatch as preview media
      };
    },
  },
};
