export const EditorIconsMap: Record<string, IconsNamesType | Record<string, IconsNamesType>> = {
  bold: 'editor/bold',
  italic: 'editor/italic',
  underline: 'editor/underline',
  strike: 'editor/strikethrough',
  blockquote: 'editor/blockquote',
  'code-block': 'editor/code',
  ordered: 'editor/list-ol',
  bullet: 'editor/list-marker',
  check: 'editor/list-check',
  link: 'editor/link',
  align: {
    '': 'editor/align-left',
    center: 'editor/align-center',
    right: 'editor/align-right',
    justify: 'editor/align-justify',
  },
  indent: {
    '+1': 'editor/indent-right',
    '-1': 'editor/indent-left',
  },
  color: 'editor/text-color',
  background: 'editor/background-color',
  image: 'editor/image',
  video: 'editor/video',
  clean: 'editor/clear',
  header: {
    1: 'editor/header-1',
    2: 'editor/header-2',
  },
  script: {
    sub: 'editor/subscript',
    super: 'editor/superscript',
  },
};

export const DefaultFormats: Array<string> = [
  'align',
  'background',
  'blockquote',
  'bold',
  'code-block',
  'color',
  'float',
  'font',
  'header',
  'height',
  'image',
  'italic',
  'link',
  'script',
  'strike',
  'size',
  'underline',
  'video',
  'indent',
  'list',
  'width',
];

export const DefaultToolbar: Array<string | object> = [
  [{ header: 1 }, { header: 2 }],

  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block', 'link'],
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],

  [{ align: '' }, { align: 'center' }, { align: 'right' }, { align: 'justify' }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],

  [{ color: [] }, { background: [] }],
  [{ image: '' }, { video: '' }],

  ['clean'],
];

export const DefaultEditorSettings = {
  formats: DefaultFormats,
  modules: {
    imageActions: {},
    imageFormats: {},
  },
};
