// third-party

// assets
import {
    CloudUploadOutlined,
    FileDoneOutlined,
    FormOutlined,
    InsertRowAboveOutlined,
    PieChartOutlined,
    StepForwardOutlined,
    TableOutlined
} from '@ant-design/icons';

// icons
const icons = {
  CloudUploadOutlined,
  FileDoneOutlined,
  FormOutlined,
  PieChartOutlined,
  StepForwardOutlined,
  TableOutlined,
  InsertRowAboveOutlined
};

// ==============================|| MENU ITEMS - FORMS & TABLES ||============================== //

const formsTables = {
  id: 'group-forms-tables',
  title: 'Forms & Tables',
  type: 'group',
  children: [
    {
      id: 'validation',
      title: 'Forms Validation',
      type: 'item',
      url: '/forms/validation',
      icon: icons.FileDoneOutlined
    },
    {
      id: 'wizard',
      title: 'Forms Wizard',
      type: 'item',
      url: '/forms/wizard',
      icon: icons.StepForwardOutlined
    },
    {
      id: 'forms-layout',
      title: 'Layout',
      type: 'collapse',
      icon: icons.FormOutlined,
      children: [
        {
          id: 'basic',
          title: 'Basic',
          type: 'item',
          url: '/forms/layout/basic'
        },
        {
          id: 'multi-column',
          title: 'Multi Column',
          type: 'item',
          url: '/forms/layout/multi-column'
        },
        {
          id: 'action-bar',
          title: 'Action Bar',
          type: 'item',
          url: '/forms/layout/action-bar'
        },
        {
          id: 'sticky-bar',
          title: 'Sticky Bar',
          type: 'item',
          url: '/forms/layout/sticky-bar'
        }
      ]
    },
    {
      id: 'forms-plugins',
      title: 'Plugins',
      type: 'collapse',
      icon: icons.CloudUploadOutlined,
      children: [
        {
          id: 'mask',
          title: 'Mask',
          type: 'item',
          url: '/forms/plugins/mask'
        },
        {
          id: 'clipboard',
          title: 'Clipboard',
          type: 'item',
          url: '/forms/plugins/clipboard'
        },
        {
          id: 're-captcha',
          title: 'Re-captcha',
          type: 'item',
          url: '/forms/plugins/re-captcha'
        },
        {
          id: 'editor',
          title: 'Editor',
          type: 'item',
          url: '/forms/plugins/editor'
        },
        {
          id: 'dropzone',
          title: 'Dropzone',
          type: 'item',
          url: '/forms/plugins/dropzone'
        }
      ]
    },
    {
      id: 'tables',
      title: 'Tables',
      type: 'collapse',
      icon: icons.TableOutlined,
      children: [
        {
          id: 'mui-table',
          title: 'MUI Table',
          type: 'collapse',
          icon: icons.InsertRowAboveOutlined,
          children: [
            {
              id: 'basic',
              title: 'Basic',
              type: 'item',
              url: '/tables/mui-table/basic'
            },
            {
              id: 'dense',
              title: 'Dense',
              type: 'item',
              url: '/tables/mui-table/dense'
            },
            {
              id: 'enhanced',
              title: 'Enhanced',
              type: 'item',
              url: '/tables/mui-table/enhanced'
            },
            {
              id: 'datatable',
              title: 'Data Table',
              type: 'item',
              url: '/tables/mui-table/datatable'
            },
            {
              id: 'custom',
              title: 'Custom',
              type: 'item',
              url: '/tables/mui-table/custom'
            },
            {
              id: 'fixed-header',
              title: 'Fixed Header',
              type: 'item',
              url: '/tables/mui-table/fixed-header'
            },
            {
              id: 'collapse',
              title: 'Collapse',
              type: 'item',
              url: '/tables/mui-table/collapse'
            }
          ]
        },
        {
          id: 'react-table',
          title: 'React Table',
          type: 'collapse',
          icon: icons.PieChartOutlined,
          children: [
            {
              id: 'basic',
              title: 'Basic',
              type: 'item',
              url: '/tables/react-table/basic'
            },
            {
              id: 'sorting',
              title: 'Sorting',
              type: 'item',
              url: '/tables/react-table/sorting'
            },
            {
              id: 'filtering',
              title: 'Filtering',
              type: 'item',
              url: '/tables/react-table/filtering'
            },
            {
              id: 'grouping',
              title: 'Grouping',
              type: 'item',
              url: '/tables/react-table/grouping'
            },
            {
              id: 'pagination',
              title: 'Pagination',
              type: 'item',
              url: '/tables/react-table/pagination'
            },
            {
              id: 'row-selection',
              title: 'Row Selection',
              type: 'item',
              url: '/tables/react-table/row-selection'
            },
            {
              id: 'expanding',
              title: 'Expanding',
              type: 'item',
              url: '/tables/react-table/expanding'
            },
            {
              id: 'editable',
              title: 'Editable',
              type: 'item',
              url: '/tables/react-table/editable'
            },
            {
              id: 'drag-drop',
              title: 'Drag & Drop',
              type: 'item',
              url: '/tables/react-table/drag-drop'
            },
            {
              id: 'column-hiding',
              title: 'Column Hiding',
              type: 'item',
              url: '/tables/react-table/column-hiding'
            },
            {
              id: 'umbrella',
              title: 'Umbrella',
              type: 'item',
              url: '/tables/react-table/umbrella'
            }
          ]
        }
      ]
    }
  ]
};

export default formsTables;
