// material-ui
import { Chip, IconButton, Stack } from '@mui/material';

// assets
import { MoreOutlined } from '@ant-design/icons';

// ==============================|| TABLE UTILITIES ||============================== //

// Generate action column with menu
export const generateActionColumn = (onMenuClick, options = {}) => {
  const {
    header = 'Actions',
    accessor = 'id',
    className = 'cell-center',
    iconColor = 'secondary'
  } = options;

  return {
    Header: header,
    accessor: accessor,
    Cell: ({ value }) => (
      <Stack direction="row" justifyContent="center">
        <IconButton
          color={iconColor}
          onClick={(event) => onMenuClick(event, value)}
        >
          <MoreOutlined />
        </IconButton>
      </Stack>
    ),
    className: className
  };
};

// Generate basic text column
export const generateTextColumn = (header, accessor, options = {}) => {
  const {
    className,
    Cell = ({ value }) => value || 'N/A'
  } = options;

  return {
    Header: header,
    accessor: accessor,
    Cell: Cell,
    ...(className && { className })
  };
};

// Generate link column
export const generateLinkColumn = (header, accessor, options = {}) => {
  const {
    className,
    target = '_blank',
    rel = 'noopener noreferrer'
  } = options;

  return {
    Header: header,
    accessor: accessor,
    Cell: ({ value }) => value ? (
      <a href={value} target={target} rel={rel}>{value}</a>
    ) : 'N/A',
    ...(className && { className })
  };
};

// Generate status column with chips
export const generateStatusColumn = (header, accessor, statusConfig, options = {}) => {
  const {
    className
  } = options;

  return {
    Header: header,
    accessor: accessor,
    Cell: ({ value }) => {
      const config = statusConfig[value] || statusConfig.default;
      return <Chip color={config.color} label={config.label} size="small" variant="light" />;
    },
    ...(className && { className })
  };
};
