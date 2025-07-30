// third-party
import { FormattedMessage } from 'react-intl';

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
      title: <FormattedMessage id="Project" />,
      type: 'collapse',
      icon: icons.AppstoreOutlined,
      children: [
        {
          id: 'project-list',
          title: <FormattedMessage id="List" />,
          type: 'item',
          url: '/apps/project/list',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default project;
