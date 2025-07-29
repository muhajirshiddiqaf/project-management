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
      id: 'client',
      title: <FormattedMessage id="client" />,
      type: 'collapse',
      icon: icons.TeamOutlined,
      children: [
        {
          id: 'client-list',
          title: <FormattedMessage id="client-list" />,
          type: 'item',
          url: '/apps/client/list',
          breadcrumbs: false
        },
        {
          id: 'client-add',
          title: <FormattedMessage id="client-add" />,
          type: 'item',
          url: '/apps/client/add'
        }
      ]
    }
  ]
};

export default client;
