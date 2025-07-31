// third-party

// assets
import { AppstoreOutlined } from '@ant-design/icons';

// icons
const icons = {
  AppstoreOutlined
};

// ==============================|| MENU ITEMS - PROJECT ||============================== //

const project = {
  id: 'group-project',
  type: 'group',
  children: [
    {
      id: 'Project',
      title: 'Project',
      type: 'collapse',
      icon: icons.AppstoreOutlined,
      children: [
        {
          id: 'project-list',
          title: 'List',
          type: 'item',
          url: '/apps/project/list',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default project;
