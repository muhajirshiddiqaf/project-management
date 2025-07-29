// material-ui
import { Chip, IconButton, Stack } from '@mui/material';

// assets
import { MoreOutlined } from '@ant-design/icons';

// project import
import { highlightText } from './highlightText';

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

// Generate basic text column with optional highlighting
export const generateTextColumn = (header, accessor, options = {}) => {
  const {
    className,
    searchTerm,
    Cell = ({ value }) => {
      if (searchTerm && value) {
        return highlightText(value, searchTerm);
      }
      return value || 'N/A';
    }
  } = options;

  return {
    Header: header,
    accessor: accessor,
    Cell: Cell,
    ...(className && { className })
  };
};

// Generate link column with optional highlighting
export const generateLinkColumn = (header, accessor, options = {}) => {
  const {
    className,
    target = '_blank',
    rel = 'noopener noreferrer',
    searchTerm
  } = options;

  return {
    Header: header,
    accessor: accessor,
    Cell: ({ value }) => {
      if (!value) return 'N/A';

      const displayText = searchTerm ? highlightText(value, searchTerm) : value;

      return (
        <a href={value} target={target} rel={rel}>
          {displayText}
        </a>
      );
    },
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
