// assets
import { EditOutlined, EyeOutlined, FileTextOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';

// constant
const icons = {
  FileTextOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  UnorderedListOutlined
};

// ==============================|| QUOTATION MENU ITEMS ||============================== //

const quotation = {
  id: 'group-quotation',
  type: 'group',
  children: [
    {
      id: 'Quotation',
      title: 'Quotation',
      type: 'collapse',
      icon: icons.FileTextOutlined,
      children: [
        {
          id: 'quotation-list',
          title: 'List',
          type: 'item',
          url: '/apps/quotation/list',
          breadcrumbs: false
        },
        {
          id: 'quotation-add',
          title: 'Add',
          type: 'item',
          url: '/apps/quotation/add',
          breadcrumbs: false
        },
        {
          id: 'quotation-preview',
          title: 'Preview',
          type: 'item',
          url: '/apps/quotation/preview',
          breadcrumbs: false
        },
        {
          id: 'quotation-edit',
          title: 'Edit',
          type: 'item',
          url: '/apps/quotation/edit',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default quotation;
