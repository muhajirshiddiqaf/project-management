import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
    Avatar,
    Box,
    Button,
    CardHeader,
    Chip,
    CircularProgress,
    Divider,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    TextField,
    Typography
} from '@mui/material';

// ant design icons
import CalendarOutlined from '@ant-design/icons/CalendarOutlined';
import CreditCardOutlined from '@ant-design/icons/CreditCardOutlined';
import EditOutlined from '@ant-design/icons/EditOutlined';
import EnvironmentOutlined from '@ant-design/icons/EnvironmentOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';
import MailOutlined from '@ant-design/icons/MailOutlined';
import PhoneOutlined from '@ant-design/icons/PhoneOutlined';
import SaveOutlined from '@ant-design/icons/SaveOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';

// third party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project imports
import authAPI from 'api/auth';
import MainCard from 'components/MainCard';
import { useAuth } from 'contexts/AuthContext';

// assets
import avatar1 from 'assets/images/users/avatar-1.png';

// ==============================|| PROFILE PAGE ||============================== //

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('personal');

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleTogglePassword = (field) => {
    switch (field) {
      case 'password':
        setShowPassword(!showPassword);
        break;
      case 'newPassword':
        setShowNewPassword(!showNewPassword);
        break;
      case 'confirmPassword':
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  const handleEditProfile = () => {
    setEditMode(true);
    setError('');
    setSuccess('');
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setPasswordMode(false);
    setError('');
    setSuccess('');
  };

  const handleUpdateProfile = async (values, { setSubmitting, setErrors }) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        designation: values.designation,
        address: values.address
      });

      if (response.data?.user) {
        updateUser(response.data.user);
        setSuccess('Profile updated successfully!');
        setEditMode(false);
      }
    } catch (error) {
      console.error('Update profile error:', error);
      setError(error.message || 'Failed to update profile');
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const handleChangePassword = async (values, { setSubmitting, setErrors }) => {
    if (values.newPassword !== values.confirmPassword) {
      setError('New passwords do not match');
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authAPI.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });

      setSuccess('Password changed successfully!');
      setPasswordMode(false);
    } catch (error) {
      console.error('Change password error:', error);
      setError(error.message || 'Failed to change password');
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const getUserDisplayName = () => {
    if (!user) return 'Guest';

    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }

    if (user.firstName) {
      return user.firstName;
    }

    if (user.email) {
      return user.email.split('@')[0];
    }

    return 'User';
  };

  const getUserRole = () => {
    if (!user) return 'Guest';

    if (user.role) {
      return user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }

    return 'User';
  };

  const renderPersonalInfo = () => (
    <MainCard
      content={false}
      title="Personal Information"
      sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
    >
      <Formik
        initialValues={{
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          email: user?.email || '',
          phone: '',
          designation: '',
          address: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          firstName: Yup.string().max(255).required('First Name is required.'),
          lastName: Yup.string().max(255).required('Last Name is required.'),
          email: Yup.string().email('Invalid email address.').max(255).required('Email is required.'),
          phone: Yup.string().max(20, 'Phone number too long.'),
          designation: Yup.string().max(255, 'Designation too long.'),
          address: Yup.string().max(500, 'Address too long.')
        })}
        onSubmit={handleUpdateProfile}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-first-name">First Name</InputLabel>
                    <TextField
                      fullWidth
                      id="personal-first-name"
                      value={values.firstName}
                      name="firstName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="First Name"
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <UserOutlined />
                          </InputAdornment>
                        )
                      }}
                    />
                    {touched.firstName && errors.firstName && (
                      <FormHelperText error id="personal-first-name-helper">
                        {errors.firstName}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-last-name">Last Name</InputLabel>
                    <TextField
                      fullWidth
                      id="personal-last-name"
                      value={values.lastName}
                      name="lastName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Last Name"
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <UserOutlined />
                          </InputAdornment>
                        )
                      }}
                    />
                    {touched.lastName && errors.lastName && (
                      <FormHelperText error id="personal-last-name-helper">
                        {errors.lastName}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-email">Email Address</InputLabel>
                    <TextField
                      type="email"
                      fullWidth
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      id="personal-email"
                      placeholder="Email Address"
                      disabled={true}
                      helperText="Email cannot be changed"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailOutlined />
                          </InputAdornment>
                        )
                      }}
                    />
                    {touched.email && errors.email && (
                      <FormHelperText error id="personal-email-helper">
                        {errors.email}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-phone">Phone Number</InputLabel>
                    <TextField
                      fullWidth
                      id="personal-phone"
                      value={values.phone}
                      name="phone"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneOutlined />
                          </InputAdornment>
                        )
                      }}
                    />
                    {touched.phone && errors.phone && (
                      <FormHelperText error id="personal-phone-helper">
                        {errors.phone}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-designation">Designation</InputLabel>
                    <TextField
                      fullWidth
                      id="personal-designation"
                      value={values.designation}
                      name="designation"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Designation"
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <UserOutlined />
                          </InputAdornment>
                        )
                      }}
                    />
                    {touched.designation && errors.designation && (
                      <FormHelperText error id="personal-designation-helper">
                        {errors.designation}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
            <CardHeader title="Address" />
            <Divider />
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="personal-address">Address</InputLabel>
                    <TextField
                      multiline
                      rows={3}
                      fullWidth
                      id="personal-address"
                      value={values.address}
                      name="address"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      placeholder="Address"
                      disabled={!editMode}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EnvironmentOutlined />
                          </InputAdornment>
                        )
                      }}
                    />
                    {touched.address && errors.address && (
                      <FormHelperText error id="personal-address-helper">
                        {errors.address}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Box>
            {editMode && (
              <Box sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isSubmitting || Object.keys(errors).length !== 0}
                    type="submit"
                    variant="contained"
                    startIcon={isSubmitting ? <CircularProgress size={16} /> : <SaveOutlined />}
                  >
                    Save
                  </Button>
                </Stack>
              </Box>
            )}
            {!editMode && (
              <Box sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<EditOutlined />}
                    onClick={handleEditProfile}
                  >
                    Edit Profile
                  </Button>
                </Stack>
              </Box>
            )}
          </form>
        )}
      </Formik>
    </MainCard>
  );

  const renderChangePassword = () => (
    <MainCard
      content={false}
      title="Change Password"
      sx={{ '& .MuiInputLabel-root': { fontSize: '0.875rem' } }}
    >
      {!passwordMode ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <LockOutlined sx={{ fontSize: 64, color: 'text.secondary', mb: 3 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Change Your Password
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            Click the button below to change your password. Make sure to use a strong password for better security.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setPasswordMode(true)}
            size="large"
            startIcon={<LockOutlined />}
          >
            Change Password
          </Button>
        </Box>
      ) : (
        <Formik
          initialValues={{
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            currentPassword: Yup.string().required('Current password is required.'),
            newPassword: Yup.string()
              .min(6, 'Password must be at least 6 characters.')
              .required('New password is required.'),
            confirmPassword: Yup.string()
              .oneOf([Yup.ref('newPassword'), null], 'Passwords must match.')
              .required('Confirm password is required.')
          })}
          onSubmit={handleChangePassword}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Box sx={{ p: 2.5 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="password-current">Current Password</InputLabel>
                      <TextField
                        fullWidth
                        id="password-current"
                        type={showPassword ? 'text' : 'password'}
                        value={values.currentPassword}
                        name="currentPassword"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Current Password"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => handleTogglePassword('password')}
                                edge="end"
                              >
                                {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                      {touched.currentPassword && errors.currentPassword && (
                        <FormHelperText error id="password-current-helper">
                          {errors.currentPassword}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="password-new">New Password</InputLabel>
                      <TextField
                        fullWidth
                        id="password-new"
                        type={showNewPassword ? 'text' : 'password'}
                        value={values.newPassword}
                        name="newPassword"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="New Password"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => handleTogglePassword('newPassword')}
                                edge="end"
                              >
                                {showNewPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                      {touched.newPassword && errors.newPassword && (
                        <FormHelperText error id="password-new-helper">
                          {errors.newPassword}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="password-confirm">Confirm New Password</InputLabel>
                      <TextField
                        fullWidth
                        id="password-confirm"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={values.confirmPassword}
                        name="confirmPassword"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Confirm New Password"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => handleTogglePassword('confirmPassword')}
                                edge="end"
                              >
                                {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                      {touched.confirmPassword && errors.confirmPassword && (
                        <FormHelperText error id="password-confirm-helper">
                          {errors.confirmPassword}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isSubmitting || Object.keys(errors).length !== 0}
                    type="submit"
                    variant="contained"
                    startIcon={isSubmitting ? <CircularProgress size={16} /> : <SaveOutlined />}
                  >
                    Change Password
                  </Button>
                </Stack>
              </Box>
            </form>
          )}
        </Formik>
      )}
    </MainCard>
  );

  const renderSettings = () => (
    <MainCard content={false} title="Settings">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <SettingOutlined sx={{ fontSize: 64, color: 'text.secondary', mb: 3 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Settings functionality will be implemented here.
        </Typography>
      </Box>
    </MainCard>
  );

  const renderPayment = () => (
    <MainCard content={false} title="Payment Information">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <CreditCardOutlined sx={{ fontSize: 64, color: 'text.secondary', mb: 3 }} />
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Payment Information
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Payment information will be implemented here.
        </Typography>
      </Box>
    </MainCard>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'password':
        return renderChangePassword();
      case 'settings':
        return renderSettings();
      case 'payment':
        return renderPayment();
      default:
        return renderPersonalInfo();
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        {/* Left Panel - Profile Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, textAlign: 'center', height: 'fit-content' }}>
            <Avatar
              src={avatar1}
              sx={{
                width: 160,
                height: 160,
                mx: 'auto',
                mb: 3,
                border: '6px solid',
                borderColor: 'primary.main'
              }}
            />
            <Typography variant="h4" fontWeight="600" sx={{ mb: 1 }}>
              {getUserDisplayName()}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              {getUserRole()}
            </Typography>

            <Chip
              label="Active"
              color="success"
              size="small"
              sx={{ mb: 4 }}
            />

            {/* Contact Information */}
            <Box sx={{ mb: 4, textAlign: 'left' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MailOutlined sx={{ mr: 2, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {user?.email || 'No email provided'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PhoneOutlined sx={{ mr: 2, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formData?.phone || 'No phone provided'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EnvironmentOutlined sx={{ mr: 2, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formData?.address || 'No address provided'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarOutlined sx={{ mr: 2, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  Joined {new Date().getFullYear()}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Statistics */}
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="600" color="primary.main">86</Typography>
                <Typography variant="body2" color="text.secondary">Posts</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="600" color="primary.main">40</Typography>
                <Typography variant="body2" color="text.secondary">Projects</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="600" color="primary.main">4.5K</Typography>
                <Typography variant="body2" color="text.secondary">Followers</Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            {/* Navigation Menu */}
            <List sx={{ p: 0 }}>
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeTab === 'personal'}
                  onClick={() => setActiveTab('personal')}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    <UserOutlined />
                  </ListItemIcon>
                  <ListItemText
                    primary="Personal Information"
                    primaryTypographyProps={{ fontWeight: activeTab === 'personal' ? 600 : 400 }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeTab === 'password'}
                  onClick={() => setActiveTab('password')}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    <LockOutlined />
                  </ListItemIcon>
                  <ListItemText
                    primary="Change Password"
                    primaryTypographyProps={{ fontWeight: activeTab === 'password' ? 600 : 400 }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeTab === 'payment'}
                  onClick={() => setActiveTab('payment')}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    <CreditCardOutlined />
                  </ListItemIcon>
                  <ListItemText
                    primary="Payment"
                    primaryTypographyProps={{ fontWeight: activeTab === 'payment' ? 600 : 400 }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={activeTab === 'settings'}
                  onClick={() => setActiveTab('settings')}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                    <SettingOutlined />
                  </ListItemIcon>
                  <ListItemText
                    primary="Settings"
                    primaryTypographyProps={{ fontWeight: activeTab === 'settings' ? 600 : 400 }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Right Panel - Content */}
        <Grid item xs={12} md={8}>
          {renderContent()}
        </Grid>
      </Grid>
    </Box>
  );
}
