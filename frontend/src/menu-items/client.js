// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { TeamOutlined } from '@ant-design/icons';

// icons
const icons = {
  TeamOutlined
};

// ==============================|| MENU ITEMS - CLIENT ||============================== //

const client = {
  id: 'group-client',
  type: 'group',
  children: [
    {
      id: 'Client',
      title: <FormattedMessage id="Client" />,
      type: 'collapse',
      icon: icons.TeamOutlined,
      children: [
        {
          id: 'client-list',
          title: <FormattedMessage id="List" />,
          type: 'item',
          url: '/apps/client/list',
          breadcrumbs: false
        }
      ]
    }
  ]
};

export default client;
