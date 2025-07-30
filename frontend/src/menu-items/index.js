// project import
import applications from './applications';
import chartsMap from './charts-map';
import client from './client';
import dashboard from './dashboard';
import formsTables from './forms-tables';
import other from './other';
import pages from './pages';
import project from './project';
import widget from './widget';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, widget, applications, client, project, formsTables, chartsMap, pages, other]
};

export default menuItems;
