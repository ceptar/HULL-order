export default {
    title: 'Shape',
    name: 'shape',
    type: 'document',
    fields: [
      {
        title: 'Title',
        name: 'title',
        type: 'string',
        validation: Rule => Rule.required(),
      },
    ],
  };