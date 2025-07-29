// third-party

// assets
import { DashboardOutlined, GoldOutlined, HomeOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  GoldOutlined,
  HomeOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'collapse',
      icon: icons.DashboardOutlined,
      children: [
        {
          id: 'default',
          title: 'Default',
          type: 'item',
          url: '/dashboard/default',
          breadcrumbs: false
        },
        {
          id: 'analytics',
          title: 'Analytics',
          type: 'item',
          url: '/dashboard/analytics'
        }
      ]
    },
    {
      id: 'components',
      title: 'Components',
      type: 'item',
      url: '/components-overview/buttons',
      icon: icons.GoldOutlined,
      target: true,
      chip: {
        label: 'new',
        color: 'primary',
        size: 'small',
        variant: 'combined'
      }
    }
  ]
};

export default dashboard;
