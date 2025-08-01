import PropTypes from 'prop-types';

// material-ui
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';

// assets
import { DeleteOutlined, EditOutlined, EyeOutlined, FileTextOutlined } from '@ant-design/icons';

// ==============================|| ACTION MENU ||============================== //

const ActionMenu = ({
  anchorEl,
  open,
  onClose,
  onView,
  onEdit,
  onDelete,
  onGenerateQuotation,
  viewText = 'View',
  editText = 'Edit',
  deleteText = 'Delete',
  generateQuotationText = 'Create Quotation',
  showView = true,
  showEdit = true,
  showDelete = true,
  showGenerateQuotation = false
}) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{
        sx: {
          minWidth: 120,
          boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)'
        }
      }}
    >
      {showView && (
        <MenuItem onClick={onView}>
          <ListItemIcon>
            <EyeOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>{viewText}</ListItemText>
        </MenuItem>
      )}
      {showEdit && (
        <MenuItem onClick={onEdit}>
          <ListItemIcon>
            <EditOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>{editText}</ListItemText>
        </MenuItem>
      )}
      {showGenerateQuotation && onGenerateQuotation && (
        <MenuItem onClick={onGenerateQuotation}>
          <ListItemIcon>
            <FileTextOutlined fontSize="small" />
          </ListItemIcon>
          <ListItemText>{generateQuotationText}</ListItemText>
        </MenuItem>
      )}
      {showDelete && (
        <MenuItem onClick={onDelete} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteOutlined fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>{deleteText}</ListItemText>
        </MenuItem>
      )}
    </Menu>
  );
};

ActionMenu.propTypes = {
  anchorEl: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onGenerateQuotation: PropTypes.func,
  viewText: PropTypes.string,
  editText: PropTypes.string,
  deleteText: PropTypes.string,
  generateQuotationText: PropTypes.string,
  showView: PropTypes.bool,
  showEdit: PropTypes.bool,
  showDelete: PropTypes.bool,
  showGenerateQuotation: PropTypes.bool
};

export default ActionMenu;
